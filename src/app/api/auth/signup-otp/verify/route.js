import connectDB from '@/lib/db';
import User from '@/models/User';
import College from '@/models/College';
import VerificationKey from '@/models/VerificationKey';
import SignupOTP from '@/models/SignupOTP';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// POST /api/auth/signup-otp/verify
// Verifies the 6-digit OTP and creates the user account.
export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    await connectDB();

    // Find pending signup record
    const pending = await SignupOTP.findOne({
      email:     email.toLowerCase().trim(),
      expiresAt: { $gt: new Date() },
    });

    if (!pending) {
      return NextResponse.json({
        error: 'Verification code expired or not found. Please request a new one.',
      }, { status: 400 });
    }

    // Verify OTP
    const valid = await bcrypt.compare(String(otp).trim(), pending.otpHash);
    if (!valid) {
      return NextResponse.json({ error: 'Incorrect verification code. Please try again.' }, { status: 400 });
    }

    const { role, pendingData } = pending;

    // Check email not already taken (race condition guard)
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      await SignupOTP.deleteOne({ email: email.toLowerCase().trim() });
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    let response = { success: true };

    if (role === 'student') {
      const college = await College.findById(pendingData.collegeId);
      if (!college || college.status !== 'active') {
        return NextResponse.json({ error: 'College is no longer active. Please contact your librarian.' }, { status: 400 });
      }

      await User.create({
        collegeId:    pendingData.collegeId,
        name:         pendingData.name,
        email:        email.toLowerCase().trim(),
        passwordHash: pendingData.passwordHash,
        role:         'student',
        isActive:     true,
      });

      response.collegeName = pendingData.collegeName || college.name;

    } else if (role === 'librarian') {
      // Re-check the setup key is still valid
      const vk = await VerificationKey.findById(pendingData.verificationKeyId);
      if (!vk || vk.used || vk.expiresAt < new Date()) {
        await SignupOTP.deleteOne({ email: email.toLowerCase().trim() });
        return NextResponse.json({ error: 'Setup key is no longer valid. Please request a new one.' }, { status: 400 });
      }

      const college = await College.findById(vk.collegeId);
      if (!college) {
        return NextResponse.json({ error: 'Institution not found.' }, { status: 400 });
      }

      await User.create({
        collegeId:    college._id,
        name:         pendingData.name,
        email:        email.toLowerCase().trim(),
        passwordHash: pendingData.passwordHash,
        role:         'librarian',
        isActive:     true,
      });

      // Mark setup key as used and activate college
      await VerificationKey.findByIdAndUpdate(vk._id, { used: true });
      await College.findByIdAndUpdate(college._id, { status: 'active' });

      response.collegeName = college.name;
      response.libraryCode = pendingData.libraryCode || college.libraryCode;

      console.log(`[Librarian Setup] ✅ Created: ${college.name} | Library Code: ${college.libraryCode}`);
    }

    // Clean up the pending OTP record
    await SignupOTP.deleteOne({ email: email.toLowerCase().trim() });

    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error('[Signup OTP Verify]', err);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
