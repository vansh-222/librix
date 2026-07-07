'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BookOpen, Clock, AlertTriangle, Loader2, Star, BookMarked, Bell, Search } from 'lucide-react';
import Link from 'next/link';

function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1)  return 'just now';
  if (hrs < 24) return `${hrs}h ago`;
  return Math.floor(hrs / 24) + 'd ago';
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysUntil(d) {
  const diff = new Date(d) - new Date();
  return Math.ceil(diff / 86400000);
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats]               = useState(null);
  const [activeBooks, setActiveBooks]   = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    // Keep loading while session is being fetched
    if (status === 'loading') return;
    // Session resolved but no user — layout would have redirected; safety guard
    if (!session?.user?.id) { setLoading(false); return; }

    Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/borrow').then(r => r.json()),
      fetch('/api/notifications?limit=5').then(r => r.json()),
    ]).then(([statsData, borrowData, notifData]) => {
      setStats(statsData);
      setActiveBooks((borrowData.records || []).filter(r => ['issued','return_pending'].includes(r.status)).slice(0, 4));
      setNotifications((notifData.notifications || []).slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [session?.user?.id, status]);

  const STAT_CARDS = [
    { icon: BookOpen,       label: 'Books Borrowed',   value: stats?.activeBorrows ?? '—', bg: '#EEF2FF', color: '#6366F1', sub: 'Currently active' },
    { icon: Clock,          label: 'Overdue',           value: stats?.overdueBorrows ?? '—', bg: '#FEF2F2', color: '#EF4444', sub: 'Past due date' },
    { icon: BookMarked,     label: 'Books Completed',  value: stats?.completedBooks ?? '—', bg: '#F0FDF4', color: '#22C55E', sub: 'Returned books' },
    { icon: AlertTriangle,  label: 'Outstanding Fine', value: stats?.pendingFineTotal !== undefined ? `₹${stats.pendingFineTotal}` : '—', bg: '#FFFBEB', color: '#F59E0B', sub: 'Total pending' },
  ];

  const QUICK_LINKS = [
    { href: '/student/search',        icon: Search,     label: 'Search Books'    },
    { href: '/student/requests',      icon: BookMarked, label: 'My Requests'     },
    { href: '/student/fines',         icon: AlertTriangle, label: 'Fines'        },
    { href: '/student/notifications', icon: Bell,       label: 'Notifications'   },
  ];

  const name = session?.user?.name?.split(' ')[0] || 'Student';

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ padding: '28px', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', minHeight: '100%' }}>
      {loading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99 }}>
          <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: '#6366F1' }} />
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {STAT_CARDS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Active Books */}
        <div>
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '20px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Currently Borrowed</h2>
              <Link href="/student/my-books" style={{ fontSize: 13, color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
            </div>
            {activeBooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <BookOpen size={36} style={{ margin: '0 auto 10px', color: '#D1D5DB' }} />
                <p style={{ color: '#9CA3AF', fontSize: 14, margin: 0 }}>No active borrows. <Link href="/student/search" style={{ color: '#6366F1', textDecoration: 'none' }}>Search books</Link></p>
              </div>
            ) : activeBooks.map(rec => {
              const days = daysUntil(rec.dueDate);
              return (
                <div key={rec._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ width: 40, height: 54, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
                    {rec.bookId?.cover
                      ? <img src={rec.bookId.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#6366F1,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={14} color="white" /></div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.bookId?.title}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>Due: {fmtDate(rec.dueDate)}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: days < 0 ? '#FEF2F2' : days <= 3 ? '#FFFBEB' : '#F0FDF4',
                    color: days < 0 ? '#EF4444' : days <= 3 ? '#F59E0B' : '#22C55E',
                    border: `1px solid ${days < 0 ? '#FECACA' : days <= 3 ? '#FDE68A' : '#BBF7D0'}`,
                    flexShrink: 0 }}>
                    {days < 0 ? `${Math.abs(days)}d Overdue` : `${days}d left`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Links */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '20px 24px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {QUICK_LINKS.map(ql => {
                const Icon = ql.icon;
                return (
                  <Link key={ql.href} href={ql.href}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 10px', borderRadius: 10, background: '#F9FAFB', border: '1px solid #E5E7EB', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.borderColor = '#C7D2FE'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={18} color="#6366F1" />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', textAlign: 'center' }}>{ql.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div>
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '20px 20px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Notifications</h2>
              <Link href="/student/notifications" style={{ fontSize: 13, color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>See All →</Link>
            </div>
            {notifications.length === 0 ? (
              <p style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>No notifications yet.</p>
            ) : notifications.map(n => (
              <div key={n._id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #F3F4F6', alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? '#E5E7EB' : '#6366F1', marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>{timeAgo(n.createdAt)}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.message}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Overdue Alert */}
          {stats?.overdueBorrows > 0 && (
            <div style={{ background: '#FEF2F2', borderRadius: 12, border: '1px solid #FECACA', padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <AlertTriangle size={18} color="#EF4444" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#DC2626' }}>Overdue Alert!</span>
              </div>
              <p style={{ fontSize: 13, color: '#B91C1C', margin: '0 0 10px', lineHeight: 1.5 }}>
                You have {stats.overdueBorrows} overdue book{stats.overdueBorrows > 1 ? 's' : ''}. Late fines are accruing daily.
              </p>
              <Link href="/student/my-books" style={{ display: 'inline-block', padding: '7px 16px', borderRadius: 8, background: '#EF4444', color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                View Overdue Books
              </Link>
            </div>
          )}

          {/* Fine Alert */}
          {stats?.pendingFineTotal > 0 && (
            <div style={{ background: '#FFFBEB', borderRadius: 12, border: '1px solid #FDE68A', padding: 16, marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#D97706', marginBottom: 8 }}>⚠️ Outstanding Fine</div>
              <p style={{ fontSize: 13, color: '#92400E', margin: '0 0 10px' }}>You have ₹{stats.pendingFineTotal} in outstanding fines.</p>
              <Link href="/student/fines" style={{ display: 'inline-block', padding: '7px 16px', borderRadius: 8, background: '#F59E0B', color: 'white', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Pay Fine →
              </Link>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
