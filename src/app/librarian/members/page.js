'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { Users, UserPlus, Search, GraduationCap, BookOpen, ToggleLeft, ToggleRight, X, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function LibrarianMembersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('student');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'teacher', department: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const fetchUsers = () => {
    setLoading(true);
    fetch(`/api/users?role=${tab}&search=${search}`).then(r => r.json()).then(d => {
      setUsers(d.users || []);
      setLoading(false);
    });
  };

  useEffect(fetchUsers, [tab, search]);

  const toggleActive = async (user) => {
    setTogglingId(user._id);
    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, isActive: !user.isActive }),
    });
    setTogglingId(null);
    fetchUsers();
  };

  const addTeacher = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'teacher' }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      showToast('Teacher added successfully!');
      setShowAdd(false);
      setForm({ name: '', email: '', password: '', role: 'teacher', department: '', phone: '' });
      fetchUsers();
    } else {
      showToast(data.error || 'Failed to add teacher');
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="Members" subtitle="Manage students and teachers" />

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: 'var(--brand)', color: '#fff', padding: '10px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
        }}>{toast}</div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Tab */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', borderRadius: 10, padding: 4 }}>
          {['student', 'teacher'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: tab === t ? 'var(--brand)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--muted)',
              fontWeight: 600, fontSize: 13, textTransform: 'capitalize', transition: 'all 0.2s',
            }}>{t}s</button>
          ))}
        </div>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            className="input" placeholder={`Search ${tab}s...`}
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 36, margin: 0 }}
          />
        </div>
        {/* Add Teacher Button */}
        {tab === 'teacher' && (
          <button onClick={() => setShowAdd(true)} className="btn btn-primary" style={{ gap: 8, flexShrink: 0 }}>
            <UserPlus size={15} /> Add Teacher
          </button>
        )}
      </div>

      {/* Add Teacher Modal */}
      {showAdd && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Add Teacher</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={addTeacher}>
              <div className="form-group">
                <label className="label">Full Name *</label>
                <input className="input" value={form.name} onChange={set('name')} required placeholder="Dr. Priya Sharma" />
              </div>
              <div className="form-group">
                <label className="label">Email *</label>
                <input type="email" className="input" value={form.email} onChange={set('email')} required placeholder="teacher@college.edu" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="label">Department</label>
                  <input className="input" value={form.department} onChange={set('department')} placeholder="Computer Science" />
                </div>
                <div className="form-group">
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Temporary Password *</label>
                <input type="password" className="input" value={form.password} onChange={set('password')} required minLength={8} placeholder="Min 8 characters" />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setShowAdd(false)} className="btn" style={{ flex: 1, background: 'var(--surface-2)', color: 'var(--muted)', border: 'none' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 1, gap: 8 }}>
                  {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <UserPlus size={15} />}
                  Add Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--brand)' }} />
        </div>
      ) : users.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <Users size={40} style={{ margin: '0 auto 12px', color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)' }}>No {tab}s found.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>{tab === 'student' ? 'Roll No.' : 'Department'}</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                      }}>
                        {(u.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {tab === 'student' ? (u.rollNumber || '—') : (u.department || '—')}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>{u.email}</td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{formatDate(u.createdAt)}</td>
                  <td>
                    <span style={{
                      background: u.isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                      color: u.isActive ? '#22C55E' : '#EF4444',
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td>
                    <button onClick={() => toggleActive(u)} disabled={togglingId === u._id}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: u.isActive ? '#EF4444' : '#22C55E',
                        display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600,
                      }}>
                      {togglingId === u._id
                        ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                        : u.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />
                      }
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
