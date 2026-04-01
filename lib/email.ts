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

export async function sendNotificationEmail(data: EmailPayload) {
  const subject =
    data.type === "booking"
      ? `New Booking Request — ${data.fullName}`
      : `New Contact Message — ${data.fullName}`;

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0">
      <div style="background:#2A9D9A;padding:28px 32px">
        <h1 style="color:#fff;margin:0;font-size:22px;font-weight:600">${subject}</h1>
        <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px">ImmiNexus Consultants — New ${data.type === "booking" ? "Consultation Request" : "Contact Form Submission"}</p>
      </div>
      <div style="padding:32px">
        <table style="width:100%;border-collapse:collapse">
          ${[
            ["Full Name", data.fullName],
            ["Email", `<a href="mailto:${data.email}" style="color:#2A9D9A">${data.email}</a>`],
            ["Phone / WhatsApp", data.phone || "—"],
            ["Country", data.country],
            ["Service Needed", data.service],
            ...(data.preferredDate ? [["Preferred Date", data.preferredDate]] : []),
            ...(data.message ? [["Message", data.message]] : []),
          ]
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;color:#64748b;font-size:13px;font-weight:500;width:140px;vertical-align:top">${label}</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f4f8;color:#1a1a2e;font-size:14px">${value}</td>
            </tr>`
            )
            .join("")}
        </table>
        <div style="margin-top:28px;padding:16px;background:#f0fafa;border-radius:6px;border-left:3px solid #2A9D9A">
          <p style="margin:0;color:#2A9D9A;font-size:13px;font-weight:500">Reply directly to: <a href="mailto:${data.email}" style="color:#2A9D9A">${data.email}</a></p>
        </div>
      </div>
      <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
        <p style="margin:0;color:#94a3b8;font-size:12px">ImmiNexus Consultants · +52 55 3163-0202 · imminexusconsultants.com</p>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "ImmiNexus <noreply@imminexusconsultants.com>",
    to: LAWYER_EMAIL,
    replyTo: data.email,
    subject,
    html,
  });
}