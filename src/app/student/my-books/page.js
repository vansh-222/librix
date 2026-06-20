'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { BookOpen, Clock, AlertTriangle, CheckCircle, RotateCcw, Timer, ChevronRight, Loader2 } from 'lucide-react';
import { formatDate, daysBetween } from '@/lib/utils';

const STATUS_CONFIG = {
  issued:         { label: 'Issued',         color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
  return_pending: { label: 'Return Pending', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  returned:       { label: 'Returned',       color: '#22C55E', bg: 'rgba(34,197,94,0.12)'  },
  overdue:        { label: 'Overdue',        color: '#EF4444', bg: 'rgba(239,68,68,0.12)'  },
};

export default function MyBooksPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');
  const [actioning, setActioning] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchRecords = async () => {
    setLoading(true);
    const statusMap = { active: 'issued', pending: 'return_pending', history: 'returned' };
    const qs = tab === 'history' ? '?status=returned' : tab === 'pending' ? '?status=return_pending' : '?status=issued';
    const r = await fetch(`/api/borrow${qs}`).then(r => r.json());
    setRecords(r.records || []);
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, [tab]);

  const doAction = async (recordId, action, extra = {}) => {
    setActioning(recordId);
    const res = await fetch('/api/borrow', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordId, action, ...extra }),
    });
    const data = await res.json();
    setActioning(null);
    if (res.ok) { showToast('Done!'); fetchRecords(); }
    else showToast(data.error || 'Action failed');
  };

  const active = records.filter(r => r.status === 'issued');
  const overdue = active.filter(r => daysBetween(r.dueDate) > 0);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="My Books" subtitle="Your borrowing history and active loans" />

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: 'var(--brand)', color: '#fff', padding: '10px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
        }}>{toast}</div>
      )}

      {/* Summary pills */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { key: 'active',  label: 'Currently Issued', icon: BookOpen, color: '#6366F1' },
          { key: 'pending', label: 'Return Pending',   icon: RotateCcw, color: '#F59E0B' },
          { key: 'history', label: 'History',          icon: CheckCircle, color: '#22C55E' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: tab === t.key ? t.color : 'var(--card)',
            color: tab === t.key ? '#fff' : 'var(--muted)',
            fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
            boxShadow: tab === t.key ? `0 4px 16px ${t.color}40` : 'none',
          }}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Overdue warning */}
      {tab === 'active' && overdue.length > 0 && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 10, color: '#EF4444', fontSize: 14,
        }}>
          <AlertTriangle size={16} />
          <span><strong>{overdue.length} book{overdue.length > 1 ? 's' : ''} overdue!</strong> Fine is accumulating daily.</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--brand)' }} />
        </div>
      ) : records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <BookOpen size={40} style={{ margin: '0 auto 12px', color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>No books here yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {records.map(rec => {
            const lateDays = daysBetween(rec.dueDate);
            const isOverdue = rec.status === 'issued' && lateDays > 0;
            const statusCfg = isOverdue ? STATUS_CONFIG.overdue : STATUS_CONFIG[rec.status] || STATUS_CONFIG.issued;

            return (
              <div key={rec._id} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* Cover */}
                <div style={{
                  width: 54, height: 72, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
                  background: 'var(--surface-2)',
                }}>
                  {rec.bookId?.cover ? (
                    <img src={rec.bookId.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={20} color="var(--muted)" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{rec.bookId?.title || 'Unknown'}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>{rec.bookId?.author}</div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--muted)' }}>
                    <span>Issued: {formatDate(rec.issueDate)}</span>
                    <span style={{ color: isOverdue ? '#EF4444' : 'var(--muted)' }}>
                      Due: {formatDate(rec.dueDate)} {isOverdue ? `(${lateDays}d overdue)` : ''}
                    </span>
                    {rec.fine > 0 && <span style={{ color: '#EF4444', fontWeight: 700 }}>Fine: ₹{rec.fine}</span>}
                  </div>
                </div>

                {/* Status + Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                  <span style={{
                    background: statusCfg.bg, color: statusCfg.color,
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  }}>{statusCfg.label}</span>

                  {rec.status === 'issued' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => doAction(rec._id, 'mark_return')} disabled={actioning === rec._id}
                        className="btn btn-sm btn-primary" style={{ gap: 4 }}>
                        {actioning === rec._id ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <RotateCcw size={12} />}
                        Return
                      </button>
                      <button onClick={() => doAction(rec._id, 'request_extension')} disabled={actioning === rec._id}
                        className="btn btn-sm" style={{ gap: 4, background: 'var(--surface-2)', color: 'var(--muted)' }}>
                        <Timer size={12} /> Extend
                      </button>
                    </div>
                  )}
                  {rec.status === 'return_pending' && (
                    <span style={{ fontSize: 12, color: '#F59E0B' }}>Awaiting librarian confirmation</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
