'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import TopBar from '@/components/shared/TopBar';
import {
  User, Mail, Phone, GraduationCap, Hash, Save, Loader2, CheckCircle,
  Calendar, Clock, BookOpen, AlertCircle, Key, LogOut, Shield, Edit3, X
} from 'lucide-react';
import { getInitials, formatDate } from '@/lib/utils';

export default function ProfilePageClient({ user }) {
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({
    phone: user.phone || '',
    department: user.department || '',
    rollNumber: user.rollNumber || '',
    studentId: user.studentId || ''
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setPass = k => e => setPasswordForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setChangingPassword(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setChangingPassword(false);
      return;
    }

    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
      }, 2000);
    } catch (err) {
      setPasswordError(err.message);
    }
    setChangingPassword(false);
  };

  const initials = getInitials(user.name || '');

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: 900 }}>
      <TopBar title="My Profile" subtitle="Manage your account and preferences" />

      {saved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 10, marginBottom: 20, color: '#22C55E', fontSize: 14, fontWeight: 600,
        }}>
          <CheckCircle size={16} /> Profile updated successfully!
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10, marginBottom: 20, color: '#EF4444', fontSize: 14,
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: 28, gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800, color: '#fff', flexShrink: 0,
              boxShadow: '0 8px 24px rgba(99,102,241,0.25)',
            }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{user.name}</div>
                  <div style={{ fontSize: 14, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={13} /> {user.email}
                  </div>
                </div>
                <span style={{
                  background: 'rgba(99,102,241,0.12)', color: '#6366F1',
                  padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700, textTransform: 'capitalize',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <User size={13} /> {user.role}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginTop: 16 }}>
                {user.studentId && (
                  <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Student ID</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{user.studentId}</div>
                  </div>
                )}
                {user.rollNumber && (
                  <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Roll Number</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{user.rollNumber}</div>
                  </div>
                )}
                {user.department && (
                  <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Department</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{user.department}</div>
                  </div>
                )}
                {user.phone && (
                  <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Phone</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{user.phone}</div>
                  </div>
                )}
                {user.lastLogin && (
                  <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Last Login</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(user.lastLogin)}</div>
                  </div>
                )}
                {user.createdAt && (
                  <div style={{ padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Member Since</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{formatDate(user.createdAt)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        {stats && (
          <>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BookOpen size={18} color="#6366F1" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Currently Borrowed</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#6366F1' }}>{stats.borrowedBooks || 0}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Books in your possession</div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Clock size={18} color="#F59E0B" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Pending Requests</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#F59E0B' }}>{stats.pendingRequests || 0}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Awaiting librarian approval</div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <AlertCircle size={18} color="#EF4444" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Pending Fine</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#EF4444' }}>₹{stats.pendingFine || 0}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Pay at library counter</div>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Calendar size={18} color="#22C55E" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Due Soon (3 days)</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#22C55E' }}>{stats.dueSoon || 0}</div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Books to return soon</div>
            </div>
          </>
        )}
      </div>

      {/* Edit Profile Form */}
      <div className="card" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Edit3 size={18} color="var(--brand)" /> Edit Profile
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Update your personal information</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">
                <User size={13} style={{ display: 'inline', marginRight: 6 }} />Student ID
              </label>
              <input className="input" placeholder="STU2024001" value={form.studentId} onChange={set('studentId')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">
                <Hash size={13} style={{ display: 'inline', marginRight: 6 }} />Roll Number
              </label>
              <input className="input" placeholder="CS-101" value={form.rollNumber} onChange={set('rollNumber')} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">
                <GraduationCap size={13} style={{ display: 'inline', marginRight: 6 }} />Department
              </label>
              <input className="input" placeholder="Computer Science" value={form.department} onChange={set('department')} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">
                <Phone size={13} style={{ display: 'inline', marginRight: 6 }} />Phone Number
              </label>
              <input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
            </div>
          </div>

          <div style={{
            padding: '12px 16px', borderRadius: 10, background: 'var(--surface-2)',
            fontSize: 13, color: 'var(--muted)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Shield size={14} />
            Your name and email can only be changed by your librarian for security reasons.
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ gap: 8 }}>
              {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
              Save Changes
            </button>
            <button type="button" onClick={() => setShowPasswordModal(true)} className="btn btn-secondary" style={{ gap: 8 }}>
              <Key size={15} /> Change Password
            </button>
          </div>
        </form>
      </div>

      {/* Account Actions */}
      <div className="card" style={{ padding: 28 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Account Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="btn btn-danger"
            style={{ gap: 8, justifyContent: 'flex-start', maxWidth: 200 }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowPasswordModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Key size={18} color="var(--brand)" /> Change Password
              </h2>
              <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
                <X size={20} />
              </button>
            </div>

            {passwordSuccess && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                borderRadius: 10, marginBottom: 20, color: '#22C55E', fontSize: 14,
              }}>
                <CheckCircle size={16} /> Password changed successfully!
              </div>
            )}

            {passwordError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, marginBottom: 20, color: '#EF4444', fontSize: 14,
              }}>
                <AlertCircle size={16} /> {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="label">Current Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={setPass('currentPassword')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Enter new password (min 6 characters)"
                  value={passwordForm.newPassword}
                  onChange={setPass('newPassword')}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label className="label">Confirm New Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={setPass('confirmPassword')}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={changingPassword}
                  style={{ flex: 1, gap: 8, justifyContent: 'center' }}
                >
                  {changingPassword ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
