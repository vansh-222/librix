import connectDB from '@/lib/db';
import College from '@/models/College';
import VerificationKey from '@/models/VerificationKey';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// ── Key generators ────────────────────────────────────────────────────────────

function initials(name) {
  return name
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() || '')
    .filter(Boolean)
    .slice(0, 5)
    .join('');
}

/** ABGI-LIB-7X92KQ */
function generateInstitutionKey(name) {
  const init  = initials(name) || 'CLG';
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg   = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${init}-LIB-${seg(6)}`;
}

/** LIB-ABGI-00001 */
function generateLibraryCode(name, seq) {
  const init = initials(name) || 'CLG';
  return `LIB-${init}-${String(seq).padStart(5, '0')}`;
}

/** VRL-XXXX-XXXX */
function generateSetupKey() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const seg   = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `VRL-${seg(4)}-${seg(4)}`;
}

// ── POST /api/colleges/verify-otp ─────────────────────────────────────────────

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    await connectDB();

    // Find pending college with OTP (include otpHash in query)
    const college = await College.findOne({
      email:              email.toLowerCase(),
      verificationStatus: 'pending',
      otpExpiresAt:       { $gt: new Date() },
    }).select('+otpHash');

    if (!college) {
      return NextResponse.json({
        error: 'OTP expired or not found. Please register again.',
      }, { status: 400 });
    }

    // Verify OTP
    const otpValid = await bcrypt.compare(otp.trim(), college.otpHash);
    if (!otpValid) {
      return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 });
    }

    // ── OTP correct — generate keys ──────────────────────────────────────────
    const count          = await College.countDocuments({ verificationStatus: 'verified' });
    const institutionKey = generateInstitutionKey(college.name);
    const libraryCode    = generateLibraryCode(college.name, count + 1);

    // Backward-compat collegeCode
    const init        = initials(college.name) || 'CLG';
    const collegeCode = `${init}${new Date().getFullYear()}LIB${String(count + 1).padStart(3, '0')}`;

    // Generate one-time librarian setup key
    const plainSetupKey = generateSetupKey();
    const keyHash       = await bcrypt.hash(plainSetupKey, 10);
    const expiresAt     = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const vKey = await VerificationKey.create({
      collegeId: college._id,
      keyHash,
      used:      false,
      expiresAt,
    });

    // Update college — mark verified, store keys, clear OTP
    await College.findByIdAndUpdate(college._id, {
      emailVerified:      true,
      verificationStatus: 'verified',
      institutionKey,
      libraryCode,
      collegeCode,
      setupKeyId: vKey._id,
      status:     'active',
      $unset: { otpHash: 1, otpExpiresAt: 1 },
    });

    console.log(`[Verify OTP] ✅ ${college.name} | Key: ${institutionKey} | Library: ${libraryCode}`);

    return NextResponse.json({
      success:        true,
      collegeName:    college.name,
      university:     college.university,
      institutionKey,   // ABGI-LIB-7X92KQ — permanent institution identity
      libraryCode,      // LIB-ABGI-00001  — share with students
      setupKey: plainSetupKey, // VRL-XXXX-XXXX  — one-time librarian setup
    });

  } catch (err) {
    console.error('[Verify OTP]', err);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
