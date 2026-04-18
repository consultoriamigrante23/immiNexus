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
    if (!date) {
      return NextResponse.json({ bookedSlots: [] });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ bookedSlots: [] });
    }

    const { db } = await connectToDatabase();
    const bookings = await db.collection("bookings").find({
      date,
      status: { $ne: "cancelled" },
    }).toArray();

    const bookedSlots = bookings.map((b: any) => b.time);
    return NextResponse.json({ bookedSlots });

  } catch (err) {
    console.error("[booking GET] Error:", err);
    return NextResponse.json({ bookedSlots: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    // ── Validate env vars ──
    if (!process.env.MONGODB_URI) {
      console.error("[booking POST] MONGODB_URI not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    if (!process.env.RESEND_API_KEY) {
      console.error("[booking POST] RESEND_API_KEY not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // ── Parse body ──
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const {
      fullName, email, phone, country, service,
      date, time, message, captchaToken,
    } = body;

    // ── Required field validation ──
    if (!fullName || !email || !country || !service || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, country, service, date, time" },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // ── Date/time validation ──
    if (!isValidFutureDate(date)) {
      return NextResponse.json(
        { error: "Date must be a future weekday (Monday–Saturday)" },
        { status: 400 }
      );
    }

    const availableSlots = getAvailableSlots(date);
    if (!availableSlots.includes(time)) {
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });
    }

    // ── hCaptcha (skip in dev) ──
    if (
      process.env.NODE_ENV === "production" &&
      captchaToken &&
      captchaToken !== "dev-bypass"
    ) {
      try {
        const captchaRes = await fetch("https://hcaptcha.com/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: process.env.HCAPTCHA_SECRET_KEY ?? "",
            response: captchaToken,
          }),
        });
        const captchaData = await captchaRes.json();
        if (!captchaData.success) {
          return NextResponse.json({ error: "Captcha verification failed" }, { status: 400 });
        }
      } catch (captchaErr) {
        console.error("[booking POST] Captcha error:", captchaErr);
      }
    }

    // ── Sanitize ──
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

    // ── MongoDB ──
    let db;
    try {
      const conn = await connectToDatabase();
      db = conn.db;
    } catch (dbErr) {
      console.error("[booking POST] MongoDB error:", dbErr);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Check slot conflict
    const conflict = await db.collection("bookings").findOne({
      date: clean.date,
      time: clean.time,
      status: { $ne: "cancelled" },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please select another time." },
        { status: 409 }
      );
    }

    // Check 7-day cooldown per email
    const recentBooking = await db.collection("bookings").findOne({
      email: clean.email,
      status: { $ne: "cancelled" },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    if (recentBooking) {
      return NextResponse.json(
        { error: "You already have a booking in the last 7 days. Use the Modify tab to change it, or contact us via WhatsApp." },
        { status: 429 }
      );
    }

    // Generate tracking ID
    const trackingId = `IMN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Save booking
    await db.collection("bookings").insertOne({
      ...clean,
      trackingId,
      status: "confirmed",
      modifications: [],
      createdAt: new Date(),
    });

    // ── Generate PDF ──
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await generatePDF({
        trackingId,
        fullName:  clean.fullName,
        email:     clean.email,
        phone:     clean.phone,
        country:   clean.country,
        service:   clean.service,
        date:      clean.date,
        time:      clean.time,
        message:   clean.message,
      });
    } catch (pdfErr) {
      console.error("[booking POST] PDF generation error:", pdfErr);
      // Continue without PDF
    }

    // ── Send emails ──
    const lawyerEmail = process.env.LAWYER_EMAIL ?? "consultoriamigrante23@gmail.com";
    const emailHtml   = buildBookingEmail(clean, trackingId);

    const attachments = pdfBuffer
      ? [{ filename: `ImmiNexus-Booking-${trackingId}.pdf`, content: pdfBuffer.toString("base64") }]
      : [];

    try {
      // To client
      await resend.emails.send({
        from:        "ImmiNexus Consultants <onboarding@resend.dev>",
        to:          [clean.email],
        subject:     `Booking Confirmed – ${trackingId}`,
        html:        emailHtml,
        attachments,
      });
    } catch (emailErr) {
      console.error("[booking POST] Client email error:", emailErr);
    }

    try {
      // To consultant
      await resend.emails.send({
        from:        "ImmiNexus Consultants <onboarding@resend.dev>",
        to:          [lawyerEmail],
        subject:     `New Booking – ${clean.fullName} – ${trackingId}`,
        html:        emailHtml,
        attachments,
      });
    } catch (emailErr) {
      console.error("[booking POST] Consultant email error:", emailErr);
    }

    return NextResponse.json({ success: true, trackingId }, { status: 200 });

  } catch (err) {
    console.error("[booking POST] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again or contact us via WhatsApp." },
      { status: 500 }
    );
  }
}

function buildBookingEmail(data: any, trackingId: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#11999e,#0d7a7e);padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0;font-size:24px">Booking Confirmed</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">ImmiNexus Consultants</p>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
        <div style="background:#e8f6f7;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center">
          <p style="margin:0;font-size:12px;color:#576d69;text-transform:uppercase;letter-spacing:1px">Your Tracking ID</p>
          <p style="margin:8px 0 0;font-size:22px;font-weight:bold;color:#11999e;font-family:monospace">${trackingId}</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${[
            ["Name",    data.fullName],
            ["Email",   data.email],
            ["Phone",   data.phone || "Not provided"],
            ["Country", data.country],
            ["Service", data.service],
            ["Date",    data.date],
            ["Time",    `${data.time} (Ottawa EST)`],
            ["Message", data.message || "None"],
          ].map(([label, value]) => `
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:12px 8px;font-weight:bold;color:#293533;width:100px">${label}</td>
              <td style="padding:12px 8px;color:#576d69">${value}</td>
            </tr>
          `).join("")}
        </table>
        <div style="margin-top:24px;padding:16px;background:#fff;border-radius:8px;border:1px solid #e5e7eb">
          <p style="margin:0;font-size:13px;color:#576d69">
            To modify or check your booking, visit our website and use your Tracking ID above.<br/>
            Questions? WhatsApp: <strong>+52 55 3163-0202</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}