'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight, ClipboardList,
  CreditCard, BarChart2, Bell, Settings, ChevronRight, ChevronDown,
  Search, Plus, Eye, Pencil, Trash2, Upload, BookMarked, MoreHorizontal,
} from 'lucide-react';

const NAV = [
  { href: '/librarian/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/librarian/books',     icon: BookOpen,        label: 'Books Management' },
  { href: '/librarian/members',   icon: Users,           label: 'Members' },
  { href: '/librarian/returns',   icon: ArrowLeftRight,  label: 'Issue / Return' },
  { href: '/librarian/requests',  icon: ClipboardList,   label: 'Requests' },
  { href: '/librarian/fines',     icon: CreditCard,      label: 'Fines & Payments' },
  { href: '/librarian/reports',   icon: BarChart2,       label: 'Reports' },
  { href: '/librarian/notifications', icon: Bell,        label: 'Notifications', badge: 6 },
  { href: '/librarian/settings',  icon: Settings,        label: 'Settings' },
];

const STATS = [
  { icon: <BookOpen size={22} color="#6C5CE7" />, iconBg: '#F3E8FF', value: '2,456', label: 'Total Books' },
  { icon: <span style={{fontSize:18}}>✓</span>, iconBg: '#DCFCE7', value: '1,856', label: 'Available Books' },
  { icon: <ArrowLeftRight size={22} color="#EA580C" />, iconBg: '#FFEDD5', value: '358', label: 'Issued Books' },
  { icon: <span style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:2,padding:2}}>{[0,1,2,3].map(i=><div key={i} style={{width:8,height:8,background:'#DC2626',borderRadius:1}}/>)}</span>, iconBg: '#FEE2E2', value: '24', label: 'Categories' },
];

const BOOKS = [
  { title: 'Atomic Habits',         isbn: '978-1847941831', author: 'James Clear',       cat: 'Self Help',    catBg: '#F3E8FF', catColor: '#9333EA', avail: 28, total: 30 },
  { title: 'The Power of Habit',    isbn: '978-0812981605', author: 'Charles Duhigg',    cat: 'Self Help',    catBg: '#F3E8FF', catColor: '#9333EA', avail: 15, total: 20 },
  { title: 'Deep Work',             isbn: '978-0349414114', author: 'Cal Newport',       cat: 'Productivity', catBg: '#DBEAFE', catColor: '#2563EB', avail: 10, total: 12 },
  { title: 'The 5 AM Club',         isbn: '978-1443456623', author: 'Robin Sharma',      cat: 'Motivation',   catBg: '#FFEDD5', catColor: '#EA580C', avail: 5,  total: 8  },
  { title: 'Rich Dad Poor Dad',     isbn: '978-1612680194', author: 'Robert T. Kiyosaki',cat: 'Finance',      catBg: '#DCFCE7', catColor: '#16A34A', avail: 12, total: 15 },
  { title: 'Clean Code',            isbn: '978-0132350884', author: 'Robert C. Martin',  cat: 'Programming',  catBg: '#FCE7F3', catColor: '#DB2777', avail: 7,  total: 10 },
  { title: 'Thinking, Fast and Slow',isbn:'978-0374275631', author: 'Daniel Kahneman',   cat: 'Psychology',   catBg: '#FFEDD5', catColor: '#EA580C', avail: 9,  total: 12 },
];

const RECENT = [
  { title: 'The Psychology of Money', author: 'Morgan Housel',  date: 'May 16, 2026' },
  { title: 'Ikigai',                  author: 'Héctor García',  date: 'May 15, 2026' },
  { title: 'Principles',             author: 'Ray Dalio',       date: 'May 14, 2026' },
  { title: 'Zero to One',            author: 'Peter Thiel',     date: 'May 13, 2026' },
];

const CATS = [
  { icon: <BookOpen size={16} color="#9333EA" />, label: 'Self Help',    count: 568 },
  { icon: <BarChart2 size={16} color="#2563EB" />, label: 'Programming', count: 423 },
  { icon: <CreditCard size={16} color="#16A34A" />, label: 'Finance',    count: 312 },
  { icon: <Bell size={16} color="#DB2777" />,       label: 'Motivation', count: 298 },
  { icon: <BookMarked size={16} color="#EA580C" />, label: 'Psychology', count: 245 },
  { icon: <MoreHorizontal size={16} color="#4B5563" />, label: 'Others', count: 610 },
];

const S = {
  sel: { padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter' },
  th: { padding: '14px 16px', fontSize: 12, fontWeight: 600, color: '#4B5563', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.05em', background: '#F9FAFB' },
  td: { padding: '0 16px', fontSize: 14, color: '#374151', verticalAlign: 'middle' },
};

export default function BooksManagement() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'white', fontFamily: 'Inter,sans-serif', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
        .nav-hover:hover { background: #F9FAFB; border-radius: 8px; }
        .act-btn:hover { background: #F3F4F6; border-radius: 6px; }
        .qa-row:hover { background: #F9FAFB; border-radius: 8px; }
        .tr-hover:hover { background: #F9FAFB; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{ width: 220, background: 'white', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* User card */}
        <div style={{ padding: 16, borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: '20px' }}>Anita Sharma</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>Librarian</div>
            </div>
            <ChevronDown size={14} color="#9CA3AF" />
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8, paddingBottom: 8 }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div className={active ? '' : 'nav-hover'} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px', background: active ? '#6C5CE7' : 'transparent', cursor: 'pointer' }}>
                  <item.icon size={18} color={active ? 'white' : '#374151'} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: active ? 'white' : '#374151', lineHeight: '20px' }}>{item.label}</span>
                  {item.badge && <div style={{ width: 20, height: 20, background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>{item.badge}</div>}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help box */}
        <div style={{ padding: 12 }}>
          <div style={{ background: '#FAF5FF', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 70, height: 44, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 28, height: 36, background: '#E9D5FF', position: 'absolute', left: 16 }} />
              <div style={{ width: 28, height: 36, background: '#C084FC', position: 'absolute', left: 26 }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Need Help?</div>
            <div style={{ fontSize: 11, color: '#4B5563', textAlign: 'center' }}>If you need assistance, we're here to help.</div>
            <button style={{ width: '100%', padding: '7px 12px', borderRadius: 8, border: '1px solid #6C5CE7', background: 'transparent', color: '#6C5CE7', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginTop: 4 }}>Contact Support</button>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {/* Topbar */}
        <div style={{ background: 'white', borderBottom: '1px solid #E5E7EB', padding: '0 32px', minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {/* LibraSys logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 40, background: '#6C5CE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>LibraSys</div>
                <div style={{ fontSize: 12, color: '#6C5CE7' }}>Library Management</div>
              </div>
            </div>
            {/* Page title */}
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Books Management</div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>Manage and organize all library books</div>
            </div>
          </div>
          {/* Right: search + bell + avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books by title, author, ISBN..." style={{ width: 320, padding: '9px 16px 9px 40px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', background: '#F9FAFB', fontFamily: 'Inter' }} />
            </div>
            <div style={{ position: 'relative' }}>
              <Bell size={22} color="#374151" />
              <div style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white' }}>8</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>A</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Anita Sharma</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Librarian</div>
              </div>
              <ChevronDown size={14} color="#9CA3AF" />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', minHeight: 0 }}>
          {/* Center column */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0, minHeight: 0 }}>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, background: s.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{s.value}</div>
                      <div style={{ fontSize: 14, color: '#6B7280' }}>{s.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View all</span>
                        <ChevronRight size={12} color="#6C5CE7" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 0', maxWidth: 320 }}>
                <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input placeholder="Search books..." style={{ width: '100%', padding: '9px 16px 9px 40px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', fontFamily: 'Inter' }} />
              </div>
              <select style={S.sel}><option>All Categories</option></select>
              <select style={S.sel}><option>All Authors</option></select>
              <select style={S.sel}><option>Availability</option></select>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 14, color: '#374151', cursor: 'pointer' }}>
                <span style={{ fontSize: 16, color: '#6C5CE7' }}>⚡</span> Filters
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: 'none', borderRadius: 8, background: '#6C5CE7', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                <Plus size={18} /> Add New Book
              </button>
            </div>

            {/* Books table */}
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Book Details', 'Author', 'Category', 'Available', 'Total Copies', 'Status', 'Action'].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BOOKS.map((b, i) => (
                    <tr key={i} className="tr-hover" style={{ borderBottom: '1px solid #F3F4F6', height: 90 }}>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
                          <div style={{ width: 56, height: 78, background: `hsl(${i * 47},60%,70%)`, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={20} color="white" />
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{b.title}</div>
                            <div style={{ fontSize: 12, color: '#6B7280' }}>ISBN: {b.isbn}</div>
                          </div>
                        </div>
                      </td>
                      <td style={S.td}>{b.author}</td>
                      <td style={S.td}>
                        <span style={{ padding: '3px 12px', background: b.catBg, color: b.catColor, borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>{b.cat}</span>
                      </td>
                      <td style={{ ...S.td, color: '#16A34A', fontWeight: 600 }}>{b.avail}</td>
                      <td style={S.td}>{b.total}</td>
                      <td style={S.td}>
                        <span style={{ padding: '3px 12px', background: '#DCFCE7', color: '#15803D', borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>Available</span>
                      </td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button className="act-btn" style={{ padding: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}><Eye size={18} color="#6C5CE7" /></button>
                          <button className="act-btn" style={{ padding: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}><Pencil size={18} color="#6C5CE7" /></button>
                          <button className="act-btn" style={{ padding: 8, border: 'none', background: 'transparent', cursor: 'pointer' }}><Trash2 size={18} color="#EF4444" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
                <span style={{ fontSize: 14, color: '#4B5563' }}>Showing 1 to 7 of 2,456 results</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {['‹', '1', '2', '3', '...', '351', '›'].map((p, i) => (
                    <button key={i} style={{ minWidth: 36, padding: '8px', border: 'none', borderRadius: 8, background: p === '1' ? '#6C5CE7' : 'transparent', color: p === '1' ? 'white' : p === '‹' || p === '›' ? '#9CA3AF' : '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{p}</button>
                  ))}
                </div>
                <select style={S.sel}><option>7 / page</option><option>14 / page</option></select>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ width: 287, background: '#F8F7FF', padding: 24, overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24, borderLeft: '1px solid #E5E7EB' }}>
            {/* Recently Added */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recently Added Books</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {RECENT.map((r, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 50, height: 75, background: `hsl(${i * 60 + 200},55%,65%)`, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={16} color="white" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>{r.author}</div>
                      <div style={{ fontSize: 12, color: '#9CA3AF' }}>{r.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Categories</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CATS.map((c, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{c.icon}<span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{c.label}</span></div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: <Plus size={18} color="white" />, label: 'Add New Book' },
                  { icon: <Upload size={18} color="white" />, label: 'Import Books' },
                ].map((q, i) => (
                  <div key={i} className="qa-row" style={{ background: 'white', borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <div style={{ width: 32, height: 32, background: '#6C5CE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{q.icon}</div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{q.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
