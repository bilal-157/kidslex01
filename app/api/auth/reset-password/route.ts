import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import OTP from '@/models/Otps';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    // Validation
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      const expiredOTP = await OTP.findOne({ email, otp });
      if (expiredOTP && expiredOTP.expiresAt <= new Date()) {
        return NextResponse.json(
          { error: 'OTP has expired. Please request a new one.' },
          { status: 400 }
        );
      }
      if (expiredOTP && expiredOTP.isUsed) {
        return NextResponse.json(
          { error: 'OTP has already been used.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // ✅ IMPORTANT: Directly assign password - let the pre('save') hook handle hashing
    // This ensures the SAME hashing method as register
    user.password = newPassword;
    await user.save(); // The pre('save') hook will automatically hash it

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Delete all OTPs for this email after successful reset
    await OTP.deleteMany({ email });

    console.log(`✅ Password reset successful for: ${email}`);

    return NextResponse.json({
      message: 'Password reset successful',
      success: true,
    });

  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}