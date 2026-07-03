'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Star, TrendingUp, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

function BookCover({ cover, title, size = 68 }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: size, height: Math.round(size * 1.45), borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#6366F1,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={size * 0.28} color="white" />
          </div>
      }
    </div>
  );
}

function StarRow({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill={i < Math.round(rating) ? '#F59E0B' : 'none'} color={i < Math.round(rating) ? '#F59E0B' : '#D1D5DB'} />
      ))}
      <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 3 }}>{rating?.toFixed(1) || '—'}</span>
    </div>
  );
}

function BookCard({ book, onRequest, isPending, isRequesting }) {
  return (
    <div style={{
      background: 'white', borderRadius: 12, border: '1px solid #E5E7EB',
      padding: 16, display: 'flex', flexDirection: 'column', gap: 10, transition: 'all 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', gap: 12 }}>
        <BookCover cover={book.cover} title={book.title} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.title}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6 }}>{book.author}</div>
          <StarRow rating={book.avgRating || 0} />
        </div>
      </div>
      {book.category && (
        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: '#EEF2FF', color: '#6366F1', fontSize: 11, fontWeight: 600 }}>{book.category}</span>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: (book.inventory?.available || 0) > 0 ? '#22C55E' : '#EF4444' }}>
          {(book.inventory?.available || 0) > 0 ? `${book.inventory.available} Available` : 'Unavailable'}
        </span>
        {isPending ? (
          <span style={{ fontSize: 12, color: '#6366F1', fontWeight: 600 }}>✓ Requested</span>
        ) : (
          <button onClick={() => onRequest(book._id, book.title)}
            disabled={isRequesting || (book.inventory?.available || 0) < 1}
            style={{
              padding: '6px 14px', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: (book.inventory?.available || 0) < 1 ? 'not-allowed' : 'pointer',
              background: (book.inventory?.available || 0) < 1 ? '#F3F4F6' : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
              color: (book.inventory?.available || 0) < 1 ? '#9CA3AF' : 'white',
              fontFamily: 'Inter',
            }}>
            {isRequesting ? '...' : 'Request'}
          </button>
        )}
      </div>
    </div>
  );
}

function HScrollList({ children }) {
  const ref = useState(null);
  return (
    <div style={{ overflowX: 'auto', display: 'flex', gap: 14, paddingBottom: 8 }}>
      {children}
    </div>
  );
}

export default function RecommendationsPage() {
  const [history, setHistory]         = useState([]);   // returned books
  const [topGenres, setTopGenres]     = useState([]);   // top read genres
  const [byGenre, setByGenre]         = useState([]);   // books in top genre
  const [trending, setTrending]       = useState([]);   // most recently added books
  const [youMightLike, setYouMightLike] = useState([]); // other genre picks
  const [loading, setLoading]         = useState(true);
  const [toast, setToast]             = useState('');
  const [requesting, setRequesting]   = useState({});
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
      const activeBorrows = (borrowData.records || []).filter(r => ['issued', 'return_pending', 'overdue'].includes(r.status)).map(r => r.bookId?._id || r.bookId);
      const pendingReqs = (reqData.requests || []).filter(r => ['requested','approved'].includes(r.status)).map(r => r.bookId?._id || r.bookId);
      const pending = new Set([...pendingReqs, ...activeBorrows]);
      setPendingBookIds(pending);

      // Fetch books by top genre for recommendations
      const fetchByGenre = async (genre) => {
        if (!genre) return [];
        const res  = await fetch(`/api/books?category=${encodeURIComponent(genre)}&limit=6`);
        const data = await res.json();
        return (data.books || []).filter(b => !alreadyReadIds.has(b._id?.toString()));
      };

      // Fetch trending (newest books)
      const fetchTrending = async () => {
        const res  = await fetch('/api/books?limit=6&sort=newest');
        const data = await res.json();
        return (data.books || []).filter(b => !alreadyReadIds.has(b._id?.toString()));
      };

      const [genreBooks, secondGenreBooks, trendingBooks] = await Promise.all([
        sorted[0] ? fetchByGenre(sorted[0][0]) : Promise.resolve([]),
        sorted[1] ? fetchByGenre(sorted[1][0]) : fetchByGenre('Self Help'),
        fetchTrending(),
      ]);

      setByGenre(genreBooks);
      setYouMightLike(secondGenreBooks);
      setTrending(trendingBooks);
    }).catch(() => showToast('Failed to load recommendations.'))
      .finally(() => setLoading(false));
  }, []);

  const requestBook = async (bookId, title) => {
    setRequesting(prev => ({ ...prev, [bookId]: true }));
    try {
      const res  = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookId }) });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Request failed.'); return; }
      showToast(`Request sent for "${title}"! 📚`);
      setPendingBookIds(prev => new Set([...prev, bookId]));
    } catch { showToast('Something went wrong.'); }
    finally { setRequesting(prev => ({ ...prev, [bookId]: false })); }
  };

  const BookGrid = ({ books }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 14 }}>
      {books.map(book => (
        <BookCard key={book._id} book={book}
          isPending={pendingBookIds.has(book._id?.toString())}
          isRequesting={requesting[book._id]}
          onRequest={requestBook}
        />
      ))}
    </div>
  );

  // ── Reading Goals Card ──
  const booksThisMonth = history.filter(r => {
    const d = new Date(r.returnDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const goalTarget = 3;
  const goalPct = Math.min(100, Math.round((booksThisMonth / goalTarget) * 100));

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', overflow: 'hidden' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#6366F1', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>{toast}</div>
      )}

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', minWidth: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
            <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: '#6366F1' }} />
          </div>
        ) : (
          <>
            {/* Based on your history */}
            {byGenre.length > 0 && topGenres[0] && (
              <section style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 3px' }}>
                      Because you love "{topGenres[0][0]}"
                    </h2>
                    <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Based on your reading history</p>
                  </div>
                </div>
                <BookGrid books={byGenre.slice(0, 6)} />
              </section>
            )}

            {/* Trending Now */}
            {trending.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <TrendingUp size={18} color="#6366F1" />
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Trending Now</h2>
                </div>
                <BookGrid books={trending.slice(0, 6)} />
              </section>
            )}

            {/* You Might Enjoy */}
            {youMightLike.length > 0 && topGenres[1] && (
              <section style={{ marginBottom: 32 }}>
                <div style={{ marginBottom: 14 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 3px' }}>You Might Enjoy</h2>
                  <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>More from "{topGenres[1][0]}"</p>
                </div>
                <BookGrid books={youMightLike.slice(0, 6)} />
              </section>
            )}

            {/* No history fallback */}
            {history.length === 0 && !loading && (
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 60, textAlign: 'center', marginBottom: 24 }}>
                <BookOpen size={48} style={{ margin: '0 auto 16px', color: '#D1D5DB' }} />
                <h3 style={{ fontSize: 16, color: '#374151', fontWeight: 600, margin: '0 0 8px' }}>No reading history yet</h3>
                <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>
                  Borrow and return some books to get personalised recommendations!
                </p>
                <a href="/student/search" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                  Browse Library
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: 268, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Reading Goals */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Reading Goals</h3>
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>This Month</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1' }}>{booksThisMonth}/{goalTarget}</span>
            </div>
            <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg,#6366F1,#A78BFA)', width: `${goalPct}%`, borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              {goalPct >= 100 ? '🎉 Goal reached!' : `${goalTarget - booksThisMonth} more to reach your goal`}
            </div>
          </div>

          {topGenres.slice(0, 4).map(([genre, count]) => (
            <div key={genre} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{genre}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{count} book{count !== 1 ? 's' : ''}</span>
            </div>
          ))}
          {topGenres.length === 0 && <p style={{ fontSize: 13, color: '#9CA3AF' }}>Start reading to see your top genres.</p>}
        </div>

        {/* Reading Stats */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Your Stats</h3>
          {[
            { label: 'Books Read',    value: history.length,                                        icon: '📖' },
            { label: 'Genres Tried',  value: topGenres.length,                                      icon: '🎭' },
            { label: 'Avg Rating',    value: history.filter(r => r.rating > 0).length ? (history.filter(r => r.rating > 0).reduce((s, r) => s + r.rating, 0) / history.filter(r => r.rating > 0).length).toFixed(1) + '⭐' : '—', icon: '⭐' },
            { label: 'This Month',    value: booksThisMonth,                                        icon: '📅' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F9FAFB', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 15 }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{s.label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Explore Categories */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Explore Categories</h3>
          {['Programming', 'Self Help', 'Psychology', 'Finance', 'History', 'Fiction'].map(cat => (
            <a key={cat} href={`/student/search?category=${encodeURIComponent(cat)}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 8, marginBottom: 6, textDecoration: 'none', color: '#374151', background: '#F9FAFB', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#6366F1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#374151'; }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{cat}</span>
              <ChevronRight size={14} color="#D1D5DB" />
            </a>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
