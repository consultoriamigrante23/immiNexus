import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { sanitize } from "@/lib/sanitize";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ feedbacks: [] });
    }

    const { db } = await connectToDatabase();
    const feedbacks = await db
      .collection("feedbacks")
      .find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({ feedbacks }, { status: 200 });

  } catch (err) {
    console.error("[feedback GET] Error:", err);
    return NextResponse.json({ feedbacks: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { name, country, service, rating, message } = body;

    if (!name || !country || !service || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, country, service, message" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    await db.collection("feedbacks").insertOne({
      name:      sanitize(name),
      country:   sanitize(country),
      service:   sanitize(service),
      rating:    ratingNum,
      message:   sanitize(message),
      approved:  false, // admin must approve
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "Thank you! Your review will appear after approval." },
      { status: 201 }
    );

  } catch (err) {
    console.error("[feedback POST] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}