'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TopBar from '@/components/shared/TopBar';
import { BookOpen, ArrowLeft, Bookmark, CheckCircle, Loader2, Users } from 'lucide-react';
import Link from 'next/link';

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [queueSize, setQueueSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/books?bookId=${id}`).then(r => r.json()),
      fetch(`/api/reservations?bookId=${id}`).then(r => r.json()),
    ]).then(([bookData, resData]) => {
      const b = bookData.books?.find(b => b._id === id) || bookData.books?.[0];
      setBook(b);
      setInventory(b?.inventory);
      setQueueSize(resData.reservations?.filter(r => r.status === 'waiting').length || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleRequest = async () => {
    setActionLoading(true);
    setMessage(null);
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: id }),
    });
    const data = await res.json();
    if (res.ok) setMessage({ type: 'success', text: 'Book requested successfully! Awaiting librarian approval.' });
    else setMessage({ type: 'error', text: data.error });
    setActionLoading(false);
  };

  const handleReserve = async () => {
    setActionLoading(true);
    setMessage(null);
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: id }),
    });
    const data = await res.json();
    if (res.ok) setMessage({ type: 'success', text: `Reserved! You are #${data.position} in the queue.` });
    else setMessage({ type: 'error', text: data.error });
    setActionLoading(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTop: '3px solid var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!book) return (
    <div className="empty-state"><p>Book not found.</p><Link href="/student/search" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>← Back to Search</Link></div>
  );

  const isAvailable = inventory && inventory.available > 0;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <button onClick={() => router.back()} className="btn btn-ghost btn-sm" style={{ marginBottom: 24, gap: 8 }}>
        <ArrowLeft size={15} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
        {/* Cover + Actions */}
        <div>
          <div style={{
            height: 380, borderRadius: 16, overflow: 'hidden',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            border: '1px solid var(--border)', marginBottom: 20,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}>
            {book.cover
              ? <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><BookOpen size={64} color="rgba(255,255,255,0.2)" /></div>
            }
          </div>

          {/* Action Buttons */}
          {message && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13,
              background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: message.type === 'success' ? '#22C55E' : '#EF4444',
            }}>
              {message.text}
            </div>
          )}

          {isAvailable ? (
            <button onClick={handleRequest} disabled={actionLoading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0' }}>
              {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}
              Request Book
            </button>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 13, color: 'var(--muted)' }}>
                <Users size={14} />
                {queueSize} {queueSize === 1 ? 'person' : 'people'} in queue
              </div>
              <button onClick={handleReserve} disabled={actionLoading} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px 0', borderColor: '#F59E0B', color: '#F59E0B' }}>
                {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Bookmark size={16} />}
                Reserve Book
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <span className="badge badge-brand">{book.category}</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, lineHeight: 1.3 }}>{book.title}</h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 24 }}>by {book.author}</p>

          {/* Availability bar */}
          <div className="card-sm" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Availability</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: isAvailable ? '#22C55E' : '#EF4444' }}>
                {inventory?.available || 0} / {inventory?.total || 0} copies
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3,
                background: isAvailable ? '#22C55E' : '#EF4444',
                width: `${inventory ? (inventory.available / inventory.total) * 100 : 0}%`,
                transition: 'width 0.5s ease',
              }} />
            </div>
            {inventory?.shelf && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Shelf: <strong>{inventory.shelf}</strong></div>}
          </div>

          {/* Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'ISBN', value: book.isbn || '—' },
              { label: 'Publisher', value: book.publisher || '—' },
              { label: 'Published Year', value: book.publishedYear || '—' },
              { label: 'Language', value: book.language || 'English' },
              { label: 'Pages', value: book.pages || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ padding: '12px 16px', background: 'var(--surface-2)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>About This Book</h2>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.8 }}>{book.description}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
