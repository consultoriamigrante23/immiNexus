import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// This route is called by a cron job (Vercel Cron or external)
// Add to vercel.json: { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 * * * *" }] }

export async function GET(req: NextRequest) {

  // Security check — only allow with secret
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await connectToDatabase();

    // Find bookings happening in 22–26 hours from now (GMT-5)
    const nowGMT5    = new Date(Date.now() - 5 * 3600000);
    const in22Hours  = new Date(nowGMT5.getTime() + 22 * 3600000);
    const in26Hours  = new Date(nowGMT5.getTime() + 26 * 3600000);

    const date22 = in22Hours.toISOString().split("T")[0];
    const date26 = in26Hours.toISOString().split("T")[0];

    // Get unique dates to check
    const datesToCheck = [...new Set([date22, date26])];

    const bookings = await db.collection("bookings").find({
      status:          "confirmed",
      date:            { $in: datesToCheck },
      reminderSent:    { $ne: true },
    }).toArray();

    let sent = 0;

    for (const booking of bookings) {
      // Parse appointment datetime in GMT-5
      const [year, month, day] = booking.date.split("-").map(Number);
      const [hour, minute]     = booking.time.split(":").map(Number);
      const apptTime = new Date(year, month - 1, day, hour, minute);
      const apptGMT5 = new Date(apptTime.getTime() + 5 * 3600000); // convert local to UTC

      const diffMs   = apptGMT5.getTime() - Date.now();
      const diffHrs  = diffMs / 3600000;

      // Only send if 22–26 hours away
      if (diffHrs < 22 || diffHrs > 26) continue;

      const locale = booking.locale ?? "en";
      const html   = buildReminderEmail(booking, locale);

      try {
        await resend.emails.send({
          from:    "ImmiNexus Consultants <onboarding@resend.dev>",
          to:      [booking.email],
          subject: getReminderSubject(booking.trackingId, locale),
          html,
        });

        // Mark reminder as sent
        await db.collection("bookings").updateOne(
          { _id: booking._id },
          { $set: { reminderSent: true, reminderSentAt: new Date() } }
        );

        sent++;
      } catch (e) {
        console.error(`[reminders] Failed to send to ${booking.email}:`, e);
      }
    }

    return NextResponse.json({ success: true, sent }, { status: 200 });

  } catch (err) {
    console.error("[reminders]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ THESE FUNCTIONS MUST BE OUTSIDE GET

function getReminderSubject(trackingId: string, locale: string): string {
  if (locale === "es") return `Recordatorio: Su consulta mañana – ${trackingId}`;
  if (locale === "fr") return `Rappel : Votre consultation demain – ${trackingId}`;
  return `Reminder: Your consultation tomorrow – ${trackingId}`;
}

function buildReminderEmail(booking: any, locale: string): string {
  const L = {
    en: {
      title:    "Appointment Reminder",
      sub:      "Your consultation is tomorrow!",
      body:     "This is a friendly reminder that your immigration consultation with ImmiNexus Consultants is scheduled for tomorrow.",
      trackLabel: "Tracking ID",
      name:     "Name",
      date:     "Date",
      time:     "Time",
      service:  "Service",
      note:     "The consultation will be by phone. ImmiNexus Consultants will contact you at the scheduled time.",
      modify:   "Need to reschedule? Visit our website and use the Modify tab with your Tracking ID.",
      wa:       "WhatsApp: +52 55 3163-0202",
    },
    es: {
      title:    "Recordatorio de Cita",
      sub:      "¡Su consulta es mañana!",
      body:     "Este es un recordatorio amistoso de que su consulta de inmigración con ImmiNexus Consultants está programada para mañana.",
      trackLabel: "ID de Seguimiento",
      name:     "Nombre",
      date:     "Fecha",
      time:     "Hora",
      service:  "Servicio",
      note:     "La consulta será por teléfono. ImmiNexus Consultants se comunicará con usted a la hora programada.",
      modify:   "¿Necesita reprogramar? Visite nuestro sitio y use la pestaña Modificar con su ID de Seguimiento.",
      wa:       "WhatsApp: +52 55 3163-0202",
    },
    fr: {
      title:    "Rappel de Rendez-vous",
      sub:      "Votre consultation est demain !",
      body:     "Ceci est un rappel amical que votre consultation en immigration avec ImmiNexus Consultants est prévue pour demain.",
      trackLabel: "ID de Suivi",
      name:     "Nom",
      date:     "Date",
      time:     "Heure",
      service:  "Service",
      note:     "La consultation sera par téléphone. ImmiNexus Consultants vous contactera à l'heure prévue.",
      modify:   "Besoin de reporter ? Visitez notre site et utilisez l'onglet Modifier avec votre ID de Suivi.",
      wa:       "WhatsApp: +52 55 3163-0202",
    },
  }[locale as "en"|"es"|"fr"] ?? {
    title:    "Appointment Reminder",
    sub:      "Your consultation is tomorrow!",
    body:     "This is a friendly reminder that your immigration consultation is scheduled for tomorrow.",
    trackLabel: "Tracking ID",
    name:     "Name",
    date:     "Date",
    time:     "Time",
    service:  "Service",
    note:     "The consultation will be by phone. ImmiNexus Consultants will contact you at the scheduled time.",
    modify:   "Need to reschedule? Visit our website and use the Modify tab with your Tracking ID.",
    wa:       "WhatsApp: +52 55 3163-0202",
  };

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#11999e,#0d7a7e);padding:32px;border-radius:12px 12px 0 0;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">🔔</div>
        <h1 style="color:white;margin:0;font-size:22px">${L.title}</h1>
        <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:15px">${L.sub}</p>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
        <p style="color:#576d69;font-size:14px;line-height:1.6;margin-bottom:24px">${L.body}</p>

        <div style="background:#e8f6f7;border-radius:8px;padding:16px;margin-bottom:20px;text-align:center">
          <p style="margin:0;font-size:11px;color:#576d69;text-transform:uppercase">${L.trackLabel}</p>
          <p style="margin:8px 0 0;font-size:20px;font-weight:bold;color:#11999e;font-family:monospace">${booking.trackingId}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          ${[
            [L.name,    booking.fullName],
            [L.date,    booking.date],
            [L.time,    `${booking.time} GMT-5`],
            [L.service, booking.service],
          ].map(([label, value]) => `
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:10px 8px;font-weight:bold;color:#293533;width:80px;font-size:13px">${label}</td>
              <td style="padding:10px 8px;color:#576d69;font-size:13px">${value}</td>
            </tr>
          `).join("")}
        </table>

        <div style="background:#fff8e1;border-left:4px solid #11999e;padding:14px 16px;border-radius:0 8px 8px 0;margin-bottom:20px">
          <p style="margin:0;font-size:13px;color:#293533;line-height:1.6">📞 ${L.note}</p>
        </div>

        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:14px">
          <p style="margin:0;font-size:12px;color:#576d69;line-height:1.6">
            ${L.modify}<br/>
            <strong>${L.wa}</strong> | <strong>consultoriamigrante23@gmail.com</strong>
          </p>
        </div>
      </div>
    </div>
  `;
}