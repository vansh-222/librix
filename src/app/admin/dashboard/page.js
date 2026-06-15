'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { Building2, Users, BookOpen, TrendingUp, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);

  const fetchData = async () => {
    const [statsData, collegeData] = await Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/colleges').then(r => r.json()),
    ]);
    setStats(statsData.stats);
    setColleges(collegeData.colleges || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateCollege = async (collegeId, updates) => {
    setActioning(collegeId);
    await fetch('/api/colleges', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeId, ...updates }),
    });
    setActioning(null);
    fetchData();
  };

  const pending = colleges.filter(c => c.status === 'pending');
  const active = colleges.filter(c => c.status === 'active');

  const STAT_CARDS = stats ? [
    { label: 'Total Colleges', value: stats.totalColleges, icon: Building2, color: '#6366F1' },
    { label: 'Active', value: stats.activeColleges, icon: CheckCircle, color: '#22C55E' },
    { label: 'Pending Approval', value: stats.pendingColleges, icon: TrendingUp, color: '#F59E0B' },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#8B5CF6' },
    { label: 'Total Borrows', value: stats.totalBorrows, icon: BookOpen, color: '#06B6D4' },
    { label: 'Fines Collected', value: `₹${stats.totalRevenue || 0}`, icon: TrendingUp, color: '#EF4444' },
  ] : [];

  const STATUS_BADGE = { pending: 'badge-warning', active: 'badge-success', suspended: 'badge-danger' };
  const PLAN_BADGE = { free: 'badge-muted', basic: 'badge-brand', premium: 'badge-purple' };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="Super Admin" subtitle="Platform-wide overview" />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16, marginBottom: 32 }}>
        {STAT_CARDS.map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <s.icon size={18} color={s.color} />
            </div>
            <div className="stat-value" style={{ fontSize: 24, color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      {pending.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
            Pending Approvals ({pending.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pending.map(c => (
              <div key={c._id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 16px', borderRadius: 10,
                background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{c.email} · {c.phone}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.address}</div>
                  <div style={{ marginTop: 6 }}>
                    <span className={`badge ${PLAN_BADGE[c.plan]}`}>{c.plan}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => updateCollege(c._id, { status: 'active' })} disabled={actioning === c._id}
                    className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)', gap: 4 }}>
                    {actioning === c._id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={13} />}
                    Approve
                  </button>
                  <button onClick={() => updateCollege(c._id, { status: 'suspended' })} disabled={actioning === c._id}
                    className="btn btn-danger btn-sm" style={{ gap: 4 }}>
                    <XCircle size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Colleges Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>All Colleges ({colleges.length})</h2>
          <Link href="/admin/colleges" style={{ fontSize: 12, color: 'var(--brand)', textDecoration: 'none' }}>Manage all →</Link>
        </div>
        <div className="table-wrapper" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>College</th>
                <th>Plan</th>
                <th>Users</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges.slice(0, 10).map(c => (
                <tr key={c._id}>
                  <td>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.email}</div>
                  </td>
                  <td><span className={`badge ${PLAN_BADGE[c.plan]}`}>{c.plan}</span></td>
                  <td style={{ fontSize: 13 }}>{c.userCount || 0}</td>
                  <td><span className={`badge ${STATUS_BADGE[c.status]}`}>{c.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--muted)' }}>{formatDate(c.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {c.status === 'active' ? (
                        <button onClick={() => updateCollege(c._id, { status: 'suspended' })} className="btn btn-danger btn-sm">Suspend</button>
                      ) : c.status === 'suspended' ? (
                        <button onClick={() => updateCollege(c._id, { status: 'active' })} className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>Restore</button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
