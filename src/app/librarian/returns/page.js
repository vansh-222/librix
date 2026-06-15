'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { CheckCircle, Loader2, BookOpen } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function LibrarianReturnsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);
  const [conditionModal, setConditionModal] = useState(null); // { recordId, condition }

  const fetchRecords = async () => {
    setLoading(true);
    const res = await fetch('/api/borrow?status=return_pending');
    const data = await res.json();
    setRecords(data.records || []);
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const receiveBook = async (recordId, condition) => {
    setActioning(recordId);
    await fetch('/api/borrow', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recordId, action: 'receive_book', condition }),
    });
    setActioning(null);
    setConditionModal(null);
    fetchRecords();
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <TopBar title="Returns" subtitle="Verify and process book returns" />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Book</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Days Late</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}><div style={{ height: 16, background: 'var(--surface-2)', borderRadius: 4, animation: 'pulse 1.5s ease infinite' }} /></td>
                  ))}
                </tr>
              ))
            ) : records.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state"><p style={{ fontSize: 13 }}>No returns pending 🎉</p></div></td></tr>
            ) : records.map((rec) => {
              const now = new Date();
              const due = new Date(rec.dueDate);
              const lateDays = Math.max(0, Math.ceil((now - due) / (1000 * 60 * 60 * 24)));

              return (
                <tr key={rec._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{(rec.userId?.name || 'U').charAt(0)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{rec.userId?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{rec.userId?.rollNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {rec.bookId?.cover ? (
                        <img src={rec.bookId.cover} alt="" style={{ width: 28, height: 38, borderRadius: 4, objectFit: 'cover' }} />
                      ) : <div style={{ width: 28, height: 38, borderRadius: 4, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={12} color="rgba(255,255,255,0.5)" /></div>}
                      <div style={{ fontSize: 13, fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.bookId?.title}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--muted)' }}>{formatDate(rec.issueDate)}</td>
                  <td style={{ fontSize: 13, color: lateDays > 0 ? '#EF4444' : 'var(--muted)' }}>{formatDate(rec.dueDate)}</td>
                  <td>
                    {lateDays > 0
                      ? <span className="badge badge-danger">{lateDays}d late</span>
                      : <span className="badge badge-success">On time</span>
                    }
                  </td>
                  <td>
                    {conditionModal?.recordId === rec._id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 4 }}>Book Condition:</div>
                        {['good', 'damaged', 'lost'].map(c => (
                          <button key={c} onClick={() => setConditionModal(m => ({ ...m, condition: c }))}
                            style={{
                              padding: '5px 12px', borderRadius: 6, border: '1px solid',
                              borderColor: conditionModal.condition === c
                                ? c === 'good' ? '#22C55E' : c === 'damaged' ? '#F59E0B' : '#EF4444'
                                : 'var(--border)',
                              background: conditionModal.condition === c
                                ? c === 'good' ? 'rgba(34,197,94,0.1)' : c === 'damaged' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'
                                : 'transparent',
                              color: c === 'good' ? '#22C55E' : c === 'damaged' ? '#F59E0B' : '#EF4444',
                              cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                              transition: 'all 0.15s',
                            }}>
                            {c === 'good' ? '✅ Good' : c === 'damaged' ? '⚠️ Damaged' : '❌ Lost'}
                          </button>
                        ))}
                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                          <button onClick={() => receiveBook(rec._id, conditionModal.condition)} disabled={actioning === rec._id} className="btn btn-primary btn-sm">
                            {actioning === rec._id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : 'Confirm'}
                          </button>
                          <button onClick={() => setConditionModal(null)} className="btn btn-ghost btn-sm">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setConditionModal({ recordId: rec._id, condition: 'good' })}
                        className="btn btn-sm" style={{ background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)', gap: 4 }}>
                        <CheckCircle size={13} /> Receive Book
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes pulse { 0%, 100% { opacity: 0.6 } 50% { opacity: 0.3 } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
