'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function StudentSignupPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState([]);
  const [form, setForm] = useState({
    collegeId: '', name: '', email: '', password: '', confirmPassword: '',
    role: 'student', studentId: '', rollNumber: '', department: '', phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    fetch('/api/colleges/list').then(r => r.json()).then(d => {
      if (d.colleges) setColleges(d.colleges);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <CheckCircle size={48} color="#22C55E" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Account Created!</h2>
          <p style={{ color: 'var(--muted)' }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ width: '100%', maxWidth: 540 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>Librar<span style={{ color: 'var(--brand)' }}>ium</span></span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create Your Account</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Join your college's digital library</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
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
            {/* Role */}
            <div className="form-group">
              <label className="label">I am a</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['student', 'teacher'].map(r => (
                  <button key={r} type="button" onClick={() => setForm(f => ({ ...f, role: r }))}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 8, border: 'none',
                      background: form.role === r ? 'var(--brand)' : 'var(--surface-2)',
                      color: form.role === r ? '#fff' : 'var(--muted)',
                      fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                      textTransform: 'capitalize',
                    }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* College */}
            <div className="form-group">
              <label className="label">Your College *</label>
              <select className="input" value={form.collegeId} onChange={set('collegeId')} required>
                <option value="">Select your college...</option>
                {colleges.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="label">Full Name *</label>
                <input className="input" placeholder="Vansh Sharma" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-group">
                <label className="label">Phone</label>
                <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Email Address *</label>
              <input type="email" className="input" placeholder="you@college.edu" value={form.email} onChange={set('email')} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="label">{form.role === 'student' ? 'Student ID' : 'Teacher ID'}</label>
                <input className="input" placeholder="STU2024001" value={form.studentId} onChange={set('studentId')} />
              </div>
              <div className="form-group">
                <label className="label">Roll Number</label>
                <input className="input" placeholder="CS-101" value={form.rollNumber} onChange={set('rollNumber')} />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Department</label>
              <input className="input" placeholder="Computer Science" value={form.department} onChange={set('department')} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="label">Password *</label>
                <input type="password" className="input" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={8} />
              </div>
              <div className="form-group">
                <label className="label">Confirm Password *</label>
                <input type="password" className="input" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px 0', marginTop: 8 }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Creating account...</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 20 }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
