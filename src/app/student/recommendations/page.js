'use client';
import { useState } from 'react';
import { BookOpen, Star, TrendingUp, ChevronRight, ChevronLeft } from 'lucide-react';

// ─── Book Data ────────────────────────────────────────────────────────────────
const BECAUSE_PROGRAMMING = [
  { id: 'p1', title: 'The Pragmatic Programmer', author: 'Andrew Hunt',    rating: 4.6, cover: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
  { id: 'p2', title: 'Code Complete',             author: 'Steve McConnell', rating: 4.5, cover: 'https://covers.openlibrary.org/b/id/8621101-M.jpg' },
  { id: 'p3', title: 'Design Patterns',           author: 'Erich Gamma',    rating: 4.4, cover: 'https://covers.openlibrary.org/b/id/7923867-M.jpg' },
  { id: 'p4', title: 'Refactoring',               author: 'Martin Fowler',  rating: 4.8, cover: 'https://covers.openlibrary.org/b/id/8356442-M.jpg' },
  { id: 'p5', title: 'Clean Architecture',        author: 'Robert C. Martin', rating: 4.7, cover: 'https://covers.openlibrary.org/b/id/10387070-M.jpg' },
  { id: 'p6', title: 'The Clean Coder',           author: 'Robert C. Martin', rating: 4.5, cover: 'https://covers.openlibrary.org/b/id/10519054-M.jpg' },
];

const YOU_MIGHT_ENJOY = [
  { id: 'e1', title: 'Atomic Habits',         author: 'James Clear',     rating: 4.7, cover: 'https://covers.openlibrary.org/b/id/10519054-M.jpg' },
  { id: 'e2', title: 'Deep Work',             author: 'Cal Newport',     rating: 4.6, cover: 'https://covers.openlibrary.org/b/id/8739161-M.jpg' },
  { id: 'e3', title: 'The 5 AM Club',         author: 'Robin Sharma',    rating: 4.5, cover: 'https://covers.openlibrary.org/b/id/10387070-M.jpg' },
  { id: 'e4', title: 'The Power of Habit',    author: 'Charles Duhigg',  rating: 4.6, cover: 'https://covers.openlibrary.org/b/id/8228691-M.jpg' },
  { id: 'e5', title: 'Mindset',               author: 'Carol S. Dweck',  rating: 4.5, cover: 'https://covers.openlibrary.org/b/id/7687356-M.jpg' },
  { id: 'e6', title: 'Grit',                  author: 'Angela Duckworth',rating: 4.4, cover: 'https://covers.openlibrary.org/b/id/8621101-M.jpg' },
];

const TRENDING = [
  { id: 't1', title: 'Thinking, Fast and Slow',         author: 'Daniel Kahneman', rating: 4.6, cover: 'https://covers.openlibrary.org/b/id/7923867-M.jpg' },
  { id: 't2', title: 'Sapiens',                          author: 'Yuval Noah Harari', rating: 4.6, cover: 'https://covers.openlibrary.org/b/id/8739150-M.jpg' },
  { id: 't3', title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', rating: 4.4, cover: 'https://covers.openlibrary.org/b/id/10789917-M.jpg' },
  { id: 't4', title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', rating: 4.5, cover: 'https://covers.openlibrary.org/b/id/8228691-M.jpg' },
  { id: 't5', title: 'The Alchemist',                    author: 'Paulo Coelho',    rating: 4.3, cover: 'https://covers.openlibrary.org/b/id/8356442-M.jpg' },
  { id: 't6', title: 'Rich Dad Poor Dad',                author: 'Robert Kiyosaki', rating: 4.4, cover: 'https://covers.openlibrary.org/b/id/8228691-M.jpg' },
];

const TOP_CATEGORIES = [
  { label: 'Programming', pct: 65, color: '#6366F1' },
  { label: 'Self Help',   pct: 60, color: '#6366F1' },
  { label: 'Productivity',pct: 50, color: '#6366F1' },
  { label: 'Psychology',  pct: 35, color: '#6366F1' },
  { label: 'Science',     pct: 20, color: '#6366F1' },
];

const WHY_ITEMS = [
  { icon: '📚', text: 'Based on your borrowed books and reading history' },
  { icon: '❤️',  text: 'From categories you love: Programming, Self Help, Productivity' },
  { icon: '📈', text: 'Popular and trending books in our library' },
  { icon: '⭐', text: 'Highly rated by students like you' },
];

// ─── Book Card ────────────────────────────────────────────────────────────────
function BookCard({ book, onRequest }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{
      width: 140, flexShrink: 0,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Cover */}
      <div style={{ width: 140, height: 190, borderRadius: 10, overflow: 'hidden', marginBottom: 10, background: '#F3F4F6', flexShrink: 0 }}>
        {book.cover && !err ? (
          <img src={book.cover} alt={book.title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
            <BookOpen size={32} color="white" />
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 3, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {book.title}
      </div>
      <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>{book.author}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
        <Star size={12} color="#F59E0B" fill="#F59E0B" />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{book.rating}</span>
      </div>
      <button
        onClick={() => onRequest(book.title)}
        style={{
          width: '100%', padding: '7px 0', border: '1px solid #E5E7EB', borderRadius: 8,
          background: 'white', fontSize: 12, fontWeight: 600, color: '#374151',
          cursor: 'pointer', fontFamily: 'Inter', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.background = '#EEF2FF'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = 'white'; }}
      >
        View Details
      </button>
    </div>
  );
}

// ─── Book Row Section ────────────────────────────────────────────────────────
function BookSection({ title, books, onRequest }) {
  const [offset, setOffset] = useState(0);
  const visible = 5;
  const canPrev = offset > 0;
  const canNext = offset + visible < books.length;

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ fontSize: 13, color: '#6366F1', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
            View All <ChevronRight size={14} />
          </button>
          <button
            onClick={() => setOffset(o => Math.max(0, o - 1))}
            disabled={!canPrev}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #E5E7EB', background: 'white', cursor: canPrev ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: canPrev ? 1 : 0.4 }}
          >
            <ChevronLeft size={14} color="#374151" />
          </button>
          <button
            onClick={() => setOffset(o => Math.min(books.length - visible, o + 1))}
            disabled={!canNext}
            style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #E5E7EB', background: 'white', cursor: canNext ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: canNext ? 1 : 0.4 }}
          >
            <ChevronRight size={14} color="#374151" />
          </button>
        </div>
      </div>

      {/* Cards row */}
      <div style={{ display: 'flex', gap: 16, overflow: 'hidden' }}>
        {books.slice(offset, offset + visible).map(book => (
          <BookCard key={book.id} book={book} onRequest={onRequest} />
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Recommendations() {
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

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

        {/* Personalized Banner */}
        <div style={{
          background: 'white', borderRadius: 12, border: '1px solid #E5E7EB',
          padding: '18px 24px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
              🎯
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                Personalized for You ✨
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                These recommendations are based on your reading history, favorite categories,<br />and books you've borrowed.
              </div>
            </div>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px',
            border: '1px solid #E5E7EB', borderRadius: 8, background: 'white',
            fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer',
            whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}
          >
            ⓘ How it works
          </button>
        </div>

        {/* Book Sections */}
        <BookSection
          title="Because you read Programming"
          books={BECAUSE_PROGRAMMING}
          onRequest={(t) => showToast(`Requested: ${t}`)}
        />
        <BookSection
          title="You might enjoy these"
          books={YOU_MIGHT_ENJOY}
          onRequest={(t) => showToast(`Requested: ${t}`)}
        />
        <BookSection
          title="Trending in Library"
          books={TRENDING}
          onRequest={(t) => showToast(`Requested: ${t}`)}
        />
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div style={{ width: 268, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Why these recommendations */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Why these recommendations?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {WHY_ITEMS.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories For You */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Top Categories for You</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {TOP_CATEGORIES.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{cat.label}</span>
                  <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{cat.pct}%</span>
                </div>
                <div style={{ width: '100%', height: 7, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${cat.pct}%`, height: '100%', background: 'linear-gradient(90deg,#6366F1,#A78BFA)', borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <button style={{
            width: '100%', marginTop: 16, padding: '9px', border: '1px solid #E5E7EB',
            borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600,
            color: '#374151', cursor: 'pointer', fontFamily: 'Inter',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}
          >
            See All Categories
          </button>
        </div>

        {/* Quote Card */}
        <div style={{
          background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16,
          position: 'relative',
        }}>
          <div style={{ fontSize: 32, color: '#6366F1', lineHeight: 1, marginBottom: 10, opacity: 0.4 }}>"</div>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
            A library is a place where you can lose your innocence without losing your virginity.
          </p>
          <div style={{ marginTop: 10, fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>— Germaine Greer</div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
