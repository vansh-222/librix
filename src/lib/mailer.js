/**
 * Unified email sender for Librix.
 *
 * Priority order:
 *  1. Brevo SMTP  — best deliverability, free 300/day, no domain needed
 *  2. Gmail SMTP  — if GMAIL_USER + GMAIL_APP_PASSWORD are set
 *  3. Resend API  — if RESEND_API_KEY is set (domain-restricted on free plan)
 *  4. Dev fallback — logs to terminal
 */

import nodemailer from 'nodemailer';

/* ── Transporter factories ───────────────────────────────────────────────── */

function createBrevoTransport() {
  return nodemailer.createTransport({
    host:   'smtp-relay.brevo.com',
    port:   587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER,       // your Brevo account email
      pass: process.env.BREVO_SMTP_KEY,   // from Brevo → Settings → SMTP & API
    },
  });
}

function createGmailTransport() {
  return nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });
}

/* ── Core sendEmail function ─────────────────────────────────────────────── */
export async function sendEmail({ to, subject, html }) {
  const brevoUser = process.env.BREVO_USER;
  const brevoKey  = process.env.BREVO_SMTP_KEY;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const resendKey = process.env.RESEND_API_KEY;

  // ── Method 1: Brevo SMTP (best deliverability — inbox, not spam) ──────
  if (brevoUser && brevoKey) {
    const transporter = createBrevoTransport();
    await transporter.sendMail({
      from: `"Librix" <${brevoUser}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email] ✅ Sent via Brevo SMTP to ${to}`);
    return;
  }

  // ── Method 2: Gmail SMTP ──────────────────────────────────────────────
  if (gmailUser && gmailPass) {
    const transporter = createGmailTransport();
    await transporter.sendMail({
      from: `"Librix" <${gmailUser}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email] ✅ Sent via Gmail SMTP to ${to}`);
    return;
  }

  // ── Method 3: Resend API ──────────────────────────────────────────────
  if (resendKey && !resendKey.startsWith('re_xxxx')) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'Librix <onboarding@resend.dev>',
        to:      [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`[Email] Resend error ${res.status}:`, err.slice(0, 200));
      throw new Error(`Email delivery failed (Resend ${res.status})`);
    }
    console.log(`[Email] ✅ Sent via Resend to ${to}`);
    return;
  }

  // ── Method 4: Dev fallback — log to terminal ──────────────────────────
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`[EMAIL - DEV FALLBACK - Configure email in .env.local]`);
  console.log(`To      : ${to}`);
  console.log(`Subject : ${subject}`);
  console.log(`${'═'.repeat(60)}\n`);
}

/* ── Pre-built email templates ───────────────────────────────────────────── */

export function otpEmailHtml({ name, otp, role }) {
  const roleLabel = role === 'librarian' ? 'Librarian' : 'Student';
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:16px;padding:40px 36px;">
      <div style="text-align:center;margin-bottom:28px;">
        <span style="font-size:22px;font-weight:800;color:#0F172A;">Librix</span>
      </div>
      <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 8px;">Verify Your Email</h2>
      <p style="font-size:14px;color:#64748B;line-height:1.6;margin:0 0 28px;">
        Hi <strong style="color:#0F172A;">${name}</strong>,<br/>
        Use the code below to complete your <strong>${roleLabel}</strong> account registration on Librix.
      </p>
      <div style="text-align:center;background:#F8FAFC;border:2px dashed #BFDBFE;border-radius:14px;padding:28px 20px;margin-bottom:28px;">
        <div style="font-size:42px;font-weight:900;letter-spacing:14px;color:#2563EB;font-family:monospace;">${otp}</div>
        <div style="font-size:12px;color:#94A3B8;margin-top:10px;">Expires in <strong>10 minutes</strong></div>
      </div>
      <p style="font-size:12px;color:#94A3B8;text-align:center;line-height:1.6;">
        If you did not request this, you can safely ignore this email.<br/>
        Never share this code with anyone.
      </p>
      <div style="border-top:1px solid #E2E8F0;margin-top:28px;padding-top:16px;text-align:center;font-size:11px;color:#CBD5E1;">
        Librix — Smart Library Management
      </div>
    </div>
  `;
}

export function collegeOtpEmailHtml({ collegeName, otp }) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:16px;padding:40px 36px;">
      <div style="text-align:center;margin-bottom:28px;">
        <span style="font-size:22px;font-weight:800;color:#0F172A;">Librix</span>
      </div>
      <h2 style="font-size:20px;font-weight:800;color:#0F172A;text-align:center;margin:0 0 8px;">Institution Verification</h2>
      <p style="font-size:14px;color:#64748B;line-height:1.6;text-align:center;margin:0 0 28px;">
        Verifying <strong style="color:#0F172A;">${collegeName}</strong>
      </p>
      <div style="text-align:center;background:#F8FAFC;border:2px dashed #BFDBFE;border-radius:14px;padding:28px 20px;margin-bottom:28px;">
        <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#64748B;margin-bottom:10px;">Your OTP Code</div>
        <div style="font-size:42px;font-weight:900;letter-spacing:14px;color:#2563EB;font-family:monospace;">${otp}</div>
        <div style="font-size:12px;color:#94A3B8;margin-top:10px;">Expires in <strong>10 minutes</strong></div>
      </div>
      <p style="font-size:12px;color:#94A3B8;text-align:center;line-height:1.6;">
        If you did not request this, you can safely ignore this email.<br/>
        Do not share this code with anyone.
      </p>
      <div style="border-top:1px solid #E2E8F0;margin-top:28px;padding-top:16px;text-align:center;font-size:11px;color:#CBD5E1;">
        Librix — Smart Library Management
      </div>
    </div>
  `;
}

export function welcomeEmailHtml({ name, role, collegeName, libraryCode, setupKey }) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:16px;padding:40px 36px;">
      <div style="text-align:center;margin-bottom:28px;">
        <span style="font-size:22px;font-weight:800;color:#0F172A;">Librix</span>
      </div>
      <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 8px;">Welcome to Librix! 🎉</h2>
      <p style="font-size:14px;color:#64748B;line-height:1.6;margin:0 0 20px;">
        Hi <strong style="color:#0F172A;">${name}</strong>,<br/>
        Your <strong>${role}</strong> account for <strong>${collegeName}</strong> has been created successfully.
      </p>
      ${libraryCode ? `
        <div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
          <div style="font-size:12px;font-weight:700;color:#0369A1;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Student Library Code</div>
          <div style="font-size:24px;font-weight:900;letter-spacing:4px;color:#0F172A;font-family:monospace;">${libraryCode}</div>
          <div style="font-size:12px;color:#64748B;margin-top:6px;">Share this code with students to let them join your library.</div>
        </div>
      ` : ''}
      ${setupKey ? `
        <div style="background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:16px 20px;margin-bottom:20px;">
          <div style="font-size:12px;font-weight:700;color:#C2410C;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Librarian Setup Key</div>
          <div style="font-size:18px;font-weight:900;letter-spacing:3px;color:#0F172A;font-family:monospace;">${setupKey}</div>
          <div style="font-size:12px;color:#64748B;margin-top:6px;">Share this key with your librarian to set up their account. It expires in 72 hours.</div>
        </div>
      ` : ''}
      <div style="border-top:1px solid #E2E8F0;margin-top:28px;padding-top:16px;text-align:center;font-size:11px;color:#CBD5E1;">
        Librix — Smart Library Management
      </div>
    </div>
  `;
}

export function forgotPasswordEmailHtml({ name, resetUrl }) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #E2E8F0;border-radius:16px;padding:40px 36px;">
      <div style="text-align:center;margin-bottom:28px;">
        <span style="font-size:22px;font-weight:800;color:#0F172A;">Librix</span>
      </div>
      <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 8px;">Reset Your Password</h2>
      <p style="font-size:14px;color:#64748B;line-height:1.6;margin:0 0 28px;">
        Hi <strong style="color:#0F172A;">${name}</strong>,<br/>
        We received a request to reset your Librix password. Click the button below to create a new one.
      </p>
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;background:#2563EB;color:#ffffff;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">
          Reset Password
        </a>
      </div>
      <p style="font-size:12px;color:#94A3B8;text-align:center;line-height:1.6;">
        This link expires in <strong>1 hour</strong>. If you did not request a password reset, ignore this email.
      </p>
      <div style="border-top:1px solid #E2E8F0;margin-top:28px;padding-top:16px;text-align:center;font-size:11px;color:#CBD5E1;">
        Librix — Smart Library Management
      </div>
    </div>
  `;
}
