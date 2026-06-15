'use client';
import { useState, useEffect, useCallback } from 'react';
import TopBar from '@/components/shared/TopBar';
import { BookOpen, Plus, Search, Edit, Trash2, X, Loader2 } from 'lucide-react';

function AddBookModal({ onClose, onAdded }) {
  const [step, setStep] = useState('search'); // 'search' | 'form'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [form, setForm] = useState({ copies: 1, shelf: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const searchBooks = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/books/search-external?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch { setResults([]); }
    setSearching(false);
  };

  const selectBook = (book) => {
    setSelectedBook(book);
    setStep('form');
  };

  const addManually = () => {
    setSelectedBook({
      title: '', author: '', isbn: '', publisher: '', publishedYear: '',
      cover: '', description: '', category: 'General', language: 'English', pages: 0, source: 'manual',
    });
    setStep('form');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...selectedBook, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onAdded();
      onClose();
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: step === 'search' ? 640 : 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{step === 'search' ? '🔍 Find a Book' : '📚 Add to Library'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
        </div>

        {step === 'search' && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div className="search-wrapper" style={{ flex: 1 }}>
                <Search size={15} className="search-icon" />
                <input className="input search-input" placeholder="Search Google Books / Open Library..." value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchBooks()} />
              </div>
              <button onClick={searchBooks} disabled={searching} className="btn btn-primary" style={{ gap: 6 }}>
                {searching ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={15} />}
                Search
              </button>
            </div>

            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {results.length === 0 && !searching && (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)', fontSize: 13 }}>
                  Search above or <button onClick={addManually} style={{ background: 'none', border: 'none', color: 'var(--brand)', cursor: 'pointer', fontWeight: 600 }}>add manually</button>
                </div>
              )}
              {results.map((book, i) => (
                <div key={i} onClick={() => selectBook(book)} style={{
                  display: 'flex', gap: 12, padding: 12, borderRadius: 8, cursor: 'pointer',
                  border: '1px solid transparent', marginBottom: 8,
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                  <div style={{ width: 44, height: 60, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                    {book.cover ? <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><BookOpen size={16} color="rgba(255,255,255,0.4)" /></div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{book.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{book.author}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      {book.isbn && <span style={{ fontSize: 11, color: 'var(--muted)' }}>ISBN: {book.isbn}</span>}
                      {book.publishedYear && <span style={{ fontSize: 11, color: 'var(--muted)' }}>· {book.publishedYear}</span>}
                      <span className="badge badge-brand" style={{ fontSize: 10 }}>{book.source === 'google_books' ? 'Google Books' : 'Open Library'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16, textAlign: 'center' }}>
              <button onClick={addManually} className="btn btn-ghost btn-sm">+ Add Book Manually</button>
            </div>
          </>
        )}

        {step === 'form' && selectedBook && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'flex-start' }}>
              {selectedBook.cover && (
                <img src={selectedBook.cover} alt="" style={{ width: 52, height: 72, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{selectedBook.title || '—'}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{selectedBook.author}</div>
              </div>
            </div>

            {/* Editable fields for manual */}
            {selectedBook.source === 'manual' && (
              <>
                {[['title', 'Book Title *'], ['author', 'Author *'], ['isbn', 'ISBN'], ['publisher', 'Publisher'], ['category', 'Category'], ['language', 'Language']].map(([k, label]) => (
                  <div key={k} className="form-group">
                    <label className="label">{label}</label>
                    <input className="input" value={selectedBook[k] || ''} onChange={e => setSelectedBook(b => ({ ...b, [k]: e.target.value }))} />
                  </div>
                ))}
              </>
            )}

            {error && <div style={{ color: '#EF4444', fontSize: 13, marginBottom: 12, background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 6 }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="label">Number of Copies *</label>
                <input type="number" className="input" min={1} max={100} value={form.copies}
                  onChange={e => setForm(f => ({ ...f, copies: parseInt(e.target.value) }))} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="label">Shelf Location</label>
                <input className="input" placeholder="e.g. A-12" value={form.shelf}
                  onChange={e => setForm(f => ({ ...f, shelf: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('search')} className="btn btn-ghost" style={{ flex: 1 }}>← Back</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={15} />}
                Add to Library
              </button>
            </div>
          </>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

export default function LibrarianBooksPage() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20, ...(search ? { search } : {}) });
    const res = await fetch(`/api/books?${params}`);
    const data = await res.json();
    setBooks(data.books || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const deleteBook = async (bookId) => {
    if (!confirm('Remove this book from your library?')) return;
    await fetch(`/api/books?bookId=${bookId}`, { method: 'DELETE' });
    fetchBooks();
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar
        title="Books"
        subtitle={`${total} books in library`}
        actions={
          <button onClick={() => setShowAdd(true)} className="btn btn-primary" style={{ gap: 8 }}>
            <Plus size={16} /> Add Book
          </button>
        }
      />

      {/* Search */}
      <div className="search-wrapper" style={{ maxWidth: 400, marginBottom: 24 }}>
        <Search size={15} className="search-icon" />
        <input className="input search-input" placeholder="Search books..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Category</th>
              <th>Total Copies</th>
              <th>Available</th>
              <th>Shelf</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j}><div style={{ height: 16, background: 'var(--surface-2)', borderRadius: 4, animation: 'pulse 1.5s ease infinite' }} /></td>
                  ))}
                </tr>
              ))
            ) : books.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="empty-state">
                  <div className="empty-state-icon">📚</div>
                  <p>No books yet. Add your first book!</p>
                  <button onClick={() => setShowAdd(true)} className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Add Book</button>
                </div>
              </td></tr>
            ) : books.map((book) => (
              <tr key={book._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 48, borderRadius: 4, overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                      {book.cover ? <img src={book.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><BookOpen size={12} color="rgba(255,255,255,0.4)" /></div>}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                      {book.isbn && <div style={{ fontSize: 11, color: 'var(--muted)' }}>ISBN: {book.isbn}</div>}
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--muted)' }}>{book.author}</td>
                <td><span className="badge badge-brand">{book.category}</span></td>
                <td style={{ fontWeight: 600, textAlign: 'center' }}>{book.inventory?.total || 0}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ fontWeight: 700, color: book.inventory?.available > 0 ? '#22C55E' : '#EF4444' }}>
                    {book.inventory?.available || 0}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: 'var(--muted)' }}>{book.inventory?.shelf || '—'}</td>
                <td>
                  <button onClick={() => deleteBook(book._id)} className="btn btn-danger btn-sm" style={{ gap: 4 }}>
                    <Trash2 size={13} /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary btn-sm">← Prev</button>
          <span style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-secondary btn-sm">Next →</button>
        </div>
      )}

      {showAdd && <AddBookModal onClose={() => setShowAdd(false)} onAdded={fetchBooks} />}

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes pulse { 0%, 100% { opacity: 0.6 } 50% { opacity: 0.3 } }`}</style>
    </div>
  );
}
