import connectDB from '@/lib/db';
import VerificationKey from '@/models/VerificationKey';
import College from '@/models/College';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// POST /api/librarian/setup — create librarian account using one-time setup key
export async function POST(req) {
  try {
    const body = await req.json();
    const { setupKey, name, email, password } = body;

    if (!setupKey || !name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await connectDB();

    // Find all unused, non-expired keys and compare hashes
    const validKeys = await VerificationKey.find({
      used:      false,
      expiresAt: { $gt: new Date() },
    });

    let matchedKey   = null;
    let matchedCollege = null;

    for (const vk of validKeys) {
      const match = await bcrypt.compare(setupKey.trim().toUpperCase(), vk.keyHash);
      if (match) {
        matchedKey     = vk;
        matchedCollege = await College.findById(vk.collegeId);
        break;
      }
    }

    if (!matchedKey || !matchedCollege) {
      return NextResponse.json({
        error: 'Invalid or expired setup key. Please check the key and try again.',
      }, { status: 400 });
    }

    if (matchedCollege.verificationStatus !== 'verified') {
      return NextResponse.json({ error: 'College is not verified' }, { status: 400 });
    }

    // Check librarian email not already taken
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Create librarian user
    const passwordHash = await User.hashPassword(password);
    await User.create({
      collegeId:    matchedCollege._id,
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      passwordHash,
      role:         'librarian',
      isActive:     true,
    });

    // Mark key as used (consumed forever)
    await VerificationKey.findByIdAndUpdate(matchedKey._id, { used: true });

    // Activate college
    await College.findByIdAndUpdate(matchedCollege._id, { status: 'active' });

    console.log(`[Librarian Setup] Created librarian for: ${matchedCollege.name} | Library Code: ${matchedCollege.libraryCode}`);

    return NextResponse.json({
      success:     true,
      collegeName: matchedCollege.name,
      libraryCode: matchedCollege.libraryCode, // remind them of the code for students
    }, { status: 201 });

  } catch (err) {
    console.error('[Librarian Setup]', err);
    return NextResponse.json({ error: 'Setup failed. Please try again.' }, { status: 500 });
  }
}
