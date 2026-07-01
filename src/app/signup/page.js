'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BookOpen, Loader2, AlertCircle, CheckCircle,
  Eye, EyeOff, Hash, GraduationCap, Library, Key, User
} from 'lucide-react';

const SPIN   = `@keyframes spin { to { transform: rotate(360deg); } }`;

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'librarian' ? 'librarian' : 'student';
  const [tab, setTab] = useState(defaultTab); // 'student' | 'librarian'

  const [form, setForm] = useState({
    collegeCode:     '', // for student
    setupKey:        '', // for librarian
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '', // only for student (to keep UI simpler for librarian, or both)
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error,   setError]             = useState('');
  const [success, setSuccess]           = useState(null); // stores success data

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const switchTab = (t) => { setTab(t); setError(''); setForm({ collegeCode: '', setupKey: '', name: '', email: '', password: '', confirmPassword: '' }); };

  const isLibrarian = tab === 'librarian';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLibrarian && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLibrarian) {
        // Librarian Setup Flow
        const res  = await fetch('/api/librarian/setup', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ 
            setupKey: form.setupKey.trim().toUpperCase(), 
            name: form.name, 
            email: form.email, 
            password: form.password 
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Setup failed');
        setSuccess({
          type: 'librarian',
          collegeName: data.collegeName,
          libraryCode: data.libraryCode
        });
        setTimeout(() => router.push('/login'), 4000);

      } else {
        // Student Signup Flow
        const res = await fetch('/api/users/register', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:        form.name,
            email:       form.email,
            password:    form.password,
            collegeCode: form.collegeCode.trim().toUpperCase(),
            role:        'student',
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        setSuccess({
          type: 'student',
          collegeName: data.collegeName || 'your college'
        });
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Success Screen ─────────────────────────────────────────────── */
  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <style>{SPIN}</style>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={36} color="#22C55E" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Account Created!</h2>
          
          {success.type === 'librarian' ? (
            <>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                Your librarian account for <strong style={{ color: 'var(--text)' }}>{success.collegeName}</strong> is ready.
              </p>
              {success.libraryCode && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20, textAlign: 'left' }}>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Student Library Code to share:</div>
                  <code style={{ fontSize: 20, fontWeight: 800, letterSpacing: 2, color: 'var(--brand)' }}>{success.libraryCode}</code>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
              You've joined <strong style={{ color: 'var(--text)' }}>{success.collegeName}</strong>'s library.
            </p>
          )}

          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10 }}>Redirecting to login…</p>
        </div>
      </div>
    );
  }

  /* ── Form ───────────────────────────────────────────────────────── */
  const GRP = { marginBottom: 16 };
  const LBL = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 5 };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <style>{SPIN}</style>

      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 700, height: 500, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
      }} />

      <div style={{ width: '100%', maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}>
              <BookOpen size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>Librar<span style={{ color: 'var(--brand)' }}>ium</span></span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 5 }}>Create an Account</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Join your institution's digital library</p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', background: 'var(--surface)', borderRadius: 12,
          padding: 4, marginBottom: 20, border: '1px solid var(--border)',
        }}>
          {[
            { key: 'student',   label: 'Student',   icon: GraduationCap },
            { key: 'librarian', label: 'Librarian', icon: Library        },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              type="button"
              style={{
                flex: 1, padding: '10px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                background: tab === key ? 'var(--brand)' : 'transparent',
                color:      tab === key ? 'white' : 'var(--muted)',
                boxShadow:  tab === key ? '0 2px 8px rgba(99,102,241,0.35)' : 'none',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: '28px 28px 24px' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#EF4444' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {isLibrarian ? (
              /* Librarian Specific Fields */
              <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10, padding: '16px', marginBottom: 22 }}>
                <label style={{ ...LBL, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Key size={13} color="var(--brand)" /> Librarian Setup Key <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  className="input"
                  placeholder="e.g. VRL-82A9-XP71"
                  value={form.setupKey}
                  onChange={set('setupKey')}
                  required autoFocus
                  style={{ fontFamily: 'monospace', letterSpacing: 2, fontSize: 16, textTransform: 'uppercase', background: 'var(--surface-2)' }}
                />
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, lineHeight: 1.5 }}>
                  You received this one-time key after verifying your college registration.
                </p>
              </div>
            ) : (
              /* Student Specific Fields */
              <div style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
                <label style={{ ...LBL, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Hash size={12} color="var(--brand)" />
                  College Library Code <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  className="input"
                  placeholder="e.g. LIB-ABGI-00001"
                  value={form.collegeCode}
                  onChange={set('collegeCode')}
                  required autoFocus
                  style={{ fontFamily: 'monospace', letterSpacing: 1.5, textTransform: 'uppercase', background: 'var(--surface-2)' }}
                />
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
                  Get this code from your college librarian
                </p>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <User size={14} color="var(--brand)" />
              <span style={{ fontSize: 13, fontWeight: 700 }}>Account Details</span>
            </div>

            <div style={GRP}>
              <label style={LBL}>Full Name <span style={{ color: '#EF4444' }}>*</span></label>
              <input className="input" placeholder="Enter your full name" value={form.name} onChange={set('name')} required />
            </div>

            <div style={GRP}>
              <label style={LBL}>Email Address <span style={{ color: '#EF4444' }}>*</span></label>
              <input type="email" className="input" placeholder={isLibrarian ? "librarian@college.ac.in" : "you@email.com"} value={form.email} onChange={set('email')} required />
            </div>

            <div style={GRP}>
              <label style={LBL}>Password <span style={{ color: '#EF4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="input" placeholder="Min 8 characters" value={form.password} onChange={set('password')} required minLength={8} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPassword(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {!isLibrarian && (
              <div style={{ ...GRP, marginBottom: 24 }}>
                <label style={LBL}>Confirm Password <span style={{ color: '#EF4444' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} className="input" placeholder="Repeat your password" value={form.confirmPassword} onChange={set('confirmPassword')} required style={{ paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowConfirm(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                    {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14, marginTop: isLibrarian ? 12 : 0 }}>
              {loading
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Creating account…</>
                : (isLibrarian ? '🔐 Create Librarian Account' : 'Create Student Account')}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 18 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{SPIN}</style>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
