'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { BookOpen, Clock, ClipboardList, AlertTriangle, ChevronRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [activeBooks, setActiveBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/borrow?status=issued').then(r => r.json()),
    ]).then(([statsData, borrowData]) => {
      setStats(statsData.stats);
      setActiveBooks(borrowData.records?.slice(0, 4) || []);
      setLoading(false);
    });
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Borrowed Books', value: stats.borrowedBooks, icon: BookOpen, color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Due Soon (3 days)', value: stats.dueSoon, icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: ClipboardList, color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Pending Fine', value: `₹${stats.pendingFine || 0}`, icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  ] : [];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="My Dashboard" subtitle="Welcome back! Here's your library overview." />

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Active Books */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Current Books</h2>
            <Link href="/student/my-books" style={{ fontSize: 13, color: 'var(--brand)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>

          {activeBooks.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <BookOpen size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
              <p style={{ fontSize: 13 }}>No books currently borrowed</p>
              <Link href="/student/search" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Browse Books</Link>
            </div>
          ) : activeBooks.map((record) => {
            const now = new Date();
            const due = new Date(record.dueDate);
            const isOverdue = due < now;
            const isDueSoon = !isOverdue && due - now < 3 * 24 * 60 * 60 * 1000;

            return (
              <div key={record._id} style={{
                display: 'flex', gap: 12, padding: '12px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                {/* Cover */}
                <div style={{
                  width: 44, height: 60, borderRadius: 6, flexShrink: 0, overflow: 'hidden',
                  background: 'linear-gradient(135deg, var(--brand), #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {record.bookId?.cover
                    ? <img src={record.bookId.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <BookOpen size={20} color="rgba(255,255,255,0.5)" />
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{record.bookId?.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{record.bookId?.author}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <Calendar size={11} color="var(--muted)" />
                    <span style={{ fontSize: 11, color: isOverdue ? '#EF4444' : isDueSoon ? '#F59E0B' : 'var(--muted)' }}>
                      Due: {formatDate(record.dueDate)} {isOverdue ? '⚠ Overdue' : isDueSoon ? '· Due soon' : ''}
                    </span>
                  </div>
                </div>
                <span className={`badge ${isOverdue ? 'badge-danger' : isDueSoon ? 'badge-warning' : 'badge-success'}`} style={{ alignSelf: 'flex-start', marginTop: 2 }}>
                  {isOverdue ? 'Overdue' : 'Issued'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Search & Request Books', href: '/student/search', color: '#6366F1', emoji: '🔍' },
                { label: 'View My Requests', href: '/student/requests', color: '#22C55E', emoji: '📋' },
                { label: 'Check Reservations', href: '/student/reservations', color: '#F59E0B', emoji: '🔖' },
                { label: 'Notifications', href: '/student/notifications', color: '#8B5CF6', emoji: '🔔' },
              ].map((a) => (
                <Link key={a.href} href={a.href} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 8, textDecoration: 'none',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = a.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span style={{ fontSize: 18 }}>{a.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{a.label}</span>
                  <ChevronRight size={14} color="var(--muted)" style={{ marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Fine Alert */}
          {stats?.pendingFine > 0 && (
            <div style={{
              padding: '16px 20px', borderRadius: 12,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertTriangle size={18} color="#EF4444" style={{ marginTop: 1, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#EF4444', marginBottom: 4 }}>
                    Outstanding Fine: ₹{stats.pendingFine}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    Please clear this fine at the library counter.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
