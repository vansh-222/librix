'use client';
import { useState } from 'react';
import { BookOpen, Star, Clock, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_COMPLETED = [
  { id: 'h1', title: 'Clean Code',              author: 'Robert C. Martin', genre: 'Programming', issuedOn: '05 May 2026', returnedOn: '19 May 2026', rating: 5, cover: 'https://covers.openlibrary.org/b/id/8621101-M.jpg'   },
  { id: 'h2', title: 'Atomic Habits',            author: 'James Clear',      genre: 'Self Help',   issuedOn: '10 Apr 2026', returnedOn: '24 Apr 2026', rating: 4, cover: 'https://covers.openlibrary.org/b/id/10519054-M.jpg' },
  { id: 'h3', title: 'The 5 AM Club',            author: 'Robin Sharma',     genre: 'Self Help',   issuedOn: '01 Apr 2026', returnedOn: '15 Apr 2026', rating: 5, cover: 'https://covers.openlibrary.org/b/id/10387070-M.jpg' },
  { id: 'h4', title: 'Deep Work',                author: 'Cal Newport',      genre: 'Productivity',issuedOn: '28 Feb 2026', returnedOn: '12 Mar 2026', rating: 3, cover: 'https://covers.openlibrary.org/b/id/8739161-M.jpg'   },
  { id: 'h5', title: 'Thinking, Fast and Slow',  author: 'Daniel Kahneman', genre: 'Psychology',  issuedOn: '20 Feb 2026', returnedOn: '05 Mar 2026', rating: 4, cover: 'https://covers.openlibrary.org/b/id/7923867-M.jpg'  },
  { id: 'h6', title: 'Sapiens',                  author: 'Yuval Noah Harari',genre: 'History',     issuedOn: '10 Jan 2026', returnedOn: '28 Jan 2026', rating: 5, cover: 'https://covers.openlibrary.org/b/id/8739150-M.jpg'  },
  { id: 'h7', title: 'Rich Dad Poor Dad',        author: 'Robert Kiyosaki',  genre: 'Finance',     issuedOn: '05 Jan 2026', returnedOn: '20 Jan 2026', rating: 4, cover: 'https://covers.openlibrary.org/b/id/8228691-M.jpg'  },
  { id: 'h8', title: 'The Psychology of Money',  author: 'Morgan Housel',    genre: 'Finance',     issuedOn: '15 Dec 2025', returnedOn: '30 Dec 2025', rating: 5, cover: 'https://covers.openlibrary.org/b/id/10789917-M.jpg' },
  { id: 'h9', title: 'The Alchemist',            author: 'Paulo Coelho',     genre: 'Fiction',     issuedOn: '01 Dec 2025', returnedOn: '15 Dec 2025', rating: 4, cover: 'https://covers.openlibrary.org/b/id/8356442-M.jpg'  },
  { id: 'h10',title: 'Mindset',                  author: 'Carol S. Dweck',   genre: 'Psychology',  issuedOn: '10 Nov 2025', returnedOn: '25 Nov 2025', rating: 4, cover: 'https://covers.openlibrary.org/b/id/7687356-M.jpg'  },
  { id: 'h11',title: 'The Power of Habit',       author: 'Charles Duhigg',   genre: 'Productivity',issuedOn: '01 Nov 2025', returnedOn: '16 Nov 2025', rating: 5, cover: 'https://covers.openlibrary.org/b/id/8228691-M.jpg'  },
  { id: 'h12',title: 'Grit',                     author: 'Angela Duckworth', genre: 'Self Help',   issuedOn: '10 Oct 2025', returnedOn: '25 Oct 2025', rating: 4, cover: 'https://covers.openlibrary.org/b/id/8621101-M.jpg'  },
];

const MOCK_IN_PROGRESS = [
  { id: 'ip1', title: 'Design Patterns', author: 'Erich Gamma', genre: 'Programming', issuedOn: '15 Jun 2026', returnedOn: '—', rating: 0, cover: 'https://covers.openlibrary.org/b/id/7923867-M.jpg' },
];

const MOCK_DNF = [
  { id: 'd1', title: 'Ulysses', author: 'James Joyce', genre: 'Fiction', issuedOn: '01 Mar 2026', returnedOn: '20 Mar 2026', rating: 2, cover: 'https://covers.openlibrary.org/b/id/8356442-M.jpg' },
];

// ─── Genre donut data ─────────────────────────────────────────────────────────
const GENRES = [
  { label: 'Programming', pct: 33, color: '#6366F1' },
  { label: 'Self Help',   pct: 25, color: '#22C55E' },
  { label: 'Productivity',pct: 17, color: '#F59E0B' },
  { label: 'Psychology',  pct: 17, color: '#EF4444' },
  { label: 'Others',      pct: 8,  color: '#A78BFA' },
];

// Monthly chart data
const MONTHLY = [
  { month: 'Jan', val: 1 }, { month: 'Feb', val: 2 },
  { month: 'Mar', val: 2 }, { month: 'Apr', val: 4 },
  { month: 'May', val: 10 },{ month: 'Jun', val: 12 },
];

const ITEMS_PER_PAGE = 5;

// ─── Star Rating display ──────────────────────────────────────────────────────
function StarRating({ rating, max = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={15}
          fill={i < rating ? '#F59E0B' : 'none'}
          color={i < rating ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
    </div>
  );
}

// ─── Book Cover ───────────────────────────────────────────────────────────────
function BookCover({ cover, title }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: 52, height: 70, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
      {cover && !err ? (
        <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
          <BookOpen size={18} color="white" />
        </div>
      )}
    </div>
  );
}

// ─── Genre Chip ───────────────────────────────────────────────────────────────
const GENRE_COLORS = {
  'Programming': { bg: '#EEF2FF', color: '#6366F1' },
  'Self Help':   { bg: '#EEF2FF', color: '#6366F1' },
  'Productivity':{ bg: '#EEF2FF', color: '#6366F1' },
  'Psychology':  { bg: '#EEF2FF', color: '#6366F1' },
  'Finance':     { bg: '#FFF7ED', color: '#D97706' },
  'History':     { bg: '#FFF1F2', color: '#E11D48' },
  'Fiction':     { bg: '#F0FDF4', color: '#16A34A' },
};
function GenreChip({ genre }) {
  const c = GENRE_COLORS[genre] || { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.color, fontSize: 11, fontWeight: 600 }}>
      {genre}
    </span>
  );
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
function LineChart({ data }) {
  const W = 220, H = 90, PAD = 16;
  const maxVal = Math.max(...data.map(d => d.val));
  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - d.val / maxVal) * (H - PAD * 2),
    val: d.val,
    month: d.month,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Y gridlines */}
      {[0, 0.33, 0.67, 1].map((f, i) => (
        <line key={i}
          x1={PAD} y1={PAD + f * (H - PAD * 2)}
          x2={W - PAD} y2={PAD + f * (H - PAD * 2)}
          stroke="#F3F4F6" strokeWidth="1"
        />
      ))}
      {/* Area fill */}
      <path d={areaD} fill="url(#lineGrad)" />
      {/* Line */}
      <path d={pathD} fill="none" stroke="#6366F1" strokeWidth="2" strokeLinejoin="round" />
      {/* Dots + labels */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="white" stroke="#6366F1" strokeWidth="2" />
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fill="#6366F1" fontWeight="700">{p.val}</text>
          <text x={p.x} y={H + 16} textAnchor="middle" fontSize="9" fill="#9CA3AF">{p.month}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Genre Donut ─────────────────────────────────────────────────────────────
function GenreDonut({ genres, total }) {
  const r = 44, cx = 56, cy = 56, C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="11" />
      {genres.map((g, i) => {
        const dash = (g.pct / 100) * C;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={g.color} strokeWidth="11"
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ReadingHistory() {
  const [tab, setTab]     = useState('completed');
  const [period, setPeriod]   = useState('all');
  const [sortBy, setSortBy]   = useState('recent');
  const [page, setPage]   = useState(1);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const dataMap = { completed: MOCK_COMPLETED, inprogress: MOCK_IN_PROGRESS, dnf: MOCK_DNF };
  const records = dataMap[tab] || [];

  const sorted = [...records].sort((a, b) =>
    sortBy === 'recent' ? 0 : (b.rating - a.rating)
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paged = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const TABS = [
    { key: 'completed',  label: 'Completed',          icon: '📖' },
    { key: 'inprogress', label: 'In Progress',         icon: '⏳' },
    { key: 'dnf',        label: 'DNF (Did Not Finish)', icon: '⏱' },
  ];

  const avgRating = (MOCK_COMPLETED.reduce((s, r) => s + r.rating, 0) / MOCK_COMPLETED.length).toFixed(1);

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

      {/* ═══ MAIN ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Tab Bar */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', marginBottom: 0, overflow: 'hidden' }}>
          {TABS.map((t, i) => {
            const isActive = tab === t.key;
            return (
              <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#6366F1' : '#6B7280',
                borderBottom: isActive ? '2px solid #6366F1' : '2px solid transparent',
                borderRight: i < TABS.length - 1 ? '1px solid #E5E7EB' : 'none',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 15 }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Filter + Sort */}
        <div style={{
          background: 'white', borderRadius: '0 0 0 0', border: '1px solid #E5E7EB', borderTop: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select value={period} onChange={e => setPeriod(e.target.value)} style={{
              padding: '7px 28px 7px 12px', border: '1px solid #E5E7EB', borderRadius: 8,
              fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer',
              outline: 'none', fontFamily: 'Inter', appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
            }}>
              <option value="all">All Time</option>
              <option value="year">This Year</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              padding: '7px 28px 7px 12px', border: '1px solid #E5E7EB', borderRadius: 8,
              fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer',
              outline: 'none', fontFamily: 'Inter', appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
            }}>
              <option value="recent">Recently Completed</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Book List */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '8px 20px' }}>
          {paged.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <BookOpen size={40} style={{ margin: '0 auto 12px', color: '#D1D5DB' }} />
              <p style={{ color: '#9CA3AF', fontSize: 15 }}>No books here yet.</p>
            </div>
          ) : paged.map((rec, idx) => (
            <div key={rec.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 0',
                borderBottom: idx < paged.length - 1 ? '1px solid #F3F4F6' : 'none',
                transition: 'background 0.15s',
              }}
            >
              {/* Cover */}
              <BookCover cover={rec.cover} title={rec.title} />

              {/* Title / Author / Genre */}
              <div style={{ flex: '0 0 170px', minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{rec.title}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{rec.author}</div>
                <GenreChip genre={rec.genre} />
              </div>

              {/* Issued On */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Issued on</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                  <Calendar size={12} color="#9CA3AF" />
                  {rec.issuedOn}
                </div>
              </div>

              {/* Returned On */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Returned on</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500, color: '#374151' }}>
                  <Calendar size={12} color="#9CA3AF" />
                  {rec.returnedOn}
                </div>
              </div>

              {/* Rating + Button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0, minWidth: 110 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>My Rating</div>
                {rec.rating > 0 ? (
                  <StarRating rating={rec.rating} />
                ) : (
                  <span style={{ fontSize: 12, color: '#9CA3AF' }}>Not rated</span>
                )}
                <button
                  onClick={() => showToast(`Review submitted for "${rec.title}"`)}
                  style={{
                    padding: '7px 14px', border: '1px solid #E5E7EB', borderRadius: 8,
                    background: 'white', fontSize: 12, fontWeight: 600, color: '#374151',
                    cursor: 'pointer', fontFamily: 'Inter', transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}
                >
                  {tab === 'inprogress' ? 'View Book' : 'Review Again'}
                </button>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>
              Showing {Math.min((page-1)*ITEMS_PER_PAGE+1, records.length)} to {Math.min(page*ITEMS_PER_PAGE, records.length)} of {records.length} records
            </span>
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                  style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: page===1?'not-allowed':'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={14} color={page===1?'#D1D5DB':'#374151'} />
                </button>
                {Array.from({length: totalPages}, (_,i) => i+1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 30, height: 30, borderRadius: 8,
                    border: p===page?'none':'1px solid #E5E7EB',
                    background: p===page?'#6366F1':'white',
                    color: p===page?'white':'#374151',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                  style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: page===totalPages?'not-allowed':'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={14} color={page===totalPages?'#D1D5DB':'#374151'} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div style={{ width: 268, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Reading Statistics */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Reading Statistics</h3>
            <select style={{ fontSize: 11, color: '#6B7280', background: 'white', border: '1px solid #E5E7EB', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', outline: 'none' }}>
              <option>All Time</option>
              <option>This Year</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: '📖', label: 'Books Completed', value: MOCK_COMPLETED.length, color: '#EEF2FF', iColor: '#6366F1' },
              { icon: '⏱',  label: 'Hours Read',      value: 246,                   color: '#ECFDF5', iColor: '#22C55E' },
              { icon: '⭐', label: 'Average Rating',  value: avgRating,             color: '#FFFBEB', iColor: '#F59E0B' },
              { icon: '📅', label: 'Streak (Days)',   value: 8,                     color: '#EEF2FF', iColor: '#6366F1' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.color, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Reading Journey (line chart) */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Your Reading Journey</h3>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 12 }}>Books per month</div>
          <LineChart data={MONTHLY} />
        </div>

        {/* Top Genres donut */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Top Genres</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Donut */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <GenreDonut genres={GENRES} total={12} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1 }}>12</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>Books</div>
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {GENRES.map((g, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: g.color }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{g.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{g.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Keep the habit going */}
        <div style={{ background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', borderRadius: 12, border: '1px solid #C7D2FE', padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>💡</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#4338CA', marginBottom: 4 }}>Keep the habit going!</div>
            <div style={{ fontSize: 12, color: '#6366F1', lineHeight: 1.5 }}>
              You've read {MOCK_COMPLETED.length} books so far.<br />
              Try reading 2 more this month.
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
