'use client';
import { useState, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BookOpen, Loader2, AlertCircle, CheckCircle,
  Eye, EyeOff, Hash, GraduationCap, Library, Key, User,
  ShieldCheck, Landmark, Users, BarChart3, Mail, Lock, Quote, UserPlus, RefreshCw
} from 'lucide-react';

const SCROLL_AND_THEME = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  html, body {
    background: #F8FAFC !important;
    color: #0F172A !important;
    min-height: 100vh;
  }
  .signup-page {
    --bg: #F8FAFC;
    --surface: #FFFFFF;
    --text: #0F172A;
    --muted: #64748B;
    --border: #E2E8F0;
    --brand: #2563EB;
    color: #0F172A;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .signup-page * {
    box-sizing: border-box;
  }
  .signup-input {
    width: 100%;
    height: 46px;
    border: 1px solid #E2E8F0;
    border-radius: 10px;
    background: #FFFFFF;
    color: #0F172A;
    font-size: 14px;
    padding: 0 14px 0 42px;
    outline: none;
    transition: all 0.2s;
  }
  .signup-input::placeholder { color: #94A3B8; }
  .signup-input:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .role-card {
    border: 1px solid #E2E8F0;
    border-radius: 14px;
    padding: 16px;
    background: #FFFFFF;
    cursor: pointer;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    transition: all 0.2s;
  }
  .role-card:hover {
    border-color: #93C5FD;
  }
  .role-card.active {
    border: 2px solid #2563EB;
    background: #EFF6FF;
    box-shadow: 0 4px 14px rgba(37,99,235,0.08);
  }
  .feature-badge:hover {
    transform: translateX(4px);
  }
`;

function BuildingIllustration() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <svg width="240" height="150" viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background clouds / bushes */}
        <path d="M40 135 C30 135 25 125 32 118 C35 110 48 110 52 118 C58 115 68 120 65 130 Z" fill="#E2E8F0" opacity="0.6" />
        <path d="M190 135 C180 135 175 125 182 118 C185 110 198 110 202 118 C208 115 218 120 215 130 Z" fill="#E2E8F0" opacity="0.6" />

        {/* Flag structure */}
        <line x1="120" y1="20" x2="120" y2="45" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M121 21 L142 28 L121 35 Z" fill="#2563EB" />

        {/* Main building body */}
        <rect x="60" y="65" width="120" height="70" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

        {/* Left & Right wings */}
        <rect x="42" y="80" width="18" height="55" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="180" y="80" width="18" height="55" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />

        {/* Center pediment / roof */}
        <path d="M54 65 L120 38 L186 65 Z" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
        <rect x="52" y="63" width="136" height="5" rx="2" fill="#2563EB" />

        {/* Clock inside pediment */}
        <circle cx="120" cy="52" r="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="120" y1="52" x2="120" y2="48" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="120" y1="52" x2="123" y2="52" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />

        {/* Main door & pillars */}
        <rect x="106" y="100" width="28" height="35" rx="2" fill="#1E293B" />
        <rect x="109" y="103" width="10" height="32" fill="#3B82F6" opacity="0.3" />
        <rect x="121" y="103" width="10" height="32" fill="#3B82F6" opacity="0.3" />
        <rect x="94" y="96" width="6" height="39" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
        <rect x="140" y="96" width="6" height="39" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />

        {/* Windows - Center body */}
        <rect x="72" y="78" width="14" height="16" rx="2" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
        <rect x="154" y="78" width="14" height="16" rx="2" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
        <rect x="72" y="104" width="14" height="16" rx="2" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
        <rect x="154" y="104" width="14" height="16" rx="2" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />

        {/* Windows - Side wings */}
        <rect x="46" y="90" width="10" height="12" rx="1.5" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
        <rect x="46" y="110" width="10" height="12" rx="1.5" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
        <rect x="184" y="90" width="10" height="12" rx="1.5" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
        <rect x="184" y="110" width="10" height="12" rx="1.5" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />

        {/* Trees */}
        <path d="M26 135 C18 135 15 120 26 112 C37 120 34 135 26 135 Z" fill="#3B82F6" opacity="0.8" />
        <path d="M214 135 C206 135 203 120 214 112 C225 120 222 135 214 135 Z" fill="#3B82F6" opacity="0.8" />
        <rect x="25" y="130" width="2" height="5" fill="#1E293B" />
        <rect x="213" y="130" width="2" height="5" fill="#1E293B" />

        {/* Ground */}
        <line x1="15" y1="135" x2="225" y2="135" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'librarian' ? 'librarian' : 'student';
  const [tab, setTab] = useState(defaultTab); // 'student' | 'librarian'

  const [form, setForm] = useState({
    collegeCode: '', // for student
    setupKey: '', // for librarian
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  // OTP step
  const [otpStep, setOtpStep] = useState(false);   // true = show OTP screen
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendCool, setResendCool] = useState(0);       // countdown seconds
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const set = (k) => (e) => {
    setError('');
    setForm(f => ({ ...f, [k]: e.target.value }));
  };

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setOtpStep(false);
    setOtpDigits(['', '', '', '', '', '']);
    setForm({ collegeCode: '', setupKey: '', name: '', email: '', password: '' });
  };

  const isLibrarian = tab === 'librarian';

  // ── Step 1: Submit form → send OTP ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: tab,
          collegeCode: form.collegeCode.trim().toUpperCase(),
          setupKey: form.setupKey.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code.');
      // Move to OTP step
      setOtpStep(true);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      startResendCooldown();
      setTimeout(() => otpRefs[0]?.current?.focus(), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend cooldown (60 s) ────────────────────────────────────────────
  const startResendCooldown = () => {
    setResendCool(60);
    const iv = setInterval(() => setResendCool(c => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; }), 1000);
  };

  const handleResend = async () => {
    if (resendCool > 0) return;
    setOtpError('');
    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/signup-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, password: form.password,
          role: tab,
          collegeCode: form.collegeCode.trim().toUpperCase(),
          setupKey: form.setupKey.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not resend code.');
      setOtpDigits(['', '', '', '', '', '']);
      startResendCooldown();
      otpRefs[0]?.current?.focus();
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── OTP digit input handlers ──────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits]; next[i] = d;
    setOtpDigits(next);
    setOtpError('');
    if (d && i < 5) otpRefs[i + 1]?.current?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs[i - 1]?.current?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setOtpDigits(next);
    otpRefs[Math.min(pasted.length, 5)]?.current?.focus();
  };

  // ── Step 2: Verify OTP → create account ──────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length < 6) { setOtpError('Please enter all 6 digits.'); return; }
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await fetch('/api/auth/signup-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed.');
      setSuccess(
        tab === 'librarian'
          ? { type: 'librarian', collegeName: data.collegeName || 'your college', libraryCode: data.libraryCode }
          : { type: 'student', collegeName: data.collegeName || 'your college' }
      );
      setTimeout(() => router.push('/login'), tab === 'librarian' ? 5000 : 3000);
    } catch (err) {
      setOtpError(err.message);
      // Auto-clear digits on wrong code
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => otpRefs[0]?.current?.focus(), 50);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── OTP Step Screen ───────────────────────────────────────────────────
  if (otpStep && !success) {
    return (
      <div className="signup-page" style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <style>{SCROLL_AND_THEME}</style>
        <div style={{ background: '#FFFFFF', borderRadius: 24, border: '1px solid #E2E8F0', padding: '48px 44px', maxWidth: 440, width: '100%', boxShadow: '0 12px 36px rgba(0,0,0,0.05)' }}>
          {/* Icon */}
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EFF6FF', border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Mail size={28} color="#2563EB" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', textAlign: 'center', margin: '0 0 8px' }}>Check your email</h2>
          <p style={{ fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 1.6, margin: '0 0 28px' }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: '#0F172A' }}>{form.email}</strong>
          </p>

          {otpError && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '11px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#EF4444' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              {otpError}
            </div>
          )}

          <form onSubmit={handleVerifyOTP}>
            {/* 6-digit OTP inputs */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }} onPaste={handleOtpPaste}>
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  style={{
                    width: 50, height: 58, textAlign: 'center', fontSize: 24, fontWeight: 800,
                    border: `2px solid ${d ? '#2563EB' : '#E2E8F0'}`,
                    borderRadius: 12, background: d ? '#EFF6FF' : '#F8FAFC',
                    color: '#0F172A', outline: 'none', fontFamily: 'Inter',
                    transition: 'all 0.15s',
                    boxShadow: d ? '0 0 0 3px rgba(37,99,235,0.1)' : 'none',
                  }}
                />
              ))}
            </div>

            <button type="submit" disabled={otpLoading || otpDigits.join('').length < 6} style={{
              width: '100%', height: 48, borderRadius: 10, border: 'none', cursor: 'pointer',
              background: otpDigits.join('').length === 6 ? 'linear-gradient(135deg,#2563EB,#1D4ED8)' : '#E2E8F0',
              color: otpDigits.join('').length === 6 ? '#fff' : '#94A3B8',
              fontSize: 15, fontWeight: 700, fontFamily: 'Inter',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s', boxShadow: otpDigits.join('').length === 6 ? '0 4px 14px rgba(37,99,235,0.3)' : 'none',
            }}>
              {otpLoading ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Verifying…</> : 'Verify & Create Account'}
            </button>
          </form>

          {/* Resend */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <span style={{ fontSize: 13, color: '#64748B' }}>Didn&apos;t receive it? </span>
            {resendCool > 0 ? (
              <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Resend in {resendCool}s</span>
            ) : (
              <button onClick={handleResend} disabled={otpLoading} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <RefreshCw size={13} /> Resend code
              </button>
            )}
          </div>

          {/* Back */}
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button onClick={() => { setOtpStep(false); setOtpError(''); }} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter' }}>
              ← Back to edit details
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Success Screen ─────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="signup-page" style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <style>{SCROLL_AND_THEME}</style>
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          border: '1px solid #E2E8F0',
          padding: '48px 40px',
          textAlign: 'center',
          maxWidth: 460,
          boxShadow: '0 12px 36px rgba(0,0,0,0.05)',
        }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={38} color="#22C55E" />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>Account Created!</h2>

          {success.type === 'librarian' ? (
            <>
              <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                Your official librarian account for <strong style={{ color: '#0F172A' }}>{success.collegeName}</strong> has been configured successfully.
              </p>
              {success.libraryCode && (
                <div style={{ background: '#F8FAFC', border: '1px solid #BFDBFE', borderRadius: 14, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                    Student Library Code to Share:
                  </div>
                  <code style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: '#2563EB' }}>{success.libraryCode}</code>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              You have successfully joined <strong style={{ color: '#0F172A' }}>{success.collegeName}</strong>&apos;s digital library system.
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Redirecting to sign in screen…</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form Render ─────────────────────────────────────────────────── */
  return (
    <div className="signup-page" style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyItems: 'space-between' }}>
      <style>{SCROLL_AND_THEME}</style>

      {/* ── TOP HEADER NAVBAR ────────────────────────────────────────────── */}
      <header style={{
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img
            src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784449649/c7205191-78c8-486e-9996-7894591bf72b_szzaji.png"
            alt="Librix Logo"
            style={{
              height: 42,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              Librix
            </div>

            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginTop: 2 }}>
              Smart Library Management
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Already have an account?
          </span>
          <Link href="/login" style={{
            padding: '8px 20px',
            borderRadius: 8,
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#2563EB',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}>
            Login
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTAINER WRAPPER ───────────────────────────────────────── */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1120,
          background: '#FFFFFF',
          borderRadius: 24,
          border: '1px solid #E2E8F0',
          boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.16fr',
          overflow: 'hidden',
        }}>

          {/* ══════════ LEFT COLUMN — CREATE ACCOUNT & ILLUSTRATION ══════════ */}
          <div style={{
            background: '#F8FAFC',
            borderRight: '1px solid #E2E8F0',
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ textAlign: 'center', marginBottom: 6 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Create Your <span style={{ color: '#2563EB' }}>Account</span>
                </h1>
                <p style={{ fontSize: 14, color: '#64748B', marginTop: 8, fontWeight: 500 }}>
                  Join Librix and be a part of a smarter way to manage libraries.
                </p>
              </div>

              {/* Building Vector Illustration */}
              <BuildingIllustration />

              {/* Feature Badges List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Secure & Trusted',
                    desc: 'Your data is protected with industry-standard security.'
                  },
                  {
                    icon: Landmark,
                    title: 'Verified Institutions Only',
                    desc: 'Access is limited to verified institutions and members.'
                  },
                  {
                    icon: Users,
                    title: 'Role-Based Access',
                    desc: 'Students and librarians get access designed for their needs.'
                  },
                  {
                    icon: BarChart3,
                    title: 'Smart & Efficient',
                    desc: 'Manage books, members and more with powerful tools.'
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="feature-badge" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      transition: 'transform 0.2s',
                    }}>
                      <div style={{
                        width: 44, height: 44,
                        borderRadius: 12,
                        background: '#EFF6FF',
                        border: '1px solid #DBEAFE',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#2563EB',
                        flexShrink: 0,
                      }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 3, lineHeight: 1.4 }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonial Quote Card */}
            <div style={{
              marginTop: 32,
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              padding: '20px 22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}>
              <div style={{ color: '#3B82F6', marginBottom: 8 }}>
                <Quote size={22} style={{ transform: 'rotate(180deg)' }} />
              </div>
              <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 12px', fontWeight: 500 }}>
                Librix has made library management seamless for our institution. Highly recommended!
              </p>
              <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
                {'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} style={{ fontSize: 13 }}>{s}</span>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                <div style={{ width: 14, height: 2, background: '#2563EB', borderRadius: 2 }} />
                Director, XYZ College
              </div>
            </div>
          </div>

          {/* ══════════ RIGHT COLUMN — SIGNUP FORM CARD ══════════ */}
          <div style={{
            padding: '44px 44px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{ marginBottom: 22 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Create Your Account
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', marginTop: 6, fontWeight: 500 }}>
                Fill in your details to get started.
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                color: '#EF4444',
                fontWeight: 500,
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Role Selection ("I am a") */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                  I am a
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {/* Student Option */}
                  <div
                    className={`role-card ${tab === 'student' ? 'active' : ''}`}
                    onClick={() => switchTab('student')}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: tab === 'student' ? '#2563EB' : '#EFF6FF',
                      color: tab === 'student' ? '#FFFFFF' : '#2563EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}>
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Student</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, lineHeight: 1.3 }}>
                        Explore and issue books, track your activity
                      </div>
                    </div>
                  </div>

                  {/* Librarian Option */}
                  <div
                    className={`role-card ${tab === 'librarian' ? 'active' : ''}`}
                    onClick={() => switchTab('librarian')}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: tab === 'librarian' ? '#2563EB' : '#EFF6FF',
                      color: tab === 'librarian' ? '#FFFFFF' : '#2563EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s',
                    }}>
                      <Library size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Librarian</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 2, lineHeight: 1.3 }}>
                        Manage books, members and library operations
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  Full Name <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: 14, color: '#64748B', pointerEvents: 'none' }}>
                    <User size={17} />
                  </div>
                  <input
                    type="text"
                    className="signup-input"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </div>
              </div>

              {/* Email ID */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  Email ID <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: 14, color: '#64748B', pointerEvents: 'none' }}>
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    className="signup-input"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={set('email')}
                    required
                  />
                </div>
              </div>



              {/* Institution / College or Librarian Setup Code Box */}
              {isLibrarian ? (
                <div style={{ marginBottom: 16, background: '#EFF6FF', border: '1.5px solid #BFDBFE', borderRadius: 12, padding: '14px 16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1E40AF', marginBottom: 6 }}>
                    <Key size={15} color="#2563EB" />
                    Librarian Setup Key (Given by College) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: 14, color: '#2563EB', pointerEvents: 'none' }}>
                      <Hash size={17} />
                    </div>
                    <input
                      type="text"
                      className="signup-input"
                      placeholder="e.g. VRL-82A9-XP71"
                      value={form.setupKey}
                      onChange={set('setupKey')}
                      required
                      style={{ fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700, borderColor: '#93C5FD' }}
                    />
                  </div>
                  <p style={{ fontSize: 11, color: '#3B82F6', marginTop: 6, marginBottom: 0, fontWeight: 500 }}>
                    Enter the one-time verification code generated when your institution registered on Librix.
                  </p>
                </div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                    College Library Code <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: 14, color: '#64748B', pointerEvents: 'none' }}>
                      <Landmark size={17} />
                    </div>
                    <input
                      type="text"
                      className="signup-input"
                      placeholder="Search and enter your institution code (e.g. LIB-ABGI-00001)"
                      value={form.collegeCode}
                      onChange={set('collegeCode')}
                      required
                      style={{ fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase' }}
                    />
                  </div>
                  <p style={{ fontSize: 11, color: '#64748B', marginTop: 4, marginBottom: 0 }}>
                    Obtain your college&apos;s student library code from your institution librarian.
                  </p>
                </div>
              )}

              {/* Password */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                  Password <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: 14, color: '#64748B', pointerEvents: 'none' }}>
                    <Lock size={17} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="signup-input"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={set('password')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', padding: 4, display: 'flex' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>



              {/* Terms Checkbox */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    required
                    style={{ width: 16, height: 16, accentColor: '#2563EB', borderRadius: 4, cursor: 'pointer' }}
                  />
                  <span>
                    I agree to the <Link href="/terms" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link> and <Link href="/privacy" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 10,
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                  transition: 'all 0.2s',
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending code…</>
                ) : (
                  <><Mail size={16} /> Send Verification Code</>
                )}
              </button>
            </form>


          </div>

          {/* Bottom Security Note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            marginTop: 22,
            fontSize: 12,
            color: '#64748B',
            fontWeight: 500,
          }}>
            <ShieldCheck size={15} color="#64748B" />
            <span>Your information is safe with us. We never share your data.</span>
          </div>
        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12,
        color: '#64748B',
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
      }}>
        <div>© 2025 Librix. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</Link>
          <span>|</span>
          <Link href="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Service</Link>
          <span>|</span>
          <Link href="/help" style={{ color: '#64748B', textDecoration: 'none' }}>Help</Link>
        </div>
      </footer>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{SCROLL_AND_THEME}</style>
        <div style={{ width: 34, height: 34, border: '3px solid #E2E8F0', borderTop: '3px solid #2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}

