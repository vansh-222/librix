'use client';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import { ChevronRight, Plus, UserPlus, RotateCcw, FileText, BarChart2, BookOpen, Users, ArrowLeftRight, ClipboardList, Clock } from 'lucide-react';

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
      <path d={path('issued')} fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinejoin="round" />
      <path d={path('returned')} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinejoin="round" />
      {CHART_DATA.map((d, i) => (
        <g key={i}>
          <circle cx={xs[i]} cy={yOf(d.issued)} r="4" fill="#6C5CE7" />
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
  { icon: <UserPlus size={16} color="#6C5CE7" />, label: 'Add New Member' },
  { icon: <ArrowLeftRight size={16} color="#2563EB" />, label: 'Issue Book' },
  { icon: <RotateCcw size={16} color="#2563EB" />, label: 'Return Book' },
  { icon: <FileText size={16} color="#4B5563" />, label: 'View All Requests' },
  { icon: <BarChart2 size={16} color="#4B5563" />, label: 'Generate Reports' },
];

/* ─── STAT CARDS ──────────────────────── */
const STATS = [
  { icon: <BookOpen size={20} color="#6C5CE7" />, iconBg: '#F3E8FF', value: '2,456', label: 'Total Books' },
  { icon: <Users size={20} color="#16A34A" />, iconBg: '#DCFCE7', value: '342', label: 'Total Members' },
  { icon: <ArrowLeftRight size={20} color="#CA8A04" />, iconBg: '#FEF9C3', value: '58', label: 'Books Issued' },
  { icon: <ClipboardList size={20} color="#DC2626" />, iconBg: '#FEE2E2', value: '12', label: 'Overdue Books' },
];

export default function LibrarianDashboard() {
  return (
    <LibrarianLayout 
      title="Dashboard" 
      subtitle="Welcome back, Anita Sharma!"
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
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View all</span>
                      <ChevronRight size={13} color="#6C5CE7" />
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
                  {[['#6C5CE7', 'Issued'], ['#22C55E', 'Returned']].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                      <span style={{ fontSize: 14, color: '#4B5563' }}>{l}</span>
                    </div>
                  ))}
                </div>
                <LineChart />
              </div>

              {/* Overdue table */}
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 16px' }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#383838ff' }}>Overdue Books</div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                      {['Book Title', 'Member Name', 'Due Date', 'Overdue Days', 'Action'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {OVERDUE.map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: '14px 16px', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 52, background: `hsl(${i * 60 + 10},55%,65%)`, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <BookOpen size={16} color="white" />
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{row.title}</div>
                              <div style={{ fontSize: 12, color: '#6B7280' }}>{row.author}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6' }}>{row.member}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#DC2626', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6' }}>{row.due}</td>
                        <td style={{ padding: '14px 16px', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', background: '#FEE2E2', color: '#DC2626', borderRadius: 9999, fontSize: 12, fontWeight: 600 }}>
                            {row.days} days
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6' }}>
                          <button className="send-btn" style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #6C5CE7', background: 'transparent', color: '#6C5CE7', fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>Send Reminder</button>
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
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {ACTIVITIES.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: a.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen size={18} color={a.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{a.title}</div>
                        <div style={{ fontSize: 12, color: '#6B7280' }}>{a.sub}</div>
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
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{q.label}</span>
                    </div>
                  ))}
                </div>
              </div>


              {/* Library Timings */}
              <div style={{ background: 'white', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Clock size={18} color="#6C5CE7" />
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
                <div style={{ fontSize: 12, color: '#6C5CE7', marginTop: 12 }}>Open on public holidays (10:00 AM - 4:00 PM)</div>
              </div>
            </div>
          </div>
        </div>
    </LibrarianLayout>
  );
}
