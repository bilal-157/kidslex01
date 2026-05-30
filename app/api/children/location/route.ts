import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Location from "@/models/Location";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const extensionId = searchParams.get("extensionId");
  await connectDB();

  const locations = await Location.find({ extensionId }).sort({ createdAt: -1 }).limit(20);
  return NextResponse.json({ locations });
}