'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { BookOpen, Package, Users, AlertTriangle, ClipboardList, RotateCcw, ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function LibrarianDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [returnPending, setReturnPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/requests?status=requested').then(r => r.json()),
      fetch('/api/borrow?status=return_pending').then(r => r.json()),
    ]).then(([statsData, reqData, returnData]) => {
      setStats(statsData.stats);
      setPendingRequests(reqData.requests?.slice(0, 5) || []);
      setReturnPending(returnData.records?.slice(0, 5) || []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const STAT_CARDS = stats ? [
    { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: '#6366F1', bg: 'rgba(99,102,241,0.1)', href: '/librarian/books' },
    { label: 'Available', value: stats.availableBooks, icon: Package, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', href: '/librarian/inventory' },
    { label: 'Issued', value: stats.issuedBooks, icon: TrendingUp, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', href: '/librarian/returns' },
    { label: 'Overdue', value: stats.overdueBooks, icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', href: '/librarian/returns' },
    { label: 'Students', value: stats.totalStudents, icon: Users, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', href: '/librarian/members' },
    { label: 'Teachers', value: stats.totalTeachers, icon: Users, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', href: '/librarian/members' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: ClipboardList, color: '#F97316', bg: 'rgba(249,115,22,0.1)', href: '/librarian/requests' },
    { label: 'Pending Fines', value: `₹${stats.pendingFines || 0}`, icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', href: '/librarian/reports' },
  ] : [];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="Librarian Dashboard" subtitle="Manage your college library" />

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {STAT_CARDS.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div className="stat-card" style={{ cursor: 'pointer' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div className="stat-value" style={{ fontSize: 24, color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Pending Requests */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClipboardList size={17} color="var(--brand)" /> Pending Requests
              {stats?.pendingRequests > 0 && <span style={{ background: '#EF4444', color: '#fff', fontSize: 11, padding: '1px 7px', borderRadius: 10 }}>{stats.pendingRequests}</span>}
            </h2>
            <Link href="/librarian/requests" style={{ fontSize: 12, color: 'var(--brand)', textDecoration: 'none' }}>View all <ChevronRight size={13} style={{ display: 'inline' }} /></Link>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p style={{ fontSize: 13 }}>No pending requests 🎉</p>
            </div>
          ) : pendingRequests.map((req) => (
            <div key={req._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="avatar">{(req.userId?.name || 'U').charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{req.userId?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{req.bookId?.title}</div>
              </div>
              <span className="badge badge-warning">Pending</span>
            </div>
          ))}
        </div>

        {/* Return Pending */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RotateCcw size={17} color="#22C55E" /> Returns Pending
            </h2>
            <Link href="/librarian/returns" style={{ fontSize: 12, color: 'var(--brand)', textDecoration: 'none' }}>View all <ChevronRight size={13} style={{ display: 'inline' }} /></Link>
          </div>

          {returnPending.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p style={{ fontSize: 13 }}>No returns pending</p>
            </div>
          ) : returnPending.map((rec) => (
            <div key={rec._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div className="avatar" style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}>{(rec.userId?.name || 'U').charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{rec.userId?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{rec.bookId?.title}</div>
              </div>
              <span className="badge badge-brand">Returning</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}
