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

import { sendEmail, collegeOtpEmailHtml } from '@/lib/mailer';

// ── Email sender via Unified Mailer ───────────────────────────────────────────

async function sendOTPEmail(email, otp, collegeName) {
  try {
    // ── Always log OTP to terminal (dev helper) ──
    console.log(`\n${'━'.repeat(52)}`);
    console.log(`  🏫  OTP for ${email.trim()} (College Register)`);
    console.log(`  🔑  Code    : ${otp}`);
    console.log(`  ⏱️   Expires : 10 minutes`);
    console.log(`${'━'.repeat(52)}\n`);

    await sendEmail({
      to:      email.trim(),
      subject: `Your Librarium Institution Verification Code`,
      html:    collegeOtpEmailHtml({ collegeName: collegeName.trim(), otp }),
    });

    return { success: true };
  } catch (err) {
    console.error('[Mailer] Fetch error:', err.message);
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
