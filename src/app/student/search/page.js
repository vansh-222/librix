'use client';
import { useState, useEffect, useCallback } from 'react';
import TopBar from '@/components/shared/TopBar';
import { Search, Filter, BookOpen, X } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['General', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Mathematics', 'Arts', 'Medicine', 'Law', 'Business', 'Philosophy', 'Literature'];

export default function SearchPage() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', category: '', language: '', available: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 16, ...Object.fromEntries(Object.entries(filters).filter(([,v]) => v)) });
    const res = await fetch(`/api/books?${params}`);
    const data = await res.json();
    setBooks(data.books || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [filters, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const setFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(1); };
  const clearFilters = () => { setFilters({ search: '', category: '', language: '', available: '' }); setPage(1); };
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="Search Books" subtitle={`${total} books in your library`} />

      {/* Search + Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-wrapper" style={{ flex: 1, minWidth: 240 }}>
          <Search size={16} className="search-icon" />
          <input
            className="input search-input"
            placeholder="Search by title, author, or ISBN..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
          />
          {filters.search && (
            <button onClick={() => setFilter('search', '')}
              style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
              <X size={14} />
            </button>
          )}
        </div>

        <button onClick={() => setShowFilters(s => !s)}
          className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
          style={{ gap: 8 }}>
          <Filter size={15} />
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>

        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="btn btn-ghost" style={{ gap: 6 }}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="card" style={{ marginBottom: 24, padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label className="label">Category</label>
              <select className="input" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Language</label>
              <select className="input" value={filters.language} onChange={e => setFilter('language', e.target.value)}>
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>
            <div>
              <label className="label">Availability</label>
              <select className="input" value={filters.available} onChange={e => setFilter('available', e.target.value)}>
                <option value="">All Books</option>
                <option value="true">Available Now</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, height: 260, animation: 'pulse 1.5s ease infinite' }} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No books found</p>
          <p style={{ fontSize: 13 }}>Try adjusting your search or filters</p>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>Clear Filters</button>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
            {books.map((book) => {
              const inv = book.inventory;
              const isAvailable = inv && inv.available > 0;
              return (
                <Link key={book._id} href={`/student/book/${book._id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    {/* Cover */}
                    <div style={{ height: 140, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', position: 'relative', overflow: 'hidden' }}>
                      {book.cover
                        ? <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><BookOpen size={36} color="rgba(255,255,255,0.3)" /></div>
                      }
                      <div style={{ position: 'absolute', top: 8, right: 8 }}>
                        <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: 10 }}>
                          {isAvailable ? `${inv.available} avail.` : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {book.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.author}</div>
                      {book.category && (
                        <span className="badge badge-brand" style={{ marginTop: 8, fontSize: 10 }}>{book.category}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 32 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary btn-sm">← Prev</button>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-secondary btn-sm">Next →</button>
            </div>
          )}
        </>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes pulse { 0%, 100% { opacity: 0.6 } 50% { opacity: 0.3 } }`}</style>
    </div>
  );
}
