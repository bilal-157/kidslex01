import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import OTP from '@/models/Otps';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() }, // Not expired
    });

    if (!otpRecord) {
      // Check if OTP exists for this email
      const existingOTP = await OTP.findOne({ email, otp });
      
      if (existingOTP && existingOTP.expiresAt <= new Date()) {
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new one.' },
          { status: 400 }
        );
      }
      
      if (existingOTP && existingOTP.isUsed) {
        return NextResponse.json(
          { error: 'OTP has already been used.' },
          { status: 400 }
        );
      }

      // Increment attempts for invalid OTP
      if (existingOTP) {
        existingOTP.attempts += 1;
        await existingOTP.save();
        
        if (existingOTP.attempts >= 5) {
          await OTP.deleteOne({ _id: existingOTP._id });
          return NextResponse.json(
            { error: 'Too many failed attempts. Please request a new OTP.' },
            { status: 400 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // Mark OTP as verified (don't mark as used yet, wait for password reset)
    // We'll just return success and let the reset-password API mark it as used
    
    return NextResponse.json({
      message: 'OTP verified successfully',
      verified: true,
    });

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}