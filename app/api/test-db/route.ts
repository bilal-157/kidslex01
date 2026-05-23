import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const userCount = await User.countDocuments();
    const users = await User.find({}, { password: 0 }); // exclude passwords

    return NextResponse.json({
      success: true,
      message: 'MongoDB connected successfully ✅',
      totalUsers: userCount,
      users,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'MongoDB connection failed ❌',
      error: error.message,
    }, { status: 500 });
  }
}