'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen, Loader2, AlertCircle, CheckCircle, Copy, Check,
  Mail, Globe, Key, ArrowRight, Shield, RefreshCw, Search,
  Phone, Lock, Eye, EyeOff, ExternalLink, Clock,
  Award, FileText, Building2, BadgeCheck, Info, User,
  ChevronLeft, HelpCircle, MapPin, Home,
} from 'lucide-react';

// ── OTP Input ──────────────────────────────────────────────────────────────────
function OTPInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs[i - 1].current?.focus();
  };
  const handleChange = (i, v) => {
    const digit = v.replace(/\D/, '').slice(-1);
    const arr = value.split('');
    arr[i] = digit;
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
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input
          key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 800,
            fontFamily: 'monospace', borderRadius: 10,
            border: value[i] ? '2px solid #1557B0' : '2px solid #E2E8F0',
            background: '#FFFFFF', color: '#0F172A',
            outline: 'none', transition: 'border 0.15s',
          }}
        />
      ))}
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const S = {
  label:   { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 },
  reqStar: { color: '#EF4444', marginLeft: 2 },
  row2:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  hint:    { fontSize: 11, color: '#6B7280', marginTop: 4, lineHeight: 1.5 },
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function RegisterCollegePage() {

  // ── AISHE state ─────────────────────────────────────────────────────────────
  const [aisheCode,    setAisheCode]    = useState('');
  const [aisheStatus,  setAisheStatus]  = useState('idle'); // idle|checking|verified|not_found|registered
  const [aisheRecord,  setAisheRecord]  = useState(null);
  const [aisheError,   setAisheError]   = useState('');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [searchResults,setSearchResults]= useState([]);
  const [searchLoading,setSearchLoading]= useState(false);

  // ── Form fields ─────────────────────────────────────────────────────────────
  const [website,        setWebsite]        = useState('');
  const [contactName,    setContactName]    = useState('');
  const [designation,    setDesignation]    = useState('');
  const [officialEmail,  setOfficialEmail]  = useState('');
  const [mobile,         setMobile]         = useState('');
  const [landline,       setLandline]       = useState('');
  const [altEmail,       setAltEmail]       = useState('');
  const [password,       setPassword]       = useState('');
  const [confirmPwd,     setConfirmPwd]     = useState('');
  const [showPwd,        setShowPwd]        = useState(false);
  const [showConf,       setShowConf]       = useState(false);
  const [agreed,         setAgreed]         = useState(false);

  // ── Flow state ──────────────────────────────────────────────────────────────
  const [stage,       setStage]       = useState('form'); // form|checking|otp|success
  const [otp,         setOtp]         = useState('');
  const [otpLoading,  setOtpLoading]  = useState(false);
  const [resending,   setResending]   = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [devMode,     setDevMode]     = useState(false);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState('');
  const [copied,      setCopied]      = useState('');

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2500);
  };

  // ── AISHE verify ────────────────────────────────────────────────────────────
  const handleAISHEVerify = async () => {
    const code = aisheCode.trim().toUpperCase();
    if (!code) return;
    setAisheStatus('checking');
    setAisheError('');
    try {
      const res  = await fetch(`/api/colleges/verify-aishe?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!data.found) {
        setAisheStatus('not_found');
        setAisheError(data.error || 'AISHE code not found in government database.');
        return;
      }
      if (data.alreadyRegistered) {
        setAisheStatus('registered');
        setAisheError('This institution is already registered on Librix.');
        return;
      }
      setAisheRecord(data.record);
      setAisheStatus('verified');
    } catch {
      setAisheStatus('not_found');
      setAisheError('Verification service unavailable. Please try again.');
    }
  };

  // ── Institution search ──────────────────────────────────────────────────────
  const searchTimeout = useRef(null);
  const handleSearch = (q) => {
    setSearchQuery(q);
    clearTimeout(searchTimeout.current);
    if (q.length < 3) { setSearchResults([]); return; }
    setSearchLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res  = await fetch('/api/colleges/verify-aishe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        });
        const data = await res.json();
        setSearchResults(data.results || []);
      } catch { setSearchResults([]); }
      setSearchLoading(false);
    }, 400);
  };

  const selectResult = (rec) => {
    setAisheCode(rec.aisheCode);
    setAisheRecord(rec);
    setAisheStatus('verified');
    setSearchQuery('');
    setSearchResults([]);
    setAisheError('');
  };

  // ── Submit form ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (aisheStatus !== 'verified') { setError('Please verify your AISHE code first.'); return; }
    if (!officialEmail)             { setError('Official email is required.'); return; }
    if (password.length < 8)        { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPwd)    { setError('Passwords do not match.'); return; }
    if (!agreed)                    { setError('Please confirm the declaration to proceed.'); return; }

    setStage('checking');
    try {
      const res  = await fetch('/api/colleges/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        aisheRecord.institutionName,
          university:  aisheRecord.university,
          website,
          email:       officialEmail,
          aisheCode:   aisheCode.trim().toUpperCase(),
          contactName,
          designation,
          mobile,
        }),
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

  // ── OTP submit ──────────────────────────────────────────────────────────────
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { setError('Enter all 6 digits'); return; }
    setOtpLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/colleges/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: officialEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      setResult(data);
      setStage('success');
    } catch (err) {
      setError(err.message);
      setOtp('');
    } finally { setOtpLoading(false); }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res  = await fetch('/api/colleges/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: aisheRecord?.institutionName || '',
          university: aisheRecord?.university || '',
          website, email: officialEmail,
          aisheCode: aisheCode.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Resend failed');
      setDevMode(data.devMode || false);
      setOtp('');
    } catch (err) { setError(err.message); }
    finally { setResending(false); }
  };

  // ── Derived: step unlock logic ───────────────────────────────────────────────
  const step1Done = aisheStatus === 'verified';
  const step2Done = step1Done && !!website;
  const step3Done = step2Done && !!contactName && !!officialEmail;

  const currentStep = !step1Done ? 1 : !step2Done ? 2 : !step3Done ? 3 : 4;

  // Light theme CSS override — scoped to this page only
  const SCROLL = `
    html, body {
      height: auto !important;
      overflow: visible !important;
      min-height: 100vh;
      background: #F8FAFC !important;
      color: #0F172A !important;
    }
    .reg-page, .reg-page * {
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --surface-2: #F1F5F9;
      --border: #E2E8F0;
      --text: #0F172A;
      --muted: #475569;
      --brand: #1557B0;
      --brand-2: #1A73E8;
      --success: #16A34A;
      --warning: #D97706;
      --danger: #DC2626;
    }
    .reg-page {
      color: #0F172A !important;
    }
    .reg-page h1, .reg-page h2, .reg-page h3, .reg-page h4, .reg-page h5, .reg-page h6 {
      color: #0F172A !important;
    }
    .reg-page p, .reg-page span, .reg-page div, .reg-page label {
      color: inherit;
    }
    .reg-page .card {
      background: #FFFFFF;
      border-color: #E2E8F0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .reg-page .card:hover { border-color: rgba(79,70,229,0.35); }
    .reg-page .input {
      background: #F8FAFC;
      border-color: #E2E8F0;
      color: #0F172A;
    }
    .reg-page .input::placeholder { color: #94A3B8; }
    .reg-page .input:focus { border-color: #1557B0; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
    .reg-page .input:disabled { background: #F1F5F9; opacity: 0.7; }
    .reg-page .badge-success { background: rgba(22,163,74,0.1); color: #16A34A; }
    .reg-page .badge-brand   { background: rgba(79,70,229,0.1); color: #1557B0; }
    .aishe-input {
      background: #F8FAFC !important;
      border: 1px solid #E2E8F0 !important;
      color: #0F172A !important;
    }
    .aishe-input:focus { border-color: #1557B0 !important; box-shadow: 0 0 0 3px rgba(79,70,229,0.1) !important; }
    .search-drop  { background: #FFFFFF !important; border-color: #E2E8F0 !important; box-shadow: 0 8px 24px rgba(0,0,0,0.10) !important; }
    .search-drop-item:hover { background: #F1F5F9 !important; }
    .trust-badge { background: #F8FAFC !important; border-color: #E2E8F0 !important; }
  `;

  // ── CHECKING stage ──────────────────────────────────────────────────────────
  if (stage === 'checking') {
    return (
      <div className="reg-page" style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{SCROLL}</style>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(79,70,229,0.10)', border: '2px solid rgba(79,70,229,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'pulse 2s infinite' }}>
            <Shield size={32} color="#1557B0" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: '#0F172A' }}>Submitting Application</h2>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 18, textAlign: 'left', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {['Validating AISHE code…', 'Checking email domain…', 'Creating institution record…', 'Sending verification code…'].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', fontSize: 13, color: '#64748B' }}>
                <Loader2 size={13} color="#1557B0" style={{ animation: 'spin 1.2s linear infinite', animationDelay: `${i * 0.15}s` }} />
                {s}
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(79,70,229,.25)}50%{box-shadow:0 0 0 16px rgba(79,70,229,0)}}`}</style>
      </div>
    );
  }

  // ── OTP stage ───────────────────────────────────────────────────────────────
  if (stage === 'otp') {
    return (
      <div className="reg-page" style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <style>{SCROLL}</style>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width: '100%', maxWidth: 420, color: '#0F172A' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(26,115,232,0.12)', border: '2px solid rgba(26,115,232,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Mail size={26} color="var(--brand)" />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Check Your Email</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
              We sent a 6-digit code to<br />
              <strong style={{ color: 'var(--text)' }}>{maskedEmail}</strong>
            </p>
          </div>

          {devMode ? (
            <div style={{ background: 'rgba(245,158,11,0.12)', border: '2px solid rgba(245,158,11,0.4)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F59E0B', marginBottom: 6 }}>🛠️ Dev Mode — Check Your Terminal</div>
              <div style={{ fontSize: 12, color: '#FCD34D', lineHeight: 1.7 }}>
                OTP was printed to your <strong>server console</strong> (where <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>npm run dev</code> is running).
                Look for a line starting with <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>[OTP - DEV MODE]</code>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <CheckCircle size={15} color="#22C55E" style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: '#22C55E' }}>
                <strong>AISHE Verified</strong> — Only official institution emails can receive this code.
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
                {otpLoading ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Verifying…</> : '✓ Verify & Activate Account'}
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
            ← Back to form
          </button>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── SUCCESS stage ────────────────────────────────────────────────────────────
  if (stage === 'success' && result) {
    const Row = ({ label, value, id, color }) => (
      <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <code style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2, color: color || 'var(--text)' }}>{value}</code>
          <button onClick={() => copy(value, id)} style={{ padding: '6px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            {copied === id ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
      </div>
    );
    return (
      <div className="reg-page" style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
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
            <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#F5F3FF)', border: '1px solid rgba(79,70,229,0.25)', borderRadius: 12, padding: '16px 18px', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <Key size={14} color="#1557B0" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1557B0', textTransform: 'uppercase', letterSpacing: 1 }}>Institution Key</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code style={{ fontSize: 22, fontWeight: 900, letterSpacing: 3, color: '#3730A3' }}>{result.institutionKey}</code>
                <button onClick={() => copy(result.institutionKey, 'ikey')} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(79,70,229,0.3)', background: 'rgba(79,70,229,0.08)', color: '#1557B0', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copied === 'ikey' ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                </button>
              </div>
              <p style={{ fontSize: 11, color: '#1A73E8', marginTop: 8 }}>Permanent institution identity key</p>
            </div>
            <div style={{ background: 'rgba(26,115,232,0.07)', border: '1px solid rgba(26,115,232,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>🔐 Librarian Setup Key <span style={{ color: '#EF4444' }}>(shown once!)</span></div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: 'var(--brand)' }}>{result.setupKey}</code>
                <button onClick={() => copy(result.setupKey, 'skey')} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(26,115,232,0.3)', background: 'rgba(26,115,232,0.1)', color: 'var(--brand)', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copied === 'skey' ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
                </button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Use on the librarian setup page. Expires in 7 days. Cannot be regenerated.</p>
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>📚 Student Library Code</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <code style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, color: '#22C55E' }}>{result.libraryCode}</code>
                <button onClick={() => copy(result.libraryCode, 'lcode')} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#22C55E', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {copied === 'lcode' ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
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

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN REGISTRATION FORM
  // ─────────────────────────────────────────────────────────────────────────────
  const steps = [
    { n: 1, label: 'Institution Verification', sub: 'Verify your institution', done: step1Done },
    { n: 2, label: 'Institution Details',       sub: 'Enter detailed information', done: step2Done },
    { n: 3, label: 'Contact Details',           sub: 'Official contact person',    done: step3Done },
    { n: 4, label: 'Review & Submit',           sub: 'Verify & submit',            done: false    },
  ];

  return (
    <div className="reg-page" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <style>{SCROLL}</style>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes fadeIn{ from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .sec-card { transition: border-color 0.2s; }
      `}</style>

      {/* ── TOP NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 40,
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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
              Libri<span style={{ color: '#000000ff' }}>x</span>
            </div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginTop: 2 }}>Smart Library Management</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#475569', fontSize: 13, cursor: 'pointer', padding: '6px 10px', borderRadius: 8 }}>
            <HelpCircle size={14} /> Need Help?
          </button>
          <Link href="/login" style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #E2E8F0', background: 'transparent', color: '#0F172A', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Login
          </Link>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, background: '#1A73E8', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <Home size={13} /> Back to Home
          </Link>
        </div>
      </nav>

      {/* ── PAGE BODY ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '32px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, alignItems: 'start' }}>

        {/* ══════════════════ LEFT — MAIN FORM ══════════════════════════════ */}
        <div>
          {/* Back link */}
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#475569', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
            <ChevronLeft size={15} /> Back
          </Link>

          {/* Page title */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Register Your Institution</h1>
            <p style={{ color: '#334155', fontSize: 14, fontWeight: 500 }}>Join Librix and digitize your library with our smart platform.</p>
          </div>

          

          {/* Step progress */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, marginBottom: 28 }}>
            {steps.map((s, idx) => {
              const active = currentStep === s.n;
              const done   = s.done;
              return (
                <div key={s.n} style={{ position: 'relative' }}>
                  {idx > 0 && (
                    <div style={{
                      position: 'absolute', top: 14, left: 0, right: '50%',
                      height: 2, background: done || currentStep > s.n ? 'var(--brand)' : 'var(--border)',
                      transition: 'background 0.3s',
                    }} />
                  )}
                  {idx < 3 && (
                    <div style={{
                      position: 'absolute', top: 14, left: '50%', right: 0,
                      height: 2, background: done ? '#1557B0' : '#E2E8F0',
                      transition: 'background 0.3s',
                    }} />
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, paddingBottom: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: done ? 13 : 12, fontWeight: 700, marginBottom: 6,
                      background: done ? '#22C55E' : active ? '#1557B0' : '#F1F5F9',
                      border: `2px solid ${done ? '#22C55E' : active ? '#1557B0' : '#E2E8F0'}`,
                      color: done || active ? '#fff' : '#64748B',
                      transition: 'all 0.25s',
                    }}>
                      {done ? <Check size={13} /> : s.n}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: active || done ? 700 : 600, color: active ? '#1557B0' : done ? '#22C55E' : '#475569', textAlign: 'center', lineHeight: 1.3 }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 10, color: '#64748B', textAlign: 'center', marginTop: 2, lineHeight: 1.3 }}>{s.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Global error */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: '#EF4444' }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          {/* ── SECTION 1 — Institution Verification ────────────────────────── */}
          <div className="card sec-card" style={{ marginBottom: 16, padding: '24px 26px', border: `1px solid ${step1Done ? 'rgba(34,197,94,0.35)' : 'rgba(26,115,232,0.4)'}` }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: step1Done ? '#22C55E' : '#1557B0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {step1Done ? <Check size={13} /> : '1'}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Institution Verification <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700 }}>(Most Important)</span></div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 1 }}>Verify your institution using AISHE code. This ensures only genuine institutions can register.</div>
                </div>
              </div>
              {step1Done && <span className="badge badge-success" style={{ flexShrink: 0 }}>✓ Verified</span>}
            </div>

            {/* AISHE verified success banner */}
            {step1Done && aisheRecord && (
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: '14px 16px', marginBottom: 18, animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <BadgeCheck size={16} color="#22C55E" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#22C55E' }}>AISHE Verified — Government Recognized Institution</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[
                    { label: 'AISHE Code',   value: aisheRecord.aisheCode },
                    { label: 'State',         value: aisheRecord.state || '—' },
                    { label: 'Type',          value: aisheRecord.type || '—' },
                  ].map(f => (
                    <div key={f.label} style={{ background: '#F1F5F9', borderRadius: 8, padding: '8px 12px' }}>
                      <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{f.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{f.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, padding: '8px 12px', background: '#F1F5F9', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Institution Name (Official)</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{aisheRecord.institutionName}</div>
                </div>
                <button onClick={() => { setAisheStatus('idle'); setAisheRecord(null); setAisheCode(''); }} style={{ marginTop: 10, background: 'none', border: 'none', color: '#475569', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                  Change AISHE code
                </button>
              </div>
            )}

            {/* AISHE code input */}
            {!step1Done && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={S.label}>AISHE Code <span style={S.reqStar}>*</span></label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input
                      className="aishe-input"
                      value={aisheCode}
                      onChange={e => { setAisheCode(e.target.value.toUpperCase()); setAisheStatus('idle'); setAisheError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleAISHEVerify()}
                      placeholder="Enter AISHE Code (e.g., C-27869)"
                      style={{
                        flex: 1, background: 'var(--surface-2)', border: '1px solid var(--border)',
                        borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: 14,
                        fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.2s',
                        letterSpacing: 1,
                      }}
                    />
                    <button
                      onClick={handleAISHEVerify}
                      disabled={!aisheCode.trim() || aisheStatus === 'checking'}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px',
                        borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                        background: 'linear-gradient(135deg,#1A73E8,#1A73E8)', color: '#fff',
                        whiteSpace: 'nowrap', flexShrink: 0,
                        opacity: !aisheCode.trim() ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {aisheStatus === 'checking'
                        ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Verifying…</>
                        : <><Shield size={13} /> Verify AISHE Code</>
                      }
                    </button>
                  </div>

                  {/* Status feedback */}
                  {aisheStatus === 'not_found' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: '#EF4444' }}>
                      <AlertCircle size={12} /> {aisheError}
                    </div>
                  )}
                  {aisheStatus === 'registered' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 12, color: '#F59E0B' }}>
                      <AlertCircle size={12} /> {aisheError}
                    </div>
                  )}
                  <p style={{ ...S.hint, marginTop: 8 }}>
                    AISHE Code is a unique 6-digit code issued by the Ministry of Education, Government of India.
                  </p>
                </div>

              </>
            )}
          </div>

          {/* ── SECTION 2 — Institution Details ─────────────────────────────── */}
          <div className="card sec-card" style={{
            marginBottom: 16, padding: '24px 26px',
            background: step1Done ? '#FFFFFF' : '#FAFAFA',
            border: `1px solid ${step2Done ? 'rgba(22,163,74,0.4)' : step1Done ? '#D1D5DB' : '#E9ECEF'}`,
            pointerEvents: step1Done ? 'auto' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: step2Done ? '#16A34A' : step1Done ? '#1557B0' : '#E5E7EB', border: `2px solid ${step2Done ? '#16A34A' : step1Done ? '#1557B0' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: step1Done ? '#fff' : '#6B7280', flexShrink: 0 }}>
                  {step2Done ? <Check size={13} /> : '2'}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Institution Details{' '}<span style={{ fontSize: 11, color: '#6B7280', fontWeight: 400 }}>(Auto-filled after verification)</span></div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>These details will be auto-filled from AISHE database and cannot be changed.</div>
                </div>
              </div>
              {step2Done && <span className="badge badge-success" style={{ flexShrink: 0 }}>✓ Complete</span>}
            </div>

            <div style={{ ...S.row2, marginBottom: 14 }}>
              <div>
                <label style={S.label}>Institution Name</label>
                <input className="input" value={aisheRecord?.institutionName || ''} readOnly placeholder="Auto-filled after verification"
                  style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#374151', cursor: 'default' }} />
              </div>
              <div>
                <label style={S.label}>Institution Type</label>
                <input className="input" value={aisheRecord?.type || ''} readOnly placeholder="Auto-filled after verification"
                  style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#374151', cursor: 'default' }} />
              </div>
            </div>
            <div style={{ ...S.row2, marginBottom: 14 }}>
              <div>
                <label style={S.label}>Affiliating University / Body</label>
                <input className="input" value={aisheRecord?.university || ''} readOnly placeholder="Auto-filled after verification"
                  style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#374151', cursor: 'default' }} />
              </div>
              <div>
                <label style={S.label}>State</label>
                <input className="input" value={aisheRecord?.state || ''} readOnly placeholder="Auto-filled after verification"
                  style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#374151', cursor: 'default' }} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>District</label>
              <input className="input" value={aisheRecord?.district || ''} readOnly placeholder="Auto-filled after verification"
                style={{ background: '#F9FAFB', borderColor: '#E5E7EB', color: '#374151', cursor: 'default' }} />
            </div>
            <div>
              <label style={S.label}>Official Website (Domain) <span style={S.reqStar}>*</span></label>
              <input
                className="input"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="Enter any official domain (e.g., abgi.co.in)"
              />
              <p style={S.hint}>Enter any official domain (e.g., abgi.co.in)</p>
            </div>
          </div>

          {/* ── SECTION 3 — Contact Details ──────────────────────────────────── */}
          <div className="card sec-card" style={{
            marginBottom: 16, padding: '24px 26px',
            background: step2Done ? '#FFFFFF' : '#FAFAFA',
            border: `1px solid ${step3Done ? 'rgba(22,163,74,0.4)' : step2Done ? '#D1D5DB' : '#E9ECEF'}`,
            pointerEvents: step2Done ? 'auto' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: step3Done ? '#16A34A' : step2Done ? '#1557B0' : '#E5E7EB', border: `2px solid ${step3Done ? '#16A34A' : step2Done ? '#1557B0' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: step2Done ? '#fff' : '#6B7280', flexShrink: 0 }}>
                  {step3Done ? <Check size={13} /> : '3'}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Contact Details <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 400 }}>(Official Person)</span></div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>Provide details of the authorized person who will manage this account.</div>
                </div>
              </div>
              {step3Done && <span className="badge badge-success" style={{ flexShrink: 0 }}>✓ Complete</span>}
            </div>

            <div style={{ ...S.row2, marginBottom: 14 }}>
              <div>
                <label style={S.label}>Full Name <span style={S.reqStar}>*</span></label>
                <input className="input" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Enter full name" />
              </div>
              <div>
                <label style={S.label}>Designation <span style={S.reqStar}>*</span></label>
                <input className="input" value={designation} onChange={e => setDesignation(e.target.value)} placeholder="e.g., Principal, Director, Registrar" />
              </div>
            </div>
            <div style={{ ...S.row2, marginBottom: 14 }}>
              <div>
                <label style={S.label}>Official Email <span style={S.reqStar}>*</span></label>
                <input type="email" className="input" value={officialEmail} onChange={e => setOfficialEmail(e.target.value)} placeholder="name@institutiondomain.edu.in" />
                <p style={S.hint}>Use official institutional email only</p>
              </div>
              <div>
                <label style={S.label}>Mobile Number <span style={S.reqStar}>*</span></label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--muted)', fontWeight: 600, flexShrink: 0 }}>+91</div>
                  <input className="input" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter mobile number" type="tel" />
                </div>
                <p style={S.hint}>OTP will be sent for verification</p>
              </div>
            </div>
            <div style={S.row2}>
              <div>
                <label style={S.label}>Landline Number <span style={{ color: 'var(--muted)', fontSize: 10 }}>(Optional)</span></label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, color: 'var(--muted)', fontWeight: 600, flexShrink: 0 }}>+91</div>
                  <input className="input" value={landline} onChange={e => setLandline(e.target.value)} placeholder="Enter landline number" type="tel" />
                </div>
              </div>
              <div>
                <label style={S.label}>Alternate Email <span style={{ color: 'var(--muted)', fontSize: 10 }}>(Optional)</span></label>
                <input type="email" className="input" value={altEmail} onChange={e => setAltEmail(e.target.value)} placeholder="Enter alternate email" />
              </div>
            </div>
          </div>

          {/* ── SECTION 4 — Create Account ───────────────────────────────────── */}
          <div className="card sec-card" style={{
            marginBottom: 24, padding: '24px 26px',
            background: step3Done ? '#FFFFFF' : '#FAFAFA',
            border: `1px solid ${step3Done ? '#D1D5DB' : '#E9ECEF'}`,
            pointerEvents: step3Done ? 'auto' : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: step3Done ? '#1557B0' : '#E5E7EB', border: `2px solid ${step3Done ? '#1557B0' : '#D1D5DB'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: step3Done ? '#fff' : '#6B7280', flexShrink: 0 }}>4</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Create Account</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>Create login credentials for your institution account.</div>
              </div>
            </div>

            <div style={S.row2}>
              <div>
                <label style={S.label}>Password <span style={S.reqStar}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create strong password"
                    style={{ paddingRight: 40 }}
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}>
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p style={S.hint}>Minimum 8 characters with letters, numbers &amp; symbols</p>
              </div>
              <div>
                <label style={S.label}>Confirm Password <span style={S.reqStar}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConf ? 'text' : 'password'}
                    className="input"
                    value={confirmPwd}
                    onChange={e => setConfirmPwd(e.target.value)}
                    placeholder="Confirm your password"
                    style={{ paddingRight: 40, borderColor: confirmPwd && confirmPwd !== password ? '#EF4444' : undefined }}
                  />
                  <button type="button" onClick={() => setShowConf(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0 }}>
                    {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPwd && confirmPwd !== password && (
                  <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>Passwords do not match</p>
                )}
              </div>
            </div>
          </div>

          {/* Declaration + Submit */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20, padding: '16px 18px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
            <button type="button" onClick={() => setAgreed(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 1, flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${agreed ? '#1557B0' : '#D1D5DB'}`, background: agreed ? '#1557B0' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                {agreed && <Check size={11} color="#fff" />}
              </div>
            </button>
            <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
              I confirm that the information provided is correct and our institution is a recognized higher education institution. False information may lead to rejection of registration.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Our team will verify your details and activate your account.</div>
            <button
              onClick={handleSubmit}
              disabled={!step1Done || !agreed}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '13px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#1A73E8,#1A73E8)',
                color: '#fff', fontSize: 14, fontWeight: 700,
                boxShadow: '0 4px 15px rgba(26,115,232,0.35)',
                opacity: !step1Done || !agreed ? 0.5 : 1,
                whiteSpace: 'nowrap',
                transition: 'opacity 0.2s, transform 0.15s',
              }}
            >
              Submit for Verification <ArrowRight size={15} />
            </button>
          </div>

          {/* Bottom security note */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20, fontSize: 11, color: '#9CA3AF' }}>
            <Shield size={11} /> Your data is 100% secure and protected with industry-standard encryption.
          </div>
        </div>

        {/* ══════════════════ RIGHT — SIDEBAR ═══════════════════════════════ */}
        <div style={{ position: 'sticky', top: 72, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Why verification */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={14} color="#1557B0" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Why Verification is Important?</span>
            </div>
            {[
              { icon: '✅', text: 'Ensures only genuine institutions can use Librix' },
              { icon: '🔒', text: 'Protects data and maintains platform integrity' },
              { icon: '🤝', text: 'Helps us provide better support and services' },
              { icon: '📋', text: 'Required for government compliance' },
            ].map(i => (
              <div key={i.text} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>{i.icon}</span>
                <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{i.text}</span>
              </div>
            ))}
          </div>

          {/* Accepted methods */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={14} color="#16A34A" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Accepted Verification Methods</span>
            </div>
            {[
              { icon: '🏛️', label: 'AISHE Code', sub: '6-digit code from AISHE portal', preferred: true },
              { icon: '📄', label: 'AICTE Approval Letter', sub: 'For technical institutions', preferred: false },
              { icon: '📜', label: 'UGC Recognition Certificate', sub: 'For universities & colleges', preferred: false },
              { icon: '🏫', label: 'Affiliation Letter', sub: 'From university/board', preferred: false },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12, padding: '8px 10px', borderRadius: 8, background: m.preferred ? 'rgba(79,70,229,0.05)' : 'transparent', border: m.preferred ? '1px solid rgba(79,70,229,0.18)' : '1px solid transparent' }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{m.icon}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: m.preferred ? '#1557B0' : '#111827' }}>{m.label}</span>
                    {m.preferred && <span style={{ fontSize: 9, fontWeight: 700, color: '#1557B0', background: 'rgba(79,70,229,0.1)', padding: '1px 6px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Preferred</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>{m.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Verification process */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={14} color="#D97706" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>Verification Process</span>
            </div>
            {[
              'Submit institution details',
              'We verify with government database',
              'Manual review by our team',
              'Account activation via email',
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#1557B0', flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5, marginTop: 2 }}>{step}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, padding: '8px 10px', background: 'rgba(22,163,74,0.06)', borderRadius: 8 }}>
              <Clock size={12} color="#16A34A" />
              <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 600 }}>Usually completed within 1-2 working days</span>
            </div>
          </div>

          {/* Need Help */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>🎧 Need Help?</div>
            <p style={{ fontSize: 12, color: '#374151', marginBottom: 12, lineHeight: 1.5 }}>Our support team is here to help you with registration.</p>
            {[
              { icon: <Mail size={12} />,  val: 'support@Librix.com' },
              { icon: <Phone size={12} />, val: '+91 12345 67890' },
              { icon: <Clock size={12} />, val: 'Mon – Sat: 9:00 AM – 6:00 PM' },
            ].map(c => (
              <div key={c.val} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, fontSize: 12, color: '#374151' }}>
                <span style={{ color: '#1557B0', flexShrink: 0 }}>{c.icon}</span> {c.val}
              </div>
            ))}
          </div>

          {/* Trust count */}
          <div style={{ padding: '16px 18px', background: 'linear-gradient(135deg,rgba(79,70,229,0.07),rgba(26,115,232,0.07))', border: '1px solid rgba(79,70,229,0.2)', borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#1557B0', marginBottom: 2 }}>500+</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Trusted by Institutions</div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>Join 500+ verified institutions using Librix</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 10 }}>
              {'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} style={{ fontSize: 14 }}>{s}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
