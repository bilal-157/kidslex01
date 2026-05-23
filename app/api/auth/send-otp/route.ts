import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import OTP from '@/models/Otps';
import { sendOTPEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if email exists
      return NextResponse.json(
        { message: 'If your email is registered, you will receive an OTP' },
        { status: 200 }
      );
    }

    // ✅ Delete ALL existing OTPs for this email
    const deletedCount = await OTP.deleteMany({ email });
    console.log(`🗑️ Deleted ${deletedCount.deletedCount} old OTPs for ${email}`);

    // ✅ Generate ONE consistent OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`🔐 Generated OTP for ${email}: ${otpCode}`);
    
    // Set expiry to 5 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // ✅ Save the SAME OTP to database
    const otpRecord = await OTP.create({
      email: email.toLowerCase(), // Store as lowercase
      otp: otpCode, // Same OTP that will be sent
      expiresAt,
      isUsed: false,
      attempts: 0,
    });

    console.log(`💾 Saved OTP to DB: ${otpRecord.otp}`);
    console.log(`📧 Sending email with OTP: ${otpCode}`);

    // ✅ Send the SAME OTP via email
    const emailSent = await sendOTPEmail(email, otpCode, user.fullName || email.split('@')[0]);
    
    if (emailSent) {
      console.log(`✅ Email sent successfully with OTP: ${otpCode}`);
    } else {
      console.log(`❌ Failed to send email`);
    }

    return NextResponse.json({
      message: 'OTP sent successfully',
      expiresIn: 300,
      // ⚠️ Remove this in production - only for debugging
      debug: process.env.NODE_ENV === 'development' ? { otp: otpCode } : undefined
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}