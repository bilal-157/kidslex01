import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import History from "@/models/History";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const extensionId = searchParams.get("extensionId");
  await connectDB();

  const history = await History.find({ extensionId }).sort({ rawTime: -1 }).limit(20);
  return NextResponse.json({ history });
}