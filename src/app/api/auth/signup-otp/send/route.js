import connectDB from '@/lib/db';
import User from '@/models/User';
import College from '@/models/College';
import VerificationKey from '@/models/VerificationKey';
import SignupOTP from '@/models/SignupOTP';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendEmail, otpEmailHtml } from '@/lib/mailer';

// POST /api/auth/signup-otp/send
// Validates the library/setup code, then sends a 6-digit OTP to the email.
export async function POST(req) {
  try {
    const { name, email, password, role, collegeCode, setupKey } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    await connectDB();

    let pendingData = { name: name.trim(), passwordHash: '', collegeName: '', libraryCode: '', collegeId: null, verificationKeyId: null };

    if (role === 'student') {
      if (!collegeCode?.trim()) {
        return NextResponse.json({ error: 'Library Code is required.' }, { status: 400 });
      }
      const college = await College.findOne({
        $or: [
          { libraryCode: collegeCode.trim().toUpperCase(), status: 'active' },
          { collegeCode: collegeCode.trim().toUpperCase(), status: 'active' },
        ],
      });
      if (!college) {
        return NextResponse.json({ error: 'Invalid Library Code. Please check with your librarian.' }, { status: 400 });
      }
      pendingData.collegeId   = college._id;
      pendingData.collegeName = college.name;

    } else if (role === 'librarian') {
      if (!setupKey?.trim()) {
        return NextResponse.json({ error: 'Setup Key is required.' }, { status: 400 });
      }
      // Find and validate the setup key
      const validKeys = await VerificationKey.find({ used: false, expiresAt: { $gt: new Date() } });
      let matchedKey = null, matchedCollege = null;
      for (const vk of validKeys) {
        if (await bcrypt.compare(setupKey.trim().toUpperCase(), vk.keyHash)) {
          matchedKey     = vk;
          matchedCollege = await College.findById(vk.collegeId);
          break;
        }
      }
      if (!matchedKey || !matchedCollege) {
        return NextResponse.json({ error: 'Invalid or expired Setup Key.' }, { status: 400 });
      }
      if (matchedCollege.verificationStatus !== 'verified') {
        return NextResponse.json({ error: 'College is not yet verified.' }, { status: 400 });
      }
      pendingData.verificationKeyId = matchedKey._id;
      pendingData.collegeName       = matchedCollege.name;
      pendingData.libraryCode       = matchedCollege.libraryCode;
    } else {
      return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // Hash password upfront so we never store it in plain text
    pendingData.passwordHash = await bcrypt.hash(password, 12);

    // Generate 6-digit OTP
    const otp     = String(crypto.randomInt(100000, 999999));
    const otpHash = await bcrypt.hash(otp, 8);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert — replace any existing pending OTP for this email
    await SignupOTP.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { email: email.toLowerCase().trim(), otpHash, expiresAt, role, pendingData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // ── Always log OTP to terminal (dev helper — code is always visible here) ──
    console.log(`\n${'━'.repeat(52)}`);
    console.log(`  📧  OTP for ${email.trim()}`);
    console.log(`  🔑  Code    : ${otp}`);
    console.log(`  ⏱️   Expires : 10 minutes`);
    console.log(`${'━'.repeat(52)}\n`);

    // Send OTP email via shared mailer (Gmail SMTP → Resend → dev log)
    // NOTE: Subject does NOT contain the OTP — that's a spam trigger.
    await sendEmail({
      to:      email.trim(),
      subject: `Your Librarium signup verification code`,
      html:    otpEmailHtml({ name: name.trim(), otp, role }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Signup OTP Send]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
