'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { CheckCircle, XCircle, BookOpen, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function LibrarianRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('requested');
  const [actioning, setActioning] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectId, setRejectId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await fetch(`/api/requests?status=${filter}`);
    const data = await res.json();
    setRequests(data.requests || []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, [filter]);

  const doAction = async (requestId, action, note = '') => {
    setActioning(requestId);
    await fetch('/api/requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, action, note }),
    });
    setActioning(null);
    setRejectId(null);
    fetchRequests();
  };

  const STATUS_LABELS = { requested: 'Pending', approved: 'Approved', rejected: 'Rejected', issued: 'Issued', cancelled: 'Cancelled' };
  const STATUS_BADGE = { requested: 'badge-warning', approved: 'badge-brand', rejected: 'badge-danger', issued: 'badge-success', cancelled: 'badge-muted' };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="Book Requests" subtitle="Approve or reject student requests" />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4, width: 'fit-content', marginBottom: 24 }}>
        {['requested', 'approved', 'issued', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{
              padding: '7px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: filter === s ? 'var(--brand)' : 'transparent',
              color: filter === s ? '#fff' : 'var(--muted)',
              fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
              textTransform: 'capitalize',
            }}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Book</th>
              <th>Requested</th>
              <th>Status</th>
              {filter === 'requested' && <th>Actions</th>}
              {filter === 'approved' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j}><div style={{ height: 16, background: 'var(--surface-2)', borderRadius: 4, animation: 'pulse 1.5s ease infinite' }} /></td>
                  ))}
                </tr>
              ))
            ) : requests.length === 0 ? (
              <tr><td colSpan={5}>
                <div className="empty-state"><p style={{ fontSize: 13 }}>No {filter} requests</p></div>
              </td></tr>
            ) : requests.map((req) => (
              <tr key={req._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{(req.userId?.name || 'U').charAt(0)}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{req.userId?.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{req.userId?.studentId || req.userId?.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {req.bookId?.cover ? (
                      <img src={req.bookId.cover} alt="" style={{ width: 28, height: 38, borderRadius: 4, objectFit: 'cover' }} />
                    ) : <div style={{ width: 28, height: 38, borderRadius: 4, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={12} color="rgba(255,255,255,0.5)" /></div>}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{req.bookId?.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{req.bookId?.author}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--muted)' }}>{formatDate(req.createdAt)}</td>
                <td><span className={`badge ${STATUS_BADGE[req.status]}`}>{STATUS_LABELS[req.status]}</span></td>

                {filter === 'requested' && (
                  <td>
                    {rejectId === req._id ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input className="input" placeholder="Rejection reason..." value={rejectNote}
                          onChange={e => setRejectNote(e.target.value)}
                          style={{ fontSize: 12, padding: '5px 10px', width: 180 }} />
                        <button onClick={() => doAction(req._id, 'reject', rejectNote)} className="btn btn-danger btn-sm" disabled={actioning === req._id}>
                          {actioning === req._id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : 'Confirm'}
                        </button>
                        <button onClick={() => setRejectId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => doAction(req._id, 'approve')} disabled={actioning === req._id} className="btn btn-sm"
                          style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', gap: 4 }}>
                          {actioning === req._id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={13} />}
                          Approve
                        </button>
                        <button onClick={() => { setRejectId(req._id); setRejectNote(''); }} className="btn btn-danger btn-sm" style={{ gap: 4 }}>
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                )}

                {filter === 'approved' && (
                  <td>
                    <button onClick={() => doAction(req._id, 'issue')} disabled={actioning === req._id} className="btn btn-primary btn-sm" style={{ gap: 4 }}>
                      {actioning === req._id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <BookOpen size={13} />}
                      Mark Issued
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes pulse { 0%, 100% { opacity: 0.6 } 50% { opacity: 0.3 } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
