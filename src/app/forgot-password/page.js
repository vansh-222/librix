'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #F8FAFC; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .card { animation: fadeUp 0.45s ease both; }
  .fp-input {
    width: 100%; height: 46px; border-radius: 10px;
    border: 1.5px solid #E2E8F0; background: #F8FAFC;
    padding: 0 14px 0 44px; font-size: 14px; font-family: inherit;
    color: #0F172A; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
  }
  .fp-input:focus { border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.12); background: #fff; }
  .fp-btn {
    width: 100%; height: 48px; border-radius: 10px; border: none; cursor: pointer;
    background: #2563EB;
    color: #fff; font-size: 15px; font-weight: 700; font-family: inherit;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
    transition: opacity 0.15s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .fp-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
  .fp-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
`;

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setError('');
    setLoading(true);

    try {
      const res  = await fetch('/api/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        setSent(true);
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <style>{THEME}</style>

      {/* Header — matches signup page navbar */}
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
            style={{ height: 42, width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>Librix</div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginTop: 2 }}>Smart Library Management</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>Remember your password?</span>
          <Link href="/login" style={{
            padding: '8px 20px',
            borderRadius: 8,
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#2563EB',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
          }}>
            Login
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '40px 36px' }}>

          {sent ? (
            /* ── Success State ── */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={30} color="#16A34A" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>Check your email</h2>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 28 }}>
                We sent a password reset link to<br />
                <strong style={{ color: '#0F172A' }}>{email}</strong><br />
                The link expires in <strong>30 minutes</strong>.
              </p>
              <div style={{ background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0', padding: '14px 16px', marginBottom: 24, fontSize: 12, color: '#64748B', lineHeight: 1.7 }}>
                💡 Didn&apos;t receive it? Check your spam folder, or{' '}
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer', fontSize: 12, padding: 0 }}
                >
                  try again
                </button>
                .
              </div>
              <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontSize: 14, fontWeight: 600, color: '#475569', textDecoration: 'none' }}>
                ← Back to Login
              </Link>
            </div>
          ) : (
            /* ── Form State ── */
            <>
              {/* Icon */}
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Mail size={24} color="#2563EB" />
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Forgot password?</h1>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 28 }}>
                No worries — enter your email and we&apos;ll send you a reset link.
              </p>

              {/* Error */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
                  <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#DC2626' }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 7 }}>
                    Email Address <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
                    <input
                      type="email"
                      className="fp-input"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={e => { setError(''); setEmail(e.target.value); }}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Sending…</> : 'Send Reset Link'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Link href="/login" style={{ fontSize: 13, color: '#6366F1', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <ArrowLeft size={13} /> Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '16px 32px', textAlign: 'center', fontSize: 12, color: '#94A3B8', borderTop: '1px solid #E2E8F0', background: '#fff' }}>
        © 2025 Librix. All rights reserved.
      </footer>
    </div>
  );
}
