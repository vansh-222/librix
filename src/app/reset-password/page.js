'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

const THEME = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: #F8FAFC; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .card { animation: fadeUp 0.45s ease both; }
  .rp-input {
    width: 100%; height: 46px; border-radius: 10px;
    border: 1.5px solid #E2E8F0; background: #F8FAFC;
    padding: 0 44px 0 44px; font-size: 14px; font-family: inherit;
    color: #0F172A; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
  }
  .rp-input:focus { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); background: #fff; }
  .rp-btn {
    width: 100%; height: 48px; border-radius: 10px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #6366F1, #8B5CF6);
    color: #fff; font-size: 15px; font-weight: 700; font-family: inherit;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    transition: opacity 0.15s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .rp-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
  .rp-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
`;

function ResetPasswordContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');
  const [invalid, setInvalid]     = useState(false);

  useEffect(() => {
    if (!token || !email) setInvalid(true);
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res  = await fetch('/api/auth/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
      } else {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3500);
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

      {/* Header */}
      <header style={{ padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={17} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
            Librar<span style={{ color: '#6366F1' }}>ium</span>
          </span>
        </Link>
        <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#6366F1', textDecoration: 'none' }}>
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div className="card" style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '40px 36px' }}>

          {/* Invalid link */}
          {invalid && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.08)', border: '2px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <AlertCircle size={30} color="#EF4444" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>Invalid Reset Link</h2>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 24 }}>
                This password reset link is missing required information. Please request a new reset link.
              </p>
              <Link href="/forgot-password" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                Request New Link
              </Link>
            </div>
          )}

          {/* Success */}
          {!invalid && success && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={30} color="#16A34A" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 10 }}>Password Reset!</h2>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 24 }}>
                Your password has been updated successfully.<br />
                Redirecting you to login…
              </p>
              <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTop: '3px solid #6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            </div>
          )}

          {/* Form */}
          {!invalid && !success && (
            <>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <ShieldCheck size={24} color="#6366F1" />
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Set new password</h1>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6, marginBottom: 8 }}>
                Resetting password for{' '}
                <strong style={{ color: '#0F172A' }}>{decodeURIComponent(email)}</strong>
              </p>
              <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 28 }}>Must be at least 8 characters.</p>

              {/* Error */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 14px', marginBottom: 20 }}>
                  <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#DC2626' }}>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* New Password */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 7 }}>
                    New Password <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="rp-input"
                      placeholder="Enter new password"
                      value={password}
                      onChange={e => { setError(''); setPassword(e.target.value); }}
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4, display: 'flex' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                        {[1,2,3,4].map(i => {
                          const strength = Math.min(4, [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length);
                          const colors = ['#EF4444','#F59E0B','#22C55E','#16A34A'];
                          return <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? colors[strength - 1] : '#E2E8F0', transition: 'background 0.2s' }} />;
                        })}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>
                        {(() => {
                          const s = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
                          return ['','Weak','Fair','Good','Strong'][s];
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="rp-btn" disabled={loading || password.length < 8}>
                  {loading
                    ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Resetting…</>
                    : 'Reset Password'
                  }
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Link href="/forgot-password" style={{ fontSize: 13, color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>
                  Request a new link
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '16px 32px', textAlign: 'center', fontSize: 12, color: '#94A3B8', borderTop: '1px solid #E2E8F0', background: '#fff' }}>
        © 2025 Librarium. All rights reserved.
      </footer>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTop: '3px solid #6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
