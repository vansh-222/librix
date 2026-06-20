'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { Bookmark, BookOpen, Loader2, XCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const STATUS_CONFIG = {
  waiting:  { label: 'In Queue',  color: '#6366F1', bg: 'rgba(99,102,241,0.1)'  },
  notified: { label: 'Available!',color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  expired:  { label: 'Expired',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)'   },
  fulfilled:{ label: 'Fulfilled', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  cancelled:{ label: 'Cancelled', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
};

export default function StudentReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchData = () => {
    fetch('/api/reservations').then(r => r.json()).then(d => {
      setReservations(d.reservations || []);
      setLoading(false);
    });
  };

  useEffect(fetchData, []);

  const cancel = async (reservationId) => {
    setCancelling(reservationId);
    const res = await fetch('/api/reservations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationId }),
    });
    setCancelling(null);
    if (res.ok) { showToast('Reservation cancelled.'); fetchData(); }
    else showToast('Failed to cancel.');
  };

  const active = reservations.filter(r => ['waiting', 'notified'].includes(r.status));
  const past   = reservations.filter(r => ['expired', 'fulfilled', 'cancelled'].includes(r.status));

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="My Reservations" subtitle="Track your place in the queue" />

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: 'var(--brand)', color: '#fff', padding: '10px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 600,
        }}>{toast}</div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--brand)' }} />
        </div>
      ) : (
        <>
          {/* Active */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
            Active ({active.length})
          </h3>
          {active.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40, marginBottom: 24 }}>
              <Bookmark size={32} style={{ margin: '0 auto 10px', color: 'var(--muted)' }} />
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>No active reservations.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {active.map(res => {
                const cfg = STATUS_CONFIG[res.status];
                return (
                  <div key={res._id} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 48, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--surface-2)' }}>
                      {res.bookId?.cover
                        ? <img src={res.bookId.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={18} color="var(--muted)" /></div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{res.bookId?.title || '—'}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{res.bookId?.author}</div>
                      {res.status === 'waiting' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                          <Clock size={13} color="#6366F1" />
                          <span style={{ color: '#6366F1', fontWeight: 700 }}>Queue position: #{res.position}</span>
                        </div>
                      )}
                      {res.status === 'notified' && res.expiresAt && (
                        <div style={{ fontSize: 12, color: '#22C55E', fontWeight: 600 }}>
                          ✅ Book available! Collect before {formatDate(res.expiresAt)}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <span style={{ background: cfg.bg, color: cfg.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        {cfg.label}
                      </span>
                      {res.status === 'waiting' && (
                        <button onClick={() => cancel(res._id)} disabled={cancelling === res._id}
                          className="btn btn-sm" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', gap: 4, border: 'none' }}>
                          {cancelling === res._id ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={12} />}
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                History ({past.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {past.map(res => {
                  const cfg = STATUS_CONFIG[res.status];
                  return (
                    <div key={res._id} className="card" style={{ padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center', opacity: 0.7 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{res.bookId?.title || '—'}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{formatDate(res.createdAt)}</div>
                      </div>
                      <span style={{ background: cfg.bg, color: cfg.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
