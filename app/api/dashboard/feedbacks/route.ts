import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const feedbacks = await db
      .collection("feedbacks")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = feedbacks.map(f => ({
      ...f,
      _id: f._id.toString(),
    }));

    return NextResponse.json({ feedbacks: serialized }, { status: 200 });
  } catch (err) {
    console.error("[dashboard/feedbacks GET]", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, approved } = await req.json();

    if (!id || !ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { db } = await connectToDatabase();
    await db.collection("feedbacks").updateOne(
      { _id: new ObjectId(id) },
      { $set: { approved, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[dashboard/feedbacks PATCH]", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id || !ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const { db } = await connectToDatabase();
    await db.collection("feedbacks").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[dashboard/feedbacks DELETE]", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}