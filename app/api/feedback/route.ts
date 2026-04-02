import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Feedback from "@/lib/models/Feedback";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2).max(80),
  country: z.string().min(2).max(100),
  service: z.string().min(2).max(200),
  rating:  z.number().int().min(1).max(5),
  message: z.string().min(10).max(1000),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 3, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const raw = await req.json();
    const sanitized = sanitizeObject(raw);
    const data = schema.parse(sanitized);

    await connectDB();
    await Feedback.create(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const feedbacks = await Feedback.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name country service rating message createdAt");
    return NextResponse.json({ feedbacks }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}