'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const PLANS = [
  { id: 'free', label: 'Free', desc: 'Up to 500 books, 50 students' },
  { id: 'basic', label: 'Basic — ₹2,499/mo', desc: '5,000 books, 500 members' },
  { id: 'premium', label: 'Premium — ₹7,999/mo', desc: 'Unlimited everything' },
];

export default function RegisterCollegePage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', plan: 'free' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/colleges/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 440 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <CheckCircle size={36} color="#22C55E" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Application Submitted!</h1>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
            Your college registration is <strong style={{ color: '#F59E0B' }}>pending approval</strong>.
            Our team will review it within 24 hours and send credentials to <strong>{form.email}</strong>.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ justifyContent: 'center' }}>Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={20} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800 }}>Librar<span style={{ color: 'var(--brand)' }}>ium</span></span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Register Your College</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Get your institution's digital library up and running</p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 24,
              display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#EF4444',
            }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">College / Institution Name *</label>
              <input className="input" placeholder="ABC College of Engineering" value={form.name} onChange={set('name')} required />
            </div>

            <div className="form-group">
              <label className="label">Official Email Address *</label>
              <input type="email" className="input" placeholder="admin@abccollege.edu" value={form.email} onChange={set('email')} required />
            </div>

            <div className="form-group">
              <label className="label">Phone Number *</label>
              <input type="tel" className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} required />
            </div>

            <div className="form-group">
              <label className="label">Full Address *</label>
              <textarea className="input" placeholder="123 College Road, City, State, PIN" value={form.address} onChange={set('address')} required rows={3} style={{ resize: 'vertical', minHeight: 80 }} />
            </div>

            <div className="form-group">
              <label className="label">Select Plan</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PLANS.map(p => (
                  <label key={p.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
                    border: form.plan === p.id ? '1px solid var(--brand)' : '1px solid var(--border)',
                    background: form.plan === p.id ? 'rgba(99,102,241,0.08)' : 'var(--surface-2)',
                    transition: 'all 0.15s',
                  }}>
                    <input type="radio" name="plan" value={p.id} checked={form.plan === p.id}
                      onChange={set('plan')} style={{ accentColor: 'var(--brand)' }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px 0', marginTop: 8 }}>
              {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : 'Submit Registration'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 20 }}>
          Already registered?{' '}
          <Link href="/login" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Sign in here</Link>
        </p>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
