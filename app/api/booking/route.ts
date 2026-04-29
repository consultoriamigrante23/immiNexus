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

    const {
      fullName, email, phone, country, service,
      date, time, message, captchaToken, deviceId,
    } = body;

    // Extract and validate locale
    const locale = (body.locale && ["en","es","fr"].includes(body.locale))
      ? body.locale : "en";

    if (!fullName || !email || !country || !service || !date || !time)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    if (!/^\S+@\S+\.\S+$/.test(email))
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });

    const dateMsg = getDateValidationMessage(date);
    if (dateMsg) return NextResponse.json({ error: dateMsg }, { status: 400 });

    if (!getAvailableSlots(date).includes(time))
      return NextResponse.json({ error: "Invalid time slot selected" }, { status: 400 });

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
    catch { return NextResponse.json({ error: "Database connection failed" }, { status: 500 }); }

    const conflict = await db.collection("bookings").findOne({
      date: clean.date, time: clean.time, status: { $ne: "cancelled" },
    });
    if (conflict)
      return NextResponse.json({ error: "This time slot is already taken. Please select another." }, { status: 409 });

    const recentByEmail = await db.collection("bookings").findOne({
      email: clean.email, status: { $ne: "cancelled" },
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    });
    if (recentByEmail)
      return NextResponse.json({
        error: "You already have an active booking. Use the Modify tab to change it, or wait 7 days.",
      }, { status: 429 });

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
      locale,
      deviceId: deviceId ? sanitize(deviceId) : null,
      status: "confirmed",
      modifications: [],
      createdAt: new Date(),
    });

    // Generate PDF in user's locale
    let pdfBuffer: Buffer | null = null;
    let pdfBase64: string | null = null;
    try {
      pdfBuffer = await generatePDF({ trackingId, ...clean, locale });
      pdfBase64 = pdfBuffer.toString("base64");
    } catch (e) { console.error("[booking] PDF:", e); }

    const lawyerEmail = process.env.LAWYER_EMAIL ?? "consultoriamigrante23@gmail.com";
    const clientHtml  = buildBookingEmail(clean, trackingId, locale);
    const adminHtml   = buildBookingEmail(clean, trackingId, "en"); // admin always English

    const clientAttachments = pdfBuffer
      ? [{ filename: `ImmiNexus-Booking-${trackingId}.pdf`, content: pdfBase64! }]
      : [];

    // Admin PDF always in English
    let adminPdfBuffer: Buffer | null = null;
    let adminPdfBase64: string | null = null;
    try {
      adminPdfBuffer = await generatePDF({ trackingId, ...clean, locale: "en" });
      adminPdfBase64 = adminPdfBuffer.toString("base64");
    } catch (e) { console.error("[booking] admin PDF:", e); }

    const adminAttachments = adminPdfBuffer
      ? [{ filename: `ImmiNexus-Booking-${trackingId}.pdf`, content: adminPdfBase64! }]
      : [];

    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to:   [clean.email],
        subject: getEmailSubject(trackingId, locale),
        html: clientHtml,
        attachments: clientAttachments,
      });
    } catch (e) { console.error("[booking] client email:", e); }

    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to:   [lawyerEmail],
        subject: `New Booking – ${clean.fullName} – ${trackingId}`,
        html: adminHtml,
        attachments: adminAttachments,
      });
    } catch (e) { console.error("[booking] consultant email:", e); }

    return NextResponse.json({ success: true, trackingId, pdfBase64 }, { status: 200 });

  } catch (err) {
    console.error("[booking POST] unexpected:", err);
    return NextResponse.json({ error: "Internal server error. Contact us via WhatsApp." }, { status: 500 });
  }
}

function getEmailSubject(trackingId: string, locale: string): string {
  if (locale === "es") return `Reserva Confirmada – ${trackingId}`;
  if (locale === "fr") return `Réservation Confirmée – ${trackingId}`;
  return `Booking Confirmed – ${trackingId}`;
}

function buildBookingEmail(data: any, trackingId: string, locale: string): string {
  const L = {
    en: {
      title: "Booking Confirmed", sub: "ImmiNexus Consultants",
      trackLabel: "Tracking ID",
      rows: ["Name","Email","Phone","Country","Service","Date","Time","Notes"],
      notProvided: "Not provided", none: "None", gmt: "GMT-5",
      footer: "To modify or cancel: visit our website → Book Consultation → Modify tab.",
      wa: "WhatsApp: +52 55 3163-0202",
    },
    es: {
      title: "Reserva Confirmada", sub: "ImmiNexus Consultants",
      trackLabel: "ID de Seguimiento",
      rows: ["Nombre","Correo","Teléfono","País","Servicio","Fecha","Hora","Notas"],
      notProvided: "No proporcionado", none: "Ninguno", gmt: "GMT-5",
      footer: "Para modificar o cancelar: visite nuestro sitio → Reservar Consulta → pestaña Modificar.",
      wa: "WhatsApp: +52 55 3163-0202",
    },
    fr: {
      title: "Réservation Confirmée", sub: "ImmiNexus Consultants",
      trackLabel: "ID de Suivi",
      rows: ["Nom","Email","Téléphone","Pays","Service","Date","Heure","Notes"],
      notProvided: "Non fourni", none: "Aucune", gmt: "GMT-5",
      footer: "Pour modifier ou annuler: visitez notre site → Réserver → onglet Modifier.",
      wa: "WhatsApp: +52 55 3163-0202",
    },
  }[locale as "en"|"es"|"fr"] ?? {
    title: "Booking Confirmed", sub: "ImmiNexus Consultants",
    trackLabel: "Tracking ID",
    rows: ["Name","Email","Phone","Country","Service","Date","Time","Notes"],
    notProvided: "Not provided", none: "None", gmt: "GMT-5",
    footer: "To modify or cancel: visit our website → Book Consultation → Modify tab.",
    wa: "WhatsApp: +52 55 3163-0202",
  };

  const values = [
    data.fullName,
    data.email,
    data.phone || L.notProvided,
    data.country,
    data.service,
    data.date,
    `${data.time} ${L.gmt}`,
    data.message || L.none,
  ];

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#11999e,#0d7a7e);padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0;font-size:22px">${L.title}</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">${L.sub}</p>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
        <div style="background:#e8f6f7;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center">
          <p style="margin:0;font-size:11px;color:#576d69;text-transform:uppercase">${L.trackLabel}</p>
          <p style="margin:8px 0 0;font-size:20px;font-weight:bold;color:#11999e;font-family:monospace">${trackingId}</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${L.rows.map((label, i) => `
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:10px 8px;font-weight:bold;color:#293533;width:100px;font-size:13px">${label}</td>
              <td style="padding:10px 8px;color:#576d69;font-size:13px">${values[i]}</td>
            </tr>
          `).join("")}
        </table>
        <div style="margin-top:20px;padding:14px;background:#fff;border-radius:8px;border:1px solid #e5e7eb">
          <p style="margin:0;font-size:12px;color:#576d69">
            ${L.footer}<br/>
            <strong>${L.wa}</strong> | <strong>consultoriamigrante23@gmail.com</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}