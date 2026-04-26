import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { generatePDF } from "@/lib/generatePDF";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI)
      return NextResponse.json({ error: "Server error" }, { status: 500 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id || !ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { db } = await connectToDatabase();
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });

    if (!booking)
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const pdfBuffer = await generatePDF({
      trackingId: booking.trackingId,
      fullName:   booking.fullName,
      email:      booking.email,
      phone:      booking.phone,
      country:    booking.country,
      service:    booking.service,
      date:       booking.date,
      time:       booking.time,
      message:    booking.message,
    });

    const pdfBase64 = pdfBuffer.toString("base64");
    return NextResponse.json({ pdfBase64 }, { status: 200 });

  } catch (err) {
    console.error("[dashboard/pdf GET]", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}