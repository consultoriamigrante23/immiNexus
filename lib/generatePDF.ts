import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface BookingData {
  trackingId:      string;
  fullName:        string;
  email:           string;
  phone:           string;
  country:         string;
  service:         string;
  date:            string;
  time:            string;
  message:         string;
  isModification?: boolean;
  previousDate?:   string;
  previousTime?:   string;
  reason?:         string;
}

export async function generatePDF(data: BookingData): Promise<Buffer> {
  const doc  = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const fontBold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const teal     = rgb(0.067, 0.600, 0.620);
  const darkTeal = rgb(0.051, 0.478, 0.494);
  const dark     = rgb(0.059, 0.122, 0.118);
  const mid      = rgb(0.251, 0.318, 0.306);
  const light    = rgb(0.42,  0.51,  0.49);
  const white    = rgb(1, 1, 1);

  // ── Header background ──
  page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: teal });

  // Header text
  page.drawText("ImmiNexus Consultants", {
    x: 40, y: height - 50,
    size: 22, font: fontBold, color: white,
  });
  page.drawText("Your Migration Success Partner", {
    x: 40, y: height - 72,
    size: 11, font: fontRegular, color: rgb(0.75, 0.95, 0.95),
  });
  page.drawText(data.isModification ? "Booking Modification Receipt" : "Booking Confirmation Receipt", {
    x: 40, y: height - 95,
    size: 10, font: fontRegular, color: rgb(0.85, 0.97, 0.97),
  });

  // Date on right
  const dateStr = new Date().toLocaleDateString("en-CA", { year:"numeric", month:"long", day:"numeric" });
  page.drawText(dateStr, {
    x: width - 160, y: height - 50,
    size: 10, font: fontRegular, color: rgb(0.85, 0.97, 0.97),
  });

  // ── Tracking ID box ──
  page.drawRectangle({ x: 40, y: height - 175, width: width - 80, height: 40, color: rgb(0.91, 0.97, 0.97) });
  page.drawText("Tracking ID:", {
    x: 55, y: height - 150,
    size: 10, font: fontBold, color: darkTeal,
  });
  page.drawText(data.trackingId, {
    x: 150, y: height - 150,
    size: 14, font: fontBold, color: teal,
  });

  // ── Section: Consultation Details ──
  let y = height - 210;

  const drawSection = (title: string) => {
    page.drawText(title.toUpperCase(), {
      x: 40, y,
      size: 9, font: fontBold, color: teal,
    });
    y -= 4;
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.87, 0.93, 0.93) });
    y -= 16;
  };

  const drawRow = (label: string, value: string) => {
    page.drawText(label, {
      x: 50, y,
      size: 10, font: fontBold, color: mid,
    });
    page.drawText(value || "—", {
      x: 200, y,
      size: 10, font: fontRegular, color: dark,
    });
    y -= 20;
  };

  drawSection("Client Information");
  drawRow("Full Name",   data.fullName);
  drawRow("Email",       data.email);
  drawRow("Phone",       data.phone || "Not provided");
  drawRow("Country",     data.country);

  y -= 10;
  drawSection("Appointment Details");
  drawRow("Service",     data.service);
  drawRow("Date",        data.date);
  drawRow("Time",        `${data.time} (Ottawa EST)`);

  if (data.message) {
    y -= 10;
    drawSection("Additional Notes");
    drawRow("Message", data.message.slice(0, 80) + (data.message.length > 80 ? "..." : ""));
  }

  if (data.isModification && data.previousDate) {
    y -= 10;
    drawSection("Modification Details");
    drawRow("Previous Date", `${data.previousDate} at ${data.previousTime}`);
    drawRow("New Date",      `${data.date} at ${data.time}`);
    drawRow("Reason",        data.reason ?? "");
  }

  // ── Status box ──
  y -= 20;
  page.drawRectangle({ x: 40, y: y - 14, width: width - 80, height: 28, color: rgb(0.94, 0.99, 0.97) });
  page.drawText(data.isModification ? "STATUS: MODIFIED" : "STATUS: CONFIRMED", {
    x: 55, y: y - 4,
    size: 11, font: fontBold, color: rgb(0.08, 0.55, 0.27),
  });

  // ── Footer ──
  page.drawRectangle({ x: 0, y: 0, width, height: 60, color: rgb(0.95, 0.98, 0.98) });
  page.drawText("ImmiNexus Consultants  |  consultoriamigrante23@gmail.com  |  +52 55 3163-0202", {
    x: 40, y: 38,
    size: 9, font: fontRegular, color: light,
  });
  page.drawText("This document serves as an official receipt. Please keep your Tracking ID for future reference.", {
    x: 40, y: 22,
    size: 8, font: fontRegular, color: light,
  });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}