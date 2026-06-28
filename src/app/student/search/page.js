'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, BookOpen, Star, Loader2, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function BookCover({ cover, title, size = 80 }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: size, height: Math.round(size * 1.4), borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
            <BookOpen size={size * 0.25} color="white" />
          </div>
      }
    </div>
  );
}

const CATEGORIES = ['All', 'Programming', 'Self Help', 'Psychology', 'Finance', 'History', 'Fiction', 'Science', 'Math', 'General'];
const LANGS = ['All', 'English', 'Hindi', 'Gujarati'];

export default function SearchBooksPage() {
  const urlParams  = useSearchParams();
  const [query, setQuery]         = useState('');
  const [category, setCategory]   = useState(urlParams.get('category') || '');
  const [language, setLanguage]   = useState('');
  const [available, setAvailable] = useState(false);
  const [books, setBooks]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState('');
  const [requesting, setRequesting] = useState({});
  const [pendingBookIds, setPendingBookIds] = useState(new Set());
  const debounceRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const doSearch = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: p,
        limit: 12,
        ...(query    ? { search:   query    } : {}),
        ...(category ? { category          } : {}),
        ...(language ? { language          } : {}),
        ...(available ? { available: 'true' } : {}),
      });
      const res  = await fetch(`/api/books?${params}`);
      const data = await res.json();
      setBooks(data.books || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      showToast('Failed to load books.');
    } finally {
      setLoading(false);
    }
  }, [query, category, language, available]);

  // Debounce search on query change
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setPage(1); doSearch(1); }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, category, language, available, doSearch]);

  useEffect(() => { doSearch(page); }, [page]);

  // Load pending requests on mount to disable request button for already-pending books
  useEffect(() => {
    fetch('/api/requests').then(r => r.json()).then(data => {
      const pending = new Set(
        (data.requests || [])
          .filter(r => ['requested', 'approved', 'issued'].includes(r.status))
          .map(r => r.bookId?._id || r.bookId)
      );
      setPendingBookIds(pending);
    }).catch(() => {});
  }, []);

  const requestBook = async (bookId, title) => {
    setRequesting(prev => ({ ...prev, [bookId]: true }));
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Request failed.'); return; }
      showToast(`Request sent for "${title}"! 📚`);
      setPendingBookIds(prev => new Set([...prev, bookId]));
    } catch {
      showToast('Something went wrong.');
    } finally {
      setRequesting(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const selectStyle = {
    padding: '8px 28px 8px 12px', border: '1px solid #E5E7EB', borderRadius: 8,
    fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none',
    fontFamily: 'Inter', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
  };

  return (
    <div style={{ padding: '28px', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', minHeight: '100%' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#6366F1', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>{toast}</div>
      )}

      {/* Search Bar */}
      <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Search size={20} color="#9CA3AF" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search books by title, author, ISBN..."
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#111827', fontFamily: 'Inter', background: 'transparent' }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <X size={18} color="#9CA3AF" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SlidersHorizontal size={16} color="#9CA3AF" />
          <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Filters:</span>
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value === 'All' ? '' : e.target.value); setPage(1); }} style={selectStyle}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={language} onChange={e => { setLanguage(e.target.value === 'All' ? '' : e.target.value); setPage(1); }} style={selectStyle}>
          {LANGS.map(l => <option key={l}>{l}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
          <input type="checkbox" checked={available} onChange={e => { setAvailable(e.target.checked); setPage(1); }}
            style={{ width: 16, height: 16, accentColor: '#6366F1', cursor: 'pointer' }} />
          Available Only
        </label>
        {(category || language || available) && (
          <button onClick={() => { setCategory(''); setLanguage(''); setAvailable(false); setPage(1); }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 12, fontWeight: 600, color: '#EF4444', cursor: 'pointer' }}>
            <X size={12} /> Clear Filters
          </button>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#9CA3AF' }}>
          {loading ? 'Searching...' : `${total} book${total !== 1 ? 's' : ''} found`}
        </span>
      </div>

      {/* Category quick-tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
            style={{
              padding: '6px 14px', borderRadius: 20, border: '1px solid',
              borderColor: (cat === 'All' ? !category : category === cat) ? '#6366F1' : '#E5E7EB',
              background: (cat === 'All' ? !category : category === cat) ? '#EEF2FF' : 'white',
              color: (cat === 'All' ? !category : category === cat) ? '#6366F1' : '#6B7280',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
          <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: '#6366F1' }} />
        </div>
      ) : books.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 80, textAlign: 'center' }}>
          <BookOpen size={48} style={{ margin: '0 auto 16px', color: '#D1D5DB' }} />
          <h3 style={{ fontSize: 16, color: '#374151', fontWeight: 600, margin: '0 0 8px' }}>No books found</h3>
          <p style={{ color: '#9CA3AF', fontSize: 13 }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {books.map(book => {
            const avail  = book.inventory?.available ?? 0;
            const isPending = pendingBookIds.has(book._id?.toString());
            const isRequesting = requesting[book._id];
            return (
              <div key={book._id}
                style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* Cover */}
                <div style={{ height: 180, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #F3F4F6', overflow: 'hidden' }}>
                  <BookCover cover={book.cover} title={book.title} size={100} />
                </div>
                {/* Info */}
                <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4, lineHeight: 1.3, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.title}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>{book.author}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    {book.category && (
                      <span style={{ padding: '3px 8px', borderRadius: 20, background: '#EEF2FF', color: '#6366F1', fontSize: 11, fontWeight: 600 }}>{book.category}</span>
                    )}
                    <span style={{ padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: avail > 0 ? '#F0FDF4' : '#FEF2F2', color: avail > 0 ? '#22C55E' : '#EF4444' }}>
                      {avail > 0 ? `${avail} Available` : 'Unavailable'}
                    </span>
                  </div>
                  {book.isbn && <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 12 }}>ISBN: {book.isbn}</div>}
                  <div style={{ marginTop: 'auto' }}>
                    {isPending ? (
                      <button disabled style={{ width: '100%', padding: '9px', border: '1px solid #C7D2FE', borderRadius: 8, background: '#EEF2FF', color: '#6366F1', fontSize: 13, fontWeight: 600, cursor: 'not-allowed' }}>
                        ✓ Request Sent
                      </button>
                    ) : (
                      <button onClick={() => requestBook(book._id, book.title)} disabled={isRequesting || avail < 1}
                        style={{
                          width: '100%', padding: '9px', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: avail < 1 ? 'not-allowed' : 'pointer', fontFamily: 'Inter', transition: 'all 0.2s',
                          background: avail < 1 ? '#F3F4F6' : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                          color: avail < 1 ? '#9CA3AF' : 'white',
                        }}>
                        {isRequesting ? 'Sending...' : avail < 1 ? 'Not Available' : 'Request Book'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
            style={{ width:36,height:36,borderRadius:8,border:'1px solid #E5E7EB',background:'white',cursor:page===1?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <ChevronLeft size={16} color={page===1?'#D1D5DB':'#374151'} />
          </button>
          {Array.from({length: Math.min(totalPages, 7)}, (_,i) => i+1).map(p=>(
            <button key={p} onClick={()=>setPage(p)} style={{ width:36,height:36,borderRadius:8,border:p===page?'none':'1px solid #E5E7EB',background:p===page?'#6366F1':'white',color:p===page?'white':'#374151',fontSize:13,fontWeight:600,cursor:'pointer' }}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ width:36,height:36,borderRadius:8,border:'1px solid #E5E7EB',background:'white',cursor:page===totalPages?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <ChevronRight size={16} color={page===totalPages?'#D1D5DB':'#374151'} />
          </button>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
