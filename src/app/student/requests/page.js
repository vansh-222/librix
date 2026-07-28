'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, Clock, BookOpen, Loader2, Calendar,
  ChevronLeft, ChevronRight, HeadphonesIcon, Search, CheckCircle
} from 'lucide-react';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const STATUS_CFG = {
  requested: { label: 'Pending',   color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
  approved:  { label: 'Approved',  color: '#22C55E', bg: '#F0FDF4', border: '#BBF7D0' },
  issued:    { label: 'Issued',    color: '#1A73E8', bg: '#EFF6FF', border: '#BFDBFE' },
  rejected:  { label: 'Rejected',  color: '#EF4444', bg: '#FEF2F2', border: '#FECACA' },
  cancelled: { label: 'Cancelled', color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB' },
  returned:  { label: 'Returned',  color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
};

function BookCover({ cover, title }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: 56, height: 76, borderRadius: 8, flexShrink: 0, overflow: 'hidden', background: '#F3F4F6' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1A73E8,#93C5FD)' }}><BookOpen size={20} color="white" /></div>
      }
    </div>
  );
}

function RequestDonut({ counts }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const r = 48, cx = 60, cy = 60, C = 2 * Math.PI * r;
  const segs = [
    { color: '#F59E0B', count: counts.requested },
    { color: '#22C55E', count: counts.approved  },
    { color: '#1A73E8', count: counts.issued    },
    { color: '#10B981', count: counts.returned  },
    { color: '#EF4444', count: counts.rejected  },
    { color: '#9CA3AF', count: counts.cancelled },
  ].filter(s => s.count > 0);
  let offset = 0;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="10" />
      {segs.map((seg, i) => {
        const dash = (seg.count / total) * C;
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="10"
          strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-offset} strokeLinecap="round" />;
        offset += dash;
        return el;
      })}
    </svg>
  );
}

const ITEMS_PER_PAGE = 5;

export default function StudentRequestsPage() {
  const [tab, setTab]         = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy]   = useState('newest');
  const [page, setPage]       = useState(1);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast]     = useState('');
  const [actionId, setActionId] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/requests');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {
      showToast('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const cancelRequest = async (requestId) => {
    setActionId(requestId);
    try {
      const res = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'cancel' }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Failed to cancel.'); return; }
      showToast('Request cancelled.');
      loadRequests();
    } catch {
      showToast('Something went wrong.');
    } finally {
      setActionId('');
    }
  };

  // Filter by tab
  const tabFiltered = tab === 'all'
    ? requests
    : tab === 'pending'
    ? requests.filter(r => r.status === 'requested')
    : requests.filter(r => ['approved', 'issued', 'rejected', 'cancelled'].includes(r.status));

  // Filter by dropdown
  const statusFiltered = filterStatus === 'all'
    ? tabFiltered
    : tabFiltered.filter(r => r.status === filterStatus);

  // Sort
  const sorted = [...statusFiltered].sort((a, b) =>
    sortBy === 'newest'
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paged = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const counts = {
    requested: requests.filter(r => r.status === 'requested').length,
    approved:  requests.filter(r => ['approved','issued'].includes(r.status)).length,
    rejected:  requests.filter(r => r.status === 'rejected').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
  };

  const TABS = [
    { key: 'all',     label: 'All Requests', icon: ClipboardList },
    { key: 'pending', label: 'Pending',       icon: Clock         },
    { key: 'history', label: 'History',       icon: Clock         },
  ];

  const selectStyle = {
    padding: '7px 28px 7px 12px', border: '1px solid #E5E7EB', borderRadius: 8,
    fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer',
    outline: 'none', fontFamily: 'Inter', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
  };

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', overflow: 'hidden' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#1A73E8', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(26,115,232,0.4)' }}>
          {toast}
        </div>
      )}

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', minWidth: 0 }}>

        {/* Tab Bar */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', marginBottom: 16, overflow: 'hidden' }}>
          {TABS.map((t, i) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#1A73E8' : '#6B7280',
                borderBottom: isActive ? '2px solid #1A73E8' : '2px solid transparent',
                borderRight: i < TABS.length - 1 ? '1px solid #E5E7EB' : 'none',
                transition: 'all 0.2s',
              }}>
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Filter + Sort */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Filter by:</span>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} style={selectStyle}>
              <option value="all">All Status</option>
              <option value="requested">Pending</option>
              <option value="approved">Approved</option>
              <option value="issued">Issued</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selectStyle}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: '#1A73E8' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {paged.length === 0 ? (
              <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 60, textAlign: 'center' }}>
                <ClipboardList size={40} style={{ margin: '0 auto 12px', color: '#D1D5DB' }} />
                <p style={{ color: '#9CA3AF', fontSize: 15 }}>No requests found.</p>
              </div>
            ) : paged.map(req => {
              const cfg    = STATUS_CFG[req.status] || STATUS_CFG.requested;
              const reqId  = `REQ-${req._id?.slice(-8)?.toUpperCase()}`;
              const isActing = actionId === req._id;

              return (
                <div key={req._id}
                  style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <BookCover cover={req.bookId?.cover} title={req.bookId?.title} />

                  {/* Title / Author */}
                  <div style={{ flex: '0 0 160px', minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{req.bookId?.title || '—'}</div>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 12 }}>{req.bookId?.author}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Requested on</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151', fontWeight: 500 }}>
                      <Calendar size={12} color="#9CA3AF" /> {fmtDate(req.createdAt)}
                    </div>
                  </div>

                  {/* Request ID */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>Request ID</div>
                    <div style={{ fontSize: 12, color: '#374151', fontWeight: 600, fontFamily: 'monospace' }}>{reqId}</div>
                  </div>

                  {/* Status + Actions */}
                  <div style={{ flexShrink: 0, width: 160, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <span style={{ padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                    <p style={{ fontSize: 12, color: '#6B7280', textAlign: 'right', margin: 0, lineHeight: 1.4 }}>
                      {req.status === 'requested' && 'Your request is pending librarian approval.'}
                      {req.status === 'approved'  && 'Your request has been approved.'}
                      {req.status === 'issued'    && 'You can collect this book from the library.'}
                      {req.status === 'rejected'  && (req.note || 'This book is currently not available.')}
                      {req.status === 'cancelled' && 'You cancelled this request.'}
                      {req.status === 'returned'  && 'You have successfully returned this book.'}
                    </p>
                    {req.status === 'requested' && (
                      <button onClick={() => cancelRequest(req._id)} disabled={isActing}
                        style={{ width: '100%', padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'Inter' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}>
                        {isActing ? '...' : 'Cancel Request'}
                      </button>
                    )}
                    {(req.status === 'approved' || req.status === 'issued') && (
                      <button style={{ width: '100%', padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'Inter' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A73E8'; e.currentTarget.style.color = '#1A73E8'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}>
                        View Details
                      </button>
                    )}
                    {req.status === 'rejected' && (
                      <button style={{ width: '100%', padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: 'Inter' }}>
                        View Reason
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {!loading && sorted.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>
              Showing {Math.min((page-1)*ITEMS_PER_PAGE+1, sorted.length)}–{Math.min(page*ITEMS_PER_PAGE, sorted.length)} of {sorted.length} requests
            </span>
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                  style={{ width:30,height:30,borderRadius:8,border:'1px solid #E5E7EB',background:'white',cursor:page===1?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <ChevronLeft size={14} color={page===1?'#D1D5DB':'#374151'} />
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                  <button key={p} onClick={()=>setPage(p)} style={{ width:30,height:30,borderRadius:8,border:p===page?'none':'1px solid #E5E7EB',background:p===page?'#1A73E8':'white',color:p===page?'white':'#374151',fontSize:13,fontWeight:600,cursor:'pointer' }}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ width:30,height:30,borderRadius:8,border:'1px solid #E5E7EB',background:'white',cursor:page===totalPages?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <ChevronRight size={14} color={page===totalPages?'#D1D5DB':'#374151'} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: 268, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Request Summary Donut */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Request Summary</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <RequestDonut counts={counts} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>Total</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>{requests.length}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
              {[
                { color: '#F59E0B', label: 'Pending',   count: counts.requested },
                { color: '#22C55E', label: 'Approved',  count: counts.approved  },
                { color: '#1A73E8', label: 'Issued',    count: counts.issued    },
                { color: '#10B981', label: 'Returned',  count: counts.returned  },
                { color: '#EF4444', label: 'Rejected',  count: counts.rejected  },
                { color: '#9CA3AF', label: 'Cancelled', count: counts.cancelled },
              ].filter(i => i.count > 0).map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How Requests Work */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>How Requests Work?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { step: 1, icon: Search,       title: 'Search a book',    desc: 'Find the book you want.' },
              { step: 2, icon: ClipboardList,title: 'Send request',     desc: 'Click "Request Book" and submit.' },
              { step: 3, icon: CheckCircle,  title: 'Librarian review', desc: 'Librarian will approve or reject.' },
              { step: 4, icon: BookOpen,     title: 'Issue book',       desc: 'Once approved, collect from library!' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color="#1A73E8" />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF' }}>{item.step}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.title}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Need Help */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeadphonesIcon size={15} color="#1A73E8" />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Need Help?</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>Contact librarian</p>
            <a href="mailto:library@college.edu.in" style={{ fontSize: 13, color: '#1A73E8', textDecoration: 'none', fontWeight: 500 }}>library@college.edu.in</a>
            <a href="tel:+919876543210" style={{ fontSize: 13, color: '#374151', textDecoration: 'none' }}>+91 98765 43210</a>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
