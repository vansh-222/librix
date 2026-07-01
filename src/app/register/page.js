'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  BookOpen, Loader2, AlertCircle, CheckCircle, Copy, Check,
  Building2, Mail, Globe, Key, ArrowRight, Shield, RefreshCw
} from 'lucide-react';

// ── OTP Input ─────────────────────────────────────────────────────────────────
function OTPInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs[i - 1].current?.focus();
  };

  const handleChange = (i, v) => {
    const digit = v.replace(/\D/, '').slice(-1);
    const arr   = value.split('');
    arr[i]      = digit;
    onChange(arr.join(''));
    if (digit && i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    refs[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {[0,1,2,3,4,5].map(i => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 800,
            fontFamily: 'monospace', borderRadius: 10,
            border: value[i] ? '2px solid var(--brand)' : '2px solid var(--border)',
            background: 'var(--surface)', color: 'var(--text)',
            outline: 'none', transition: 'border 0.15s',
          }}
        />
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function RegisterCollegePage() {
  const [form, setForm]       = useState({ name: '', university: '', website: '', email: '' });
  const [stage, setStage]     = useState('form');       // form | checking | otp | success | error
  const [otp, setOtp]         = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resending, setResending]   = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [devMode, setDevMode]       = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState('');

  const set  = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2500);
  };

  // ── Step 1: Submit college details ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStage('checking');
    try {
      const res  = await fetch('/api/colleges/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setMaskedEmail(data.maskedEmail);
      setDevMode(data.devMode || false);
      setStage('otp');
    } catch (err) {
      setError(err.message);
      setStage('form');
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { setError('Enter all 6 digits'); return; }
    setOtpLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/colleges/verify-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setResult(data);
      setStage('success');
    } catch (err) {
      setError(err.message);
      setOtp('');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res  = await fetch('/api/colleges/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Resend failed');
      setDevMode(data.devMode || false);
      setOtp('');
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const SCROLL = `html, body { height: auto !important; overflow: visible !important; min-height: 100vh; }`;

  // ── CHECKING ──────────────────────────────────────────────────────────────
  if (stage === 'checking') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{SCROLL}</style>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '2px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'pulse 2s infinite' }}>
            <Shield size={32} color="var(--brand)" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Verifying Domain</h2>
          <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 18, textAlign: 'left' }}>
            {['Checking email domain ownership…', 'Matching against official website…', 'Validating institution email…', 'Sending verification code…'].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', fontSize: 13, color: 'var(--muted)' }}>
                <Loader2 size={13} color="var(--brand)" style={{ animation: 'spin 1.2s linear infinite', animationDelay: `${i*0.15}s` }} />
                {s}
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.3)}50%{box-shadow:0 0 0 16px rgba(99,102,241,0)}}`}</style>
      </div>
    );
  }

  // ── OTP STAGE ─────────────────────────────────────────────────────────────
  if (stage === 'otp') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <style>{SCROLL}</style>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', border: '2px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Mail size={26} color="var(--brand)" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Check Your Email</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
              We sent a 6-digit code to<br />
              <strong style={{ color: 'var(--text)' }}>{maskedEmail}</strong>
            </p>
          </div>

          {/* Dev Mode / Domain match info */}
          {devMode ? (
            <div style={{ background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', marginBottom: 6 }}>🛠️ Dev Mode — Check Your Terminal</div>
              <div style={{ fontSize: 12, color: '#FCD34D', lineHeight: 1.7 }}>
                Resend is not configured, so the OTP was printed to your <strong>server console</strong> (the terminal where <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>npm run dev</code> is running).<br />
                Look for a line starting with <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>[OTP - DEV MODE]</code>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircle size={15} color="#22C55E" style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: '#22C55E' }}>
                <strong>Domain Verified</strong> — Email matches your official website domain.
                Only institution officials can receive this code.
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 28 }}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#EF4444' }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleOTPSubmit}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textAlign: 'center', marginBottom: 14 }}>Enter 6-digit OTP</div>
                <OTPInput value={otp} onChange={setOtp} />
              </div>

              <button type="submit" disabled={otpLoading || otp.length < 6} className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px 0', opacity: otp.length < 6 ? 0.5 : 1 }}>
                {otpLoading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Verifying…</> : '✓ Verify & Complete Registration'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--muted)' }}>
              Didn't get the code?{' '}
              <button onClick={handleResend} disabled={resending} style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                {resending ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> Sending…</> : 'Resend OTP'}
              </button>
            </div>
          </div>

          <button onClick={() => setStage('form')} style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 13 }}>
            ← Back to edit details
          </button>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  if (stage === 'success' && result) {
    const Row = ({ label, value, id, color }) => (
      <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <code style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2, color: color || 'var(--text)' }}>{value}</code>
          <button onClick={() => copy(value, id)} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            {copied === id ? <><Check size={12}/> Copied!</> : <><Copy size={12}/> Copy</>}
          </button>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <style>{SCROLL}</style>
        <div style={{ maxWidth: 500, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <CheckCircle size={36} color="#22C55E" />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#22C55E', marginBottom: 6 }}>Institution Verified ✅</div>
            <h1 style={{ fontSize: 21, fontWeight: 800, marginBottom: 3 }}>{result.collegeName}</h1>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>{result.university}</p>
          </div>

          <div className="card" style={{ padding: '24px 28px' }}>
            {/* Institution Key */}
            <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#2d2960)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 12, padding: '16px 18px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <Key size={14} color="#A78BFA" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: 1 }}>Institution Key</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code style={{ fontSize: 22, fontWeight: 900, letterSpacing: 3, color: 'white' }}>{result.institutionKey}</code>
                <button onClick={() => copy(result.institutionKey, 'ikey')} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.15)', color: '#C4B5FD', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copied === 'ikey' ? <><Check size={11}/> Copied!</> : <><Copy size={11}/> Copy</>}
                </button>
              </div>
              <p style={{ fontSize: 11, color: '#7C3AED', marginTop: 8 }}>Permanent institution identity key</p>
            </div>

            {/* Librarian Setup Key */}
            <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>🔐 Librarian Setup Key <span style={{ color: '#EF4444' }}>(shown once!)</span></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: 'var(--brand)' }}>{result.setupKey}</code>
                <button onClick={() => copy(result.setupKey, 'skey')} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.1)', color: 'var(--brand)', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copied === 'skey' ? <><Check size={11}/> Copied!</> : <><Copy size={11}/> Copy</>}
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Use this on the librarian setup page. Expires in 7 days. Cannot be regenerated.</p>
            </div>

            {/* Library Code */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>📚 Student Library Code</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: '#22C55E' }}>{result.libraryCode}</code>
                <button onClick={() => copy(result.libraryCode, 'lcode')} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#22C55E', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copied === 'lcode' ? <><Check size={11}/> Copied!</> : <><Copy size={11}/> Copy</>}
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Share with students — they enter this code when signing up.</p>
            </div>

            <Link href="/signup?tab=librarian" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 10, background: 'var(--brand)', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              Set Up Librarian Account <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── REGISTRATION FORM ─────────────────────────────────────────────────────
  const GRP = { marginBottom: 18 };
  const LBL = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 5 };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      <style>{SCROLL}</style>
      <div style={{ width: '100%', maxWidth: 500 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800 }}>Librar<span style={{ color: 'var(--brand)' }}>ium</span></span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Register Your Institution</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Domain-verified registration — only official emails accepted</p>
        </div>

        <div className="card" style={{ padding: '30px 32px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#EF4444' }}>
              <AlertCircle size={15} style={{ marginTop: 1, flexShrink: 0 }} /> {error}
            </div>
          )}

          {/* How it works */}
          <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', marginBottom: 8 }}>How verification works</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, color: 'var(--muted)' }}>
              <div>✅ Your email domain must match your official website domain</div>
              <div>✅ An OTP is sent to your institution email — only you can receive it</div>
              <div>✅ Gmail / Yahoo / personal emails are not accepted</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
              <Building2 size={15} color="var(--brand)" />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Institution Details</span>
            </div>

            <div style={GRP}>
              <label style={LBL}>College / Institution Name <span style={{ color: '#EF4444' }}>*</span></label>
              <input className="input" placeholder="e.g. Aman Bhalla Group of Institutes" value={form.name} onChange={set('name')} required />
            </div>

            <div style={GRP}>
              <label style={LBL}>University / Affiliating Body <span style={{ color: '#EF4444' }}>*</span></label>
              <input className="input" placeholder="e.g. I.K. Gujral Punjab Technical University" value={form.university} onChange={set('university')} required />
            </div>

            <div style={GRP}>
              <label style={LBL}>
                <Globe size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Official Website <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input className="input" placeholder="https://www.abgi.co.in" value={form.website} onChange={set('website')} required />
            </div>

            <div style={{ ...GRP, marginBottom: 24 }}>
              <label style={LBL}>
                <Mail size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Official Institution Email <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input type="email" className="input" placeholder="admin@abgi.co.in" value={form.email} onChange={set('email')} required />
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                Must use your institution's domain (not Gmail/Yahoo)
              </p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px 0', fontSize: 15 }}>
              <Shield size={15} /> Verify Domain & Send OTP
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 20 }}>
          Already registered?{' '}
          <Link href="/login" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          {' · '}
          <Link href="/signup?tab=librarian" style={{ color: 'var(--muted)', fontWeight: 500, textDecoration: 'none' }}>Librarian setup</Link>
        </p>
      </div>
    </div>
  );
}
