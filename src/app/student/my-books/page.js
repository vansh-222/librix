'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Star, Calendar, Clock, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle2, RotateCcw, Loader2
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
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Book Cover ───────────────────────────────────────────────────────────────
function BookCover({ cover, title, size = 56 }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: size, height: Math.round(size * 1.4), borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}>
            <BookOpen size={size * 0.3} color="white" />
          </div>
      }
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function DueBadge({ days }) {
  if (days < 0)  return <span style={{ padding: '3px 10px', borderRadius: 20, background: '#FEF2F2', color: '#EF4444', fontSize: 11, fontWeight: 700, border: '1px solid #FECACA' }}>Overdue {Math.abs(days)}d</span>;
  if (days <= 3) return <span style={{ padding: '3px 10px', borderRadius: 20, background: '#FFFBEB', color: '#F59E0B', fontSize: 11, fontWeight: 700, border: '1px solid #FDE68A' }}>Due in {days}d</span>;
  return <span style={{ padding: '3px 10px', borderRadius: 20, background: '#F0FDF4', color: '#22C55E', fontSize: 11, fontWeight: 700, border: '1px solid #BBF7D0' }}>Due in {days}d</span>;
}

const ITEMS_PER_PAGE = 5;

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MyBooksPage() {
  const [tab, setTab]         = useState('borrowed');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [toast, setToast]     = useState('');
  const [actionId, setActionId] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const status = tab === 'borrowed' ? '' : 'returned';
      const res = await fetch(`/api/borrow${status ? `?status=${status}` : ''}`);
      const data = await res.json();
      setRecords(data.records || []);
    } catch {
      showToast('Failed to load records.');
    } finally {
      setLoading(false);
    }
    setPage(1);
  }, [tab]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  // ── Filter for current tab ──
  const displayed = tab === 'borrowed'
    ? records.filter(r => ['issued', 'return_pending', 'overdue'].includes(r.status))
    : records.filter(r => r.status === 'returned');

  const totalPages = Math.max(1, Math.ceil(displayed.length / ITEMS_PER_PAGE));
  const paged = displayed.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── Stats for right panel ──
  const overdue    = records.filter(r => r.status === 'issued' && daysUntil(r.dueDate) < 0).length;
  const active     = records.filter(r => ['issued', 'return_pending'].includes(r.status)).length;
  const completed  = records.filter(r => r.status === 'returned').length;
  const fineTotal  = records.filter(r => r.fineStatus === 'pending').reduce((s, r) => s + (r.fine || 0), 0);
  const upcoming   = [...records]
    .filter(r => r.status === 'issued')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  // ── Actions ──
  const action = async (recordId, act, extra = {}) => {
    setActionId(recordId);
    try {
      const res = await fetch('/api/borrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, action: act, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Action failed.'); return; }
      showToast(act === 'mark_return'
        ? 'Return marked! Librarian will confirm.'
        : act === 'request_extension'
        ? 'Extension granted!'
        : 'Done!');
      loadRecords();
    } catch {
      showToast('Something went wrong.');
    } finally {
      setActionId('');
    }
  };

  const TABS = [
    { key: 'borrowed', label: 'Currently Borrowed' },
    { key: 'history',  label: 'History'            },
  ];

  // ── Donut chart ──
  const total = active + completed + overdue;
  const R = 44, cx = 56, cy = 56, C = 2 * Math.PI * R;
  let off = 0;
  const segs = [
    { color: '#22C55E', count: completed },
    { color: '#6366F1', count: active    },
    { color: '#EF4444', count: overdue   },
  ].map(s => { const d = total ? (s.count / total) * C : 0; const el = { ...s, dash: d, offset: off }; off += d; return el; });

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', overflow: 'hidden' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#6366F1', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>
          {toast}
        </div>
      )}

      {/* ═══ MAIN ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', minWidth: 0 }}>

        {/* Tab Bar */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', marginBottom: 20, overflow: 'hidden' }}>
          {TABS.map((t, i) => {
            const isActive = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flex: 1, padding: '13px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#6366F1' : '#6B7280',
                borderBottom: isActive ? '2px solid #6366F1' : '2px solid transparent',
                borderRight: i < TABS.length - 1 ? '1px solid #E5E7EB' : 'none',
                transition: 'all 0.2s',
              }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Book List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: '#6366F1' }} />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {paged.length === 0 ? (
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 60, textAlign: 'center' }}>
                  <BookOpen size={40} style={{ margin: '0 auto 12px', color: '#D1D5DB' }} />
                  <p style={{ color: '#9CA3AF', fontSize: 15 }}>
                    {tab === 'borrowed' ? "You have no active borrowed books." : "No reading history yet."}
                  </p>
                </div>
              ) : paged.map(rec => {
                const days = daysUntil(rec.dueDate);
                const isPending = rec.status === 'return_pending';
                const isActing  = actionId === rec._id;

                return (
                  <div key={rec._id} style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <BookCover cover={rec.bookId?.cover} title={rec.bookId?.title} />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{rec.bookId?.title || '—'}</div>
                      <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>{rec.bookId?.author}</div>
                      {rec.bookId?.category && (
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, background: '#EEF2FF', color: '#6366F1', fontSize: 11, fontWeight: 600, marginBottom: 10 }}>{rec.bookId.category}</span>
                      )}
                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>Issued On</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#374151', fontWeight: 500 }}>
                            <Calendar size={12} color="#9CA3AF" /> {fmtDate(rec.issueDate)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>Due Date</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: days < 0 ? '#EF4444' : '#374151', fontWeight: 500 }}>
                            <Calendar size={12} color={days < 0 ? '#EF4444' : '#9CA3AF'} /> {fmtDate(rec.dueDate)}
                          </div>
                        </div>
                        {rec.status === 'returned' && (
                          <div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 3 }}>Returned On</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#374151', fontWeight: 500 }}>
                              <Calendar size={12} color="#9CA3AF" /> {fmtDate(rec.returnDate)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status + Actions */}
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 140 }}>
                      {tab === 'borrowed' ? (
                        <>
                          {isPending
                            ? <span style={{ padding: '4px 12px', borderRadius: 20, background: '#EEF2FF', color: '#6366F1', fontSize: 12, fontWeight: 600, border: '1px solid #C7D2FE' }}>Return Pending</span>
                            : <DueBadge days={days} />
                          }
                          {rec.fine > 0 && (
                            <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Fine: ₹{rec.fine}</span>
                          )}
                          {!isPending && rec.status === 'issued' && (
                            <button onClick={() => action(rec._id, 'mark_return')} disabled={isActing}
                              style={{ padding: '7px 14px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                              {isActing ? '...' : 'Mark Return'}
                            </button>
                          )}
                          {!isPending && rec.extensionsUsed < 2 && rec.status === 'issued' && (
                            <button onClick={() => action(rec._id, 'request_extension')} disabled={isActing}
                              style={{ padding: '7px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer', width: '100%' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}>
                              Extend ({2 - rec.extensionsUsed} left)
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <span style={{ padding: '4px 12px', borderRadius: 20, background: '#F0FDF4', color: '#22C55E', fontSize: 12, fontWeight: 600, border: '1px solid #BBF7D0' }}>Returned</span>
                          {rec.fine > 0 && (
                            <span style={{ fontSize: 12, color: rec.fineStatus === 'paid' ? '#22C55E' : '#EF4444', fontWeight: 600 }}>
                              Fine ₹{rec.fine} {rec.fineStatus === 'paid' ? '(Paid)' : '(Unpaid)'}
                            </span>
                          )}
                          {rec.rating > 0 && (
                            <div style={{ display: 'flex', gap: 2 }}>
                              {Array.from({length: 5}).map((_, i) => <Star key={i} size={13} fill={i < rec.rating ? '#F59E0B' : 'none'} color={i < rec.rating ? '#F59E0B' : '#D1D5DB'} />)}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>
                  Showing {Math.min((page-1)*ITEMS_PER_PAGE+1, displayed.length)}–{Math.min(page*ITEMS_PER_PAGE, displayed.length)} of {displayed.length}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                    style={{ width:30,height:30,borderRadius:8,border:'1px solid #E5E7EB',background:'white',cursor:page===1?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <ChevronLeft size={14} color={page===1?'#D1D5DB':'#374151'} />
                  </button>
                  {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                    <button key={p} onClick={()=>setPage(p)} style={{ width:30,height:30,borderRadius:8,border:p===page?'none':'1px solid #E5E7EB',background:p===page?'#6366F1':'white',color:p===page?'white':'#374151',fontSize:13,fontWeight:600,cursor:'pointer' }}>{p}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                    style={{ width:30,height:30,borderRadius:8,border:'1px solid #E5E7EB',background:'white',cursor:page===totalPages?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <ChevronRight size={14} color={page===totalPages?'#D1D5DB':'#374151'} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div style={{ width: 268, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Upcoming Returns */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Upcoming Returns</h3>
          {upcoming.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>No active borrows.</p>
          ) : upcoming.map(rec => {
            const d = daysUntil(rec.dueDate);
            return (
              <div key={rec._id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <BookCover cover={rec.bookId?.cover} title={rec.bookId?.title} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.bookId?.title}</div>
                  <div style={{ fontSize: 11, color: d < 0 ? '#EF4444' : d <= 3 ? '#F59E0B' : '#9CA3AF' }}>
                    {d < 0 ? `${Math.abs(d)}d overdue` : `Due in ${d}d`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fine Summary */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Fine Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Total Outstanding', value: `₹${fineTotal}`, color: fineTotal > 0 ? '#EF4444' : '#22C55E' },
              { label: 'Paid',              value: `₹${records.filter(r => r.fineStatus==='paid').reduce((s,r) => s+(r.fine||0),0)}`, color: '#22C55E' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#F9FAFB', borderRadius: 8 }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.value}</span>
              </div>
            ))}
            {fineTotal > 0 && (
              <a href="/student/fines" style={{ textAlign: 'center', fontSize: 13, color: '#6366F1', fontWeight: 600, textDecoration: 'none', marginTop: 4 }}>Pay Fine →</a>
            )}
          </div>
        </div>

        {/* Reading Stats */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Reading Statistics</h3>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 14 }}>
            <svg width="112" height="112" viewBox="0 0 112 112" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={cx} cy={cy} r={R} fill="none" stroke="#F3F4F6" strokeWidth="11" />
              {segs.map((s, i) => (
                <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth="11"
                  strokeDasharray={`${s.dash} ${C - s.dash}`} strokeDashoffset={-s.offset} />
              ))}
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>{total}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>Total</div>
            </div>
          </div>
          {[
            { color: '#22C55E', label: 'Completed', count: completed },
            { color: '#6366F1', label: 'Active',    count: active    },
            { color: '#EF4444', label: 'Overdue',   count: overdue   },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                <span style={{ fontSize: 12, color: '#6B7280' }}>{item.label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
