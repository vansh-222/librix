'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight, ClipboardList,
  CreditCard, BarChart2, Bell, Settings, ChevronRight, ChevronDown,
  Search, Clock, Plus, UserPlus, RotateCcw, FileText,
} from 'lucide-react';

/* ─── NAV ─────────────────────────────── */
const NAV = [
  { href: '/librarian/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/librarian/books',     icon: BookOpen,        label: 'Books Management', chevron: true },
  { href: '/librarian/members',   icon: Users,           label: 'Members' },
  { href: '/librarian/returns',   icon: ArrowLeftRight,  label: 'Issue / Return' },
  { href: '/librarian/requests',  icon: ClipboardList,   label: 'Requests' },
  { href: '/librarian/fines',     icon: CreditCard,      label: 'Fines & Payments' },
  { href: '/librarian/reports',   icon: BarChart2,       label: 'Reports' },
  { href: '/librarian/notifications', icon: Bell,        label: 'Notifications' },
  { href: '/librarian/settings',  icon: Settings,        label: 'Settings' },
];

/* ─── CHART DATA ──────────────────────── */
const CHART_DATA = [
  { day: 'May 10', issued: 45, returned: 28 },
  { day: 'May 11', issued: 62, returned: 45 },
  { day: 'May 12', issued: 53, returned: 38 },
  { day: 'May 13', issued: 70, returned: 50 },
  { day: 'May 14', issued: 58, returned: 42 },
  { day: 'May 15', issued: 75, returned: 35 },
  { day: 'May 16', issued: 65, returned: 30 },
];

function LineChart() {
  const W = 680, H = 220, PAD = { t: 10, b: 30, l: 30, r: 10 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const maxV = 90;
  const xs = CHART_DATA.map((_, i) => PAD.l + (i / (CHART_DATA.length - 1)) * cW);
  const yOf = v => PAD.t + cH - (v / maxV) * cH;
  const path = (key) => CHART_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${xs[i]},${yOf(d[key])}`).join(' ');
  const yLines = [0, 20, 40, 60, 80];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
      {yLines.map(v => (
        <g key={v}>
          <line x1={PAD.l} y1={yOf(v)} x2={W - PAD.r} y2={yOf(v)} stroke="#F3F4F6" strokeWidth="1" />
          <text x={PAD.l - 6} y={yOf(v) + 4} fontSize="11" fill="#9CA3AF" textAnchor="end">{v}</text>
        </g>
      ))}
      {CHART_DATA.map((d, i) => (
        <text key={i} x={xs[i]} y={H - 4} fontSize="11" fill="#9CA3AF" textAnchor="middle">{d.day}</text>
      ))}
      <path d={path('issued')} fill="none" stroke="#9333EA" strokeWidth="2" strokeLinejoin="round" />
      <path d={path('returned')} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinejoin="round" />
      {CHART_DATA.map((d, i) => (
        <g key={i}>
          <circle cx={xs[i]} cy={yOf(d.issued)} r="4" fill="#9333EA" />
          <circle cx={xs[i]} cy={yOf(d.returned)} r="4" fill="#22C55E" />
        </g>
      ))}
    </svg>
  );
}

/* ─── OVERDUE DATA ────────────────────── */
const OVERDUE = [
  { title: 'Clean Code', author: 'Robert C. Martin', member: 'Vikram Patel', due: 'May 14, 2026', days: 2 },
  { title: 'The Power of Habit', author: 'Charles Duhigg', member: 'Sneha Iyer', due: 'May 12, 2026', days: 4 },
  { title: 'The Power of Habit', author: 'Charles Duhigg', member: 'Sneha Iyer', due: 'May 12, 2026', days: 4 },
  { title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', member: 'Aman Sharma', due: 'May 10, 2026', days: 6 },
  { title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', member: 'Aman Sharma', due: 'May 10, 2026', days: 6 },
];

const ACTIVITIES = [
  { bg: '#FFEDD5', color: '#EA580C', title: 'Deep Work', sub: 'issued to Rahul Verma', time: '10:30 AM' },
  { bg: '#DCFCE7', color: '#16A34A', title: 'Atomic Habits', sub: 'returned by Priya Singh', time: '09:15 AM' },
  { bg: '#DBEAFE', color: '#2563EB', title: 'New member Arjun Mehta', sub: 'registered', time: 'Yesterday' },
  { bg: '#FFEDD5', color: '#EA580C', title: 'The 5 AM Club', sub: 'issue request by Neha Gupta', time: 'Yesterday' },
  { bg: '#FEE2E2', color: '#DC2626', title: 'Fine of ₹50 collected', sub: 'from Vikram Patel', time: 'May 15, 2026' },
];

const NOTIFS = [
  { bg: '#FEE2E2', color: '#DC2626', text: '"Clean Code" is overdue by 2 days.', time: '10:30 AM' },
  { bg: '#FEF9C3', color: '#CA8A04', text: '"The 5 AM Club" issue request by Neha Gupta.', time: '09:45 AM' },
  { bg: '#DCFCE7', color: '#16A34A', text: 'New member registration by Arjun Mehta.', time: 'Yesterday' },
];

const QUICK = [
  { icon: <Plus size={16} color="#2563EB" />, label: 'Add New Book' },
  { icon: <UserPlus size={16} color="#9333EA" />, label: 'Add New Member' },
  { icon: <ArrowLeftRight size={16} color="#2563EB" />, label: 'Issue Book' },
  { icon: <RotateCcw size={16} color="#2563EB" />, label: 'Return Book' },
  { icon: <FileText size={16} color="#4B5563" />, label: 'View All Requests' },
  { icon: <BarChart2 size={16} color="#4B5563" />, label: 'Generate Reports' },
];

/* ─── STAT CARDS ──────────────────────── */
const STATS = [
  { icon: <BookOpen size={20} color="#9333EA" />, iconBg: '#F3E8FF', value: '2,456', label: 'Total Books' },
  { icon: <Users size={20} color="#16A34A" />, iconBg: '#DCFCE7', value: '342', label: 'Total Members' },
  { icon: <ArrowLeftRight size={20} color="#CA8A04" />, iconBg: '#FEF9C3', value: '58', label: 'Books Issued' },
  { icon: <ClipboardList size={20} color="#DC2626" />, iconBg: '#FEE2E2', value: '12', label: 'Overdue Books' },
];

export default function LibrarianDashboard() {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F8F9FA', fontFamily: 'Inter,sans-serif', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
        .qa-row:hover { background: #F9FAFB; border-radius: 8px; }
        .nav-item:hover { background: #F9FAFB; border-radius: 8px; }
        .send-btn:hover { background: #F3E8FF; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 220, background: 'white', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: '#9333EA', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>LibraSys</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Library Management</div>
            </div>
          </div>
        </div>

        {/* User */}
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ background: '#F9FAFB', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Anita Sharma</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Librarian</div>
            </div>
            <ChevronDown size={14} color="#9CA3AF" />
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
                <div className={active ? '' : 'nav-item'} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', borderRadius: 8,
                  background: active ? '#9333EA' : 'transparent', cursor: 'pointer',
                }}>
                  <item.icon size={18} color={active ? 'white' : '#374151'} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: active ? 'white' : '#374151' }}>{item.label}</span>
                  {item.chevron && <ChevronRight size={14} color={active ? 'white' : '#374151'} />}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help box */}
        <div style={{ padding: 24 }}>
          <div style={{ background: '#FAF5FF', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 64, height: 64, borderRadius: 8, background: '#E9D5FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={32} color="#9333EA" />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', paddingTop: 8 }}>Need Help?</div>
            <div style={{ fontSize: 12, color: '#4B5563', textAlign: 'center', paddingBottom: 8 }}>If you need any assistance,<br />we're here to help you.</div>
            <button style={{ alignSelf: 'stretch', padding: '8px 16px', borderRadius: 8, border: '2px solid #9333EA', background: 'transparent', color: '#9333EA', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Contact Support</button>
          </div>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>Dashboard</div>
            <div style={{ fontSize: 14, color: '#6B7280' }}>Welcome back, Anita Sharma!</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Search */}
            <div style={{ position: 'relative', width: 320 }}>
              <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input placeholder="Search books, members, ISBN..." style={{ width: '100%', padding: '9px 16px 9px 40px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', fontFamily: 'Inter' }} />
            </div>
            {/* Bell */}
            <div style={{ position: 'relative' }}>
              <Bell size={22} color="#4B5563" />
              <div style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white' }}>3</div>
            </div>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>A</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Anita Sharma</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Librarian</div>
              </div>
              <ChevronDown size={14} color="#9CA3AF" />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {/* ── LEFT COLUMN ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
                {STATS.map((s, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: 48, height: 48, background: s.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginTop: 12 }}>{s.value}</div>
                    <div style={{ fontSize: 14, color: '#4B5563', marginTop: 4 }}>{s.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#9333EA', cursor: 'pointer' }}>View all</span>
                      <ChevronRight size={14} color="#9333EA" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Issue / Return Overview</div>
                  <div style={{ padding: '8px 20px', background: '#EFEFEF', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#4B5563' }}>Last 7 Days</div>
                </div>
                <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
                  {[['#9333EA', 'Issued'], ['#22C55E', 'Returned']].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                      <span style={{ fontSize: 14, color: '#4B5563' }}>{l}</span>
                    </div>
                  ))}
                </div>
                <LineChart />
              </div>

              {/* Overdue table */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Overdue Books</div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#9333EA', cursor: 'pointer' }}>View All</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                      {['Book Title', 'Member Name', 'Due Date', 'Overdue Days', 'Action'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#4B5563', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {OVERDUE.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 40, height: 56, background: '#E5E7EB', borderRadius: 4, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{row.title}</div>
                              <div style={{ fontSize: 12, color: '#6B7280' }}>{row.author}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 14, color: '#111827' }}>{row.member}</td>
                        <td style={{ padding: '12px 16px', fontSize: 14, color: '#DC2626' }}>{row.due}</td>
                        <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#DC2626' }}>{row.days} days</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button className="send-btn" style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #9333EA', background: 'transparent', color: '#9333EA', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Send Reminder</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Recent Activities */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Recent Activities</div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#9333EA', cursor: 'pointer' }}>View All</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {ACTIVITIES.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: a.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={18} color={a.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: '#4B5563' }}>{a.sub}</div>
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', flexShrink: 0 }}>{a.time}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Quick Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {QUICK.map((q, i) => (
                    <div key={i} className="qa-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}>
                      {q.icon}
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{q.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Notifications</div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#9333EA', cursor: 'pointer' }}>View All</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {NOTIFS.map((n, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: n.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Bell size={18} color={n.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, color: '#111827', lineHeight: '20px' }}>{n.text}</div>
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', flexShrink: 0 }}>{n.time}</div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#9333EA', cursor: 'pointer' }}>View all notifications</span>
                </div>
              </div>

              {/* Library Timings */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Clock size={18} color="#9333EA" />
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Library Timings</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: '#4B5563' }}>Monday - Saturday</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>9:00 AM - 7:00 PM</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: '#4B5563' }}>Sunday</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Closed</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#9333EA', marginTop: 12 }}>Open on public holidays (10:00 AM - 4:00 PM)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
