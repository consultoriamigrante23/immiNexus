import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Submission from "@/lib/models/Submission";
import { sendNotificationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeObject } from "@/lib/sanitize";
import { verifyCaptcha } from "@/lib/verifyCaptcha";
import { z } from "zod";

const schema = z.object({
  fullName:     z.string().min(2).max(100),
  email:        z.string().email().max(200),
  phone:        z.string().max(30).optional(),
  country:      z.string().min(2).max(100),
  service:      z.string().min(2).max(200),
  message:      z.string().max(2000).optional(),
  type:         z.enum(["contact","booking"]),
  captchaToken: z.string().min(1),
});

const COOLDOWN_DAYS = 7;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
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

    const captchaOk = await verifyCaptcha(data.captchaToken);
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha verification failed." }, { status: 400 });
    }

    await connectDB();

    // 7-day cooldown per email
    const cooldownDate = new Date();
    cooldownDate.setDate(cooldownDate.getDate() - COOLDOWN_DAYS);
    const recent = await Submission.findOne({
      email:     data.email,
      createdAt: { $gte: cooldownDate },
    });
    if (recent) {
      const nextAllowed = new Date(recent.createdAt);
      nextAllowed.setDate(nextAllowed.getDate() + COOLDOWN_DAYS);
      const daysLeft = Math.ceil((nextAllowed.getTime() - Date.now()) / 86400000);
      return NextResponse.json({
        error: `You already sent a message recently. Please wait ${daysLeft} more day${daysLeft !== 1 ? "s" : ""} before contacting us again.`,
      }, { status: 429 });
    }

    const { captchaToken, ...saveData } = data;
    await Submission.create(saveData);
    await sendNotificationEmail(saveData);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}