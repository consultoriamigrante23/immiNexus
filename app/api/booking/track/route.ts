import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Resend } from "resend";
import { generatePDF } from "@/lib/generatePDF";
import { getAvailableSlots, getDateValidationMessage, formatTimeGMT5 } from "@/lib/availability";
import { sanitize } from "@/lib/sanitize";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Tracking ID required" }, { status: 400 });
    if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Server error" }, { status: 500 });

    const { db } = await connectToDatabase();
    const booking = await db.collection("bookings").findOne({ trackingId: id.trim() });
    if (!booking) return NextResponse.json({ error: "Booking not found. Check your Tracking ID." }, { status: 404 });

    const bookingDate = new Date(booking.date);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const daysLeft = Math.max(0, Math.ceil((bookingDate.getTime() - today.getTime()) / 86400000));

    return NextResponse.json({ booking, daysLeft }, { status: 200 });
  } catch (err) {
    console.error("[track GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) return NextResponse.json({ error: "Server error" }, { status: 500 });

    let body: any;
    try { body = await req.json(); }
    catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }

    const { trackingId, newDate, newTime, reason } = body;

    // Extract locale — use the one sent from frontend, or fall back to booking's saved locale
    const requestLocale = (body.locale && ["en","es","fr"].includes(body.locale))
      ? body.locale : null;

    if (!trackingId || !newDate || !newTime || !reason)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const dateMsg = getDateValidationMessage(newDate);
    if (dateMsg) return NextResponse.json({ error: dateMsg }, { status: 400 });

    if (!getAvailableSlots(newDate).includes(newTime))
      return NextResponse.json({ error: "Invalid time slot" }, { status: 400 });

    const { db } = await connectToDatabase();

    const booking = await db.collection("bookings").findOne({
      trackingId: sanitize(trackingId),
    });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.status === "cancelled")
      return NextResponse.json({ error: "Cannot modify a cancelled booking" }, { status: 400 });

    // Use locale from request, or fall back to the locale saved at booking time, or English
    const locale = requestLocale ?? booking.locale ?? "en";

    const conflict = await db.collection("bookings").findOne({
      date: newDate, time: newTime,
      status: { $ne: "cancelled" },
      trackingId: { $ne: sanitize(trackingId) },
    });
    if (conflict)
      return NextResponse.json({ error: "This time slot is already taken." }, { status: 409 });

    const modification = {
      previousDate: booking.date,
      previousTime: booking.time,
      newDate, newTime,
      reason: sanitize(reason),
      modifiedAt: new Date(),
    };

    await db.collection("bookings").updateOne(
      { trackingId: sanitize(trackingId) },
      {
        $set:  { date: newDate, time: newTime, updatedAt: new Date() },
        $push: { modifications: modification as any },
      }
    );

    // Client PDF in their language
    let clientPdfBuffer: Buffer | null = null;
    let clientPdfBase64: string | null = null;
    try {
      clientPdfBuffer = await generatePDF({
        trackingId:     booking.trackingId,
        fullName:       booking.fullName,
        email:          booking.email,
        phone:          booking.phone,
        country:        booking.country,
        service:        booking.service,
        date:           newDate,
        time:           newTime,
        message:        booking.message,
        locale,
        isModification: true,
        previousDate:   booking.date,
        previousTime:   booking.time,
        reason:         sanitize(reason),
      });
      clientPdfBase64 = clientPdfBuffer.toString("base64");
    } catch (e) { console.error("[track PATCH] client PDF:", e); }

    // Admin PDF always in English
    let adminPdfBuffer: Buffer | null = null;
    let adminPdfBase64: string | null = null;
    try {
      adminPdfBuffer = await generatePDF({
        trackingId:     booking.trackingId,
        fullName:       booking.fullName,
        email:          booking.email,
        phone:          booking.phone,
        country:        booking.country,
        service:        booking.service,
        date:           newDate,
        time:           newTime,
        message:        booking.message,
        locale:         "en",
        isModification: true,
        previousDate:   booking.date,
        previousTime:   booking.time,
        reason:         sanitize(reason),
      });
      adminPdfBase64 = adminPdfBuffer.toString("base64");
    } catch (e) { console.error("[track PATCH] admin PDF:", e); }

    const lawyerEmail = process.env.LAWYER_EMAIL ?? "consultoriamigrante23@gmail.com";

    const clientHtml = buildModifyEmail(booking, newDate, newTime, sanitize(reason), locale);
    const adminHtml  = buildModifyEmail(booking, newDate, newTime, sanitize(reason), "en");

    const clientAttachments = clientPdfBuffer
      ? [{ filename: `ImmiNexus-Modified-${booking.trackingId}.pdf`, content: clientPdfBase64! }]
      : [];

    const adminAttachments = adminPdfBuffer
      ? [{ filename: `ImmiNexus-Modified-${booking.trackingId}.pdf`, content: adminPdfBase64! }]
      : [];

    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to: [booking.email],
        subject: getModifySubject(booking.trackingId, locale),
        html: clientHtml,
        attachments: clientAttachments,
      });
    } catch (e) { console.error("[track PATCH] client email:", e); }

    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to: [lawyerEmail],
        subject: `Booking Modified – ${booking.fullName} – ${booking.trackingId}`,
        html: adminHtml,
        attachments: adminAttachments,
      });
    } catch (e) { console.error("[track PATCH] admin email:", e); }

    return NextResponse.json({
      success: true,
      pdfBase64: clientPdfBase64,
      booking: { ...booking, date: newDate, time: newTime },
    }, { status: 200 });

  } catch (err) {
    console.error("[track PATCH] unexpected:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function getModifySubject(trackingId: string, locale: string): string {
  if (locale === "es") return `Reserva Modificada – ${trackingId}`;
  if (locale === "fr") return `Réservation Modifiée – ${trackingId}`;
  return `Booking Modified – ${trackingId}`;
}

function buildModifyEmail(
  booking: any, newDate: string, newTime: string, reason: string, locale: string
): string {
  const L = {
    en: {
      title: "Booking Modified", trackLabel: "Tracking ID",
      prevDate: "Previous Date", newDateLabel: "New Date",
      name: "Name", service: "Service", reasonLabel: "Reason",
      footer: "To check your booking status, visit our website and enter your Tracking ID.",
      wa: "WhatsApp: +52 55 3163-0202",
    },
    es: {
      title: "Reserva Modificada", trackLabel: "ID de Seguimiento",
      prevDate: "Fecha Anterior", newDateLabel: "Nueva Fecha",
      name: "Nombre", service: "Servicio", reasonLabel: "Motivo",
      footer: "Para verificar su reserva, visite nuestro sitio e ingrese su ID de Seguimiento.",
      wa: "WhatsApp: +52 55 3163-0202",
    },
    fr: {
      title: "Réservation Modifiée", trackLabel: "ID de Suivi",
      prevDate: "Date Précédente", newDateLabel: "Nouvelle Date",
      name: "Nom", service: "Service", reasonLabel: "Raison",
      footer: "Pour vérifier votre réservation, visitez notre site et entrez votre ID de Suivi.",
      wa: "WhatsApp: +52 55 3163-0202",
    },
  }[locale as "en"|"es"|"fr"] ?? {
    title: "Booking Modified", trackLabel: "Tracking ID",
    prevDate: "Previous Date", newDateLabel: "New Date",
    name: "Name", service: "Service", reasonLabel: "Reason",
    footer: "To check your booking status, visit our website and enter your Tracking ID.",
    wa: "WhatsApp: +52 55 3163-0202",
  };

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#11999e,#0d7a7e);padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <h1 style="color:white;margin:0;font-size:22px">${L.title}</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">ImmiNexus Consultants</p>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
        <div style="background:#e8f6f7;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center">
          <p style="margin:0;font-size:11px;color:#576d69;text-transform:uppercase">${L.trackLabel}</p>
          <p style="margin:8px 0 0;font-size:20px;font-weight:bold;color:#11999e;font-family:monospace">${booking.trackingId}</p>
        </div>
        <table style="width:100%;border-collapse:collapse">
          <tr style="background:#fff8f0">
            <td style="padding:10px;font-weight:bold;width:150px;font-size:13px;color:#293533">${L.prevDate}</td>
            <td style="padding:10px;color:#576d69;font-size:13px">${booking.date} · ${formatTimeGMT5(booking.time)}</td>
          </tr>
          <tr style="background:#f0fdf4">
            <td style="padding:10px;font-weight:bold;font-size:13px;color:#293533">${L.newDateLabel}</td>
            <td style="padding:10px;color:#15803d;font-size:13px;font-weight:bold">${newDate} · ${formatTimeGMT5(newTime)}</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;font-size:13px;color:#293533">${L.name}</td>
            <td style="padding:10px;color:#576d69;font-size:13px">${booking.fullName}</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;font-size:13px;color:#293533">${L.service}</td>
            <td style="padding:10px;color:#576d69;font-size:13px">${booking.service}</td>
          </tr>
          <tr>
            <td style="padding:10px;font-weight:bold;font-size:13px;color:#293533">${L.reasonLabel}</td>
            <td style="padding:10px;color:#576d69;font-size:13px">${reason}</td>
          </tr>
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