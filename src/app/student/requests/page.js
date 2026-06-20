'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { ClipboardList, Clock, CheckCircle, XCircle, BookOpen, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const STATUS_CONFIG = {
  requested: { label: 'Pending',  color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  approved:  { label: 'Approved', color: '#6366F1', bg: 'rgba(99,102,241,0.1)'  },
  issued:    { label: 'Issued',   color: '#22C55E', bg: 'rgba(34,197,94,0.1)'   },
  rejected:  { label: 'Rejected', color: '#EF4444', bg: 'rgba(239,68,68,0.1)'   },
};

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');

  useEffect(() => {
    fetch('/api/requests').then(r => r.json()).then(d => {
      setRequests(d.requests || []);
      setLoading(false);
    });
  }, []);

  const filtered = tab === 'all' ? requests : requests.filter(r => r.status === tab);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="My Requests" subtitle="Track your book request status" />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { key: 'all',       label: 'All',      color: '#6366F1' },
          { key: 'requested', label: 'Pending',  color: '#F59E0B' },
          { key: 'approved',  label: 'Approved', color: '#6366F1' },
          { key: 'issued',    label: 'Issued',   color: '#22C55E' },
          { key: 'rejected',  label: 'Rejected', color: '#EF4444' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: tab === t.key ? t.color : 'var(--card)',
            color: tab === t.key ? '#fff' : 'var(--muted)',
            fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
          }}>
            {t.label}
            <span style={{
              marginLeft: 6,
              background: tab === t.key ? 'rgba(255,255,255,0.25)' : 'var(--surface-2)',
              padding: '1px 7px', borderRadius: 10, fontSize: 11,
            }}>
              {t.key === 'all' ? requests.length : requests.filter(r => r.status === t.key).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--brand)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <ClipboardList size={40} style={{ margin: '0 auto 12px', color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)' }}>No requests found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(req => {
            const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.requested;
            return (
              <div key={req._id} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                {/* Cover */}
                <div style={{ width: 48, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--surface-2)' }}>
                  {req.bookId?.cover
                    ? <img src={req.bookId.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={18} color="var(--muted)" /></div>
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{req.bookId?.title || '—'}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>{req.bookId?.author}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    Requested on {formatDate(req.createdAt)}
                    {req.note && <span> · Note: {req.note}</span>}
                  </div>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span style={{
                    background: cfg.bg, color: cfg.color,
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                  }}>{cfg.label}</span>
                  {req.status === 'approved' && (
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>Visit library to collect</span>
                  )}
                  {req.status === 'rejected' && req.rejectionReason && (
                    <span style={{ fontSize: 11, color: '#EF4444' }}>{req.rejectionReason}</span>
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
