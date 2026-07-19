import connectDB from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// POST /api/auth/forgot-password
export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always respond the same — don't reveal if email exists
    const genericOk = NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });

    if (!user || !user.isActive) return genericOk;

    // Generate a secure random token
    const plainToken = crypto.randomBytes(32).toString('hex');
    const tokenHash  = await bcrypt.hash(plainToken, 8);
    const expiry     = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await User.findByIdAndUpdate(user._id, {
      resetTokenHash:   tokenHash,
      resetTokenExpiry: expiry,
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${plainToken}&email=${encodeURIComponent(user.email)}`;

    await sendResetEmail({ to: user.email, name: user.name, resetUrl });

    return genericOk;
  } catch (err) {
    console.error('[Forgot Password]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

async function sendResetEmail({ to, name, resetUrl }) {
  const apiKey = process.env.RESEND_API_KEY;

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;background:#0F1117;color:#F1F5F9;border-radius:14px;padding:36px 32px;">
      <div style="text-align:center;margin-bottom:28px;">
        <span style="font-size:22px;font-weight:800;">Librix</span>
      </div>
      <h2 style="font-size:20px;font-weight:800;margin-bottom:8px;">Reset Your Password</h2>
      <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin-bottom:24px;">
        Hi <strong style="color:#F1F5F9;">${name}</strong>,<br/>
        We received a request to reset your Librix password. Click the button below to set a new password.
      </p>
      <a href="${resetUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;font-size:15px;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;margin-bottom:24px;">
        Reset Password
      </a>
      <p style="font-size:12px;color:#64748B;text-align:center;line-height:1.6;">
        This link expires in <strong>30 minutes</strong>.<br/>
        If you did not request a password reset, you can safely ignore this email.
      </p>
      <p style="font-size:11px;color:#475569;text-align:center;margin-top:20px;">Librix — Smart Library Management</p>
    </div>
  `;

  if (!apiKey || apiKey.startsWith('re_xxxx') || apiKey.startsWith('re_xxxxxxxxx')) {
    console.log(`\n${'═'.repeat(55)}`);
    console.log(`[RESET EMAIL - DEV MODE] To   : ${to}`);
    console.log(`[RESET EMAIL - DEV MODE] Link : ${resetUrl}`);
    console.log(`${'═'.repeat(55)}\n`);
    return;
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
        to:      [to],
        subject: 'Reset your Librix password',
        html,
      }),
    });
    if (!res.ok) {
      console.error('[Reset Email] Resend error:', res.status, (await res.text()).slice(0, 200));
    }
  } catch (err) {
    console.error('[Reset Email] Fetch error:', err.message);
  }
}
