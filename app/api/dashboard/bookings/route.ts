import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const bookings = await db
      .collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert _id to string so JSON serialization works
    const serialized = bookings.map(b => ({
      ...b,
      _id: b._id.toString(),
    }));

    return NextResponse.json({ bookings: serialized }, { status: 200 });
  } catch (err) {
    console.error("[dashboard/bookings GET]", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status)
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });

    if (!ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { db } = await connectToDatabase();
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[dashboard/bookings PATCH]", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}