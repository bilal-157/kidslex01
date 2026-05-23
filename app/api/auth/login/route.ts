import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendLoginNotificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log('Login attempt for email:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('Database connected');

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Comparing password for user:', user.email);
    console.log('Stored password hash length:', user.password?.length);
    
    // Compare password
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('Login successful for:', email);

    // Send email notification (don't await)
    sendLoginNotificationEmail(user.email, user.fullName || user.email.split('@')[0]);

    // Return user info
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error: any) {
    console.error('Login error details:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}