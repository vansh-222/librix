'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight, ClipboardList,
  CreditCard, BarChart2, Bell, Settings, ChevronRight, ChevronDown,
  Search, Plus, Eye, Pencil, Trash2, Upload, BookMarked, MoreHorizontal,
  CheckCircle, RefreshCw, LayoutGrid, SlidersHorizontal, Zap, X,
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
  { icon: <BookOpen size={22} color="#6C5CE7" />,    iconBg: '#EDE9FE', value: '2,456', label: 'Total Books' },
  { icon: <CheckCircle size={22} color="#16A34A" />, iconBg: '#DCFCE7', value: '1,856', label: 'Available Books' },
  { icon: <RefreshCw size={22} color="#EA580C" />,   iconBg: '#FFEDD5', value: '358',   label: 'Issued Books' },
  { icon: <LayoutGrid size={22} color="#DC2626" />,  iconBg: '#FEE2E2', value: '24',    label: 'Categories' },
];

// Book cover colors matching the target image more closely
const COVER_COLORS = [
  { bg: '#E05252', spine: '#C43A3A' },  // red - Atomic Habits
  { bg: '#5B8CDB', spine: '#3D6BBF' },  // blue - Power of Habit
  { bg: '#2B6CB0', spine: '#1A4F8A' },  // dark blue - Deep Work
  { bg: '#D4A017', spine: '#B8880F' },  // gold - 5 AM Club
  { bg: '#4CAF50', spine: '#388E3C' },  // green - Rich Dad Poor Dad
  { bg: '#9C27B0', spine: '#7B1FA2' },  // purple - Clean Code
  { bg: '#26C6DA', spine: '#00ACC1' },  // teal - Thinking Fast
];

const BOOKS = [
  { title: 'Atomic Habits',          isbn: '978-1847941831', author: 'James Clear',        cat: 'Self Help',    catBg: '#F3E8FF', catColor: '#9333EA', avail: 28, total: 30 },
  { title: 'The Power of Habit',     isbn: '978-0812981605', author: 'Charles Duhigg',     cat: 'Self Help',    catBg: '#F3E8FF', catColor: '#9333EA', avail: 15, total: 20 },
  { title: 'Deep Work',              isbn: '978-0349414114', author: 'Cal Newport',        cat: 'Productivity', catBg: '#DBEAFE', catColor: '#2563EB', avail: 10, total: 12 },
  { title: 'The 5 AM Club',          isbn: '978-1443456623', author: 'Robin Sharma',       cat: 'Motivation',   catBg: '#FFEDD5', catColor: '#EA580C', avail: 5,  total: 8  },
  { title: 'Rich Dad Poor Dad',      isbn: '978-1612680194', author: 'Robert T. Kiyosaki', cat: 'Finance',      catBg: '#DCFCE7', catColor: '#16A34A', avail: 12, total: 15 },
  { title: 'Clean Code',             isbn: '978-0132350884', author: 'Robert C. Martin',   cat: 'Programming',  catBg: '#FCE7F3', catColor: '#DB2777', avail: 7,  total: 10 },
  { title: 'Thinking, Fast and Slow',isbn: '978-0374275631', author: 'Daniel Kahneman',    cat: 'Psychology',   catBg: '#FFEDD5', catColor: '#EA580C', avail: 9,  total: 12 },
];

// Right panel recent books cover colors
const RECENT_COLORS = ['#5B9BD5', '#7B68EE', '#DA70D6', '#CD853F'];

const RECENT = [
  { title: 'The Psychology of Money', author: 'Morgan Housel',  date: 'May 16, 2026' },
  { title: 'Ikigai',                  author: 'Héctor García',  date: 'May 15, 2026' },
  { title: 'Principles',              author: 'Ray Dalio',      date: 'May 14, 2026' },
  { title: 'Zero to One',             author: 'Peter Thiel',    date: 'May 13, 2026' },
];

const CATS = [
  { icon: <BookOpen size={15} color="#9333EA" />,       bg: '#F3E8FF', label: 'Self Help',    count: 568 },
  { icon: <BarChart2 size={15} color="#2563EB" />,      bg: '#DBEAFE', label: 'Programming',  count: 423 },
  { icon: <CreditCard size={15} color="#16A34A" />,     bg: '#DCFCE7', label: 'Finance',      count: 312 },
  { icon: <Bell size={15} color="#DB2777" />,           bg: '#FCE7F3', label: 'Motivation',   count: 298 },
  { icon: <BookMarked size={15} color="#EA580C" />,     bg: '#FFEDD5', label: 'Psychology',   count: 245 },
  { icon: <MoreHorizontal size={15} color="#4B5563" />, bg: '#F3F4F6', label: 'Others',       count: 610 },
];

const selStyle = {
  padding: '8px 12px',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  fontSize: 13,
  color: '#374151',
  background: 'white',
  cursor: 'pointer',
  outline: 'none',
  fontFamily: 'Inter',
  appearance: 'none',
  paddingRight: 28,
};

const TH_STYLE = {
  padding: '12px 16px',
  fontSize: 11,
  fontWeight: 600,
  color: '#6B7280',
  textTransform: 'uppercase',
  textAlign: 'left',
  letterSpacing: '0.06em',
  background: '#F9FAFB',
  borderBottom: '1px solid #E5E7EB',
};

const TD_STYLE = {
  padding: '0 16px',
  fontSize: 13,
  color: '#374151',
  verticalAlign: 'middle',
};

// Book cover component — mimics the real book cover look from target image
function BookCover({ color, size = 'md' }) {
  const w = size === 'sm' ? 44 : 52;
  const h = size === 'sm' ? 62 : 72;
  return (
    <div style={{
      width: w, height: h, borderRadius: 4, flexShrink: 0, overflow: 'hidden', position: 'relative',
      boxShadow: '2px 2px 6px rgba(0,0,0,0.18)',
    }}>
      {/* Main cover */}
      <div style={{ width: '100%', height: '100%', background: color.bg, position: 'relative' }}>
        {/* Spine shadow on left */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', background: color.spine }} />
        {/* Subtle lines to simulate pages on right */}
        <div style={{ position: 'absolute', right: 0, top: 0, width: 3, height: '100%', background: 'rgba(255,255,255,0.15)' }} />
        {/* Small icon */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <BookOpen size={size === 'sm' ? 14 : 18} color="rgba(255,255,255,0.7)" />
        </div>
      </div>
    </div>
  );
}

// Minimal "Add New Book" modal so the button actually does something.
// Wire onSubmit up to your real create-book API call later.
function AddBookModal({ onClose }) {
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '', copies: '' });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call your API to create the book, then close + refresh the list.
    console.log('New book submitted:', form);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: 'white', borderRadius: 14, width: 420, maxWidth: '92vw', padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Add New Book</span>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', padding: 4 }}>
            <X size={18} color="#6B7280" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { key: 'title', label: 'Title', placeholder: 'e.g. Atomic Habits' },
            { key: 'author', label: 'Author', placeholder: 'e.g. James Clear' },
            { key: 'isbn', label: 'ISBN', placeholder: 'e.g. 978-1847941831' },
            { key: 'category', label: 'Category', placeholder: 'e.g. Self Help' },
            { key: 'copies', label: 'Total Copies', placeholder: 'e.g. 10' },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input
                value={form[f.key]}
                onChange={update(f.key)}
                placeholder={f.placeholder}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', fontFamily: 'Inter' }}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>
              Cancel
            </button>
            <button type="submit" style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: '#6C5CE7', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter' }}>
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BooksManagement() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const QUICK_ACTIONS = [
    { icon: <Plus size={15} color="white" />,   label: 'Add New Book', onClick: () => setShowAddModal(true) },
    { icon: <Upload size={15} color="white" />, label: 'Import Books', onClick: () => console.log('Import books clicked') },
  ];

  return (
    // FIX #1: minHeight: 0 on the outermost flex row.
    // Without this, flex children default to min-height:auto and will never
    // shrink below their content's natural size — they just grow the page.
    <div style={{ display: 'flex', height: '100vh', background: '#F9FAFB', fontFamily: 'Inter,sans-serif', overflow: 'hidden', minHeight: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { height: 100%; }
        /* Hide scrollbars but keep functionality */
        ::-webkit-scrollbar { width: 0px; height: 0px; }
        ::-webkit-scrollbar-thumb { background: transparent; }
        ::-webkit-scrollbar-track { background: transparent; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        .nav-link:hover { background: #F3F4F6 !important; }
        .act-btn:hover { background: #F3F4F6 !important; border-radius: 6px; }
        .tr-hover:hover td { background: #FAFAFA; }
        .qa-row:hover { background: #F3F4F6 !important; }
        .cat-row:hover { background: #F3F4F6 !important; }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; }
        input:focus { border-color: #6C5CE7 !important; box-shadow: 0 0 0 3px rgba(108,92,231,0.08); }
        .page-btn:hover { background: #F3F4F6 !important; }
        .btn-primary { transition: background 0.15s ease, transform 0.05s ease; }
        .btn-primary:hover { background: #5B4BD6 !important; }
        .btn-primary:active { transform: scale(0.97); }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 200,
        background: 'white',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, background: '#6C5CE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: '19px' }}>LibraSys</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', lineHeight: '14px' }}>Library Management</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8, paddingBottom: 8 }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block', padding: '2px 8px' }}>
                <div className={active ? '' : 'nav-link'} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  background: active ? '#6C5CE7' : 'transparent',
                  borderRadius: 8, cursor: 'pointer',
                }}>
                  <item.icon size={16} color={active ? 'white' : '#6B7280'} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'white' : '#374151', lineHeight: '18px' }}>{item.label}</span>
                  {item.badge && (
                    <div style={{ minWidth: 18, height: 18, background: active ? 'rgba(255,255,255,0.25)' : '#2563EB', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', padding: '0 4px' }}>
                      {item.badge}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help box */}
        <div style={{ padding: '12px 12px 16px' }}>
          <div style={{ background: '#FAF5FF', borderRadius: 12, padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, border: '1px solid #EDE9FE' }}>
            {/* Book stack illustration */}
            <div style={{ width: 72, height: 48, position: 'relative', marginBottom: 2 }}>
              <div style={{ width: 24, height: 38, background: '#C4B5FD', position: 'absolute', left: 10, bottom: 0, borderRadius: '2px 2px 0 0' }} />
              <div style={{ width: 24, height: 44, background: '#8B5CF6', position: 'absolute', left: 26, bottom: 0, borderRadius: '2px 2px 0 0' }} />
              <div style={{ width: 20, height: 32, background: '#DDD6FE', position: 'absolute', left: 44, bottom: 0, borderRadius: '2px 2px 0 0' }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Need Help?</div>
            <div style={{ fontSize: 10, color: '#6B7280', textAlign: 'center', lineHeight: '14px' }}>If you need assistance, we're here to help.</div>
            <button type="button" style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid #6C5CE7', background: 'transparent', color: '#6C5CE7', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginTop: 2 }}>
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      {/* FIX #2: minHeight: 0 — this column sits inside the 100vh flex row above.
          It's flex:1 and flexDirection:column, so it ALSO needs minHeight:0,
          otherwise it inherits the same "won't shrink below content" problem
          and passes it straight down to the content row and table below. */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, minHeight: 0 }}>

        {/* Topbar */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #E5E7EB',
          padding: '0 28px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 20,
        }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: '26px' }}>Books Management</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>Manage and organize all library books</div>
          </div>

          <div style={{ flex: 1, maxWidth: 380 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search books by title, author, ISBN..."
                style={{ width: '100%', padding: '9px 16px 9px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', background: '#F9FAFB', fontFamily: 'Inter' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="#374151" />
              <div style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>8</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Anita Sharma</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Librarian</div>
              </div>
              <ChevronDown size={13} color="#9CA3AF" />
            </div>
          </div>
        </div>

        {/* Content row */}
        {/* FIX #3: minHeight: 0 — same reasoning, one level deeper. This row is
            flex:1 inside the MAIN AREA column. */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* Center scrollable */}
          {/* FIX #4: minHeight: 0 on the actual scroll container itself.
              This is the div with overflowY:'auto' — it now has a real bounded
              height (because every ancestor above it can finally shrink), so
              when the table + cards exceed that height, THIS div scrolls
              instead of the whole page growing. */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 24px 32px', minWidth: 0, minHeight: 0 }}><div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 46, height: 46, background: s.iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View all</span>
                        <ChevronRight size={12} color="#6C5CE7" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter / toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative', minWidth: 160 }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  placeholder="Search books..."
                  style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', fontFamily: 'Inter', background: 'white' }}
                />
              </div>

              {/* Dropdowns with wrapper for chevron */}
              {['All Categories', 'All Authors', 'Availability'].map((label, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <select style={selStyle}>
                    <option>{label}</option>
                  </select>
                  <ChevronDown size={12} color="#6B7280" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              ))}

              {/* Filters button */}
              <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter' }}>
                <Zap size={14} color="#6C5CE7" />
                Filters
              </button>

              {/* Add New Book — now wired to open the modal */}
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowAddModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', borderRadius: 8, background: '#6C5CE7', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', marginLeft: 'auto' }}
              >
                Add New Book
              </button>
            </div>

            {/* Books table */}
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ ...TH_STYLE, width: '28%' }}>Book Details</th>
                    <th style={{ ...TH_STYLE, width: '16%' }}>Author</th>
                    <th style={{ ...TH_STYLE, width: '12%' }}>Category</th>
                    <th style={{ ...TH_STYLE, width: '9%', textAlign: 'center' }}>Available</th>
                    <th style={{ ...TH_STYLE, width: '10%', textAlign: 'center' }}>Total Copies</th>
                    <th style={{ ...TH_STYLE, width: '10%' }}>Status</th>
                    <th style={{ ...TH_STYLE, width: '15%', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {BOOKS.map((b, i) => (
                    <tr key={i} className="tr-hover" style={{ borderBottom: i < BOOKS.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                      <td style={{ ...TD_STYLE, padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <BookCover color={COVER_COLORS[i]} />
                          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>ISBN: {b.isbn}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...TD_STYLE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.author}</td>
                      <td style={TD_STYLE}>
                        <span style={{ padding: '3px 10px', background: b.catBg, color: b.catColor, borderRadius: 9999, fontSize: 11, fontWeight: 500, display: 'inline-block' }}>{b.cat}</span>
                      </td>
                      <td style={{ ...TD_STYLE, color: '#16A34A', fontWeight: 600, textAlign: 'center' }}>{b.avail}</td>
                      <td style={{ ...TD_STYLE, textAlign: 'center' }}>{b.total}</td>
                      <td style={TD_STYLE}>
                        <span style={{ padding: '3px 10px', background: '#DCFCE7', color: '#15803D', borderRadius: 9999, fontSize: 11, fontWeight: 500 }}>Available</span>
                      </td>
                      <td style={{ ...TD_STYLE, padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                          <button type="button" className="act-btn" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
                            <Eye size={16} color="#6C5CE7" />
                          </button>
                          <button type="button" className="act-btn" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
                            <Pencil size={16} color="#6C5CE7" />
                          </button>
                          <button type="button" className="act-btn" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
                            <Trash2 size={16} color="#EF4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Showing 1 to 7 of 2,456 results</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {['‹', '1', '2', '3', '...', '351', '›'].map((p, i) => (
                    <button key={i} type="button" className={p !== '1' ? 'page-btn' : ''} style={{
                      minWidth: 32, height: 32, padding: '0 8px',
                      border: p === '1' ? 'none' : '1px solid transparent',
                      borderRadius: 8,
                      background: p === '1' ? '#6C5CE7' : 'transparent',
                      color: p === '1' ? 'white' : (p === '‹' || p === '›' ? '#9CA3AF' : '#374151'),
                      fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter',
                    }}>{p}</button>
                  ))}
                </div>
                <div style={{ position: 'relative' }}>
                  <select style={{ ...selStyle, fontSize: 13 }}>
                    <option>7 / page</option>
                    <option>14 / page</option>
                    <option>25 / page</option>
                  </select>
                  <ChevronDown size={12} color="#6B7280" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{
            width: 280,
            background: 'white',
            borderLeft: '1px solid #E5E7EB',
            padding: '20px 16px',
            overflowY: 'auto',
            overflowX: 'hidden',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minHeight: 0,
          }}>

            {/* Recently Added */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Recently Added Books</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {RECENT.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < RECENT.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                    {/* Cover */}
                    <div style={{
                      width: 42, height: 58, borderRadius: 4, flexShrink: 0,
                      background: RECENT_COLORS[i],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '1px 1px 4px rgba(0,0,0,0.15)',
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, width: 5, height: '100%', background: 'rgba(0,0,0,0.15)' }} />
                      <BookOpen size={14} color="rgba(255,255,255,0.8)" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{r.author}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{r.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#F3F4F6' }} />

            {/* Categories */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Categories</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {CATS.map((c, i) => (
                  <div key={i} className="cat-row" style={{ borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {c.icon}
                      </div>
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 400 }}>{c.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#F3F4F6' }} />

            {/* Quick Actions */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {QUICK_ACTIONS.map((q, i) => (
                  <div
                    key={i}
                    className="qa-row"
                    onClick={q.onClick}
                    style={{ borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', border: '1px solid #F3F4F6' }}
                  >
                    <div style={{ width: 30, height: 30, background: '#6C5CE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {q.icon}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{q.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && <AddBookModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}