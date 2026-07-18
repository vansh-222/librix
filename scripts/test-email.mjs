/**
 * Email delivery diagnostic test.
 * Run: node scripts/test-email.mjs your@email.com
 */

import nodemailer from 'nodemailer';
import dotenv   from 'dotenv';
import path     from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const TO = process.argv[2] || process.env.GMAIL_USER;

console.log('\n🔍 Email Diagnostic\n');
console.log('GMAIL_USER       :', process.env.GMAIL_USER  || '❌ NOT SET');
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Set (' + process.env.GMAIL_APP_PASSWORD.length + ' chars)' : '❌ NOT SET');
console.log('Sending to       :', TO, '\n');

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.error('❌ Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env.local');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
  debug: true,   // prints full SMTP conversation
  logger: true,
});

try {
  console.log('🔌 Verifying SMTP connection...');
  await transporter.verify();
  console.log('✅ SMTP connection verified!\n');
} catch (err) {
  console.error('❌ SMTP connection failed:', err.message);
  console.error('   → Check GMAIL_APP_PASSWORD is correct (no spaces, 16 chars)');
  process.exit(1);
}

try {
  console.log('📤 Sending test email...');
  const info = await transporter.sendMail({
    from:    `"Librarium" <${process.env.GMAIL_USER}>`,
    to:      TO,
    subject: 'Librarium Email Test — please check this email',
    html: `
      <div style="font-family:Arial;padding:24px;max-width:400px">
        <h2 style="color:#2563EB">✅ Email is working!</h2>
        <p>If you received this, Gmail SMTP is delivering correctly.</p>
        <p>Your OTP verification emails will reach users.</p>
        <p style="color:#888;font-size:12px">Sent from Librarium diagnostic test</p>
      </div>
    `,
  });

  console.log('\n✅ Email sent!');
  console.log('   Message ID :', info.messageId);
  console.log('   Response   :', info.response);
  console.log('\n📬 Check the inbox (and spam) of:', TO);
} catch (err) {
  console.error('\n❌ Send failed:', err.message);
  console.error('   Code     :', err.code);
  console.error('   Response :', err.response);
}
