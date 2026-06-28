'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Clock, Heart, Bell, ChevronLeft, ChevronRight, Calendar, Loader2, RotateCcw } from 'lucide-react';
import { formatDate, daysBetween } from '@/lib/utils';

// ─── Mock Data (replace with real API later) ─────────────────────────────────
const today = new Date();
const daysFromNow = (n) => new Date(today.getTime() + n * 24 * 60 * 60 * 1000).toISOString();
const daysAgo     = (n) => new Date(today.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

const MOCK_BORROWED = [
  {
    _id: 'm1',
    status: 'issued',
    issueDate: daysAgo(18),
    dueDate: daysFromNow(2),
    fine: 0,
    bookId: {
      title: 'Atomic Habits',
      author: 'James Clear',
      genre: 'Self Help',
      cover: 'https://covers.openlibrary.org/b/id/10519054-M.jpg',
    },
  },
  {
    _id: 'm2',
    status: 'issued',
    issueDate: daysAgo(15),
    dueDate: daysFromNow(5),
    fine: 0,
    bookId: {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Programming',
      cover: 'https://covers.openlibrary.org/b/id/8621101-M.jpg',
    },
  },
  {
    _id: 'm3',
    status: 'issued',
    issueDate: daysAgo(27),
    dueDate: daysAgo(1),
    fine: 50,
    bookId: {
      title: 'The 5 AM Club',
      author: 'Robin Sharma',
      genre: 'Self Help',
      cover: 'https://covers.openlibrary.org/b/id/10387070-M.jpg',
    },
  },
  {
    _id: 'm4',
    status: 'issued',
    issueDate: daysAgo(30),
    dueDate: daysAgo(8),
    fine: 80,
    bookId: {
      title: 'Deep Work',
      author: 'Cal Newport',
      genre: 'Productivity',
      cover: 'https://covers.openlibrary.org/b/id/8739161-M.jpg',
    },
  },
  {
    _id: 'm5',
    status: 'issued',
    issueDate: daysAgo(38),
    dueDate: daysAgo(18),
    fine: 180,
    bookId: {
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      genre: 'Finance',
      cover: 'https://covers.openlibrary.org/b/id/10789917-M.jpg',
    },
  },
  {
    _id: 'm6',
    status: 'issued',
    issueDate: daysAgo(10),
    dueDate: daysFromNow(18),
    fine: 0,
    bookId: {
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      genre: 'Self Help',
      cover: 'https://covers.openlibrary.org/b/id/8739164-M.jpg',
    },
  },
  {
    _id: 'm7',
    status: 'issued',
    issueDate: daysAgo(5),
    dueDate: daysFromNow(25),
    fine: 0,
    bookId: {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Fiction',
      cover: 'https://covers.openlibrary.org/b/id/8356442-M.jpg',
    },
  },
];

const MOCK_HISTORY = [
  {
    _id: 'h1',
    status: 'returned',
    issueDate: daysAgo(60),
    dueDate: daysAgo(46),
    fine: 0,
    bookId: {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      genre: 'History',
      cover: 'https://covers.openlibrary.org/b/id/8739150-M.jpg',
    },
  },
  {
    _id: 'h2',
    status: 'returned',
    issueDate: daysAgo(80),
    dueDate: daysAgo(66),
    fine: 0,
    bookId: {
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      genre: 'Finance',
      cover: 'https://covers.openlibrary.org/b/id/8228691-M.jpg',
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDueLabel(dueDate, status) {
  if (status === 'returned') return null;
  const days = daysBetween(dueDate);
  if (days > 0) return { text: 'Overdue',         color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' };
  if (days === 0) return { text: 'Due today',      color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' };
  const abs = Math.abs(days);
  if (abs <= 2) return { text: `Due in ${abs} days`, color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' };
  if (abs <= 5) return { text: `Due in ${abs} days`, color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' };
  return { text: `Due in ${abs} days`, color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE' };
}

const ITEMS_PER_PAGE = 5;

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ completed, reading, overdue }) {
  const total = completed + reading + overdue || 1;
  const r = 48, cx = 60, cy = 60;
  const C = 2 * Math.PI * r;
  const cDash = (completed / total) * C;
  const rDash = (reading   / total) * C;
  const oDash = (overdue   / total) * C;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6366F1" strokeWidth="10"
        strokeDasharray={`${cDash} ${C - cDash}`} strokeDashoffset={0} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22C55E" strokeWidth="10"
        strokeDasharray={`${rDash} ${C - rDash}`} strokeDashoffset={-cDash} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EF4444" strokeWidth="10"
        strokeDasharray={`${oDash} ${C - oDash}`} strokeDashoffset={-(cDash + rDash)} strokeLinecap="round" />
    </svg>
  );
}

// ─── Book Cover ───────────────────────────────────────────────────────────────
function BookCover({ cover, title, size = 'md' }) {
  const w = size === 'sm' ? 38 : 52;
  const h = size === 'sm' ? 52 : 70;
  const [err, setErr] = useState(false);

  return (
    <div style={{ width: w, height: h, borderRadius: 6, flexShrink: 0, overflow: 'hidden', background: '#F3F4F6' }}>
      {cover && !err ? (
        <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
          <BookOpen size={size === 'sm' ? 14 : 18} color="white" />
        </div>
      )}
    </div>
  );
}

// ─── Genre chip colors ────────────────────────────────────────────────────────
const GENRE_COLORS = {
  'Self Help':   { bg: '#EEF2FF', color: '#6366F1' },
  'Programming': { bg: '#ECFDF5', color: '#059669' },
  'Finance':     { bg: '#FFF7ED', color: '#D97706' },
  'Productivity':{ bg: '#FDF4FF', color: '#9333EA' },
  'History':     { bg: '#FFF1F2', color: '#E11D48' },
};
function GenreChip({ genre }) {
  if (!genre) return null;
  const c = GENRE_COLORS[genre] || { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.color, fontSize: 11, fontWeight: 600 }}>
      {genre}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyBooksPage() {
  const [tab, setTab]         = useState('borrowed');
  const [sortBy, setSortBy]   = useState('due_nearest');
  const [page, setPage]       = useState(1);
  const [actioning, setActioning] = useState(null);
  const [toast, setToast]     = useState('');
  const [borrowedRecords, setBorrowedRecords] = useState(MOCK_BORROWED);
  const [historyRecords, setHistoryRecords]   = useState(MOCK_HISTORY);

  // Merge API data on top of mock (API may return nothing if DB empty — mock stays)
  useEffect(() => {
    const qs = tab === 'history' ? '?status=returned' : '?status=issued';
    fetch(`/api/borrow${qs}`)
      .then(r => r.json())
      .then(data => {
        const apiRecords = data.records || [];
        if (apiRecords.length > 0) {
          if (tab === 'history') setHistoryRecords(apiRecords);
          else setBorrowedRecords(apiRecords);
        }
      })
      .catch(() => {});
    setPage(1);
  }, [tab]);

  const records = tab === 'history' ? historyRecords : borrowedRecords;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const doAction = async (recordId, action) => {
    // For mock records, just show toast
    if (recordId.startsWith('m') || recordId.startsWith('h')) {
      showToast('Action recorded (demo mode)');
      return;
    }
    setActioning(recordId);
    const res = await fetch('/api/borrow', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordId, action }),
    });
    const data = await res.json();
    setActioning(null);
    if (res.ok) showToast('Done!');
    else showToast(data.error || 'Action failed');
  };

  // Sort
  const sorted = [...records].sort((a, b) => {
    if (sortBy === 'due_nearest') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === 'due_farthest') return new Date(b.dueDate) - new Date(a.dueDate);
    if (sortBy === 'title') return (a.bookId?.title || '').localeCompare(b.bookId?.title || '');
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paged = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Right panel data
  const upcoming = [...borrowedRecords]
    .filter(r => r.status === 'issued')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const totalFine  = borrowedRecords.reduce((s, r) => s + (r.fine || 0), 0);
  const paidFine   = 0;
  const outstanding = totalFine - paidFine;

  const completedCount   = 12;
  const currentlyReading = borrowedRecords.filter(r => r.status === 'issued').length;
  const overdueCount     = borrowedRecords.filter(r => r.status === 'issued' && daysBetween(r.dueDate) > 0).length;
  const totalBooks       = completedCount + currentlyReading;

  const TABS = [
    { key: 'borrowed', label: 'Currently Borrowed', icon: BookOpen },
    { key: 'history',  label: 'Borrow History',     icon: Clock },
    { key: 'wishlist', label: 'Wishlist',            icon: Heart },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter, sans-serif', background: '#F9FAFB', overflow: 'hidden' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: '#6366F1', color: '#fff', padding: '10px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
        }}>{toast}</div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', minWidth: 0 }}>

        {/* Tab Bar */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', marginBottom: 24, overflow: 'hidden' }}>
          {TABS.map((t, i) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#6366F1' : '#6B7280',
                borderBottom: isActive ? '2px solid #6366F1' : '2px solid transparent',
                borderRight: i < TABS.length - 1 ? '1px solid #E5E7EB' : 'none',
                transition: 'all 0.2s',
              }}>
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Wishlist */}
        {tab === 'wishlist' ? (
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 60, textAlign: 'center' }}>
            <Heart size={40} style={{ margin: '0 auto 12px', color: '#D1D5DB' }} />
            <p style={{ color: '#9CA3AF', fontSize: 15 }}>Your wishlist is empty. Browse books to add them!</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                {tab === 'borrowed' ? 'Currently Borrowed Books' : 'Borrow History'} ({records.length})
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Sort by:</span>
                <div style={{ position: 'relative' }}>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    style={{
                      padding: '7px 32px 7px 12px', border: '1px solid #E5E7EB', borderRadius: 8,
                      fontSize: 13, color: '#111827', background: 'white', cursor: 'pointer',
                      outline: 'none', fontFamily: 'Inter', appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
                    }}
                  >
                    <option value="due_nearest">Due Date (Nearest)</option>
                    <option value="due_farthest">Due Date (Farthest)</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Book Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {paged.map(rec => {
                const dueInfo  = getDueLabel(rec.dueDate, rec.status);
                const isActing = actioning === rec._id;
                const isOver   = rec.status === 'issued' && daysBetween(rec.dueDate) > 0;

                return (
                  <div key={rec._id}
                    style={{
                      background: 'white', borderRadius: 12,
                      border: `1px solid ${isOver ? '#FECACA' : '#E5E7EB'}`,
                      padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16,
                      transition: 'box-shadow 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    {/* Cover */}
                    <BookCover cover={rec.bookId?.cover} title={rec.bookId?.title} size="md" />

                    {/* Title / Author / Genre */}
                    <div style={{ flex: '0 0 170px', minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {rec.bookId?.title || 'Unknown'}
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
                        {rec.bookId?.author || '—'}
                      </div>
                      <GenreChip genre={rec.bookId?.genre} />
                    </div>

                    {/* Issued On */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Issued On</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                        <Calendar size={13} color="#9CA3AF" />
                        {formatDate(rec.issueDate)}
                      </div>
                    </div>

                    {/* Due Date */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Due Date</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: isOver ? '#EF4444' : '#374151' }}>
                        <Calendar size={13} color={isOver ? '#EF4444' : '#9CA3AF'} />
                        {formatDate(rec.dueDate)}
                      </div>
                    </div>

                    {/* Badge + Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0, minWidth: 110 }}>
                      {dueInfo && (
                        <span style={{
                          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: dueInfo.bg, color: dueInfo.color, border: `1px solid ${dueInfo.border}`,
                        }}>{dueInfo.text}</span>
                      )}
                      {rec.status === 'returned' && (
                        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#F0FDF4', color: '#22C55E', border: '1px solid #BBF7D0' }}>
                          Returned
                        </span>
                      )}
                      <button
                        onClick={() => doAction(rec._id, 'mark_return')}
                        disabled={isActing}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '7px 14px', border: '1px solid #E5E7EB', borderRadius: 8,
                          background: 'white', fontSize: 13, fontWeight: 600, color: '#374151',
                          cursor: isActing ? 'not-allowed' : 'pointer', opacity: isActing ? 0.6 : 1,
                          transition: 'all 0.2s', fontFamily: 'Inter',
                        }}
                        onMouseEnter={e => { if (!isActing) { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; } }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}
                      >
                        {isActing ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 500, color: page === 1 ? '#D1D5DB' : '#374151', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  <ChevronLeft size={15} /> Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 34, height: 34, borderRadius: 8,
                    border: p === page ? 'none' : '1px solid #E5E7EB',
                    background: p === page ? '#6366F1' : 'white',
                    color: p === page ? 'white' : '#374151',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>{p}</button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 500, color: page === totalPages ? '#D1D5DB' : '#374151', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div style={{ width: 268, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Upcoming Returns */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Upcoming Returns</h3>
            <button style={{ fontSize: 12, color: '#6366F1', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>View Calendar</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {upcoming.map(rec => {
              const days = daysBetween(rec.dueDate);
              const abs  = Math.abs(days);
              const labelText  = days > 0 ? `Overdue by ${abs} day${abs !== 1 ? 's' : ''}` : days === 0 ? 'Due today' : `Due in ${abs} days`;
              const labelColor = days > 0 ? '#EF4444' : abs <= 2 ? '#EF4444' : abs <= 5 ? '#F59E0B' : '#6366F1';

              return (
                <div key={rec._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <BookCover cover={rec.bookId?.cover} title={rec.bookId?.title} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {rec.bookId?.title}
                    </div>
                    <div style={{ fontSize: 11, color: labelColor, fontWeight: 600 }}>{labelText}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{formatDate(rec.dueDate)}</div>
                  </div>
                  <button style={{ padding: 6, borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={13} color="#6B7280" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fine Summary */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Fine Summary</h3>
            <button style={{ fontSize: 12, color: '#6366F1', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>View Details</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
            {[
              { label: 'Total Fine',   value: `₹${totalFine}`,   color: '#EF4444' },
              { label: 'Paid',         value: `₹${paidFine}`,    color: '#22C55E' },
              { label: 'Outstanding',  value: `₹${outstanding}`, color: '#EF4444' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%', padding: 10, borderRadius: 8, border: 'none',
            background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter',
          }}>
            Pay Fine Now
          </button>
        </div>

        {/* Reading Statistics */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Reading Statistics</h3>
            <select style={{ fontSize: 11, color: '#6B7280', background: 'white', border: '1px solid #E5E7EB', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', outline: 'none' }}>
              <option>This Year</option>
              <option>This Month</option>
              <option>All Time</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 16 }}>
            <DonutChart completed={completedCount} reading={currentlyReading} overdue={overdueCount} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{totalBooks}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>Books</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { color: '#6366F1', label: 'Completed',         count: completedCount },
              { color: '#22C55E', label: 'Currently Reading', count: currentlyReading },
              { color: '#EF4444', label: 'Overdue',           count: overdueCount },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{item.count}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#6B7280' }}>Total Books Read</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{totalBooks}</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}
