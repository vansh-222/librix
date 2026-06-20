'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { BookOpen, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState({ collegeId: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/colleges/list').then(r => r.json()).then(d => {
      if (d.colleges) setColleges(d.colleges);
    });
    if (searchParams.get('error')) setError('Invalid credentials. Please try again.');
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      collegeId: isSuperAdmin ? '' : form.collegeId,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password. Please check your credentials.');
      setLoading(false);
      return;
    }

    // Fetch session to get role for redirect
    const res = await fetch('/api/auth/session');
    const session = await res.json();
    const role = session?.user?.role;

    if (role === 'super_admin') router.push('/admin/dashboard');
    else if (role === 'librarian') router.push('/librarian/dashboard');
    else router.push('/student/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            }}>
              <BookOpen size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              Librar<span style={{ color: 'var(--brand)' }}>ium</span>
            </span>
          </Link>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>Sign in to your library</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {/* Admin toggle */}
          <div style={{
            display: 'flex', gap: 4, background: 'var(--surface-2)',
            borderRadius: 8, padding: 4, marginBottom: 24,
          }}>
            {['Student Login', 'Librarian Login'].map((tab, i) => (
              <button key={tab} onClick={() => { setIsSuperAdmin(i === 1); setError(''); }}
                style={{
                  flex: 1, padding: '7px 0', borderRadius: 6, border: 'none',
                  background: (i === 1) === isSuperAdmin ? 'var(--brand)' : 'transparent',
                  color: (i === 1) === isSuperAdmin ? '#fff' : 'var(--muted)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {tab}
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
              display: 'flex', gap: 8, alignItems: 'center',
              fontSize: 13, color: '#EF4444',
            }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* College selector (hidden for super admin) */}
            {!isSuperAdmin && (
              <div className="form-group">
                <label className="label">College / Institution</label>
                <select
                  className="input"
                  value={form.collegeId}
                  onChange={e => setForm(f => ({ ...f, collegeId: e.target.value }))}
                  required={!isSuperAdmin}
                >
                  <option value="">Select your college...</option>
                  {colleges.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
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
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                  }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <Link href="/forgot-password" style={{ fontSize: 12, color: 'var(--brand)', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 24 }}>
          New to Librarium?{' '}
          <Link href="/register" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
            Register your college
          </Link>
        </p>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 8 }}>
          Student or Teacher?{' '}
          <Link href="/signup" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>
            Create an account
          </Link>
        </p>
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

