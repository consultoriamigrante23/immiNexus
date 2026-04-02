import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/lib/models/Booking";
import { sendBookingConfirmationEmails } from "@/lib/email";
import { generateBookingPDF } from "@/lib/generatePDF";
import { isWithinWorkingHours, isValidFutureDate } from "@/lib/availability";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";
import { z } from "zod";

// GET: look up booking by trackingId
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const trackingId = searchParams.get("id");
  if (!trackingId) return NextResponse.json({ error: "Tracking ID required." }, { status: 400 });

  try {
    await connectDB();
    const booking = await Booking.findOne({ trackingId })
      .select("fullName email country service date time status modifications createdAt");
    if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });

    // Days until appointment
    const appointmentDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0,0,0,0);
    const daysLeft = Math.ceil((appointmentDate.getTime() - today.getTime()) / 86400000);

    return NextResponse.json({ booking, daysLeft }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

const modifySchema = z.object({
  trackingId: z.string().min(1),
  newDate:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  newTime:    z.string().regex(/^\d{2}:\d{2}$/),
  reason:     z.string().min(5).max(500),
});

// PATCH: modify booking
export async function PATCH(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const raw       = await req.json();
    const sanitized = sanitizeObject(raw);
    const data      = modifySchema.parse(sanitized);

    if (!isValidFutureDate(data.newDate)) {
      return NextResponse.json({ error: "Must be a future weekday (Mon–Sat)." }, { status: 400 });
    }
    if (!isWithinWorkingHours(data.newTime)) {
      return NextResponse.json({ error: "Time must be between 9AM–9PM Ottawa EST." }, { status: 400 });
    }

    await connectDB();

    const booking = await Booking.findOne({ trackingId: data.trackingId });
    if (!booking) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    if (booking.status === "cancelled") return NextResponse.json({ error: "Cancelled bookings cannot be modified." }, { status: 400 });

    // Check new slot is free
    const slotTaken = await Booking.findOne({
      date:       data.newDate,
      time:       data.newTime,
      status:     { $ne: "cancelled" },
      trackingId: { $ne: data.trackingId },
    });
    if (slotTaken) return NextResponse.json({ error: "This slot is already booked. Please choose another." }, { status: 409 });

    // Save modification history
    booking.modifications.push({
      previousDate: booking.date,
      previousTime: booking.time,
      newDate:      data.newDate,
      newTime:      data.newTime,
      reason:       data.reason,
      modifiedAt:   new Date(),
    });
    booking.date = data.newDate;
    booking.time = data.newTime;
    await booking.save();

    // Generate new PDF
    const pdfBuffer = await generateBookingPDF({
      fullName:           booking.fullName,
      email:              booking.email,
      phone:              booking.phone,
      country:            booking.country,
      service:            booking.service,
      date:               data.newDate,
      time:               data.newTime,
      trackingId:         booking.trackingId,
      message:            booking.message,
      isModification:     true,
      modificationReason: data.reason,
    });

    // Send updated PDF to both
    await sendBookingConfirmationEmails({
      fullName:           booking.fullName,
      email:              booking.email,
      phone:              booking.phone,
      country:            booking.country,
      service:            booking.service,
      date:               data.newDate,
      time:               data.newTime,
      trackingId:         booking.trackingId,
      message:            booking.message,
      isModification:     true,
      modificationReason: data.reason,
      pdfBuffer,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    console.error("Modify booking error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}