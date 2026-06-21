'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { BookOpen, Eye, EyeOff, Loader2, AlertCircle, GraduationCap, Library } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLibrarian, setIsLibrarian] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', librarianCode: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get('error') ? 'Invalid credentials. Please try again.' : ''
  );

  const switchTab = (librarian) => {
    setIsLibrarian(librarian);
    setError('');
    setForm({ email: '', password: '', librarianCode: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLibrarian && !form.librarianCode.trim()) {
      setError('Librarian access code is required.');
      return;
    }

    setLoading(true);

    const result = await signIn('credentials', {
      email:         form.email,
      password:      form.password,
      librarianCode: isLibrarian ? form.librarianCode : '',
      redirect:      false,
    });

    if (result?.error) {
      setError(
        isLibrarian
          ? 'Invalid credentials or access code. Please try again.'
          : 'Invalid email or password. Please try again.'
      );
      setLoading(false);
      return;
    }

    const res = await fetch('/api/auth/session');
    const session = await res.json();
    const role = session?.user?.role;

    if (role === 'librarian') router.push('/librarian/dashboard');
    else router.push('/student/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: isLibrarian
          ? 'radial-gradient(circle,rgba(5,32,51,0.07) 0%,transparent 70%)'
          : 'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)',
        pointerEvents: 'none', transition: 'background 0.4s',
      }} />

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: isLibrarian
                ? 'linear-gradient(135deg,#052033,#1A73E8)'
                : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isLibrarian
                ? '0 0 20px rgba(5,32,51,0.3)'
                : '0 0 20px rgba(99,102,241,0.4)',
              transition: 'all 0.3s',
            }}>
              <BookOpen size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              Librar<span style={{ color: 'var(--brand)' }}>ium</span>
            </span>
          </Link>
        </div>

        {/* Student / Librarian tabs */}
        <div style={{
          display: 'flex', gap: 0, marginBottom: 20,
          background: 'var(--surface-2)', borderRadius: 12, padding: 4,
        }}>
          {[
            { label: 'Student Login',   icon: <GraduationCap size={15}/>, librarian: false },
            { label: 'Librarian Login', icon: <Library size={15}/>,       librarian: true  },
          ].map(({ label, icon, librarian }) => (
            <button key={label} onClick={() => switchTab(librarian)} style={{
              flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
              background: isLibrarian === librarian
                ? (librarian ? '#052033' : 'var(--brand)')
                : 'transparent',
              color: isLibrarian === librarian ? '#fff' : 'var(--muted)',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s',
            }}>
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 32 }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, textAlign: 'center' }}>
            {isLibrarian
              ? '🔐 Restricted area — librarian credentials required'
              : '👋 Welcome back, sign in to your library account'}
          </p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#EF4444',
            }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Access code — librarian only */}
            {isLibrarian && (
              <div className="form-group">
                <label className="label">Librarian Access Code *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCode ? 'text' : 'password'}
                    className="input"
                    placeholder="Enter your secret access code"
                    value={form.librarianCode}
                    onChange={e => setForm(f => ({ ...f, librarianCode: e.target.value }))}
                    required={isLibrarian}
                    style={{ paddingRight: 44 }}
                    autoComplete="off"
                  />
                  <button type="button" onClick={() => setShowCode(s => !s)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                  }}>
                    {showCode ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  Contact your administrator if you don't have this code.
                </p>
              </div>
            )}

            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="you@college.edu"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 28 }}>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                }}>
                  {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{
                width: '100%', justifyContent: 'center', padding: '12px 0',
                background: isLibrarian ? '#052033' : undefined,
              }}>
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }}/> Signing in...</>
                : isLibrarian ? '🔐 Sign in as Librarian' : 'Sign In'}
            </button>
          </form>
        </div>

        {!isLibrarian && (
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 24 }}>
            New student?{' '}
            <Link href="/signup" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
              Create an account
            </Link>
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
