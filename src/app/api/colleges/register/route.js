import connectDB from '@/lib/db';
import College from '@/models/College';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// ── Domain helpers ────────────────────────────────────────────────────────────

function extractEmailDomain(email) {
  return (email.split('@')[1] || '').toLowerCase().replace(/^www\./, '').trim();
}

function extractSiteDomain(website) {
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    return url.hostname.toLowerCase().replace(/^www\./, '').trim();
  } catch {
    return website.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim();
  }
}

// ── OTP helpers ────────────────────────────────────────────────────────────────

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

// ── Email sender via Resend ───────────────────────────────────────────────────

async function sendOTPEmail(email, otp, collegeName) {
  const apiKey = process.env.RESEND_API_KEY;

  // Dev fallback — log OTP to console if no valid Resend key
  if (!apiKey || apiKey.startsWith('re_xxxx')) {
    console.log(`\n${'═'.repeat(50)}`);
    console.log(`[OTP - DEV MODE] To: ${email}`);
    console.log(`[OTP - DEV MODE] Code: ${otp}`);
    console.log(`${'═'.repeat(50)}\n`);
    return { success: true, devMode: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'Librarium <noreply@librarium.app>',
        to:      [email],
        subject: `${otp} — Your Librarium Verification Code`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#0F1117;color:#F1F5F9;border-radius:12px;">
            <div style="text-align:center;margin-bottom:28px;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#6366F1,#8B5CF6);display:flex;align-items:center;justify-content:center;">
                  📚
                </div>
                <span style="font-size:22px;font-weight:800;">Librar<span style="color:#6366F1;">ium</span></span>
              </div>
            </div>
            <h2 style="font-size:20px;font-weight:800;text-align:center;margin-bottom:8px;">Institution Verification</h2>
            <p style="color:#94A3B8;font-size:14px;text-align:center;margin-bottom:28px;">
              Verifying <strong style="color:#F1F5F9;">${collegeName}</strong>
            </p>
            <div style="background:#1A1D27;border:1px solid #2A2D3A;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
              <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#94A3B8;margin-bottom:10px;">Your OTP Code</div>
              <div style="font-size:40px;font-weight:900;letter-spacing:8px;color:#6366F1;font-family:monospace;">${otp}</div>
              <div style="font-size:12px;color:#94A3B8;margin-top:10px;">Expires in 10 minutes</div>
            </div>
            <p style="font-size:12px;color:#64748B;text-align:center;line-height:1.6;">
              If you did not request this, please ignore this email.<br/>
              Do not share this code with anyone.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[Resend] Error:', res.status, err.slice(0, 200));
      return { success: false, error: err };
    }

    return { success: true };
  } catch (err) {
    console.error('[Resend] Fetch error:', err.message);
    return { success: false, error: err.message };
  }
}

// ── POST /api/colleges/register ───────────────────────────────────────────────

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, university, website, email, aisheCode, contactName, designation, mobile } = body;

    if (!name || !university || !website || !email) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // ── Domain match check ───────────────────────────────────────────────────
    const emailDomain = extractEmailDomain(email);
    const siteDomain  = extractSiteDomain(website);

    console.log(`[College Register] Email domain: "${emailDomain}" | Site domain: "${siteDomain}"`);

    // ── DEV MODE: set to false to enforce strict domain matching in production ──
    const DEV_MODE = true;

    if (!DEV_MODE) {
      // Reject generic email providers (Gmail, Yahoo, etc.)
      const genericProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'rediffmail.com', 'ymail.com'];
      if (genericProviders.includes(emailDomain)) {
        return NextResponse.json({
          error: `Generic email providers (${emailDomain}) are not accepted. Please use your official institution email (e.g. admin@${siteDomain}).`,
          domainMismatch: true,
        }, { status: 400 });
      }

      // Reject if email domain doesn't match website domain
      if (emailDomain !== siteDomain) {
        return NextResponse.json({
          error: `Domain mismatch: email domain "${emailDomain}" does not match website domain "${siteDomain}". Use an email from your official website domain.`,
          domainMismatch: true,
          emailDomain,
          siteDomain,
        }, { status: 400 });
      }
    } else {
      console.log(`[College Register] DEV MODE — domain check skipped (${emailDomain} vs ${siteDomain})`);
    }

    await connectDB();

    // Check duplicate by email
    const existing = await College.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.verificationStatus === 'verified') {
        return NextResponse.json({ error: 'This email is already registered' }, { status: 409 });
      }
      // Pending — resend OTP
      const otp       = generateOTP();
      const otpHash   = await bcrypt.hash(otp, 8);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await College.findByIdAndUpdate(existing._id, { otpHash, otpExpiresAt: expiresAt });
      const emailResult = await sendOTPEmail(email, otp, existing.name);
      return NextResponse.json({
        otpSent:     true,
        maskedEmail: maskEmail(email),
        resent:      true,
        devMode:     emailResult.devMode || false,
      });
    }

    // Check duplicate AISHE code (if provided)
    if (aisheCode && aisheCode.trim()) {
      const aisheExists = await College.findOne({
        aisheCode:          aisheCode.trim().toUpperCase(),
        verificationStatus: 'verified',
      });
      if (aisheExists) {
        return NextResponse.json({
          error: 'This institution (AISHE code) is already registered on Librarium.',
        }, { status: 409 });
      }
    }

    // ── Create pending college + send OTP ────────────────────────────────────
    const otp       = generateOTP();
    const otpHash   = await bcrypt.hash(otp, 8);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await College.create({
      name:        name.trim(),
      university:  university.trim(),
      website:     website.trim(),
      email:       email.toLowerCase().trim(),
      emailDomain,
      siteDomain,
      domainVerified: true,
      emailVerified:  false,
      verificationStatus: 'pending',
      otpHash,
      otpExpiresAt: expiresAt,
      // AISHE + contact
      aisheCode:   aisheCode ? aisheCode.trim().toUpperCase() : '',
      contactName: contactName || '',
      designation: designation || '',
      mobile:      mobile      || '',
    });

    const emailResult = await sendOTPEmail(email, otp, name);

    console.log(`[College Register] OTP sent to ${email} | AISHE: ${aisheCode || 'N/A'} | Domain: ${siteDomain} ✅`);

    return NextResponse.json({
      otpSent:     true,
      maskedEmail: maskEmail(email),
      devMode:     emailResult.devMode || false,
    });

  } catch (err) {
    console.error('[College Register]', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}

function maskEmail(email) {
  const [user, domain] = email.split('@');
  const masked = user.slice(0, 2) + '***';
  return `${masked}@${domain}`;
}
