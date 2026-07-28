'use client';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import { ChevronRight, Plus, UserPlus, RotateCcw, FileText, BarChart2, BookOpen, Users, ArrowLeftRight, ClipboardList, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ─── CHART ──────────────────────── */
function LineChart({ data }) {
  if (!data || data.length === 0) return null;
  const W = 680, H = 220, PAD = { t: 10, b: 30, l: 30, r: 10 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const maxV = Math.max(10, ...data.map(d => Math.max(d.issued, d.returned)));
  const xs = data.map((_, i) => PAD.l + (i / Math.max(data.length - 1, 1)) * cW);
  const yOf = v => PAD.t + cH - (v / maxV) * cH;
  const path = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xs[i]},${yOf(d[key])}`).join(' ');
  const yLines = [0, Math.round(maxV * 0.25), Math.round(maxV * 0.5), Math.round(maxV * 0.75), maxV];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {yLines.map(v => (
        <g key={v}>
          <line x1={PAD.l} y1={yOf(v)} x2={W - PAD.r} y2={yOf(v)} stroke="#F3F4F6" strokeWidth="1" />
          <text x={PAD.l - 6} y={yOf(v) + 4} fontSize="11" fill="#9CA3AF" textAnchor="end">{v}</text>
        </g>
      ))}
      {data.map((d, i) => (
        <text key={i} x={xs[i]} y={H - 4} fontSize="11" fill="#9CA3AF" textAnchor="middle">{d.day}</text>
      ))}
      {data.length > 1 && (
        <>
          <path d={path('issued')} fill="none" stroke="#1A73E8" strokeWidth="2" strokeLinejoin="round" />
          <path d={path('returned')} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinejoin="round" />
        </>
      )}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={xs[i]} cy={yOf(d.issued)} r="4" fill="#1A73E8" />
          {d.issued > 0 && <text x={xs[i]} y={yOf(d.issued) - 8} fontSize="11" fill="#1A73E8" fontWeight="600" textAnchor="middle">{d.issued}</text>}
          <circle cx={xs[i]} cy={yOf(d.returned)} r="4" fill="#22C55E" />
          {d.returned > 0 && <text x={xs[i]} y={d.returned === d.issued ? yOf(d.returned) + 16 : yOf(d.returned) - 8} fontSize="11" fill="#22C55E" fontWeight="600" textAnchor="middle">{d.returned}</text>}
        </g>
      ))}
    </svg>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function daysLate(due) {
  return Math.max(0, Math.ceil((new Date() - new Date(due)) / 86400000));
}
function timeAgo(d) {
  const diff = Date.now() - new Date(d).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'just now';
  if (hrs < 24) return `${hrs}h ago`;
  return Math.floor(hrs / 24) + 'd ago';
}

const QUICK = [
  { icon: <Plus size={16} color="#2563EB" />, label: 'Add New Book',       href: '/librarian/books'    },
  { icon: <UserPlus size={16} color="#1A73E8" />, label: 'Add New Member', href: '/librarian/members'  },
  { icon: <ArrowLeftRight size={16} color="#2563EB" />, label: 'Issue Book', href: '/librarian/requests' },
  { icon: <RotateCcw size={16} color="#2563EB" />, label: 'Return Book',   href: '/librarian/returns'  },
  { icon: <FileText size={16} color="#4B5563" />, label: 'View All Requests', href: '/librarian/requests' },
  { icon: <BarChart2 size={16} color="#4B5563" />, label: 'Generate Reports', href: '/librarian/reports' },
];

const RECENT_COLORS = ['#5B9BD5', '#7B68EE', '#DA70D6', '#CD853F'];

export default function LibrarianDashboard() {
  const [statsData, setStatsData] = useState({ totalBooks: '…', totalMembers: '…', activeBorrows: '…', overdueCount: '…' });
  const [notifRecs, setNotifRecs] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [requestRecs, setRequestRecs] = useState([]);

  useEffect(() => {
    fetch(`/api/stats?t=${Date.now()}`).then(r => r.json()).then(d => {
      setStatsData({
        totalBooks:    d.totalBooks    ?? '—',
        totalMembers:  d.totalMembers  ?? '—',
        activeBorrows: d.activeBorrows ?? '—',
        overdueCount:  d.overdueCount  ?? '—',
      });
    }).catch(() => {});

    // Build last-7-days chart data from real borrow records
    fetch(`/api/borrow?t=${Date.now()}`).then(r => r.json()).then(d => {
      const records = d.records || [];
      const days = Array.from({ length: 7 }, (_, i) => {
        const dt = new Date();
        dt.setDate(dt.getDate() - (6 - i));
        return dt;
      });
      const fmt = dt => dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const data = days.map(dt => {
        const dateStr = dt.toISOString().slice(0, 10);
        const issued   = records.filter(r => (r.issueDate || '').slice(0, 10) === dateStr).length;
        const returned = records.filter(r => r.returnDate && (r.returnDate || '').slice(0, 10) === dateStr).length;
        return { day: fmt(dt), issued, returned };
      });
      setChartData(data);
    }).catch(() => {});

    fetch('/api/books?limit=4').then(r => r.json()).then(d => {
      setRecentBooks(d.books || []);
    }).catch(() => {});

    fetch('/api/notifications?limit=3').then(r => r.json()).then(d => {
      setNotifRecs(d.notifications || []);
    }).catch(() => {});
  }, []);

  const STATS = [
    { icon: <BookOpen size={20} color="#1A73E8" />, iconBg: '#F3E8FF', value: statsData.totalBooks,    label: 'Total Books'    },
    { icon: <Users size={20} color="#16A34A" />,    iconBg: '#DCFCE7', value: statsData.totalMembers,  label: 'Total Members'  },
    { icon: <ArrowLeftRight size={20} color="#CA8A04" />, iconBg: '#FEF9C3', value: statsData.activeBorrows, label: 'Books Issued' },
    { icon: <ClipboardList size={20} color="#DC2626" />, iconBg: '#FEE2E2', value: statsData.overdueCount,  label: 'Overdue Books' },
  ];

  return (
    <LibrarianLayout
      title="Dashboard"
      subtitle="Welcome back!"
      searchPlaceholder="Search books, members, ISBN..."
    >
      <div style={{ padding: 28 }}>
        <div style={{
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
          minHeight: 'max-content',
          height: 'auto'
        }}>
            {/* ── LEFT COLUMN ── */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              minWidth: 0,

            }}>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
                {STATS.map((s, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 12, padding: 20, border: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 44, height: 44, background: s.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{s.label}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#1A73E8', cursor: 'pointer' }}>View all</span>
                      <ChevronRight size={13} color="#1A73E8" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart — real data */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Issue / Return Overview</div>
                  <div style={{ padding: '8px 20px', background: '#EFEFEF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#4B5563' }}>Last 7 Days</div>
                </div>
                <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                  {[['#1A73E8', 'Issued'], ['#22C55E', 'Returned']].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                      <span style={{ fontSize: 14, color: '#4B5563' }}>{l}</span>
                    </div>
                  ))}
                </div>
                {chartData.length === 0
                  ? <div style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>Loading chart…</div>
                  : <LineChart data={chartData} />}
              </div>

              {/* Recently Added Books panel */}
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 16px' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#383838' }}>Recently Added Books</div>
                  <Link href="/librarian/books" style={{ fontSize: 13, fontWeight: 500, color: '#1A73E8', cursor: 'pointer', textDecoration: 'none' }}>View All</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {recentBooks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '28px 0', color: '#9CA3AF', fontSize: 13 }}>No recently added books.</div>
                  ) : recentBooks.map((b, i) => (
                    <div key={b._id || i} style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 20px',
                      borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
                      background: 'white',
                    }}>
                      <div style={{
                        width: 42, height: 58, borderRadius: 4, flexShrink: 0,
                        background: RECENT_COLORS[i % RECENT_COLORS.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '1px 1px 4px rgba(0,0,0,0.15)',
                        position: 'relative', overflow: 'hidden',
                      }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, width: 5, height: '100%', background: 'rgba(0,0,0,0.15)' }} />
                        <BookOpen size={14} color="rgba(255,255,255,0.8)" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{b.title}</div>
                        <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.45, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                          <span style={{ fontWeight: 500 }}>{b.author}</span> • {b.category || 'General'}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0, marginTop: 2 }}>
                        {fmtDate(b.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Recent Activities */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Recent Activities</div>
                  <Link href="/librarian/notifications" style={{ fontSize: 14, fontWeight: 500, color: '#1A73E8', cursor: 'pointer', textDecoration: 'none' }}>View All</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {notifRecs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#9CA3AF', fontSize: 13 }}>No recent activity.</div>
                  ) : notifRecs.slice(0, 3).map((a, i) => (
                    <div key={a._id || i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: '#FFEDD5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={18} color="#EA580C" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{a.message}</div>
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', flexShrink: 0 }}>{timeAgo(a.createdAt)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {QUICK.map((q, i) => (
                    <Link key={i} href={q.href} className="qa-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer', textDecoration: 'none' }}>
                      {q.icon}
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{q.label}</span>
                    </Link>
                  ))}
                </div>
              </div>


              {/* Library Timings */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Clock size={18} color="#1A73E8" />
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Library Timings</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: '#4B5563' }}>Monday - Saturday</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>9:00 AM - 7:00 PM</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: '#4B5563' }}>Sunday</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Closed</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#1A73E8', marginTop: 12 }}>Open on public holidays (10:00 AM - 4:00 PM)</div>
              </div>
            </div>
          </div>
        </div>
    </LibrarianLayout>
  );
}
