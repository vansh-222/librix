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

// ── Welcome email with all codes ──────────────────────────────────────────────

async function sendWelcomeEmail({ email, collegeName, institutionKey, libraryCode, setupKey }) {
  const apiKey = process.env.RESEND_API_KEY;

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#0F1117;color:#F1F5F9;border-radius:14px;padding:36px 32px;">
      <div style="text-align:center;margin-bottom:28px;">
        <div style="display:inline-flex;align-items:center;gap:10px;">
          <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#6366F1,#8B5CF6);display:flex;align-items:center;justify-content:center;font-size:20px;">📚</div>
          <span style="font-size:22px;font-weight:800;">Librix</span>
        </div>
      </div>

      <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:10px;padding:14px 18px;margin-bottom:24px;text-align:center;">
        <span style="font-size:13px;font-weight:700;color:#22C55E;">✅ Institution Successfully Verified</span>
      </div>

      <h2 style="font-size:20px;font-weight:800;margin-bottom:6px;">Welcome, ${collegeName}!</h2>
      <p style="color:#94A3B8;font-size:14px;margin-bottom:28px;line-height:1.6;">
        Your institution has been verified and activated on Librix. Below are your one-time credentials — please save them securely.
      </p>

      <div style="background:#1A1D27;border:1px solid #2A2D3A;border-radius:12px;padding:20px;margin-bottom:16px;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#94A3B8;margin-bottom:6px;">🏛️ Institution Key</div>
        <div style="font-size:26px;font-weight:900;letter-spacing:4px;color:#818CF8;font-family:monospace;">${institutionKey}</div>
        <div style="font-size:11px;color:#64748B;margin-top:6px;">Permanent identity key for your institution</div>
      </div>

      <div style="background:#1A1D27;border:2px solid rgba(99,102,241,0.4);border-radius:12px;padding:20px;margin-bottom:16px;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#94A3B8;margin-bottom:6px;">🔐 Librarian Setup Key <span style="color:#EF4444;">(Shown Once — Save It!)</span></div>
        <div style="font-size:26px;font-weight:900;letter-spacing:4px;color:#6366F1;font-family:monospace;">${setupKey}</div>
        <div style="font-size:11px;color:#64748B;margin-top:6px;">Share with your librarian to create their account. Expires in 7 days. Cannot be regenerated.</div>
      </div>

      <div style="background:#1A1D27;border:1px solid rgba(34,197,94,0.3);border-radius:12px;padding:20px;margin-bottom:28px;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#94A3B8;margin-bottom:6px;">📚 Student Library Code</div>
        <div style="font-size:26px;font-weight:900;letter-spacing:4px;color:#22C55E;font-family:monospace;">${libraryCode}</div>
        <div style="font-size:11px;color:#64748B;margin-top:6px;">Share with students — they enter this code when signing up on Librix.</div>
      </div>

      <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:14px 18px;margin-bottom:24px;">
        <p style="font-size:12px;color:#FCD34D;margin:0;line-height:1.7;">
          ⚠️ <strong>Next Steps:</strong><br/>
          1. Share the <strong>Librarian Setup Key</strong> with your librarian to set up their account at <a href="${process.env.NEXTAUTH_URL}/signup?tab=librarian" style="color:#818CF8;">${process.env.NEXTAUTH_URL}/signup</a><br/>
          2. Share the <strong>Student Library Code</strong> with students so they can register.
        </p>
      </div>

      <p style="font-size:12px;color:#64748B;text-align:center;line-height:1.6;">
        If you did not register on Librix, please contact us immediately.<br/>
        Do not share the Librarian Setup Key publicly.
      </p>
      <p style="font-size:11px;color:#475569;text-align:center;margin-top:20px;">Librix — Smart Library Management</p>
    </div>
  `;

  // Dev fallback — log to console if no valid Resend key
  if (!apiKey || apiKey.startsWith('re_xxxx') || apiKey.startsWith('re_xxxxxxxxx')) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`[WELCOME EMAIL - DEV MODE] To: ${email}`);
    console.log(`[WELCOME EMAIL - DEV MODE] College: ${collegeName}`);
    console.log(`[WELCOME EMAIL - DEV MODE] Institution Key : ${institutionKey}`);
    console.log(`[WELCOME EMAIL - DEV MODE] Librarian Key   : ${setupKey}`);
    console.log(`[WELCOME EMAIL - DEV MODE] Student Code    : ${libraryCode}`);
    console.log(`${'═'.repeat(60)}\n`);
    return { devMode: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    'Librix <onboarding@resend.dev>',
        to:      [email],
        subject: `🎉 ${collegeName} — Your Librix Credentials`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Welcome Email] Resend error:', res.status, err.slice(0, 200));
      return { devMode: false, error: err };
    }
    return { devMode: false };
  } catch (err) {
    console.error('[Welcome Email] Fetch error:', err.message);
    return { devMode: false, error: err.message };
  }
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

    // ── Send one-time welcome email with all credentials ─────────────────────
    const emailResult = await sendWelcomeEmail({
      email:          college.email,
      collegeName:    college.name,
      institutionKey,
      libraryCode,
      setupKey:       plainSetupKey,
    });

    if (emailResult.devMode) {
      console.log('[Verify OTP] Welcome email logged to console (dev mode — configure RESEND_API_KEY to send real emails)');
    }

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
