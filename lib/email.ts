import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const LAWYER_EMAIL = process.env.LAWYER_EMAIL as string;

interface EmailPayload {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  service: string;
  message?: string;
  preferredDate?: string;
  type: "contact" | "booking";
}

interface BookingEmailPayload {
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  service: string;
  date: string;
  time: string;
  trackingId: string;
  message?: string;
  isModification?: boolean;
  modificationReason?: string;
  pdfBuffer: Buffer;
}

function buildEmailHTML(data: EmailPayload): string {
  const isBooking = data.type === "booking";
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:#2A9D9A;padding:28px 32px">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600">${isBooking ? "New Booking Request" : "New Contact Message"} — ${data.fullName}</h1>
        <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:13px">ImmiNexus Consultants</p>
      </div>
      <div style="padding:28px 32px">
        <table style="width:100%;border-collapse:collapse">
          ${[
            ["Full Name",  data.fullName],
            ["Email",      `<a href="mailto:${data.email}" style="color:#2A9D9A">${data.email}</a>`],
            ["Phone",      data.phone || "—"],
            ["Country",    data.country],
            ["Service",    data.service],
            ...(data.preferredDate ? [["Date",  data.preferredDate]] : []),
            ...(data.message       ? [["Notes", data.message]]       : []),
          ].map(([l, v]) => `
            <tr>
              <td style="padding:9px 0;border-bottom:1px solid #f0f4f8;color:#64748b;font-size:12px;font-weight:600;width:130px;vertical-align:top">${l}</td>
              <td style="padding:9px 0;border-bottom:1px solid #f0f4f8;color:#1a1a2e;font-size:13px">${v}</td>
            </tr>`).join("")}
        </table>
        <div style="margin-top:24px;padding:14px;background:#f0fafa;border-radius:6px;border-left:3px solid #2A9D9A">
          <p style="margin:0;color:#2A9D9A;font-size:12px;font-weight:600">Reply to: <a href="mailto:${data.email}" style="color:#2A9D9A">${data.email}</a></p>
        </div>
      </div>
      <div style="padding:14px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
        <p style="margin:0;color:#94a3b8;font-size:11px">ImmiNexus Consultants · +52 55 3163-0202</p>
      </div>
    </div>`;
}

export async function sendNotificationEmail(data: EmailPayload) {
  const html = buildEmailHTML(data);
  const subject = data.type === "booking"
    ? `New Booking — ${data.fullName}`
    : `New Contact — ${data.fullName}`;

  await resend.emails.send({
    from: "ImmiNexus <noreply@imminexusconsultants.com>",
    to: LAWYER_EMAIL,
    replyTo: data.email,
    subject,
    html,
  });
}

export async function sendBookingConfirmationEmails(data: BookingEmailPayload) {
  const subject = data.isModification
    ? `Booking Modified — ${data.trackingId}`
    : `Booking Confirmed — ${data.trackingId}`;

  const clientHtml = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:#2A9D9A;padding:28px 32px">
        <h1 style="color:#fff;margin:0;font-size:20px;font-weight:600">
          ${data.isModification ? "Booking Modified ✓" : "Booking Received ✓"}
        </h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px">ImmiNexus Consultants</p>
      </div>
      <div style="padding:28px 32px">
        <p style="color:#1a1a2e;font-size:15px;margin:0 0 20px">Hi <strong>${data.fullName}</strong>,</p>
        <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 20px">
          ${data.isModification
            ? "Your consultation has been successfully modified. Please find the updated receipt attached."
            : "Thank you for booking a consultation with ImmiNexus. Please find your receipt attached. We will confirm your appointment within 24 hours."}
        </p>
        <div style="background:#f0fafa;border-radius:8px;padding:20px;border:1px solid #c5eaea;margin:0 0 20px">
          <p style="margin:0 0 8px;color:#2A9D9A;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Booking Details</p>
          <p style="margin:4px 0;color:#1a1a2e;font-size:13px"><strong>Date:</strong> ${data.date}</p>
          <p style="margin:4px 0;color:#1a1a2e;font-size:13px"><strong>Time:</strong> ${data.time} (Ottawa EST)</p>
          <p style="margin:4px 0;color:#1a1a2e;font-size:13px"><strong>Service:</strong> ${data.service}</p>
          <p style="margin:4px 0;color:#1a1a2e;font-size:13px"><strong>Tracking ID:</strong> <code style="background:#e8f7f7;padding:2px 6px;border-radius:4px;color:#2A9D9A">${data.trackingId}</code></p>
        </div>
        <div style="background:#fff8ed;border-radius:8px;padding:16px;border:1px solid #fde68a">
          <p style="margin:0;color:#92400e;font-size:12px;font-weight:600">📌 Save your Tracking ID</p>
          <p style="margin:4px 0 0;color:#92400e;font-size:12px">You can use it to check your booking status or request modifications.</p>
        </div>
      </div>
      <div style="padding:14px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
        <p style="margin:0;color:#94a3b8;font-size:11px">ImmiNexus Consultants · consultoriamigrante23@gmail.com · +52 55 3163-0202</p>
      </div>
    </div>`;

  const attachment = {
    filename: `imminexus-booking-${data.trackingId}.pdf`,
    content: data.pdfBuffer.toString("base64"),
  };

  // Send to client
  await resend.emails.send({
    from: "ImmiNexus <noreply@imminexusconsultants.com>",
    to: data.email,
    subject,
    html: clientHtml,
    attachments: [attachment],
  });

  // Send to lawyer
  const lawyerHtml = buildEmailHTML({
    ...data,
    type: "booking",
    preferredDate: `${data.date} at ${data.time} Ottawa EST${data.isModification ? " (MODIFICATION)" : ""}`,
    message: data.modificationReason ? `Reason: ${data.modificationReason}` : data.message,
  });

  await resend.emails.send({
    from: "ImmiNexus <noreply@imminexusconsultants.com>",
    to: LAWYER_EMAIL,
    subject: `[ImmiNexus] ${subject}`,
    html: lawyerHtml,
    attachments: [attachment],
  });
}