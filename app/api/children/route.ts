import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Child from "@/models/Child";

export async function POST(req: Request) {
  const { parentEmail, childName, extensionId } = await req.json();
  await connectDB();

  const exists = await Child.findOne({ extensionId });
  if (exists) return NextResponse.json({ error: "Extension ID already linked" }, { status: 400 });

  await Child.create({ parentEmail, childName, extensionId });
  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parentEmail = searchParams.get("parentEmail");
  await connectDB();

  const children = await Child.find({ parentEmail });
  return NextResponse.json({ children });
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await connectDB();
  await Child.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}