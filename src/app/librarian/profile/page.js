'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, Building2, Hash, Save, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';

import LibrarianLayout from '@/components/librarian/LibrarianLayout';

export default function LibrarianProfilePage() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState({ msg: '', type: 'success' });

  // Profile form
  const [form, setForm] = useState({ name: '', phone: '', department: '', studentId: '', rollNumber: '' });
  // Password form
  const [pwForm, setPwForm]     = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw]     = useState({ current: false, newPw: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: 'success' }), 3500); };

  useEffect(() => {
    fetch('/api/users/me')
      .then(r => r.json())
      .then(({ user: u }) => {
        setUser(u);
        setForm({ name: u.name || '', phone: u.phone || '', department: u.department || '', studentId: u.studentId || '', rollNumber: u.rollNumber || '' });
      })
      .catch(() => showToast('Failed to load profile.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res  = await fetch('/api/users/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Save failed.', 'error'); return; }
      setUser(prev => ({ ...prev, ...data.user }));
      showToast('Profile saved successfully!');
    } catch { showToast('Something went wrong.', 'error'); }
    finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { showToast('New passwords do not match.', 'error'); return; }
    if (pwForm.newPw.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }
    setPwSaving(true);
    try {
      const res  = await fetch('/api/users/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }) });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Password change failed.', 'error'); return; }
      showToast('Password changed successfully!');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch { showToast('Something went wrong.', 'error'); }
    finally { setPwSaving(false); }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8,
    fontSize: 13, color: '#111827', outline: 'none', fontFamily: 'Inter', boxSizing: 'border-box', background: 'white',
  };

  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 };

  const SectionCard = ({ children, title, subtitle }) => (
    <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24, marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 20px' }}>{subtitle}</p>}
      {children}
    </div>
  );

  if (loading) return (
    <LibrarianLayout title="Profile" subtitle="Manage your librarian profile details">
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: '#1A73E8' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
    </LibrarianLayout>
  );

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <LibrarianLayout title="Profile" subtitle="Manage your librarian profile details">
    <div style={{ padding: '28px', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', minHeight: '100%' }}>
      {toast.msg && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: toast.type === 'error' ? '#EF4444' : '#22C55E', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} /> {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#1A73E8,#93C5FD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', flexShrink: 0 }}>
            {user?.avatarUrl
              ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{user?.email}</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 12px', borderRadius: 20, background: '#EFF6FF', color: '#1A73E8', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{user?.role}</span>
              {user?.collegeId?.name && <span style={{ padding: '3px 12px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280', fontSize: 12, fontWeight: 600 }}>{user.collegeId.name}</span>}
              <span style={{ padding: '3px 12px', borderRadius: 20, background: user?.isActive ? '#F0FDF4' : '#FEF2F2', color: user?.isActive ? '#22C55E' : '#EF4444', fontSize: 12, fontWeight: 600 }}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>Member since</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Last login</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
            </div>
          </div>
        </div>

        {/* Edit Profile */}
        <SectionCard title="Personal Information" subtitle="Update your profile details">
          <form onSubmit={saveProfile}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}><User size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Full Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}><Mail size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Email</label>
                <input value={user?.email || ''} style={{ ...inputStyle, background: '#F9FAFB', color: '#9CA3AF' }} disabled />
              </div>
              <div>
                <label style={labelStyle}><Phone size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Phone</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label style={labelStyle}><Building2 size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Department</label>
                <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} style={inputStyle} placeholder="Computer Science" />
              </div>
              {(false) && <>
                <div>
                  <label style={labelStyle}><Hash size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Student ID</label>
                  <input value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><Hash size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />Roll Number</label>
                  <input value={form.rollNumber} onChange={e => setForm(f => ({ ...f, rollNumber: e.target.value }))} style={inputStyle} />
                </div>
              </>}
            </div>
            <button type="submit" disabled={saving}
              style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg,#1A73E8,#1A73E8)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter' }}>
              {saving ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Save size={15} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </SectionCard>

        {/* Change Password */}
        <SectionCard title="Change Password" subtitle="Keep your account secure with a strong password">
          <form onSubmit={changePassword}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
              {[
                { key: 'current', label: 'Current Password' },
                { key: 'newPw',   label: 'New Password'     },
                { key: 'confirm', label: 'Confirm New Password' },
              ].map(field => (
                <div key={field.key}>
                  <label style={labelStyle}><Lock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{field.label}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPw[field.key] ? 'text' : 'password'}
                      value={pwForm[field.key]}
                      onChange={e => setPwForm(f => ({ ...f, [field.key]: e.target.value }))}
                      style={{ ...inputStyle, paddingRight: 44 }} required
                    />
                    <button type="button" onClick={() => setShowPw(s => ({ ...s, [field.key]: !s[field.key] }))}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      {showPw[field.key] ? <EyeOff size={16} color="#9CA3AF" /> : <Eye size={16} color="#9CA3AF" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" disabled={pwSaving}
              style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg,#1A73E8,#1A73E8)', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter' }}>
              {pwSaving ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Lock size={15} />}
              {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </SectionCard>

        {/* Account Info (read-only) */}
        <SectionCard title="Account Information">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Account ID',  value: user?._id },
              { label: 'Role',        value: user?.role },
              { label: 'College',     value: user?.collegeId?.name || '—' },
              { label: 'Status',      value: user?.isActive ? 'Active' : 'Inactive' },
            ].map(item => (
              <div key={item.label} style={{ padding: '12px 16px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', wordBreak: 'break-all' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
    </LibrarianLayout>
  );
}

