import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Resend } from "resend";
import { generatePDF } from "@/lib/generatePDF";
import { sanitize } from "@/lib/sanitize";
import { isValidFutureDate, getAvailableSlots, getDateValidationMessage } from "@/lib/availability";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date");
    if (!date) return NextResponse.json({ bookedSlots: [] });
    if (!process.env.MONGODB_URI) return NextResponse.json({ bookedSlots: [] });
    const { db } = await connectToDatabase();
    const bookings = await db.collection("bookings").find({
      date, status: { $ne: "cancelled" },
    }).toArray();
    return NextResponse.json({ bookedSlots: bookings.map((b: any) => b.time) });
  } catch { return NextResponse.json({ bookedSlots: [] }); }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI)
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    if (!process.env.RESEND_API_KEY)
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });

    let body: any;
    try { body = await req.json(); }
    catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

    const { fullName, email, phone, country, service, date, time, message, captchaToken, deviceId } = body;

    if (!fullName || !email || !country || !service || !date || !time)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    if (!/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

    // Date validation (Sunday, 48h, weekday)
    const dateMsg = getDateValidationMessage(date);
    if (dateMsg)
      return NextResponse.json({ error: dateMsg }, { status: 400 });

    if (!getAvailableSlots(date).includes(time))
      return NextResponse.json({ error: "Invalid time slot selected" }, { status: 400 });

    // hCaptcha
    if (process.env.NODE_ENV === "production" && captchaToken && captchaToken !== "dev-bypass") {
      try {
        const cr = await fetch("https://hcaptcha.com/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.HCAPTCHA_SECRET_KEY ?? "",
            response: captchaToken,
          }),
        });
        const cd = await cr.json();
        if (!cd.success)
          return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
      } catch (e) { console.error("[booking] captcha:", e); }
    }

    const clean = {
      fullName: sanitize(fullName),
      email:    sanitize(email),
      phone:    sanitize(phone ?? ""),
      country:  sanitize(country),
      service:  sanitize(service),
      date:     sanitize(date),
      time:     sanitize(time),
      message:  sanitize(message ?? ""),
    };

    let db: any;
    try { ({ db } = await connectToDatabase()); }
    catch (e) { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }

    // Slot conflict
    const conflict = await db.collection("bookings").findOne({
      date: clean.date, time: clean.time, status: { $ne: "cancelled" },
    });
    if (conflict)
      return NextResponse.json({ error: "This time slot is already taken. Please select another." }, { status: 409 });

    // 7-day email cooldown
    const recentByEmail = await db.collection("bookings").findOne({
      email: clean.email, status: { $ne: "cancelled" },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    if (recentByEmail)
      return NextResponse.json({
        error: "You already have an active booking. Use the Modify tab to change it, or wait 7 days.",
      }, { status: 429 });

    // Device ID check — prevent same device booking twice (phone + PC)
    if (deviceId) {
      const recentByDevice = await db.collection("bookings").findOne({
        deviceId: sanitize(deviceId), status: { $ne: "cancelled" },
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      });
      if (recentByDevice)
        return NextResponse.json({
          error: "A booking was already made from this device. Use the Modify tab to change it.",
        }, { status: 429 });
    }

    const trackingId = `IMN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await db.collection("bookings").insertOne({
      ...clean,
      trackingId,
      deviceId: deviceId ? sanitize(deviceId) : null,
      status: "confirmed",
      modifications: [],
      createdAt: new Date(),
    });

    // PDF
    let pdfBuffer: Buffer | null = null;
    let pdfBase64: string | null = null;
    try {
      pdfBuffer = await generatePDF({ trackingId, ...clean });
      pdfBase64 = pdfBuffer.toString("base64");
    } catch (e) { console.error("[booking] PDF:", e); }

    const lawyerEmail = process.env.LAWYER_EMAIL ?? "consultoriamigrante23@gmail.com";
    const html        = buildBookingEmail(clean, trackingId);
    const attachments = pdfBuffer
      ? [{ filename: `ImmiNexus-Booking-${trackingId}.pdf`, content: pdfBase64! }]
      : [];

    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to:   [clean.email],
        subject: `Booking Confirmed – ${trackingId}`,
        html, attachments,
      });
    } catch (e) { console.error("[booking] client email:", e); }

    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to:   [lawyerEmail],
        subject: `New Booking – ${clean.fullName} – ${trackingId}`,
        html, attachments,
      });
    } catch (e) { console.error("[booking] consultant email:", e); }

    return NextResponse.json({ success: true, trackingId, pdfBase64 }, { status: 200 });

  } catch (err) {
    console.error("[booking POST] unexpected:", err);
    return NextResponse.json({ error: "Internal server error. Contact us via WhatsApp." }, { status: 500 });
  }
}

function buildBookingEmail(data: any, trackingId: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#11999e,#0d7a7e);padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0;font-size:22px">Booking Confirmed</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">ImmiNexus Consultants</p>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
        <div style="background:#e8f6f7;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center">
          <p style="margin:0;font-size:11px;color:#576d69;text-transform:uppercase">Tracking ID</p>
          <p style="margin:8px 0 0;font-size:20px;font-weight:bold;color:#11999e;font-family:monospace">${trackingId}</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${[
            ["Name",    data.fullName],
            ["Email",   data.email],
            ["Phone",   data.phone || "Not provided"],
            ["Country", data.country],
            ["Service", data.service],
            ["Date",    data.date],
            ["Time",    `${data.time} GMT-5`],
            ["Notes",   data.message || "None"],
          ].map(([l, v]) => `
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:10px 8px;font-weight:bold;color:#293533;width:80px;font-size:13px">${l}</td>
              <td style="padding:10px 8px;color:#576d69;font-size:13px">${v}</td>
            </tr>
          `).join("")}
        </table>
        <div style="margin-top:20px;padding:14px;background:#fff;border-radius:8px;border:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#576d69">
            To modify or cancel: visit our website → Book Consultation → Modify tab.<br/>
            WhatsApp: <strong>+52 55 3163-0202</strong> | Email: <strong>consultoriamigrante23@gmail.com</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}