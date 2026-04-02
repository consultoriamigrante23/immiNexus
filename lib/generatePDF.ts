import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface BookingData {
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
}

export async function generateBookingPDF(data: BookingData): Promise<Buffer> {
  const doc  = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const fontBold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const brand = rgb(0.165, 0.616, 0.604);
  const dark  = rgb(0.1,   0.1,   0.1);
  const gray  = rgb(0.45,  0.45,  0.45);
  const light = rgb(0.96,  0.98,  0.98);
  const white = rgb(1,     1,     1);

  // ── Header background ──
  page.drawRectangle({ x: 0, y: height - 130, width, height: 130, color: brand });

  // Logo circle
  page.drawCircle({ x: 60, y: height - 65, size: 28, color: white });
  page.drawText("IN", { x: 48, y: height - 72, size: 14, font: fontBold, color: brand });

  // Header text
  page.drawText("ImmiNexus Consultants", {
    x: 100, y: height - 52, size: 20, font: fontBold, color: white,
  });
  page.drawText("YOUR MIGRATION SUCCESS PARTNER", {
    x: 100, y: height - 72, size: 9, font: fontRegular, color: rgb(0.8, 0.95, 0.95),
  });
  page.drawText(data.isModification ? "BOOKING MODIFICATION RECEIPT" : "BOOKING CONFIRMATION RECEIPT", {
    x: 100, y: height - 92, size: 11, font: fontBold, color: white,
  });

  // Status badge (no borderRadius — just a plain rect)
  const badgeColor = data.isModification ? rgb(0.95, 0.6, 0.1) : rgb(0.13, 0.75, 0.55);
  const badgeText  = data.isModification ? "MODIFIED" : "PENDING CONFIRMATION";
  page.drawRectangle({ x: width - 160, y: height - 98, width: 140, height: 26, color: badgeColor });
  page.drawText(badgeText, { x: width - 148, y: height - 88, size: 9, font: fontBold, color: white });

  let y = height - 160;

  // ── Tracking ID box ──
  page.drawRectangle({ x: 40, y: y - 10, width: width - 80, height: 42, color: light });
  page.drawText("Tracking ID:", { x: 55, y: y + 10, size: 10, font: fontBold, color: brand });
  page.drawText(data.trackingId, { x: 150, y: y + 10, size: 11, font: fontBold, color: dark });
  page.drawText("Save this ID — use it to check your booking status or request modifications.",
    { x: 55, y: y - 2, size: 8, font: fontRegular, color: gray });
  y -= 65;

  // ── Section helper ──
  const drawSection = (label: string) => {
    page.drawText(label, { x: 40, y, size: 10, font: fontBold, color: brand });
    page.drawLine({
      start: { x: 40, y: y - 6 },
      end:   { x: width - 40, y: y - 6 },
      thickness: 0.8,
      color: brand,
      opacity: 0.3,
    });
    y -= 25;
  };

  const drawRow = (label: string, value: string) => {
    page.drawRectangle({ x: 40, y: y - 8, width: width - 80, height: 26, color: light });
    page.drawText(`${label}:`, { x: 55, y: y + 3, size: 10, font: fontBold, color: gray });
    page.drawText(value,       { x: 200, y: y + 3, size: 10, font: fontRegular, color: dark });
    y -= 34;
  };

  // ── Consultation Details ──
  drawSection("CONSULTATION DETAILS");
  drawRow("Date",    data.date);
  drawRow("Time",    `${data.time} (Ottawa EST)`);
  drawRow("Service", data.service);
  if (data.isModification && data.modificationReason) {
    drawRow("Reason for Modification", data.modificationReason);
  }
  y -= 10;

  // ── Client Information ──
  drawSection("CLIENT INFORMATION");
  drawRow("Full Name", data.fullName);
  drawRow("Email",     data.email);
  drawRow("Phone",     data.phone || "—");
  drawRow("Country",   data.country);
  y -= 10;

  // ── Notes ──
  if (data.message) {
    drawSection("NOTES");
    page.drawRectangle({ x: 40, y: y - 35, width: width - 80, height: 55, color: light });
    const words = data.message.split(" ");
    let line  = "";
    let lineY = y - 5;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (fontRegular.widthOfTextAtSize(test, 9) > 480) {
        page.drawText(line, { x: 55, y: lineY, size: 9, font: fontRegular, color: dark });
        line  = word;
        lineY -= 14;
      } else {
        line = test;
      }
    }
    if (line) page.drawText(line, { x: 55, y: lineY, size: 9, font: fontRegular, color: dark });
    y -= 65;
  }

  // ── Important notice box ──
  y -= 10;
  page.drawRectangle({ x: 40, y: y - 35, width: width - 80, height: 55, color: rgb(1, 0.98, 0.9) });
  page.drawLine({ start: { x: 40, y: y - 35 }, end: { x: 40, y: y + 20 }, thickness: 3, color: rgb(0.95, 0.7, 0.1) });
  page.drawText("IMPORTANT — Keep your Tracking ID safe", { x: 55, y: y + 5, size: 10, font: fontBold,    color: rgb(0.6, 0.4, 0) });
  page.drawText(`Your ID: ${data.trackingId}`,            { x: 55, y: y - 8, size: 10, font: fontBold,    color: brand });
  page.drawText("Visit the website → Book Consultation → Track tab → Enter your ID",
    { x: 55, y: y - 22, size: 8,  font: fontRegular, color: gray });

  // ── Footer ──
  page.drawRectangle({ x: 0, y: 0, width, height: 55, color: rgb(0.1, 0.1, 0.12) });
  page.drawText("ImmiNexus Consultants", {
    x: 40, y: 36, size: 10, font: fontBold, color: white,
  });
  page.drawText("consultoriamigrante23@gmail.com  |  +52 55 3163-0202  |  instagram: @imminexusconsultants", {
    x: 40, y: 20, size: 7.5, font: fontRegular, color: rgb(0.65, 0.65, 0.65),
  });
  page.drawText(`Generated: ${new Date().toLocaleDateString("en-CA")}`, {
    x: width - 160, y: 20, size: 7.5, font: fontRegular, color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}