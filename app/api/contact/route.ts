import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Resend } from "resend";
import { sanitize } from "@/lib/sanitize";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    // ── Validate env vars first ──
    if (!process.env.MONGODB_URI) {
      console.error("[contact] MONGODB_URI is not set");
      return NextResponse.json({ error: "Server configuration error: missing MONGODB_URI" }, { status: 500 });
    }
    if (!process.env.RESEND_API_KEY) {
      console.error("[contact] RESEND_API_KEY is not set");
      return NextResponse.json({ error: "Server configuration error: missing RESEND_API_KEY" }, { status: 500 });
    }

    // ── Parse body ──
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { fullName, email, phone, country, service, message, captchaToken } = body;

    // ── Basic validation ──
    if (!fullName || !email || !country || !service) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, country, service" },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // ── hCaptcha verification (skip in dev) ──
    if (process.env.NODE_ENV === "production" && captchaToken && captchaToken !== "dev-bypass") {
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
        console.error("[contact] Captcha error:", captchaErr);
        // Don't block on captcha errors
      }
    }

    // ── Sanitize inputs ──
    const clean = {
      fullName: sanitize(fullName),
      email:    sanitize(email),
      phone:    sanitize(phone ?? ""),
      country:  sanitize(country),
      service:  sanitize(service),
      message:  sanitize(message ?? ""),
    };

    // ── MongoDB ──
    let db;
    try {
      const conn = await connectToDatabase();
      db = conn.db;
    } catch (dbErr) {
      console.error("[contact] MongoDB connection error:", dbErr);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    // Check 7-day cooldown
    const existing = await db.collection("submissions").findOne({
      email: clean.email,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted a request in the last 7 days. Please contact us via WhatsApp if urgent." },
        { status: 429 }
      );
    }

    // Save to DB
    await db.collection("submissions").insertOne({
      ...clean,
      type: "contact",
      createdAt: new Date(),
    });

    // ── Send email ──
    const lawyerEmail = process.env.LAWYER_EMAIL ?? "consultoriamigrante23@gmail.com";

    try {
      await resend.emails.send({
        from:    "ImmiNexus Consultants <onboarding@resend.dev>",
        to:      [lawyerEmail],
        subject: `New Contact Form – ${clean.fullName} (${clean.country})`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <div style="background:#11999e;padding:24px;border-radius:8px 8px 0 0">
              <h2 style="color:white;margin:0">New Contact Request</h2>
            </div>
            <div style="background:#f9f9f9;padding:24px;border-radius:0 0 8px 8px">
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;font-weight:bold;width:120px">Name</td><td style="padding:8px 0">${clean.fullName}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold">Email</td><td style="padding:8px 0">${clean.email}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold">Phone</td><td style="padding:8px 0">${clean.phone || "Not provided"}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold">Country</td><td style="padding:8px 0">${clean.country}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold">Service</td><td style="padding:8px 0">${clean.service}</td></tr>
                <tr><td style="padding:8px 0;font-weight:bold">Message</td><td style="padding:8px 0">${clean.message || "None"}</td></tr>
              </table>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("[contact] Email send error:", emailErr);
      // Don't fail the whole request if email fails — data is saved in DB
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again or contact us via WhatsApp." },
      { status: 500 }
    );
  }
}