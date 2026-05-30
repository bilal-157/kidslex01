import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import History from "@/models/History";

export async function POST(req: Request) {
  const data = await req.json();
  await connectDB();

  await History.create({
    parentEmail: data.parentEmail,
    extensionId: data.extensionId,
    url: data.url,
    title: data.title,
    time: data.time,
    rawTime: data.rawTime,
  });

  return NextResponse.json({ success: true });
}