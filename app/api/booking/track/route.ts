import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Resend } from "resend";
import { generatePDF } from "@/lib/generatePDF";
import { isValidFutureDate, getAvailableSlots, getDateValidationMessage, formatTimeGMT5 } from "@/lib/availability";
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
    const today = new Date(); today.setHours(0,0,0,0);
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

    if (!trackingId || !newDate || !newTime || !reason)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    // Date validation
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

    // Slot conflict (exclude current booking)
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

    // Generate PDF for modification
    let pdfBuffer: Buffer | null = null;
    let pdfBase64: string | null = null;
    try {
      pdfBuffer = await generatePDF({
        trackingId:      booking.trackingId,
        fullName:        booking.fullName,
        email:           booking.email,
        phone:           booking.phone,
        country:         booking.country,
        service:         booking.service,
        date:            newDate,
        time:            newTime,
        message:         booking.message,
        isModification:  true,
        previousDate:    booking.date,
        previousTime:    booking.time,
        reason:          sanitize(reason),
      });
      pdfBase64 = pdfBuffer.toString("base64");
    } catch (e) { console.error("[track PATCH] PDF:", e); }

    const lawyerEmail = process.env.LAWYER_EMAIL ?? "consultoriamigrante23@gmail.com";
    const attachments = pdfBuffer
      ? [{ filename: `ImmiNexus-Modified-${booking.trackingId}.pdf`, content: pdfBase64! }]
      : [];

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#11999e,#0d7a7e);padding:32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:white;margin:0">Booking Modified</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">ImmiNexus Consultants</p>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
          <div style="background:#e8f6f7;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center">
            <p style="margin:0;font-size:11px;color:#576d69;text-transform:uppercase">Tracking ID</p>
            <p style="margin:8px 0 0;font-size:20px;font-weight:bold;color:#11999e;font-family:monospace">${booking.trackingId}</p>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr style="background:#fff8f0"><td style="padding:10px;font-weight:bold;width:140px;font-size:13px">Previous Date</td><td style="padding:10px;color:#576d69;font-size:13px">${booking.date} at ${formatTimeGMT5(booking.time)}</td></tr>
            <tr style="background:#f0fdf4"><td style="padding:10px;font-weight:bold;font-size:13px">New Date</td><td style="padding:10px;color:#15803d;font-size:13px">${newDate} at ${formatTimeGMT5(newTime)}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;font-size:13px">Name</td><td style="padding:10px;color:#576d69;font-size:13px">${booking.fullName}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;font-size:13px">Service</td><td style="padding:10px;color:#576d69;font-size:13px">${booking.service}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;font-size:13px">Reason</td><td style="padding:10px;color:#576d69;font-size:13px">${sanitize(reason)}</td></tr>
          </table>
        </div>
      </div>
    `;

    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to: [booking.email],
        subject: `Booking Modified – ${booking.trackingId}`,
        html, attachments,
      });
    } catch (e) { console.error("[track PATCH] email:", e); }

    try {
      await resend.emails.send({
        from: "ImmiNexus Consultants <onboarding@resend.dev>",
        to: [lawyerEmail],
        subject: `Booking Modified – ${booking.fullName} – ${booking.trackingId}`,
        html, attachments,
      });
    } catch (e) { console.error("[track PATCH] consultant email:", e); }

    return NextResponse.json({
      success: true,
      pdfBase64,
      booking: { ...booking, date: newDate, time: newTime },
    }, { status: 200 });

  } catch (err) {
    console.error("[track PATCH] unexpected:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}