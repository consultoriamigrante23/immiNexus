import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Submission from "@/lib/models/Submission";
import { sendNotificationEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  fullName:      z.string().min(2).max(100),
  email:         z.string().email(),
  phone:         z.string().optional(),
  country:       z.string().min(2).max(100),
  service:       z.string().min(2).max(200),
  message:       z.string().max(2000).optional(),
  preferredDate: z.string().optional(),
  type:          z.enum(["contact", "booking"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await connectDB();
    await Submission.create(data);
    await sendNotificationEmail(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 });
    }
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}