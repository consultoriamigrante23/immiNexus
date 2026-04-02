import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/lib/models/Booking";
import { sendBookingConfirmationEmails } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";
import { isWithinWorkingHours, isValidFutureDate } from "@/lib/availability";
import { verifyCaptcha } from "@/lib/verifyCaptcha";
import { generateBookingPDF } from "@/lib/generatePDF";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  fullName:     z.string().min(2).max(100),
  email:        z.string().email().max(200),
  phone:        z.string().max(30).optional(),
  country:      z.string().min(2).max(100),
  service:      z.string().min(2).max(200),
  message:      z.string().max(2000).optional(),
  date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time:         z.string().regex(/^\d{2}:\d{2}$/),
  captchaToken: z.string().min(1),
});

const COOLDOWN_DAYS = 7;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
  }

  const origin = req.headers.get("origin");
  const host   = req.headers.get("host");
  if (origin && host && !origin.includes(host.split(":")[0])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const raw       = await req.json();
    const sanitized = sanitizeObject(raw);
    const data      = schema.parse(sanitized);

    // Verify captcha
    const captchaOk = await verifyCaptcha(data.captchaToken);
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 });
    }

    if (!isValidFutureDate(data.date)) {
      return NextResponse.json({ error: "Invalid date. Must be a future weekday (Mon–Sat)." }, { status: 400 });
    }
    if (!isWithinWorkingHours(data.time)) {
      return NextResponse.json({ error: "Time must be between 9:00 AM and 9:00 PM Ottawa time." }, { status: 400 });
    }

    await connectDB();

    // Spam cooldown — 7 days per email
    const cooldownDate = new Date();
    cooldownDate.setDate(cooldownDate.getDate() - COOLDOWN_DAYS);
    const recentBooking = await Booking.findOne({
      email:     data.email,
      createdAt: { $gte: cooldownDate },
      status:    { $ne: "cancelled" },
    });
    if (recentBooking) {
      const nextAllowed = new Date(recentBooking.createdAt);
      nextAllowed.setDate(nextAllowed.getDate() + COOLDOWN_DAYS);
      const daysLeft = Math.ceil((nextAllowed.getTime() - Date.now()) / 86400000);
      return NextResponse.json({
        error: `You already have a booking. You can book again in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.`,
      }, { status: 429 });
    }

    // Check slot availability
    const slotTaken = await Booking.findOne({
      date:   data.date,
      time:   data.time,
      status: { $ne: "cancelled" },
    });
    if (slotTaken) {
      return NextResponse.json({ error: "This slot is already booked. Please choose another time." }, { status: 409 });
    }

    // Generate tracking ID
    const trackingId = `IMN-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // Generate PDF
    const pdfBuffer = await generateBookingPDF({
      ...data,
      trackingId,
      isModification: false,
    });

    // Save to DB
    await Booking.create({ ...data, trackingId });

    // Send emails with PDF
    await sendBookingConfirmationEmails({
      ...data,
      trackingId,
      pdfBuffer,
      isModification: false,
    });

    return NextResponse.json({ success: true, trackingId }, { status: 200 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 });
    }
    console.error("Booking API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET booked slots for a date
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  try {
    await connectDB();
    const bookings = await Booking.find({ date, status: { $ne: "cancelled" } }).select("time");
    const bookedSlots = bookings.map((b: any) => b.time);
    return NextResponse.json({ bookedSlots }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}