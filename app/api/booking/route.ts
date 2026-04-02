import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/lib/models/Booking";
import { sendNotificationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";
import { isWithinWorkingHours, isValidFutureDate } from "@/lib/availability";
import { z } from "zod";

const schema = z.object({
  fullName:  z.string().min(2).max(100),
  email:     z.string().email().max(200),
  phone:     z.string().max(30).optional(),
  country:   z.string().min(2).max(100),
  service:   z.string().min(2).max(200),
  message:   z.string().max(2000).optional(),
  date:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time:      z.string().regex(/^\d{2}:\d{2}$/),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && !origin.includes(host.split(":")[0])) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const raw = await req.json();
    const sanitized = sanitizeObject(raw);
    const data = schema.parse(sanitized);

    if (!isValidFutureDate(data.date)) {
      return NextResponse.json({ error: "Invalid date. Must be a future weekday." }, { status: 400 });
    }
    if (!isWithinWorkingHours(data.time)) {
      return NextResponse.json({ error: "Time must be between 9:00 AM and 9:00 PM Ottawa time." }, { status: 400 });
    }

    // Check slot not already taken
    await connectDB();
    const existing = await Booking.findOne({ date: data.date, time: data.time, status: { $ne: "cancelled" } });
    if (existing) {
      return NextResponse.json({ error: "This slot is already booked. Please choose another time." }, { status: 409 });
    }

    await Booking.create(data);
    await sendNotificationEmail({ ...data, type: "booking", preferredDate: `${data.date} at ${data.time} (Ottawa EST)` });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("Booking API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}