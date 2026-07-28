'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import {
  BookOpen, ChevronRight, Search, Plus, Eye, Pencil, Trash2, Upload, BookMarked, MoreHorizontal,
  CheckCircle, RefreshCw, LayoutGrid, Zap, X, BarChart2, CreditCard, ChevronDown, Bell, Loader2
} from 'lucide-react';

const COVER_COLORS = [
  { bg: '#E05252', spine: '#C43A3A' },
  { bg: '#5B8CDB', spine: '#3D6BBF' },
  { bg: '#2B6CB0', spine: '#1A4F8A' },
  { bg: '#D4A017', spine: '#B8880F' },
  { bg: '#4CAF50', spine: '#388E3C' },
  { bg: '#9C27B0', spine: '#7B1FA2' },
  { bg: '#26C6DA', spine: '#00ACC1' },
];

const RECENT_COLORS = ['#5B9BD5', '#7B68EE', '#DA70D6', '#CD853F'];

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const CAT_PALETTE = [
  { bg: '#F3E8FF', color: '#9333EA' }, { bg: '#DBEAFE', color: '#2563EB' },
  { bg: '#DCFCE7', color: '#16A34A' }, { bg: '#FFEDD5', color: '#EA580C' },
  { bg: '#FCE7F3', color: '#DB2777' }, { bg: '#FEF3C7', color: '#D97706' },
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

function BookCover({ color, size = 'md' }) {
  const w = size === 'sm' ? 44 : 52;
  const h = size === 'sm' ? 62 : 72;
  return (
    <div style={{
      width: w, height: h, borderRadius: 4, flexShrink: 0, overflow: 'hidden', position: 'relative',
      boxShadow: '2px 2px 6px rgba(0,0,0,0.18)',
    }}>
      <div style={{ width: '100%', height: '100%', background: color.bg, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, width: 6, height: '100%', background: color.spine }} />
        <div style={{ position: 'absolute', right: 0, top: 0, width: 3, height: '100%', background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <BookOpen size={size === 'sm' ? 14 : 18} color="rgba(255,255,255,0.7)" />
        </div>
      </div>
    </div>
  );
}

/* ── Search & Add Book Modal ─────────────────────────────────────────── */
function SearchBookCover({ cover, title }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: 60, height: 84, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1A73E8,#93C5FD)' }}>
            <BookOpen size={22} color="white" />
          </div>
      }
    </div>
  );
}

function AddBookModal({ onClose, onAdded }) {
  /* Step 1 = search  |  Step 2 = confirm */
  const [step, setStep]           = useState(1);
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState('');
  const [selected, setSelected]   = useState(null);
  const [form, setForm]           = useState({ copies: '1', shelf: '', section: '', floor: '' });
  const [saving, setSaving]       = useState(false);
  const [saveErr, setSaveErr]     = useState('');
  const debounceRef               = useRef(null);

  const upd = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  /* Live search with 500ms debounce */
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setSearching(true); setSearchErr('');
      try {
        const res  = await fetch(`/api/books/search-external?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Search failed');
        setResults(data.results || []);
        if ((data.results || []).length === 0) setSearchErr('No books found. Try a different search.');
      } catch (e) { setSearchErr(e.message || 'Search failed. Check your connection.'); }
      finally { setSearching(false); }
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const pickBook = (book) => { setSelected(book); setStep(2); };

  const saveBook = async (e) => {
    e.preventDefault();
    if (!parseInt(form.copies) || parseInt(form.copies) < 1) { setSaveErr('Enter at least 1 copy.'); return; }
    setSaving(true); setSaveErr('');
    try {
      const res  = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:         selected.title,
          author:        selected.author,
          isbn:          selected.isbn          || '',
          publisher:     selected.publisher     || '',
          publishedYear: selected.publishedYear || '',
          cover:         selected.cover         || '',
          description:   selected.description   || '',
          category:      selected.category      || 'General',
          language:      selected.language      || 'en',
          pages:         selected.pages         || 0,
          source:        selected.source        || 'google_books',
          googleBooksId: selected.googleBooksId || '',
          openLibraryId: selected.openLibraryId || '',
          copies:  parseInt(form.copies),
          shelf:   form.shelf,
          section: form.section,
          floor:   form.floor,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSaveErr(data.error || 'Failed to add book.'); return; }
      onAdded?.();
      onClose();
    } catch { setSaveErr('Something went wrong. Please try again.'); }
    finally { setSaving(false); }
  };

  const INP = { width: '100%', padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', fontFamily: 'Inter', boxSizing: 'border-box' };
  const LBL = { fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
      onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 16, width: step === 1 ? 680 : 520, maxWidth: '96vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 48px rgba(0,0,0,0.25)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>
              {step === 1 ? '📚 Search & Add Book' : '📋 Add to Library'}
            </div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
              {step === 1 ? 'Search by title, author or ISBN' : 'Set inventory details for this book'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {step === 2 && (
              <button type="button" onClick={() => { setStep(1); setSaveErr(''); }}
                style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', fontSize: 13, fontWeight: 500, color: '#374151', cursor: 'pointer', fontFamily: 'Inter' }}>
                ← Back
              </button>
            )}
            <button type="button" onClick={onClose} style={{ border: 'none', background: '#F3F4F6', borderRadius: 8, cursor: 'pointer', display: 'flex', padding: 8 }}>
              <X size={16} color="#6B7280" />
            </button>
          </div>
        </div>

        {/* ── STEP 1: Search ── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Search input */}
            <div style={{ padding: '16px 24px', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder='Search by title, author, or ISBN… e.g. "Atomic Habits"'
                  style={{ ...INP, paddingLeft: 38, paddingRight: searching ? 38 : 12 }}
                />
                {searching && (
                  <Loader2 size={16} color="#1A73E8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', animation: 'spin 0.8s linear infinite' }} />
                )}
              </div>
            </div>

            {/* Results */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
              {!query.trim() && !searching && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
                  <BookOpen size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Start typing to search books</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Powered by Google Books + Open Library</div>
                </div>
              )}

              {searchErr && !searching && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#EF4444' }}>
                  <div style={{ fontSize: 14 }}>{searchErr}</div>
                </div>
              )}

              {!searching && results.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {results.map((book, i) => (
                    <div key={book.googleBooksId || book.openLibraryId || i}
                      style={{ display: 'flex', gap: 14, padding: '14px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white', alignItems: 'flex-start', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A73E8'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,115,232,0.12)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <SearchBookCover cover={book.cover} title={book.title} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 3, lineHeight: 1.3 }}>{book.title}</div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>by {book.author}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                          {book.category && <span style={{ padding: '2px 8px', borderRadius: 20, background: '#EFF6FF', color: '#1A73E8', fontSize: 11, fontWeight: 600 }}>{book.category}</span>}
                          {book.isbn     && <span style={{ padding: '2px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280', fontSize: 11 }}>ISBN: {book.isbn}</span>}
                          {book.publishedYear && <span style={{ padding: '2px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280', fontSize: 11 }}>{book.publishedYear}</span>}
                          {book.publisher && <span style={{ padding: '2px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280', fontSize: 11 }}>{book.publisher}</span>}
                          <span style={{ padding: '2px 8px', borderRadius: 20, background: book.source === 'google_books' ? '#DCFCE7' : '#FEF3C7', color: book.source === 'google_books' ? '#16A34A' : '#D97706', fontSize: 11, fontWeight: 600 }}>
                            {book.source === 'google_books' ? 'Google Books' : 'Open Library'}
                          </span>
                        </div>
                        {book.description && (
                          <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {book.description}
                          </div>
                        )}
                      </div>
                      <button type="button" onClick={() => pickBook(book)}
                        style={{ flexShrink: 0, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1A73E8', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap' }}>
                        Add to Library
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Confirm & save ── */}
        {step === 2 && selected && (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <form onSubmit={saveBook} style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Selected book preview */}
              <div style={{ display: 'flex', gap: 14, padding: 14, background: '#F9FAFB', borderRadius: 12, border: '1px solid #E5E7EB' }}>
                <SearchBookCover cover={selected.cover} title={selected.title} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{selected.title}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>by {selected.author}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {selected.category && <span style={{ padding: '2px 8px', borderRadius: 20, background: '#EFF6FF', color: '#1A73E8', fontSize: 11, fontWeight: 600 }}>{selected.category}</span>}
                    {selected.isbn && <span style={{ padding: '2px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280', fontSize: 11 }}>ISBN: {selected.isbn}</span>}
                    {selected.publishedYear && <span style={{ padding: '2px 8px', borderRadius: 20, background: '#F3F4F6', color: '#6B7280', fontSize: 11 }}>{selected.publishedYear}</span>}
                  </div>
                </div>
              </div>

              {/* Inventory form */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #F3F4F6' }}>
                  Library Inventory Details
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={LBL}>Total Copies <span style={{ color: '#EF4444' }}>*</span></label>
                    <input type="number" min="1" max="999" required value={form.copies} onChange={upd('copies')}
                      placeholder="e.g. 5" style={INP} />
                  </div>
                  <div>
                    <label style={LBL}>Shelf Number</label>
                    <input value={form.shelf} onChange={upd('shelf')} placeholder="e.g. A-12" style={INP} />
                  </div>
                  <div>
                    <label style={LBL}>Section</label>
                    <input value={form.section} onChange={upd('section')} placeholder="e.g. Science" style={INP} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={LBL}>Floor</label>
                    <input value={form.floor} onChange={upd('floor')} placeholder="e.g. Ground Floor" style={INP} />
                  </div>
                </div>
              </div>

              {saveErr && <div style={{ fontSize: 12, color: '#DC2626', background: '#FEF2F2', padding: '8px 12px', borderRadius: 8 }}>{saveErr}</div>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={onClose}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ flex: 2, padding: '11px 0', borderRadius: 8, border: 'none', background: '#1A73E8', color: 'white', fontSize: 13, fontWeight: 700, cursor: saving ? 'wait' : 'pointer', fontFamily: 'Inter', opacity: saving ? 0.75 : 1 }}>
                  {saving ? '⏳ Saving…' : '✓ Add to Library'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function BooksManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [books, setBooks]               = useState([]);
  const [statsData, setStatsData]       = useState({});
  const [search, setSearch]             = useState('');
  const [catFilter, setCatFilter]       = useState('');
  const [availFilter, setAvailFilter]   = useState('');
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [deleting, setDeleting]         = useState('');
  const [toast, setToast]               = useState('');
  const PAGE_SIZE = 7;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadBooks = useCallback(async () => {
    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (search)      params.set('search', search);
    if (catFilter)   params.set('category', catFilter);
    if (availFilter === 'available') params.set('available', 'true');
    const res  = await fetch('/api/books?' + params);
    const data = await res.json();
    setBooks(data.books || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
  }, [page, search, catFilter, availFilter]);

  const loadStats = useCallback(async () => {
    const res  = await fetch('/api/stats');
    const data = await res.json();
    setStatsData(data);
  }, []);

  useEffect(() => { loadBooks(); }, [loadBooks]);
  useEffect(() => { loadStats();  }, [loadStats]);

  const deleteBook = async (bookId) => {
    if (!confirm('Remove this book from the catalog?')) return;
    setDeleting(bookId);
    try {
      await fetch(`/api/books?bookId=${bookId}`, { method: 'DELETE' });
      showToast('Book removed.');
      loadBooks();
      loadStats();
    } finally { setDeleting(''); }
  };

  // Build stat cards from live data
  const availableBooks = books.reduce((s, b) => s + (b.inventory?.available || 0), 0);
  const issuedBooks    = (statsData.activeBorrows || 0);

  const STATS = [
    { icon: <BookOpen size={22} color="#1A73E8" />,   iconBg: '#EFF6FF', value: statsData.totalBooks ?? '…',  label: 'Total Books'      },
    { icon: <CheckCircle size={22} color="#16A34A" />, iconBg: '#DCFCE7', value: availableBooks || '…',         label: 'Available Books'  },
    { icon: <RefreshCw size={22} color="#EA580C" />,   iconBg: '#FFEDD5', value: issuedBooks || '…',            label: 'Issued Books'     },
    { icon: <LayoutGrid size={22} color="#DC2626" />,  iconBg: '#FEE2E2', value: statsData.totalMembers ?? '…', label: 'Active Members'   },
  ];

  // Derive recently added (first 4 by date desc)
  const RECENT = [...books].slice(0, 4).map(b => ({
    title:  b.title,
    author: b.author,
    date:   fmtDate(b.createdAt),
  }));

  // Derive category counts from current page
  const catMap = {};
  books.forEach(b => { catMap[b.category || 'General'] = (catMap[b.category || 'General'] || 0) + 1; });
  const CAT_ICONS = [
    <BookOpen size={15} color="#9333EA" />,
    <BarChart2 size={15} color="#2563EB" />,
    <CreditCard size={15} color="#16A34A" />,
    <Bell size={15} color="#DB2777" />,
    <BookMarked size={15} color="#EA580C" />,
    <MoreHorizontal size={15} color="#4B5563" />,
  ];
  const CATS = Object.entries(catMap).slice(0, 6).map(([label, count], i) => ({
    icon:  CAT_ICONS[i] || <BookOpen size={15} color="#9333EA" />,
    bg:    CAT_PALETTE[i]?.bg    || '#F3E8FF',
    label, count,
  }));

  const QUICK_ACTIONS = [
    { icon: <Plus size={15} color="white" />, label: 'Add New Book', onClick: () => setShowAddModal(true) },
    { icon: <Upload size={15} color="white" />, label: 'Import Books', onClick: () => showToast('Import coming soon.') },
  ];

  // Pagination pages array
  const pagesArr = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => String(i + 1));

  return (
    <LibrarianLayout
      title="Books Management"
      subtitle="Manage and organize your library collection"
      searchPlaceholder="Search books by title, author, ISBN..."
    >
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
        
        {/* Left scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 24px 32px', minWidth: 0, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

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
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#1A73E8', cursor: 'pointer' }}>View all</span>
                        <ChevronRight size={12} color="#1A73E8" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter / toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', minWidth: 160 }}>
                <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  placeholder="Search books..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', fontFamily: 'Inter', background: 'white' }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <select style={selStyle} value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
                  <option value="">All Categories</option>
                  {['Self Help','Productivity','Motivation','Finance','Programming','Psychology','Fiction','Science'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={12} color="#6B7280" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>

              <div style={{ position: 'relative' }}>
                <select style={selStyle} value={availFilter} onChange={e => { setAvailFilter(e.target.value); setPage(1); }}>
                  <option value="">Availability</option>
                  <option value="available">Available Only</option>
                </select>
                <ChevronDown size={12} color="#6B7280" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>

              <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter' }}>
                <Zap size={14} color="#1A73E8" />
                Filters
              </button>

              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', borderRadius: 8, background: '#1A73E8', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', marginLeft: 'auto' }}
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
                  {books.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#9CA3AF' }}>No books found.</td></tr>
                  ) : books.map((b, i) => {
                    const inv   = b.inventory || {};
                    const avail = inv.available ?? 0;
                    const invTotal = inv.total ?? 0;
                    const pal   = CAT_PALETTE[i % CAT_PALETTE.length];
                    return (
                    <tr key={b._id} className="tr-hover" style={{ borderBottom: i < books.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                      <td style={{ ...TD_STYLE, padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <BookCover color={COVER_COLORS[i % COVER_COLORS.length]} />
                          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: '18px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>ISBN: {b.isbn || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...TD_STYLE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.author}</td>
                      <td style={TD_STYLE}>
                        <span style={{ padding: '3px 10px', background: pal.bg, color: pal.color, borderRadius: 9999, fontSize: 11, fontWeight: 500, display: 'inline-block' }}>{b.category || 'General'}</span>
                      </td>
                      <td style={{ ...TD_STYLE, color: avail > 0 ? '#16A34A' : '#DC2626', fontWeight: 600, textAlign: 'center' }}>{avail}</td>
                      <td style={{ ...TD_STYLE, textAlign: 'center' }}>{invTotal}</td>
                      <td style={TD_STYLE}>
                        <span style={{ padding: '3px 10px', background: avail > 0 ? '#DCFCE7' : '#FEE2E2', color: avail > 0 ? '#15803D' : '#DC2626', borderRadius: 9999, fontSize: 11, fontWeight: 500 }}>{avail > 0 ? 'Available' : 'Unavailable'}</span>
                      </td>
                      <td style={{ ...TD_STYLE, padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                          <button type="button" className="act-btn" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
                            <Eye size={16} color="#1A73E8" />
                          </button>
                          <button type="button" className="act-btn" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
                            <Pencil size={16} color="#1A73E8" />
                          </button>
                          <button type="button" className="act-btn" onClick={() => deleteBook(b._id)} disabled={deleting === b._id} style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', opacity: deleting === b._id ? 0.4 : 1 }}>
                            <Trash2 size={16} color="#EF4444" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ); })}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE,total)} of {total} results</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <button type="button" className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} style={{ minWidth: 32, height: 32, padding: '0 8px', border: '1px solid transparent', borderRadius: 8, background: 'transparent', color: '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>‹</button>
                  {pagesArr.map((p) => (
                    <button key={p} type="button" onClick={() => setPage(Number(p))} className={String(page) !== p ? 'page-btn' : ''} style={{ minWidth: 32, height: 32, padding: '0 8px', border: String(page) === p ? 'none' : '1px solid transparent', borderRadius: 8, background: String(page) === p ? '#1A73E8' : 'transparent', color: String(page) === p ? 'white' : '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>{p}</button>
                  ))}
                  <button type="button" className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p+1))} style={{ minWidth: 32, height: 32, padding: '0 8px', border: '1px solid transparent', borderRadius: 8, background: 'transparent', color: '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>›</button>
                </div>
                <div style={{ position: 'relative' }}>
                  <select style={{ ...selStyle, fontSize: 13 }}>
                    <option>7 / page</option>
                  </select>
                  <ChevronDown size={12} color="#6B7280" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Panel */}
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
              <span style={{ fontSize: 12, fontWeight: 500, color: '#1A73E8', cursor: 'pointer' }}>View All</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RECENT.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < RECENT.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
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

          <div style={{ height: 1, background: '#F3F4F6' }} />

          {/* Categories */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Categories</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: '#1A73E8', cursor: 'pointer' }}>View All</span>
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
                  <div style={{ width: 30, height: 30, background: '#1A73E8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {q.icon}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{q.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1001, background: '#1A73E8', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(26,115,232,0.4)' }}>{toast}</div>}
      {showAddModal && <AddBookModal onClose={() => setShowAddModal(false)} onAdded={() => { loadBooks(); loadStats(); showToast('Book added! 📚'); }} />}

      <style jsx>{`
        .cat-row:hover { background: #F9FAFB; }
        .qa-row:hover { background: #F9FAFB; }
        .page-btn:hover { border-color: #E5E7EB !important; background: #F9FAFB !important; }
      `}</style>
    </LibrarianLayout>
  );
}
