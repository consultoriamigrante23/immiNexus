import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Resend } from "resend";
import { generatePDF } from "@/lib/generatePDF";
import { sanitize } from "@/lib/sanitize";
import { isValidFutureDate, getAvailableSlots } from "@/lib/availability";

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
  } catch (err) {
    console.error("[booking GET]", err);
    return NextResponse.json({ bookedSlots: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Server configuration error: missing MONGODB_URI" }, { status: 500 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Server configuration error: missing RESEND_API_KEY" }, { status: 500 });
    }

    let body: any;
    try { body = await req.json(); }
    catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

    const { fullName, email, phone, country, service, date, time, message, captchaToken } = body;

    if (!fullName || !email || !country || !service || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (!isValidFutureDate(date)) {
      return NextResponse.json({ error: "Date must be a future weekday (Mon–Sat)" }, { status: 400 });
    }
    if (!getAvailableSlots(date).includes(time)) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }

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
        if (!cd.success) return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
      } catch (e) { console.error("[booking] captcha error", e); }
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
    catch (e) {
      console.error("[booking] MongoDB error", e);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Check slot conflict
    const conflict = await db.collection("bookings").findOne({
      date: clean.date, time: clean.time, status: { $ne: "cancelled" },
    });
    if (conflict) {
      return NextResponse.json({ error: "This time slot is already taken. Please select another." }, { status: 409 });
    }

    // 7-day cooldown
    const recent = await db.collection("bookings").findOne({
      email: clean.email, status: { $ne: "cancelled" },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    if (recent) {
      return NextResponse.json({
        error: "You already have a booking in the last 7 days. Use the Modify tab to change it.",
      }, { status: 429 });
    }

    const trackingId = `IMN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await db.collection("bookings").insertOne({
      ...clean, trackingId, status: "confirmed", modifications: [], createdAt: new Date(),
    });

    // Generate PDF
    let pdfBuffer: Buffer | null = null;
    let pdfBase64: string | null = null;
    try {
      pdfBuffer = await generatePDF({ trackingId, ...clean });
      pdfBase64 = pdfBuffer.toString("base64");
    } catch (e) { console.error("[booking] PDF error", e); }

    const lawyerEmail = process.env.LAWYER_EMAIL ?? "consultoriamigrante23@gmail.com";
    const emailHtml   = buildEmail(clean, trackingId);
    const attachments = pdfBuffer
      ? [{ filename: `ImmiNexus-Booking-${trackingId}.pdf`, content: pdfBase64! }]
      : [];

    // Email to client
    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to:   [clean.email],
        subject: `Booking Confirmed – ${trackingId}`,
        html: emailHtml,
        attachments,
      });
    } catch (e) { console.error("[booking] client email error:", e); }

    // Email to consultant
    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to:   [lawyerEmail],
        subject: `New Booking – ${clean.fullName} – ${trackingId}`,
        html: emailHtml,
        attachments,
      });
    } catch (e) { console.error("[booking] consultant email error:", e); }

    // Return pdfBase64 so frontend can trigger download
    return NextResponse.json({ success: true, trackingId, pdfBase64 }, { status: 200 });

  } catch (err) {
    console.error("[booking POST] unexpected:", err);
    return NextResponse.json({ error: "Internal server error. Contact us via WhatsApp." }, { status: 500 });
  }
}

function buildEmail(data: any, trackingId: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#11999e,#0d7a7e);padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0;font-size:22px">Booking Confirmed</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:13px">ImmiNexus Consultants – Your Migration Success Partner</p>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
        <div style="background:#e8f6f7;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center">
          <p style="margin:0;font-size:11px;color:#576d69;text-transform:uppercase;letter-spacing:1px">Tracking ID</p>
          <p style="margin:8px 0 0;font-size:20px;font-weight:bold;color:#11999e;font-family:monospace">${trackingId}</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${[
            ["Name",      data.fullName],
            ["Email",     data.email],
            ["Phone",     data.phone || "Not provided"],
            ["Country",   data.country],
            ["Service",   data.service],
            ["Date",      data.date],
            ["Time",      `${data.time} (Ottawa EST)`],
            ["Message",   data.message || "None"],
          ].map(([l, v]) => `
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:10px 8px;font-weight:bold;color:#293533;width:90px;font-size:13px">${l}</td>
              <td style="padding:10px 8px;color:#576d69;font-size:13px">${v}</td>
            </tr>
          `).join("")}
        </table>
        <div style="margin-top:20px;padding:14px;background:#fff;border-radius:8px;border:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#576d69">
            To modify or check your booking, visit our website and enter your Tracking ID.<br/>
            Questions? <strong>WhatsApp: +52 55 3163-0202</strong> | <strong>consultoriamigrante23@gmail.com</strong>
          </p>
        </div>
        <p style="margin-top:16px;font-size:11px;color:#9ca3af;text-align:center">
          PDF receipt is attached to this email. Please keep your Tracking ID safe.
        </p>
      </div>
    </div>
  `;
}