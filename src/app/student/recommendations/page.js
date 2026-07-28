'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { BookOpen, Star, TrendingUp, ChevronRight, ChevronLeft, Loader2, Sparkles, Info, Heart, BarChart2, Users } from 'lucide-react';
import RequestModal from '@/components/student/RequestModal';

// ─── Book Cover ───────────────────────────────────────────────────────────────
function BookCover({ cover, title, size = 110 }) {
  const [err, setErr] = useState(false);
  const h = Math.round(size * 1.45);
  return (
    <div style={{ width: size, height: h, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1A73E8,#93C5FD)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={size * 0.3} color="white" />
          </div>
      }
    </div>
  );
}

// ─── Star Row ─────────────────────────────────────────────────────────────────
function StarRow({ rating }) {
  const r = rating || 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Star size={13} fill={r > 0 ? '#F59E0B' : 'none'} color={r > 0 ? '#F59E0B' : '#D1D5DB'} />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{r > 0 ? r.toFixed(1) : '—'}</span>
    </div>
  );
}

// ─── Vertical Book Card (image on top, details below) ─────────────────────────
function BookCard({ book, isPending, onRequest }) {
  const avail = book.inventory?.available ?? 0;
  return (
    <div style={{ flexShrink: 0, width: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: 10 }}>
        <BookCover cover={book.cover} title={book.title} size={110} />
      </div>
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {book.title}
        </div>
        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {book.author}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <StarRow rating={book.avgRating} />
        </div>
        <Link
          href={`/student/book/${book._id}`}
          style={{
            display: 'block', width: '100%', padding: '7px 0',
            border: '1px solid #E5E7EB', borderRadius: 8,
            background: 'white', color: '#374151',
            fontSize: 12, fontWeight: 600, textDecoration: 'none',
            textAlign: 'center', transition: 'all 0.15s',
            marginBottom: 6,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#1A73E8'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
        >
          View Details
        </Link>
        {isPending ? (
          <div style={{ width: '100%', padding: '6px 0', borderRadius: 8, background: '#EFF6FF', color: '#1A73E8', fontSize: 11, fontWeight: 700, textAlign: 'center', border: '1px solid #BFDBFE' }}>
            ✓ Requested
          </div>
        ) : (
          <button
            onClick={() => onRequest(book)}
            style={{
              width: '100%', padding: '7px 0', border: 'none', borderRadius: 8,
              background: avail > 0 ? 'linear-gradient(135deg,#1A73E8,#1A73E8)' : '#F3F4F6',
              color: avail > 0 ? 'white' : '#9CA3AF',
              fontSize: 11, fontWeight: 700, cursor: avail > 0 ? 'pointer' : 'default',
              transition: 'all 0.15s',
            }}
          >
            {avail > 0 ? '📚 Request' : 'Waitlist'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Horizontal scrollable book row with nav arrows ──────────────────────────
function BookRow({ books, isPending, onRequest }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => scroll(-1)}
        style={{ position: 'absolute', left: -16, top: '40%', transform: 'translateY(-50%)', zIndex: 2, width: 32, height: 32, borderRadius: '50%', background: 'white', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <ChevronLeft size={16} color="#6B7280" />
      </button>
      <div ref={ref} style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {books.map(book => (
          <BookCard
            key={book._id}
            book={book}
            isPending={isPending(book._id?.toString())}
            onRequest={onRequest}
          />
        ))}
      </div>
      <button
        onClick={() => scroll(1)}
        style={{ position: 'absolute', right: -16, top: '40%', transform: 'translateY(-50%)', zIndex: 2, width: 32, height: 32, borderRadius: '50%', background: 'white', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <ChevronRight size={16} color="#6B7280" />
      </button>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, genre }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0 }}>{title}</h2>
      <Link
        href={genre ? `/student/search?category=${encodeURIComponent(genre)}` : '/student/search'}
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#1A73E8', textDecoration: 'none' }}
      >
        View All <ChevronRight size={14} />
      </Link>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ pct, color = '#1A73E8' }) {
  return (
    <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', background: color, width: `${pct}%`, borderRadius: 4, transition: 'width 0.6s ease' }} />
    </div>
  );
}

const QUOTES = [
  { text: "A library is a place where you can lose your innocence without losing your virginity.", author: "Germaine Greer" },
  { text: "Not all readers are leaders, but all leaders are readers.", author: "Harry S. Truman" },
  { text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
];

export default function RecommendationsPage() {
  const [history, setHistory]           = useState([]);
  const [topGenres, setTopGenres]       = useState([]);
  const [byGenre, setByGenre]           = useState([]);
  const [trending, setTrending]         = useState([]);
  const [youMightLike, setYouMightLike] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [toast, setToast]               = useState('');
  const [requestModalBook, setRequestModalBook] = useState(null);
  const [pendingBookIds, setPendingBookIds] = useState(new Set());

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  useEffect(() => {
    Promise.all([
      fetch('/api/borrow').then(r => r.json()),
      fetch('/api/requests').then(r => r.json()),
    ]).then(async ([borrowData, reqData]) => {
      const returned = (borrowData.records || []).filter(r => r.status === 'returned');
      setHistory(returned);

      // Build genre map from reading history
      const genreMap = {};
      returned.forEach(r => {
        const c = r.bookId?.category;
        if (c) genreMap[c] = (genreMap[c] || 0) + 1;
      });
      const sorted = Object.entries(genreMap).sort((a, b) => b[1] - a[1]);
      setTopGenres(sorted);

      const alreadyReadIds = new Set(returned.map(r => r.bookId?._id?.toString()));
      const activeBorrows = (borrowData.records || []).filter(r => ['issued', 'return_pending', 'overdue'].includes(r.status)).map(r => (r.bookId?._id || r.bookId)?.toString());
      const pendingReqs = (reqData.requests || []).filter(r => ['requested', 'approved'].includes(r.status)).map(r => (r.bookId?._id || r.bookId)?.toString());
      setPendingBookIds(new Set([...pendingReqs, ...activeBorrows]));

      // Fetch books by genre for sections
      const fetchByGenre = async (genre) => {
        if (!genre) return [];
        const res = await fetch(`/api/books?category=${encodeURIComponent(genre)}&limit=10`);
        const data = await res.json();
        return data.books || [];
      };
      const fetchTrending = async () => {
        const res = await fetch('/api/books?limit=10&sort=newest');
        const data = await res.json();
        return data.books || [];
      };
      const fetchAllCats = async () => {
        const res = await fetch('/api/books?limit=500');
        const data = await res.json();
        const catMap = {};
        (data.books || []).forEach(b => { if (b.category) catMap[b.category] = (catMap[b.category] || 0) + 1; });
        return Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
      };

      const [genreBooks, secondGenreBooks, trendingBooks, cats] = await Promise.all([
        sorted[0] ? fetchByGenre(sorted[0][0]) : fetchByGenre('Programming'),
        sorted[1] ? fetchByGenre(sorted[1][0]) : fetchByGenre('Self Help'),
        fetchTrending(),
        fetchAllCats(),
      ]);

      setByGenre(genreBooks);
      setYouMightLike(secondGenreBooks);
      setTrending(trendingBooks);
      setAllCategories(cats);
    }).catch(() => showToast('Failed to load recommendations.'))
      .finally(() => setLoading(false));
  }, []);

  const openRequestModal = (book) => setRequestModalBook(book);

  const onRequestSuccess = (msg, bookId) => {
    showToast(msg);
    setPendingBookIds(prev => new Set([...prev, bookId?.toString()]));
  };

  const isPending = (id) => pendingBookIds.has(id);

  // Top genres for sidebar — max pct relative to top category
  const maxCatCount = allCategories[0]?.[1] || 1;
  const catColors = ['#1A73E8', '#EC4899', '#22C55E', '#F59E0B', '#3B82F6'];

  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  const topGenre = topGenres[0]?.[0];
  const secondGenre = topGenres[1]?.[0];

  return (
    <div style={{ display: 'flex', minHeight: '100%', fontFamily: 'Inter,sans-serif', background: '#F9FAFB' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#1A73E8', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(26,115,232,0.4)' }}>{toast}</div>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 40px 28px 24px', minWidth: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
            <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: '#1A73E8' }} />
          </div>
        ) : (
          <>
            {/* Personalized banner */}
            <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#F5F3FF)', border: '1px solid #BFDBFE', borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(26,115,232,0.15)' }}>
                <span style={{ fontSize: 26 }}>🪄</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#4338CA', marginBottom: 4 }}>Personalized for You ✨</div>
                <div style={{ fontSize: 13, color: '#1A73E8', lineHeight: 1.5 }}>
                  These recommendations are based on your reading history, favorite categories, and books you've borrowed.
                </div>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1px solid #BFDBFE', borderRadius: 8, background: 'white', color: '#1A73E8', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <Info size={14} /> How it works
              </button>
            </div>

            {/* Section 1: Because you read <genre> */}
            {byGenre.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <SectionHeader
                  title={topGenre ? `Because you read ${topGenre}` : 'Recommended for You'}
                  genre={topGenre}
                />
                <div style={{ position: 'relative', paddingLeft: 0 }}>
                  <BookRow books={byGenre} isPending={isPending} onRequest={openRequestModal} />
                </div>
              </section>
            )}

            {/* Section 2: You might enjoy these */}
            {youMightLike.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <SectionHeader
                  title="You might enjoy these"
                  genre={secondGenre}
                />
                <BookRow books={youMightLike} isPending={isPending} onRequest={openRequestModal} />
              </section>
            )}

            {/* Section 3: Trending in Library */}
            {trending.length > 0 && (
              <section style={{ marginBottom: 40 }}>
                <SectionHeader title="Trending in Library" />
                <BookRow books={trending} isPending={isPending} onRequest={openRequestModal} />
              </section>
            )}

            {/* No history fallback — still show trending */}
            {history.length === 0 && byGenre.length === 0 && !loading && (
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 60, textAlign: 'center', marginBottom: 24 }}>
                <BookOpen size={48} style={{ margin: '0 auto 16px', color: '#D1D5DB' }} />
                <h3 style={{ fontSize: 16, color: '#374151', fontWeight: 600, margin: '0 0 8px' }}>No reading history yet</h3>
                <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>Borrow and return some books to get personalised recommendations!</p>
                <Link href="/student/search" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: 'linear-gradient(135deg,#1A73E8,#1A73E8)', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                  Browse Library
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ RIGHT SIDEBAR ═══ */}
      <div style={{ width: 288, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Why these recommendations */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#111827', marginBottom: 18, margin: '0 0 18px' }}>Why these recommendations?</h3>
          {[
            { icon: '📚', color: '#EFF6FF', iconColor: '#1A73E8', text: 'Based on your borrowed books and reading history' },
            { icon: '❤️', color: '#FFF1F2', iconColor: '#E11D48', text: `From categories you love: ${topGenres.slice(0, 3).map(g => g[0]).join(', ') || 'Start reading to personalize'}` },
            { icon: '📈', color: '#F0FDF4', iconColor: '#16A34A', text: 'Popular and trending books in our library' },
            { icon: '👥', color: '#FFFBEB', iconColor: '#D97706', text: 'Highly rated by students like you' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < 3 ? 16 : 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                {item.icon}
              </div>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.5, paddingTop: 2 }}>{item.text}</div>
            </div>
          ))}
        </div>

        {/* Top Categories for You */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#111827', margin: '0 0 18px' }}>Top Categories for You</h3>
          {allCategories.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>Loading categories...</p>
          ) : allCategories.map(([cat, count], i) => {
            const pct = Math.round((count / maxCatCount) * 100);
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{cat}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: catColors[i % catColors.length] }}>{pct}%</span>
                </div>
                <ProgressBar pct={pct} color={catColors[i % catColors.length]} />
              </div>
            );
          })}
          <Link
            href="/student/search"
            style={{ display: 'block', marginTop: 14, padding: '10px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', color: '#374151', fontSize: 13, fontWeight: 600, textDecoration: 'none', textAlign: 'center', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
          >
            See All Categories
          </Link>
        </div>

        {/* Quote card */}
        <div style={{ background: 'linear-gradient(135deg,#F9FAFB,#EFF6FF)', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 32, color: '#1A73E8', lineHeight: 1, marginBottom: 10, fontFamily: 'Georgia, serif', fontWeight: 900 }}>&ldquo;</div>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 12px' }}>{quote.text}</p>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#1A73E8' }}>— {quote.author}</div>
        </div>

      </div>

      {/* Request Modal */}
      {requestModalBook && (
        <RequestModal
          book={requestModalBook}
          onClose={() => setRequestModalBook(null)}
          onSuccess={(msg) => { onRequestSuccess(msg, requestModalBook._id); setRequestModalBook(null); }}
        />
      )}
    </div>
  );
}
