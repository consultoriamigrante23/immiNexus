import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Simple token check — dashboard only
function isAuthorized(req: NextRequest): boolean {
  const referer = req.headers.get("referer") ?? "";
  // Allow from localhost always
  const host = req.headers.get("host") ?? "";
  if (host.includes("localhost") || host.includes("127.0.0.1")) return true;
  // In production — check referer is from same domain
  return referer.includes("/dashboard");
}

export async function GET(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI)
      return NextResponse.json({ error: "Server error" }, { status: 500 });

    const { db } = await connectToDatabase();
    const bookings = await db
      .collection("bookings")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Serialize _id
    const serialized = bookings.map(b => ({
      ...b,
      _id: b._id.toString(),
    }));

    return NextResponse.json({ bookings: serialized }, { status: 200 });
  } catch (err) {
    console.error("[dashboard/bookings GET]", err);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!process.env.MONGODB_URI)
      return NextResponse.json({ error: "Server error" }, { status: 500 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id || !ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { db } = await connectToDatabase();
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "cancelled", updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[dashboard/bookings PATCH]", err);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}