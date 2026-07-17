import connectDB from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// POST /api/auth/reset-password
export async function POST(req) {
  try {
    const { email, token, password } = await req.json();

    if (!email || !token || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    await connectDB();

    // Find user and include hidden reset fields
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetTokenExpiry: { $gt: new Date() }, // not expired
    }).select('+resetTokenHash +resetTokenExpiry');

    if (!user || !user.resetTokenHash) {
      return NextResponse.json({
        error: 'Reset link is invalid or has expired. Please request a new one.',
      }, { status: 400 });
    }

    // Verify token
    const tokenValid = await bcrypt.compare(token, user.resetTokenHash);
    if (!tokenValid) {
      return NextResponse.json({
        error: 'Reset link is invalid or has expired. Please request a new one.',
      }, { status: 400 });
    }

    // Hash new password and clear reset token
    const passwordHash = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(user._id, {
      passwordHash,
      resetTokenHash:   null,
      resetTokenExpiry: null,
    });

    console.log(`[Reset Password] ✅ Password reset for ${user.email}`);

    return NextResponse.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    console.error('[Reset Password]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
