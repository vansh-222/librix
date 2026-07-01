'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  BookOpen, Eye, EyeOff, Loader2, AlertCircle,
  GraduationCap, Library
} from 'lucide-react';


const SPIN   = `@keyframes spin { to { transform: rotate(360deg); } }`;

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab]   = useState('student');   // 'student' | 'librarian'
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(
    searchParams.get('error') ? 'Invalid credentials. Please try again.' : ''
  );

  const switchTab = (t) => { setTab(t); setError(''); setForm({ email: '', password: '' }); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      const msg = result.error.includes('LIBRARIAN_NO_COLLEGE')
        ? 'Your librarian account is not linked to a college. Please contact your administrator.'
        : 'Invalid email or password. Please try again.';
      setError(msg);
      setLoading(false);
      return;
    }

    // Fetch session to get role → redirect
    const res     = await fetch('/api/auth/session');
    const session = await res.json();
    const role    = session?.user?.role;

    if (role === 'librarian' || role === 'super_admin') router.push('/librarian/dashboard');
    else router.push('/student/dashboard');
  };

  const isLibrarian = tab === 'librarian';

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <style>{SPIN}</style>

      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 700, height: 500, borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
      }} />

      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99,102,241,0.35)',
            }}>
              <BookOpen size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              Librar<span style={{ color: 'var(--brand)' }}>ium</span>
            </span>
          </Link>
          <div style={{ marginTop: 18, fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Welcome back</div>
          <div style={{ marginTop: 5, fontSize: 13, color: 'var(--muted)' }}>Sign in to your library account</div>
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

        {/* Card */}
        <div className="card" style={{ padding: '28px 28px 24px' }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#EF4444',
            }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 5 }}>
                Email Address
              </label>
              <input
                type="email" className="input"
                placeholder={isLibrarian ? 'librarian@college.ac.in' : 'you@college.edu'}
                value={form.email}
                onChange={set('email')}
                required autoFocus
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 5 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input" placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  required style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 0', fontSize: 14 }}>
              {loading
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }}/> Signing in…</>
                : `Sign In as ${isLibrarian ? 'Librarian' : 'Student'}`}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
          {!isLibrarian && (
            <p style={{ marginBottom: 8 }}>
              New student?{' '}
              <Link href="/signup" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
                Create an account
              </Link>
            </p>
          )}
          {isLibrarian && (
            <p style={{ marginBottom: 8 }}>
              Need to set up librarian account?{' '}
              <Link href="/signup?tab=librarian" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
                Use setup key
              </Link>
            </p>
          )}
          <p>
            <Link href="/register" style={{ color: 'var(--muted)', fontWeight: 500, textDecoration: 'none' }}>
              Register your institution
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{SPIN}</style>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
