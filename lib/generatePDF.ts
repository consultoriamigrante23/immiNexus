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
  locale?:         string; // "en" | "es" | "fr"
  isModification?: boolean;
  previousDate?:   string;
  previousTime?:   string;
  reason?:         string;
}

const LABELS: Record<string, Record<string, string>> = {
  en: {
    title:         "Booking Confirmation Receipt",
    modTitle:      "Booking Modification Receipt",
    trackingId:    "Tracking ID",
    clientInfo:    "CLIENT INFORMATION",
    apptDetails:   "APPOINTMENT DETAILS",
    notes:         "ADDITIONAL NOTES",
    modDetails:    "MODIFICATION DETAILS",
    name:          "Full Name",
    email:         "Email",
    phone:         "Phone",
    country:       "Country",
    service:       "Service",
    date:          "Date",
    time:          "Time",
    message:       "Message",
    previousDate:  "Previous Date",
    newDate:       "New Date",
    reason:        "Reason",
    status:        "STATUS: CONFIRMED",
    modStatus:     "STATUS: MODIFIED",
    notProvided:   "Not provided",
    timeZone:      "GMT-5",
    footer1:       "ImmiNexus Consultants  |  consultoriamigrante23@gmail.com  |  +52 55 3163-0202",
    footer2:       "This document serves as an official receipt. Please keep your Tracking ID for future reference.",
    partner:       "Your Migration Success Partner",
    phoneNote: "The consultation will be by phone. ImmiNexus Consultants will contact you on the date and time of your appointment.",
  },
  es: {
    title:         "Recibo de Confirmación de Reserva",
    modTitle:      "Recibo de Modificación de Reserva",
    trackingId:    "ID de Seguimiento",
    clientInfo:    "INFORMACIÓN DEL CLIENTE",
    apptDetails:   "DETALLES DE LA CITA",
    notes:         "NOTAS ADICIONALES",
    modDetails:    "DETALLES DE MODIFICACIÓN",
    name:          "Nombre Completo",
    email:         "Correo Electrónico",
    phone:         "Teléfono",
    country:       "País",
    service:       "Servicio",
    date:          "Fecha",
    time:          "Hora",
    message:       "Mensaje",
    previousDate:  "Fecha Anterior",
    newDate:       "Nueva Fecha",
    reason:        "Motivo",
    status:        "ESTADO: CONFIRMADO",
    modStatus:     "ESTADO: MODIFICADO",
    notProvided:   "No proporcionado",
    timeZone:      "GMT-5",
    footer1:       "ImmiNexus Consultants  |  consultoriamigrante23@gmail.com  |  +52 55 3163-0202",
    footer2:       "Este documento sirve como recibo oficial. Conserve su ID de seguimiento para referencia futura.",
    partner:       "Su Socio en el Éxito Migratorio",
    phoneNote: "La consulta será por teléfono. ImmiNexus Consultants se comunicará con usted en la fecha y hora de su cita.",
  },
  fr: {
    title:         "Reçu de Confirmation de Réservation",
    modTitle:      "Reçu de Modification de Réservation",
    trackingId:    "ID de Suivi",
    clientInfo:    "INFORMATIONS CLIENT",
    apptDetails:   "DÉTAILS DU RENDEZ-VOUS",
    notes:         "NOTES SUPPLÉMENTAIRES",
    modDetails:    "DÉTAILS DE MODIFICATION",
    name:          "Nom Complet",
    email:         "Adresse Email",
    phone:         "Téléphone",
    country:       "Pays",
    service:       "Service",
    date:          "Date",
    time:          "Heure",
    message:       "Message",
    previousDate:  "Date Précédente",
    newDate:       "Nouvelle Date",
    reason:        "Raison",
    status:        "STATUT: CONFIRMÉ",
    modStatus:     "STATUT: MODIFIÉ",
    notProvided:   "Non fourni",
    timeZone:      "GMT-5",
    footer1:       "ImmiNexus Consultants  |  consultoriamigrante23@gmail.com  |  +52 55 3163-0202",
    footer2:       "Ce document sert de reçu officiel. Veuillez conserver votre ID de suivi pour référence future.",
    partner:       "Votre Partenaire pour la Réussite Migratoire",
    phoneNote: "La consultation sera par téléphone. ImmiNexus Consultants vous contactera à la date et l'heure de votre rendez-vous.",
  },
};

export async function generatePDF(data: BookingData): Promise<Buffer> {
  const locale = (data.locale && ["en","es","fr"].includes(data.locale)) ? data.locale : "en";
  const L = LABELS[locale];

  const doc  = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const fontBold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

  const teal     = rgb(0.067, 0.600, 0.620);
  const darkTeal = rgb(0.051, 0.478, 0.494);
  const dark     = rgb(0.059, 0.122, 0.118);
  const mid      = rgb(0.251, 0.318, 0.306);
  const light    = rgb(0.42,  0.51,  0.49);
  const white    = rgb(1, 1, 1);

  // Header background
  page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: teal });

  page.drawText("ImmiNexus Consultants", {
    x: 40, y: height - 48,
    size: 22, font: fontBold, color: white,
  });
  page.drawText(L.partner, {
    x: 40, y: height - 68,
    size: 10, font: fontRegular, color: rgb(0.75, 0.95, 0.95),
  });
  page.drawText(data.isModification ? L.modTitle : L.title, {
    x: 40, y: height - 88,
    size: 9, font: fontRegular, color: rgb(0.85, 0.97, 0.97),
  });

  const dateStr = new Date().toLocaleDateString(
    locale === "fr" ? "fr-FR" : locale === "es" ? "es-MX" : "en-CA",
    { year: "numeric", month: "long", day: "numeric" }
  );
  page.drawText(dateStr, {
    x: width - 160, y: height - 48,
    size: 9, font: fontRegular, color: rgb(0.85, 0.97, 0.97),
  });

  // Tracking ID box
  page.drawRectangle({ x: 40, y: height - 172, width: width - 80, height: 38, color: rgb(0.91, 0.97, 0.97) });
  page.drawText(`${L.trackingId}:`, {
    x: 55, y: height - 149,
    size: 9, font: fontBold, color: darkTeal,
  });
  page.drawText(data.trackingId, {
    x: 175, y: height - 149,
    size: 13, font: fontBold, color: teal,
  });

  let y = height - 205;

  const drawSection = (title: string) => {
    page.drawText(title, {
      x: 40, y,
      size: 8, font: fontBold, color: teal,
    });
    y -= 4;
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: rgb(0.87, 0.93, 0.93) });
    y -= 14;
  };

  const drawRow = (label: string, value: string) => {
    if (!value) return;
    page.drawText(label, {
      x: 50, y,
      size: 9, font: fontBold, color: mid,
    });
    // Handle long text wrapping
    const maxChars = 65;
    if (value.length <= maxChars) {
      page.drawText(value, { x: 195, y, size: 9, font: fontRegular, color: dark });
    } else {
      const line1 = value.slice(0, maxChars);
      const line2 = value.slice(maxChars, maxChars * 2);
      page.drawText(line1, { x: 195, y, size: 9, font: fontRegular, color: dark });
      y -= 13;
      page.drawText(line2, { x: 195, y, size: 9, font: fontRegular, color: dark });
    }
    y -= 17;
  };

  drawSection(L.clientInfo);
  drawRow(L.name,    data.fullName);
  drawRow(L.email,   data.email);
  drawRow(L.phone,   data.phone || L.notProvided);
  drawRow(L.country, data.country);

  y -= 8;
  drawSection(L.apptDetails);
  drawRow(L.service, data.service);
  drawRow(L.date,    data.date);
  drawRow(L.time,    `${data.time} ${L.timeZone}`);

  if (data.message) {
    y -= 8;
    drawSection(L.notes);
    drawRow(L.message, data.message.slice(0, 120));
  }

  if (data.isModification && data.previousDate) {
    y -= 8;
    drawSection(L.modDetails);
    drawRow(L.previousDate, `${data.previousDate} ${data.previousTime}`);
    drawRow(L.newDate,      `${data.date} ${data.time} ${L.timeZone}`);
    drawRow(L.reason,       data.reason ?? "");
  }

  // Status box
  y -= 16;
  page.drawRectangle({ x: 40, y: y - 12, width: width - 80, height: 26, color: rgb(0.94, 0.99, 0.97) });
  page.drawText(data.isModification ? L.modStatus : L.status, {
    x: 55, y: y - 2,
    size: 10, font: fontBold, color: rgb(0.08, 0.55, 0.27),
  });
  // Phone note box
y -= 20;
page.drawRectangle({
  x: 40, y: y - 28, width: width - 80, height: 36,
  color: rgb(0.95, 0.97, 0.99),
});
page.drawLine({
  start: { x: 40, y: y - 28 }, end: { x: 40, y: y + 8 },
  thickness: 3, color: teal,
});

// Word-wrap the note
const noteWords = L.phoneNote.split(" ");
let noteLine = "";
let noteY = y - 8;
for (const word of noteWords) {
  const test = noteLine ? `${noteLine} ${word}` : word;
  if (test.length > 75) {
    page.drawText(noteLine, { x: 52, y: noteY, size: 8, font: fontRegular, color: mid });
    noteY -= 12;
    noteLine = word;
  } else {
    noteLine = test;
  }
}
if (noteLine) {
  page.drawText(noteLine, { x: 52, y: noteY, size: 8, font: fontRegular, color: mid });
}

  // Footer
  page.drawRectangle({ x: 0, y: 0, width, height: 55, color: rgb(0.96, 0.98, 0.98) });
  page.drawText(L.footer1, { x: 40, y: 35, size: 8, font: fontRegular, color: light });
  page.drawText(L.footer2, { x: 40, y: 20, size: 7, font: fontRegular, color: light });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}