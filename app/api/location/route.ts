import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Location from "@/models/Location";

export async function POST(req: Request) {
  const data = await req.json();
  await connectDB();

  await Location.create({
    parentEmail: data.parentEmail,
    extensionId: data.extensionId,
    latitude: data.latitude,
    longitude: data.longitude,
    time: data.time,
  });

  return NextResponse.json({ success: true });
}