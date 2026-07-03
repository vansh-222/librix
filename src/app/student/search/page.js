'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, BookOpen, Loader2, ChevronLeft, ChevronRight, X, LayoutGrid, List, Calendar, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function BookCover({ cover, title, size = 80 }) {
  const [err, setErr] = useState(false);
  const height = Math.round(size * 1.35);
  return (
    <div style={{ width: size, height, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
            <BookOpen size={size * 0.3} color="white" />
          </div>
      }
    </div>
  );
}

export default function SearchBooksPage() {
  const urlParams = useSearchParams();
  
  // Search & Filter state
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('relevance');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  // Sidebar Filters state
  const [availFilter, setAvailFilter] = useState('all'); // 'all', 'available', 'issued'
  const [category, setCategory] = useState(urlParams.get('category') || '');
  const [author, setAuthor] = useState('');
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');
  const [language, setLanguage] = useState('');

  // Data state
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  
  // Requesting state
  const [requesting, setRequesting] = useState({});
  const [pendingBookIds, setPendingBookIds] = useState(new Set());

  // Dynamic filter lists loaded from real inventory (NO FAKE DATA)
  const [allCategoriesWithCounts, setAllCategoriesWithCounts] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
  const [allLanguages, setAllLanguages] = useState([]);

  const debounceRef = useRef(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  // Load pending requests and active borrow records
  useEffect(() => {
    Promise.all([
      fetch('/api/requests').then(r => r.json()),
      fetch('/api/borrow').then(r => r.json()),
    ]).then(([reqData, borrowData]) => {
      const pendingReqs = (reqData.requests || [])
        .filter(r => ['requested', 'approved'].includes(r.status))
        .map(r => r.bookId?._id || r.bookId);
      const activeBorrows = (borrowData.records || [])
        .filter(r => ['issued', 'return_pending', 'overdue'].includes(r.status))
        .map(r => r.bookId?._id || r.bookId);
      setPendingBookIds(new Set([...pendingReqs, ...activeBorrows]));
    }).catch(() => {});
  }, []);

  // Fetch all books once on mount to compute REAL category counts, authors, and languages
  useEffect(() => {
    fetch('/api/books?limit=500').then(r => r.json()).then(data => {
      const list = data.books || [];
      const catCounts = {};
      const authorSet = new Set();
      const langSet = new Set();

      list.forEach(b => {
        if (b.category) {
          catCounts[b.category] = (catCounts[b.category] || 0) + 1;
        }
        if (b.author) authorSet.add(b.author);
        if (b.language) langSet.add(b.language);
      });

      const catList = Object.entries(catCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setAllCategoriesWithCounts(catList);
      setAllAuthors(Array.from(authorSet).sort());
      setAllLanguages(Array.from(langSet).sort());
    }).catch(() => {});
  }, []);

  // Search API execution
  const doSearch = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: p,
        limit: viewMode === 'grid' ? 12 : 6,
        ...(query ? { search: query } : {}),
        ...(category ? { category } : {}),
        ...(language ? { language } : {}),
        ...(availFilter === 'available' ? { available: 'true' } : {}),
        ...(sort === 'title_asc' ? { sort: 'title_asc' } : {}),
      });

      const res = await fetch(`/api/books?${params}`);
      const data = await res.json();
      let fetchedBooks = data.books || [];

      // Client-side filtering for fields not directly supported by basic backend query
      if (author) {
        fetchedBooks = fetchedBooks.filter(b => b.author && b.author.toLowerCase() === author.toLowerCase());
      }
      if (availFilter === 'issued') {
        fetchedBooks = fetchedBooks.filter(b => (b.inventory?.available || 0) === 0);
      }
      if (fromYear) {
        fetchedBooks = fetchedBooks.filter(b => {
          const yr = parseInt(b.publishedYear || b.year || 0);
          return yr >= parseInt(fromYear);
        });
      }
      if (toYear) {
        fetchedBooks = fetchedBooks.filter(b => {
          const yr = parseInt(b.publishedYear || b.year || 9999);
          return yr <= parseInt(toYear);
        });
      }

      setBooks(fetchedBooks);
      setTotal(data.total || fetchedBooks.length);
      setTotalPages(data.totalPages || Math.ceil(fetchedBooks.length / (viewMode === 'grid' ? 12 : 6)) || 1);
    } catch {
      showToast('Failed to load books.');
    } finally {
      setLoading(false);
    }
  }, [query, category, language, availFilter, author, fromYear, toYear, sort, viewMode]);

  // Debounce query
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { setPage(1); doSearch(1); }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, category, language, availFilter, author, fromYear, toYear, sort, viewMode, doSearch]);

  useEffect(() => { doSearch(page); }, [page]);

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

  const clearAllFilters = () => {
    setAvailFilter('all');
    setCategory('');
    setAuthor('');
    setFromYear('');
    setToYear('');
    setLanguage('');
    setQuery('');
    setPage(1);
  };

  const selectStyle = {
    width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 8,
    fontSize: 13, color: '#374151', background: 'white', outline: 'none', fontFamily: 'Inter',
  };

  return (
    <div style={{ padding: '28px', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', minHeight: '100%' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#6366F1', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>{toast}</div>
      )}

      {/* Main 2-Column Container matching Screenshot */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: Search & Results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          
          {/* Top Search Bar Row */}
          <div style={{
            background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '14px 18px',
            marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap'
          }}>
            {/* Search Input Box */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 260, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB' }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by title, author, ISBN or keyword..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#111827', fontFamily: 'Inter', background: 'transparent' }}
              />
              {query ? (
                <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <X size={16} color="#9CA3AF" />
                </button>
              ) : (
                <Search size={16} color="#9CA3AF" />
              )}
            </div>

            {/* Sort By & View Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#4B5563', fontWeight: 500 }}>Sort by:</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{
                    padding: '7px 24px 7px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151',
                    background: 'white', outline: 'none', cursor: 'pointer', fontFamily: 'Inter'
                  }}
                >
                  <option value="relevance">Relevance</option>
                  <option value="title_asc">Title (A - Z)</option>
                </select>
              </div>

              {/* View toggle buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F3F4F6', padding: 3, borderRadius: 8 }}>
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  style={{
                    padding: 6, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: viewMode === 'grid' ? 'white' : 'transparent',
                    color: viewMode === 'grid' ? '#6366F1' : '#6B7280',
                    boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s'
                  }}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  title="List View"
                  style={{
                    padding: 6, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: viewMode === 'list' ? 'white' : 'transparent',
                    color: viewMode === 'list' ? '#6366F1' : '#6B7280',
                    boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s'
                  }}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Showing results count */}
          <div style={{ fontSize: 13, color: '#4B5563', fontWeight: 500, marginBottom: 16 }}>
            {loading ? 'Searching catalog...' : `Showing ${books.length > 0 ? ((page - 1) * (viewMode === 'grid' ? 12 : 6)) + 1 : 0}–${((page - 1) * (viewMode === 'grid' ? 12 : 6)) + books.length} of ${total} results`}
          </div>

          {/* Results Area */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
              <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: '#6366F1' }} />
            </div>
          ) : books.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 80, textAlign: 'center' }}>
              <BookOpen size={48} style={{ margin: '0 auto 16px', color: '#D1D5DB' }} />
              <h3 style={{ fontSize: 16, color: '#374151', fontWeight: 600, margin: '0 0 8px' }}>No books found</h3>
              <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0 }}>We couldn't find any books matching your criteria. Try adjusting your search or filters.</p>
            </div>
          ) : viewMode === 'list' ? (
            /* LIST VIEW (Matching Screenshot Exactly) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {books.map(book => {
                const avail = book.inventory?.available ?? 0;
                const isPending = pendingBookIds.has(book._id?.toString());
                const isRequesting = requesting[book._id];
                return (
                  <div
                    key={book._id}
                    style={{
                      background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '18px 20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                  >
                    {/* Left: Cover & Info */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flex: 1, minWidth: 0 }}>
                      <BookCover cover={book.cover} title={book.title} size={82} />
                      
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {book.title}
                        </div>
                        <div style={{ fontSize: 13, color: '#4B5563', marginBottom: 10 }}>{book.author}</div>
                        
                        {book.category && (
                          <div style={{ marginBottom: 12 }}>
                            <span style={{ display: 'inline-block', padding: '3px 12px', background: '#EEF2FF', color: '#6366F1', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                              {book.category}
                            </span>
                          </div>
                        )}
                        
                        <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span>ISBN: {book.isbn || 'N/A'}</span>
                          <span style={{ color: '#D1D5DB' }}>•</span>
                          <span>Pages: {book.pages || '—'}</span>
                          <span style={{ color: '#D1D5DB' }}>•</span>
                          <span>Published: {book.publishedYear || book.year || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Availability & Action Button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, flexShrink: 0 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: avail > 0 ? '#16A34A' : '#D97706', textAlign: 'right' }}>
                          {avail > 0 ? 'Available' : 'Issued'}
                        </div>
                        <div style={{ fontSize: 13, color: '#4B5563', textAlign: 'right', marginTop: 2 }}>
                          {avail > 0 ? `${avail} Cop${avail === 1 ? 'y' : 'ies'}` : '0 Copies'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Link
                          href={`/student/book/${book._id}`}
                          style={{
                            padding: '8px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', color: '#374151',
                            fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.borderColor = '#C7D2FE'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                        >
                          View Details
                        </Link>

                        {isPending ? (
                          <button disabled style={{ padding: '8px 16px', border: '1px solid #C7D2FE', borderRadius: 8, background: '#EEF2FF', color: '#6366F1', fontSize: 13, fontWeight: 600, cursor: 'not-allowed' }}>
                            ✓ Requested
                          </button>
                        ) : avail > 0 ? (
                          <button
                            onClick={() => requestBook(book._id, book.title)}
                            disabled={isRequesting}
                            style={{
                              padding: '8px 18px', border: '1px solid #818CF8', borderRadius: 8, background: 'white', color: '#6366F1',
                              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                          >
                            {isRequesting ? 'Sending...' : 'Request Book'}
                          </button>
                        ) : (
                          <button
                            onClick={() => requestBook(book._id, book.title)}
                            disabled={isRequesting}
                            style={{
                              padding: '8px 18px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', color: '#6B7280',
                              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                          >
                            {isRequesting ? 'Sending...' : 'Join Waitlist'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* GRID VIEW */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {books.map(book => {
                const avail = book.inventory?.available ?? 0;
                const isPending = pendingBookIds.has(book._id?.toString());
                const isRequesting = requesting[book._id];
                return (
                  <div key={book._id}
                    style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ height: 180, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #F3F4F6', overflow: 'hidden' }}>
                      <BookCover cover={book.cover} title={book.title} size={95} />
                    </div>
                    <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4, lineHeight: 1.3, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.title}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 10 }}>{book.author}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        {book.category && (
                          <span style={{ padding: '3px 8px', borderRadius: 20, background: '#EEF2FF', color: '#6366F1', fontSize: 11, fontWeight: 600 }}>{book.category}</span>
                        )}
                        <span style={{ fontSize: 11, fontWeight: 700, color: avail > 0 ? '#16A34A' : '#D97706' }}>
                          {avail > 0 ? 'Available' : 'Issued'}
                        </span>
                      </div>
                      <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
                        <Link
                          href={`/student/book/${book._id}`}
                          style={{
                            flex: 1, padding: '8px 4px', border: '1px solid #E5E7EB', borderRadius: 8, background: '#F9FAFB', color: '#374151',
                            fontSize: 12, fontWeight: 600, textDecoration: 'none', textAlign: 'center', transition: 'all 0.15s'
                          }}
                        >
                          Details
                        </Link>
                        {isPending ? (
                          <button disabled style={{ flex: 1.2, padding: '8px 4px', border: '1px solid #C7D2FE', borderRadius: 8, background: '#EEF2FF', color: '#6366F1', fontSize: 12, fontWeight: 600, cursor: 'not-allowed' }}>✓ Requested</button>
                        ) : (
                          <button onClick={() => requestBook(book._id, book.title)} disabled={isRequesting}
                            style={{
                              flex: 1.2, padding: '8px 4px', border: '1px solid #818CF8', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
                              background: avail > 0 ? 'white' : '#F9FAFB', color: avail > 0 ? '#6366F1' : '#6B7280',
                            }}>
                            {isRequesting ? 'Sending...' : avail > 0 ? 'Request Book' : 'Join Waitlist'}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 28 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 500, color: page === 1 ? '#D1D5DB' : '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ChevronLeft size={16} /> Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: p === page ? 'none' : '1px solid #E5E7EB', background: p === page ? '#6366F1' : 'white', color: p === page ? 'white' : '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 500, color: page === totalPages ? '#D1D5DB' : '#374151', display: 'flex', alignItems: 'center', gap: 4 }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Filters & Categories Sidebar (width ~300px) */}
        <div style={{ width: 300, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Card 1: Filters */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Filters</span>
              <button onClick={clearAllFilters} style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                Clear All
              </button>
            </div>

            {/* Availability */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Availability</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'available', label: 'Available' },
                  { id: 'issued', label: 'Issued' },
                ].map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#4B5563', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={availFilter === opt.id}
                      onChange={() => { setAvailFilter(opt.id); setPage(1); }}
                      style={{ width: 16, height: 16, accentColor: '#6366F1', cursor: 'pointer' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Category Dropdown */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Category</div>
              <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} style={selectStyle}>
                <option value="">All Categories</option>
                {allCategoriesWithCounts.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Author Dropdown */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Author</div>
              <select value={author} onChange={e => { setAuthor(e.target.value); setPage(1); }} style={selectStyle}>
                <option value="">All Authors</option>
                {allAuthors.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Publication Year */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Publication Year</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="number"
                    placeholder="From Year"
                    value={fromYear}
                    onChange={e => { setFromYear(e.target.value); setPage(1); }}
                    style={{ width: '100%', padding: '9px 28px 9px 10px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, outline: 'none', color: '#374151' }}
                  />
                  <Calendar size={13} color="#9CA3AF" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="number"
                    placeholder="To Year"
                    value={toYear}
                    onChange={e => { setToYear(e.target.value); setPage(1); }}
                    style={{ width: '100%', padding: '9px 28px 9px 10px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, outline: 'none', color: '#374151' }}
                  />
                  <Calendar size={13} color="#9CA3AF" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Language */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Language</div>
              <select value={language} onChange={e => { setLanguage(e.target.value); setPage(1); }} style={selectStyle}>
                <option value="">All Languages</option>
                {allLanguages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={() => doSearch(1)}
              style={{
                width: '100%', padding: '11px', background: '#6366F1', color: 'white', border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(99,102,241,0.25)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#4F46E5'}
              onMouseLeave={e => e.currentTarget.style.background = '#6366F1'}
            >
              Apply Filters
            </button>
          </div>

          {/* Card 2: Categories List */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 22 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Categories</div>
            
            {allCategoriesWithCounts.length === 0 ? (
              <div style={{ fontSize: 13, color: '#9CA3AF', padding: '16px 0', textAlign: 'center' }}>
                No category data available
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {allCategoriesWithCounts.slice(0, 7).map(c => (
                  <div
                    key={c.name}
                    onClick={() => { setCategory(c.name); setPage(1); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0',
                      borderBottom: '1px solid #F3F4F6', cursor: 'pointer', transition: 'color 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
                    onMouseLeave={e => e.currentTarget.style.color = '#374151'}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</span>
                    <span style={{ background: '#F3E8FF', color: '#6C5CE7', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                      {c.count}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {allCategoriesWithCounts.length > 0 && (
              <div
                onClick={() => { setCategory(''); setPage(1); }}
                style={{
                  marginTop: 14, fontSize: 13, fontWeight: 600, color: '#6366F1', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <span>View All Categories</span>
                <span>›</span>
              </div>
            )}
          </div>

        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
