'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  BookOpen, Star, Calendar, Clock, ChevronLeft, ChevronRight,
  Loader2, Heart, Bell, Trash2, ArrowRight, X, CheckCircle, BookMarked,
  MessageSquare, User, FileText, History
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function daysUntil(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Book Cover ───────────────────────────────────────────────────────────────
function BookCover({ cover, title, size = 64 }) {
  const [err, setErr] = useState(false);
  const height = Math.round(size * 1.38);
  return (
    <div style={{ width: size, height, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1A73E8,#93C5FD)', color: 'white', padding: 4, textAlign: 'center' }}>
            <BookOpen size={size * 0.35} />
          </div>
      }
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function DueBadge({ days }) {
  if (days < 0) return <span style={{ padding: '4px 12px', borderRadius: 20, background: '#FEF2F2', color: '#EF4444', fontSize: 12, fontWeight: 700, border: '1px solid #FECACA' }}>Overdue</span>;
  if (days <= 3) return <span style={{ padding: '4px 12px', borderRadius: 20, background: '#FFF1F2', color: '#E11D48', fontSize: 12, fontWeight: 700, border: '1px solid #FFE4E6' }}>Due in {days}d</span>;
  return <span style={{ padding: '4px 12px', borderRadius: 20, background: '#FFFBEB', color: '#D97706', fontSize: 12, fontWeight: 700, border: '1px solid #FEF3C7' }}>Due in {days} days</span>;
}

// ─── Star Selector ────────────────────────────────────────────────────────────
function StarSelector({ rating, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
        >
          <Star size={28}
            fill={(hover || rating) >= i ? '#F59E0B' : 'none'}
            color={(hover || rating) >= i ? '#F59E0B' : '#D1D5DB'}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Book Detail Modal (Step 1: Book Info + Return) ───────────────────────────
function BookDetailModal({ rec, onClose, onReturnSuccess }) {
  const [returning, setReturning] = useState(false);
  const book = rec.bookId || {};
  const days = daysUntil(rec.dueDate);

  const handleReturn = async () => {
    setReturning(true);
    try {
      const res = await fetch('/api/borrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId: rec._id, action: 'mark_return' }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to initiate return. Please try again.');
        return;
      }
      onReturnSuccess(rec);
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setReturning(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'modalIn 0.2s ease' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#1A73E8,#1A73E8)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.75, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Book Details</div>
            <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.25 }}>{book.title || 'Book'}</div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{book.author}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {/* Book cover + meta */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
            <BookCover cover={book.cover} title={book.title} size={80} />
            <div style={{ flex: 1 }}>
              {book.category && (
                <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 20, background: '#EFF6FF', color: '#1A73E8', fontSize: 11, fontWeight: 700, marginBottom: 10 }}>
                  {book.category}
                </span>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                  <User size={14} color="#9CA3AF" />
                  <span><span style={{ color: '#6B7280' }}>Author: </span><strong>{book.author || '—'}</strong></span>
                </div>
                {book.isbn && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                    <FileText size={14} color="#9CA3AF" />
                    <span><span style={{ color: '#6B7280' }}>ISBN: </span><strong>{book.isbn}</strong></span>
                  </div>
                )}
                {book.language && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                    <MessageSquare size={14} color="#9CA3AF" />
                    <span><span style={{ color: '#6B7280' }}>Language: </span><strong>{book.language}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Issue & Due dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: '14px 16px', background: '#F9FAFB', borderRadius: 10, border: '1px solid #F3F4F6' }}>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={12} /> Issued On
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{fmtDate(rec.issueDate)}</div>
            </div>
            <div style={{ padding: '14px 16px', background: days < 0 ? '#FEF2F2' : days <= 3 ? '#FFF1F2' : '#F9FAFB', borderRadius: 10, border: `1px solid ${days < 0 ? '#FECACA' : days <= 3 ? '#FFE4E6' : '#F3F4F6'}` }}>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> Due Date
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: days < 0 ? '#EF4444' : days <= 3 ? '#E11D48' : '#111827' }}>{fmtDate(rec.dueDate)}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: days < 0 ? '#EF4444' : '#D97706', marginTop: 2 }}>
                {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today!' : `${days} days remaining`}
              </div>
            </div>
          </div>

          {/* Fine notice if any */}
          {rec.fine > 0 && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 18 }}>⚠️</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>Fine: ₹{rec.fine}</div>
                <div style={{ fontSize: 11, color: '#EF4444', opacity: 0.8 }}>Fine will be calculated upon return</div>
              </div>
            </div>
          )}

          {/* Status */}
          {rec.status === 'return_pending' ? (
            <div style={{ padding: '16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>⏳</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A73E8' }}>Return Pending</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Waiting for librarian confirmation</div>
            </div>
          ) : (
            <button
              onClick={handleReturn}
              disabled={returning}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: returning ? '#9CA3AF' : 'linear-gradient(135deg,#1A73E8,#1A73E8)',
                color: 'white', fontSize: 15, fontWeight: 700, cursor: returning ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxShadow: returning ? 'none' : '0 4px 16px rgba(26,115,232,0.35)',
                transition: 'all 0.2s',
              }}
            >
              {returning
                ? <><Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> Processing...</>
                : <><BookMarked size={18} /> Return This Book</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Feedback Modal (Step 2: Rating + Review) ─────────────────────────────────
function FeedbackModal({ rec, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const book = rec.bookId || {};

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please give a star rating before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/borrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId: rec._id, action: 'rate', rating, reviewNote: review }),
      });
      onSubmit();
    } catch {
      alert('Failed to save feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 420, boxShadow: '0 24px 60px rgba(0,0,0,0.2)', animation: 'modalIn 0.2s ease' }}>
        {/* Success banner */}
        <div style={{ background: 'linear-gradient(135deg,#22C55E,#16A34A)', padding: '24px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <CheckCircle size={32} color="white" />
          </div>
          <div style={{ color: 'white', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Book Return Initiated!</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>Librarian will confirm your return shortly</div>
        </div>

        {/* Feedback form */}
        <div style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>How was "{book.title}"?</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>Share your reading experience</div>
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <StarSelector rating={rating} onChange={setRating} />
            <div style={{ fontSize: 14, fontWeight: 700, color: rating ? '#F59E0B' : '#9CA3AF', minHeight: 20 }}>
              {labels[rating]}
            </div>
          </div>

          {/* Review text */}
          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder="Write a short review (optional)..."
            maxLength={300}
            rows={3}
            style={{
              width: '100%', padding: '12px 14px', border: '1px solid #E5E7EB', borderRadius: 10,
              fontSize: 13, color: '#374151', resize: 'none', outline: 'none', fontFamily: 'Inter, sans-serif',
              lineHeight: 1.6, marginBottom: 4,
            }}
          />
          <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'right', marginBottom: 20 }}>{review.length}/300</div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #E5E7EB', background: 'white', color: '#6B7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              style={{
                flex: 2, padding: '12px', borderRadius: 10, border: 'none',
                background: rating === 0 ? '#F3F4F6' : 'linear-gradient(135deg,#1A73E8,#1A73E8)',
                color: rating === 0 ? '#9CA3AF' : 'white',
                fontSize: 14, fontWeight: 700, cursor: rating === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}
            >
              {submitting ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Star size={16} fill={rating > 0 ? 'white' : 'none'} />}
              {submitting ? 'Saving...' : 'Submit Feedback'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Success Toast Modal (Step 3: Confirm) ────────────────────────────────────
function SuccessToast({ bookTitle, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1002, background: 'white', border: '1px solid #BBF7D0', borderRadius: 14, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.14)', minWidth: 340, animation: 'modalIn 0.2s ease' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <CheckCircle size={22} color="#16A34A" />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Return & Feedback Saved!</div>
        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>"{bookTitle}" moved to Reading History</div>
      </div>
      <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
        <X size={16} />
      </button>
    </div>
  );
}

const ITEMS_PER_PAGE = 5;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyBooksPage() {
  const { data: session, status } = useSession();
  const [tab, setTab]          = useState('borrowed');
  const [records, setRecords]  = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [page, setPage]        = useState(1);
  const [sortBy, setSortBy]    = useState('due_near');
  const [toast, setToast]      = useState('');

  // Modal state machine: null | { step: 'detail'|'feedback'|'success', rec }
  const [modal, setModal] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      // Accrue any running fines for overdue books first
      await fetch('/api/borrow/accrue-fines', { method: 'POST' });
      const res = await fetch('/api/borrow', { cache: 'no-store' });
      const data = await res.json();
      setRecords(data.records || []);
    } catch { showToast('Failed to load records.'); }
    finally { setLoading(false); }
  }, []);

  const loadWishlist = () => {
    try {
      const stored = localStorage.getItem('librix_wishlist');
      if (stored) {
        const parsed = JSON.parse(stored);
        setWishlist(Array.isArray(parsed) ? parsed : []);
      }
    } catch {}
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user?.id) { setLoading(false); return; }
    loadRecords();
    loadWishlist();
  }, [loadRecords, session?.user?.id, status]);

  const removeFromWishlist = (bookId) => {
    const next = wishlist.filter(item => (item._id || item.id) !== bookId);
    setWishlist(next);
    try { localStorage.setItem('librix_wishlist', JSON.stringify(next)); } catch {}
    showToast('Removed from Wishlist');
  };

  // Filter & sort
  let displayed = [];
  if (tab === 'borrowed') {
    displayed = records.filter(r => ['issued', 'return_pending', 'overdue'].includes(r.status));
    if (sortBy === 'due_near') displayed.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    else displayed.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
  } else if (tab === 'history') {
    displayed = records.filter(r => r.status === 'returned');
    displayed.sort((a, b) => new Date(b.returnDate || b.updatedAt) - new Date(a.returnDate || a.updatedAt));
  } else if (tab === 'wishlist') {
    displayed = wishlist;
  }

  const totalPages = Math.max(1, Math.ceil(displayed.length / ITEMS_PER_PAGE));
  const paged = displayed.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Stats
  const activeRecords = records.filter(r => ['issued', 'return_pending', 'overdue'].includes(r.status));
  const completedRecords = records.filter(r => r.status === 'returned');
  const overdueRecords = records.filter(r => ['issued', 'overdue'].includes(r.status) && daysUntil(r.dueDate) < 0);
  const activeCount = activeRecords.length;
  const completedCount = completedRecords.length;
  const overdueCount = overdueRecords.length;
  const totalBooksRead = activeCount + completedCount;
  const totalFineAmount = records.reduce((s, r) => s + (r.fine || 0), 0);
  const paidFineAmount = records.filter(r => r.fineStatus === 'paid').reduce((s, r) => s + (r.fine || 0), 0);
  const outstandingFineAmount = Math.max(0, totalFineAmount - paidFineAmount);
  const upcoming = [...activeRecords].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3);

  // Donut chart
  const R = 40, cx = 50, cy = 50, C = 2 * Math.PI * R;
  let off = 0;
  const segs = [
    { color: '#22C55E', count: completedCount },
    { color: '#1A73E8', count: activeCount },
    { color: '#EF4444', count: overdueCount },
  ].map(s => { const d = totalBooksRead ? (s.count / Math.max(totalBooksRead, 1)) * C : 0; const el = { ...s, dash: d, offset: off }; off += d; return el; });

  const TABS = [
    { key: 'borrowed', label: 'Currently Borrowed', icon: <BookOpen size={15} /> },
    { key: 'history',  label: 'Borrow History',     icon: <Clock size={15} /> },
    { key: 'wishlist', label: 'Wishlist',           icon: <Heart size={15} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100%', fontFamily: 'Inter,sans-serif', background: '#F9FAFB' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .book-row:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.07); border-color: #BFDBFE !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#1A73E8', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(26,115,232,0.4)' }}>{toast}</div>
      )}

      {/* ─── MODAL SYSTEM ─── */}
      {modal?.step === 'detail' && (
        <BookDetailModal
          rec={modal.rec}
          onClose={() => setModal(null)}
          onReturnSuccess={(rec) => setModal({ step: 'feedback', rec })}
        />
      )}
      {modal?.step === 'feedback' && (
        <FeedbackModal
          rec={modal.rec}
          onClose={() => { setModal({ step: 'success', rec: modal.rec }); loadRecords(); }}
          onSubmit={() => { setModal({ step: 'success', rec: modal.rec }); loadRecords(); }}
        />
      )}
      {modal?.step === 'success' && (
        <SuccessToast
          bookTitle={modal.rec?.bookId?.title || 'Book'}
          onClose={() => setModal(null)}
        />
      )}

      {/* ═══ MAIN AREA ═══ */}
      <div style={{ flex: 1, padding: '28px 24px', minWidth: 0, overflowY: 'auto' }}>
        
        
        {/* Tab Bar */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', marginBottom: 24, overflow: 'hidden' }}>
          {TABS.map((t, i) => {
            const isActive = tab === t.key;
            return (
              <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }} style={{
                flex: 1, padding: '14px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 14, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#1A73E8' : '#6B7280',
                borderBottom: isActive ? '2px solid #1A73E8' : '2px solid transparent',
                borderRight: i < TABS.length - 1 ? '1px solid #E5E7EB' : 'none', transition: 'all 0.15s',
              }}>
                {t.icon} {t.label} {t.key === 'wishlist' && wishlist.length > 0 && `(${wishlist.length})`}
              </button>
            );
          })}
        </div>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
            {tab === 'borrowed' && `Currently Borrowed Books (${displayed.length})`}
            {tab === 'history' && `Borrow History (${displayed.length})`}
            {tab === 'wishlist' && `Saved in Wishlist (${displayed.length})`}
          </div>
          {tab === 'borrowed' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
              <span>Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', color: '#111827', fontWeight: 600, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                <option value="due_near">Due Date (Nearest)</option>
                <option value="due_far">Due Date (Farthest)</option>
              </select>
            </div>
          )}
        </div>

        {/* Book List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite', color: '#1A73E8' }} />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {paged.length === 0 ? (
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 60, textAlign: 'center' }}>
                  <BookOpen size={48} style={{ margin: '0 auto 16px', color: '#D1D5DB' }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
                    {tab === 'borrowed' && 'No Currently Borrowed Books'}
                    {tab === 'history' && 'No Borrowing History Yet'}
                    {tab === 'wishlist' && 'Your Wishlist is Empty'}
                  </h3>
                  <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 20 }}>
                    {tab === 'borrowed' && 'When you borrow books from the library, they will appear here.'}
                    {tab === 'history' && 'Books that you return will be archived here for your reference.'}
                    {tab === 'wishlist' && 'Explore our catalog and save books you want to read!'}
                  </p>
                  <Link href="/student/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#1A73E8', color: 'white', borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
                    Explore Catalog <ArrowRight size={16} />
                  </Link>
                </div>
              ) : tab === 'wishlist' ? (
                // ── Wishlist items ──
                paged.map((book, idx) => (
                  <div key={book._id || idx} className="book-row" style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 18, transition: 'all 0.2s' }}>
                    <BookCover cover={book.cover} title={book.title} size={64} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{book.title}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{book.author || 'Unknown Author'}</div>
                      {book.category && <span style={{ padding: '3px 12px', borderRadius: 20, background: '#EFF6FF', color: '#1A73E8', fontSize: 11, fontWeight: 700 }}>{book.category}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Link href={`/student/book/${book._id || book.id}`} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', color: '#1A73E8', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                        View Details
                      </Link>
                      <button onClick={() => removeFromWishlist(book._id || book.id)} style={{ padding: '8px', borderRadius: 8, border: '1px solid #FECACA', background: '#FEF2F2', color: '#EF4444', cursor: 'pointer', display: 'flex' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // ── Borrowed / History items ──
                paged.map(rec => {
                  const book = rec.bookId || {};
                  const days = daysUntil(rec.dueDate);
                  const isPending = rec.status === 'return_pending';

                  return (
                    <div key={rec._id} className="book-row" style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 18, transition: 'all 0.2s' }}>
                      <BookCover cover={book.cover} title={book.title} size={68} />

                      {/* Info */}
                      <div style={{ flex: 1.2, minWidth: 160 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 3, lineHeight: 1.3 }}>{book.title || 'Unknown Book'}</div>
                        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{book.author}</div>
                        {book.category && <span style={{ padding: '4px 12px', borderRadius: 20, background: '#EFF6FF', color: '#1A73E8', fontSize: 11, fontWeight: 700 }}>{book.category}</span>}
                      </div>

                      {/* Dates */}
                      <div style={{ flex: 1.5, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Issued On</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#374151', fontWeight: 600 }}>
                            <Calendar size={13} color="#6B7280" /> {fmtDate(rec.issueDate)}
                          </div>
                        </div>
                        {tab === 'borrowed' ? (
                          <div>
                            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Due Date</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: days < 0 ? '#EF4444' : '#374151', fontWeight: 600 }}>
                              <Calendar size={13} color={days < 0 ? '#EF4444' : '#6B7280'} /> {fmtDate(rec.dueDate)}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Returned On</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#374151', fontWeight: 600 }}>
                              <Calendar size={13} color="#6B7280" /> {fmtDate(rec.returnDate || rec.updatedAt)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right side: badge + button */}
                      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, minWidth: 140 }}>
                        {tab === 'borrowed' ? (
                          <>
                            {isPending
                              ? <span style={{ padding: '4px 12px', borderRadius: 20, background: '#EFF6FF', color: '#1A73E8', fontSize: 12, fontWeight: 700, border: '1px solid #BFDBFE' }}>Return Pending</span>
                              : <DueBadge days={days} />
                            }
                            {rec.fine > 0 && <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 700 }}>Fine: ₹{rec.fine}</span>}
                            {/* View Details opens modal */}
                            <button
                              onClick={() => setModal({ step: 'detail', rec })}
                              style={{ width: '100%', padding: '8px 16px', borderRadius: 8, border: '1px solid #BFDBFE', background: '#EFF6FF', color: '#1A73E8', fontSize: 13, fontWeight: 700, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#1A73E8'; e.currentTarget.style.color = 'white'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#1A73E8'; }}
                            >
                              View Details
                            </button>
                          </>
                        ) : (
                          <>
                            <span style={{ padding: '4px 12px', borderRadius: 20, background: '#F0FDF4', color: '#16A34A', fontSize: 12, fontWeight: 700, border: '1px solid #BBF7D0' }}>Returned</span>
                            {rec.rating > 0 && (
                              <div style={{ display: 'flex', gap: 2 }}>
                                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={i <= rec.rating ? '#F59E0B' : 'none'} color={i <= rec.rating ? '#F59E0B' : '#D1D5DB'} />)}
                              </div>
                            )}
                            <Link href="/student/history" style={{ width: '100%', padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', color: '#1A73E8', fontSize: 13, fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>
                              View Details
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 28 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', color: page === 1 ? '#D1D5DB' : '#374151', fontSize: 13, fontWeight: 600, cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
                  ‹ Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} style={{ width: 36, height: 36, borderRadius: 8, border: p === page ? 'none' : '1px solid #E5E7EB', background: p === page ? '#1A73E8' : 'white', color: p === page ? 'white' : '#374151', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', color: page === totalPages ? '#D1D5DB' : '#374151', fontSize: 13, fontWeight: 600, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
                  Next ›
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ RIGHT SIDEBAR ═══ */}
      <div style={{ width: 320, flexShrink: 0, padding: '28px 20px 28px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Upcoming Returns */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Upcoming Returns</span>
            <Link href="/student/dashboard" style={{ fontSize: 12, fontWeight: 600, color: '#1A73E8', textDecoration: 'none' }}>View Calendar</Link>
          </div>
          {upcoming.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: '8px 0' }}>No active borrowings</p>
          ) : upcoming.map(rec => {
            const book = rec.bookId || {};
            const d = daysUntil(rec.dueDate);
            return (
              <div key={rec._id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid #F3F4F6' }}>
                <BookCover cover={book.cover} title={book.title} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{book.title}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: d < 0 ? '#EF4444' : d <= 3 ? '#E11D48' : '#D97706', marginBottom: 2 }}>
                    {d < 0 ? `Overdue by ${Math.abs(d)}d` : `Due in ${d} day${d === 1 ? '' : 's'}`}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{fmtDate(rec.dueDate)}</div>
                </div>
                <button onClick={() => showToast(`Reminder set for "${book.title}"! 🔔`)} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A73E8', cursor: 'pointer', flexShrink: 0 }}>
                  <Bell size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Fine Summary */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Fine Summary</span>
            <Link href="/student/fines" style={{ fontSize: 12, fontWeight: 600, color: '#1A73E8', textDecoration: 'none' }}>View Details</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', textAlign: 'center', padding: '12px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', marginBottom: 16 }}>
            {[
              { label: 'Total Fine', val: `₹${totalFineAmount}`, color: totalFineAmount > 0 ? '#EF4444' : '#374151' },
              { label: 'Paid',       val: `₹${paidFineAmount}`,  color: '#16A34A' },
              { label: 'Outstanding', val: `₹${outstandingFineAmount}`, color: outstandingFineAmount > 0 ? '#EF4444' : '#374151' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.val}</div>
              </div>
            ))}
          </div>
          <Link href="/student/fines" style={{ display: 'block', width: '100%', padding: '12px', background: '#1A73E8', color: 'white', borderRadius: 8, fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none', boxShadow: '0 4px 12px rgba(26,115,232,0.25)' }}>
            Pay Fine Now
          </Link>
        </div>

        {/* Reading Statistics */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Reading Statistics</span>
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>All Time</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20 }}>
            <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="#F3F4F6" strokeWidth="10" />
                {segs.map((s, i) => <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth="10" strokeDasharray={`${s.dash} ${C - s.dash}`} strokeDashoffset={-s.offset} strokeLinecap="round" />)}
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{totalBooksRead}</div>
                <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>Books</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { color: '#22C55E', label: 'Completed', count: completedCount },
                { color: '#1A73E8', label: 'Borrowed',  count: activeCount },
                { color: '#EF4444', label: 'Overdue',   count: overdueCount },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, display: 'block', flexShrink: 0 }} />
                  <span style={{ color: '#4B5563', flex: 1 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: 14, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
            <span style={{ color: '#6B7280' }}>Total Books Read</span>
            <span style={{ fontWeight: 800, color: '#111827', fontSize: 15 }}>{totalBooksRead}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
