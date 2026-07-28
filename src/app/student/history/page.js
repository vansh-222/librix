'use client';
import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Star, ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const GENRE_COLORS = {
  'Programming':  { bg: '#EFF6FF', color: '#1A73E8' },
  'Self Help':    { bg: '#EFF6FF', color: '#1A73E8' },
  'Productivity': { bg: '#ECFDF5', color: '#16A34A' },
  'Psychology':   { bg: '#FFF7ED', color: '#D97706' },
  'Finance':      { bg: '#FFF7ED', color: '#D97706' },
  'History':      { bg: '#FFF1F2', color: '#E11D48' },
  'Fiction':      { bg: '#F0FDF4', color: '#16A34A' },
};

function GenreChip({ genre }) {
  const c = GENRE_COLORS[genre] || { bg: '#F3F4F6', color: '#6B7280' };
  return <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.color, fontSize: 11, fontWeight: 600 }}>{genre}</span>;
}

function StarRating({ rating, max = 5, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={15}
          fill={(hover || rating) > i ? '#F59E0B' : 'none'}
          color={(hover || rating) > i ? '#F59E0B' : '#D1D5DB'}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
          onMouseEnter={() => onChange && setHover(i + 1)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(i + 1)}
        />
      ))}
    </div>
  );
}

function BookCover({ cover, title }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: 52, height: 70, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1A73E8,#93C5FD)' }}><BookOpen size={18} color="white" /></div>
      }
    </div>
  );
}

function LineChart({ data }) {
  const W = 220, H = 90, PAD = 16;
  const maxVal = Math.max(...data.map(d => d.val), 1);
  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - d.val / maxVal) * (H - PAD * 2),
    val: d.val, month: d.month,
  }));
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A73E8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1A73E8" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lg2)" />
      <path d={pathD} fill="none" stroke="#1A73E8" strokeWidth="2" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="white" stroke="#1A73E8" strokeWidth="2" />
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fill="#1A73E8" fontWeight="700">{p.val}</text>
          <text x={p.x} y={H + 16} textAnchor="middle" fontSize="9" fill="#9CA3AF">{p.month}</text>
        </g>
      ))}
    </svg>
  );
}

function GenreDonut({ genres }) {
  const r = 44, cx = 56, cy = 56, C = 2 * Math.PI * r;
  let offset = 0;
  const total = genres.reduce((s, g) => s + g.count, 0) || 1;
  const COLORS = ['#1A73E8','#22C55E','#F59E0B','#EF4444','#93C5FD'];
  return (
    <svg width="112" height="112" viewBox="0 0 112 112" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="11" />
      {genres.map((g, i) => {
        const dash = (g.count / total) * C;
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth="11"
          strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-offset} />;
        offset += dash;
        return el;
      })}
    </svg>
  );
}

const ITEMS_PER_PAGE = 5;
const COLORS_LIST = ['#1A73E8','#22C55E','#F59E0B','#EF4444','#93C5FD'];

export default function ReadingHistory() {
  const [tab, setTab]     = useState('completed');
  const [period, setPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage]   = useState(1);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState('');
  const [ratingRec, setRatingRec] = useState(null); // record being rated

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [borrowRes, statsRes] = await Promise.all([
        fetch('/api/borrow'),
        fetch('/api/stats'),
      ]);
      const borrowData = await borrowRes.json();
      const statsData  = await statsRes.json();
      setRecords(borrowData.records || []);
      setStats(statsData);
    } catch {
      showToast('Failed to load history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const saveRating = async (recordId, rating) => {
    try {
      const res = await fetch('/api/borrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, action: 'rate', rating }),
      });
      if (res.ok) {
        showToast('Rating saved! ⭐');
        setRecords(prev => prev.map(r => r._id === recordId ? { ...r, rating } : r));
      }
    } catch { showToast('Failed to save rating.'); }
    setRatingRec(null);
  };

  const completed   = records.filter(r => r.status === 'returned');
  const inProgress  = records.filter(r => ['issued','return_pending'].includes(r.status));

  const displayed   = tab === 'completed' ? completed : tab === 'inprogress' ? inProgress : [];
  const sorted = [...displayed].sort((a, b) =>
    sortBy === 'recent' ? new Date(b.updatedAt) - new Date(a.updatedAt) : (b.rating - a.rating)
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paged = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Genre breakdown
  const genreMap = {};
  completed.forEach(r => { const c = r.bookId?.category || 'General'; genreMap[c] = (genreMap[c] || 0) + 1; });
  const genres = Object.entries(genreMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([label,count])=>({ label, count }));
  const totalBooks = completed.length;

  // Monthly reading
  const monthly = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const count = completed.filter(r => new Date(r.returnDate) >= start && new Date(r.returnDate) <= end).length;
    monthly.push({ month: start.toLocaleString('en', { month: 'short' }), val: count });
  }

  const ratings = completed.filter(r => r.rating > 0).map(r => r.rating);
  const avgRating = ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1) : '—';

  const selectStyle = {
    padding: '7px 28px 7px 12px', border: '1px solid #E5E7EB', borderRadius: 8,
    fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
  };

  const TABS = [
    { key: 'completed',  label: 'Completed',           icon: '📖' },
    { key: 'inprogress', label: 'In Progress',          icon: '⏳' },
    { key: 'dnf',        label: 'DNF (Did Not Finish)', icon: '⏱' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', overflow: 'hidden' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#1A73E8', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(26,115,232,0.4)' }}>{toast}</div>
      )}

      {/* Rating Modal */}
      {ratingRec && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, minWidth: 320, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Rate "{ratingRec.bookId?.title}"</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>How would you rate this book?</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
              <StarRating rating={ratingRec.rating || 0} onChange={(r) => saveRating(ratingRec._id, r)} />
            </div>
            <button onClick={() => setRatingRec(null)} style={{ padding: '8px 20px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', minWidth: 0 }}>

        {/* Tab Bar */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', marginBottom: 0, overflow: 'hidden' }}>
          {TABS.map((t, i) => {
            const isActive = tab === t.key;
            return (
              <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14, fontWeight: isActive ? 600 : 500, color: isActive ? '#1A73E8' : '#6B7280',
                borderBottom: isActive ? '2px solid #1A73E8' : '2px solid transparent',
                borderRight: i < TABS.length - 1 ? '1px solid #E5E7EB' : 'none', transition: 'all 0.2s',
              }}>
                <span>{t.icon}</span>{t.label}
              </button>
            );
          })}
        </div>

        {/* Filter + Sort */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderTop: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
          <select value={period} onChange={e => setPeriod(e.target.value)} style={selectStyle}>
            <option value="all">All Time</option>
            <option value="year">This Year</option>
            <option value="month">This Month</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
              <option value="recent">Recently Completed</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Book List */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '8px 20px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
              <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: '#1A73E8' }} />
            </div>
          ) : paged.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <BookOpen size={40} style={{ margin: '0 auto 12px', color: '#D1D5DB' }} />
              <p style={{ color: '#9CA3AF', fontSize: 15 }}>No books here yet.</p>
            </div>
          ) : paged.map((rec, idx) => (
            <div key={rec._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: idx < paged.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <BookCover cover={rec.bookId?.cover} title={rec.bookId?.title} />
              <div style={{ flex: '0 0 170px', minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{rec.bookId?.title || '—'}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{rec.bookId?.author}</div>
                <GenreChip genre={rec.bookId?.category || 'General'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Issued on</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', fontWeight: 500 }}>
                  <Calendar size={12} color="#9CA3AF" /> {fmtDate(rec.issueDate)}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 5 }}>Returned on</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', fontWeight: 500 }}>
                  <Calendar size={12} color="#9CA3AF" /> {fmtDate(rec.returnDate || rec.dueDate)}
                </div>
              </div>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 110 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>My Rating</div>
                <StarRating rating={rec.rating || 0} />
                <button onClick={() => setRatingRec(rec)}
                  style={{ padding: '7px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A73E8'; e.currentTarget.style.color = '#1A73E8'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}>
                  {tab === 'inprogress' ? 'View Book' : rec.rating ? 'Review Again' : 'Rate Book'}
                </button>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>
              Showing {sorted.length === 0 ? 0 : Math.min((page-1)*ITEMS_PER_PAGE+1, sorted.length)}–{Math.min(page*ITEMS_PER_PAGE, sorted.length)} of {sorted.length} records
            </span>
            {totalPages > 1 && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                  style={{ width:30,height:30,borderRadius:8,border:'1px solid #E5E7EB',background:'white',cursor:page===1?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <ChevronLeft size={14} color={page===1?'#D1D5DB':'#374151'} />
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                  <button key={p} onClick={()=>setPage(p)} style={{ width:30,height:30,borderRadius:8,border:p===page?'none':'1px solid #E5E7EB',background:p===page?'#1A73E8':'white',color:p===page?'white':'#374151',fontSize:13,fontWeight:600,cursor:'pointer' }}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ width:30,height:30,borderRadius:8,border:'1px solid #E5E7EB',background:'white',cursor:page===totalPages?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <ChevronRight size={14} color={page===totalPages?'#D1D5DB':'#374151'} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: 268, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Reading Statistics */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Reading Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: '📖', label: 'Books Completed', value: completed.length, bg: '#EFF6FF' },
              { icon: '⏱',  label: 'Hours Read',      value: completed.length * 8, bg: '#ECFDF5' },
              { icon: '⭐', label: 'Average Rating',  value: avgRating, bg: '#FFFBEB' },
              { icon: '📅', label: 'Streak (Days)',   value: stats?.streakDays || 8, bg: '#EFF6FF' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3, lineHeight: 1.3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reading Journey */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Your Reading Journey</h3>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 12 }}>Books per month</div>
          <LineChart data={monthly} />
        </div>

        {/* Top Genres */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Top Genres</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <GenreDonut genres={genres} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{totalBooks}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>Books</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {genres.map((g, i) => (
                <div key={g.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS_LIST[i % COLORS_LIST.length] }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{g.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{totalBooks > 0 ? Math.round((g.count/totalBooks)*100) : 0}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Habit card */}
        <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#F5F3FF)', borderRadius: 12, border: '1px solid #BFDBFE', padding: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>💡</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#4338CA', marginBottom: 4 }}>Keep the habit going!</div>
            <div style={{ fontSize: 12, color: '#1A73E8', lineHeight: 1.5 }}>You've read {completed.length} books so far.<br />Try reading 2 more this month.</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
