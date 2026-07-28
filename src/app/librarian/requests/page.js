'use client';
import { useState, useEffect, useCallback } from 'react';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import {
  BookOpen, ClipboardList, CheckCircle, XCircle, Filter, Plus, Clock, X, Check
} from 'lucide-react';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtTime(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function fmtRelativeTime(d) {
  if (!d) return '';
  const date      = new Date(d);
  const today     = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === today.toDateString())     return `Today, ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${time}`;
}

const BOOK_COLORS = ['#E05252','#2B6CB0','#9C27B0','#F5F5F5','#D4A017','#26C6DA','#EA580C','#1A73E8'];


function BookCover({ color }) {
  return (
    <div style={{
      width: 42, height: 58, borderRadius: 4, flexShrink: 0, overflow: 'hidden', position: 'relative',
      boxShadow: '1px 2px 4px rgba(0,0,0,0.15)', background: color
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 5, height: '100%', background: 'rgba(0,0,0,0.15)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        <BookOpen size={14} color="rgba(255,255,255,0.8)" />
      </div>
    </div>
  );
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests]   = useState([]);
  const [acting, setActing]       = useState('');
  const [toast, setToast]         = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    const res  = await fetch('/api/requests');
    const data = await res.json();
    setRequests(data.requests || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const total    = requests.length;
  const pending  = requests.filter(r => r.status === 'requested').length;
  const approved = requests.filter(r => ['approved', 'issued', 'returned'].includes(r.status)).length;
  const rejected = requests.filter(r => r.status === 'rejected').length;

  const STATS = [
    { icon: <ClipboardList size={22} color="#1A73E8" />, iconBg: '#EFF6FF', value: total,    label: 'Total Requests'    },
    { icon: <Clock size={22} color="#F59E0B" />,         iconBg: '#FEF3C7', value: pending,   label: 'Pending Requests'  },
    { icon: <CheckCircle size={22} color="#16A34A" />,   iconBg: '#DCFCE7', value: approved,  label: 'Approved Requests' },
    { icon: <XCircle size={22} color="#DC2626" />,       iconBg: '#FEE2E2', value: rejected,  label: 'Rejected Requests' },
  ];

  const doAction = async (requestId, action) => {
    
    setActing(requestId + action);
    try {
      const res = await fetch('/api/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Action failed.'); return; }
      showToast(action === 'approve' ? 'Request approved! ✅' : action === 'issue' ? 'Book issued! 📚' : 'Request rejected.');
      load();
    } catch { showToast('Something went wrong.'); }
    finally { setActing(''); }
  };

  const tabs = [
    { id: 'all',       label: 'All Requests' },
    { id: 'requested', label: 'Pending'      },
    { id: 'approved',  label: 'Approved'     },
    { id: 'rejected',  label: 'Rejected'     },
  ];

  const STATUS_MAP = {
    requested: 'pending',
    approved:  'approved',
    issued:    'approved',
    returned:  'returned',
    rejected:  'rejected',
    cancelled: 'rejected',
  };

  const filteredRequests = activeTab === 'all'
    ? requests
    : requests.filter(r => (
        activeTab === 'requested' ? r.status === 'requested' :
        activeTab === 'approved'  ? ['approved','issued','returned'].includes(r.status) :
        r.status === activeTab
      ));

  return (
    <LibrarianLayout
      title="Requests"
      subtitle="Manage book requests from members"
      searchPlaceholder="Search books, members, ISBN..."
    >
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#1A73E8', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(26,115,232,0.4)' }}>{toast}</div>}
      <div style={{ padding: '24px 24px 32px' }}>
        {/* Two column layout */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Left column */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 46, height: 46, background: s.iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#1A73E8', cursor: 'pointer' }}>View details →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs and Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 8 }}>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '11px 24px',
                      border: 'none',
                      borderRadius: 8,
                      background: activeTab === tab.id ? '#1A73E8' : 'white',
                      color: activeTab === tab.id ? 'white' : '#374151',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      boxShadow: activeTab === tab.id ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Filter size={15} color="#1A73E8" />
                  Filters
                </button>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: 'none', borderRadius: 8, background: '#1A73E8', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Plus size={16} />
                  New Request
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '24%' }}>BOOK DETAILS</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '18%' }}>REQUESTED BY</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '15%' }}>REQUEST DATE</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '13%' }}>STATUS</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '30%' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req, i) => {
                    const uiStatus = STATUS_MAP[req.status] || req.status;
                    const statusConfig = {
                      pending:  { label: 'Pending',  bg: '#FEF3C7', color: '#D97706' },
                      approved: { label: 'Approved', bg: '#DCFCE7', color: '#15803D' },
                      returned: { label: 'Returned', bg: '#ECFDF5', color: '#10B981' },
                      rejected: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626' },
                    };
                    const status = statusConfig[uiStatus] || statusConfig.pending;
                    const cover  = BOOK_COLORS[i % BOOK_COLORS.length];
                    return (
                      <tr key={req._id} className="tr-hover" style={{ borderBottom: i < filteredRequests.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <BookCover color={cover} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.bookId?.title}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{req.bookId?.author}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>ISBN: {req.bookId?.isbn || '—'}</div>
                              {req.reason && (
                                <div style={{ fontSize: 11, color: '#4B5563', marginTop: 6, fontStyle: 'italic', background: '#F3F4F6', padding: '4px 8px', borderRadius: 6, display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={req.reason}>
                                  "{req.reason}"
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1A73E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
                              {(req.userId?.name || '?').split(' ').map(n => n[0]).join('')}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.userId?.name}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{req.userId?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{fmtDate(req.createdAt)}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{fmtTime(req.createdAt)}</div>
                          {req.daysNeeded && (
                            <div style={{ fontSize: 11, color: '#1A73E8', marginTop: 6, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, background: '#EFF6FF', padding: '2px 8px', borderRadius: 9999 }}>
                              {req.daysNeeded} Days
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ padding: '4px 12px', background: status.bg, color: status.color, borderRadius: 9999, fontSize: 11, fontWeight: 500, display: 'inline-block' }}>
                            {status.label}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                            {req.status === 'requested' ? (
                              <>
                                <button type="button" title="Approve Request"
                                  disabled={acting === req._id + 'approve'}
                                  onClick={() => doAction(req._id, 'approve')}
                                  style={{ padding: '7px 14px', border: '1px solid #16A34A', background: 'white', color: '#16A34A', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, fontFamily: 'Inter', transition: 'all 0.15s ease' }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#16A34A'; e.currentTarget.style.color = 'white'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#16A34A'; }}
                                >
                                  <Check size={14} /> Approve
                                </button>
                                <button type="button" title="Reject Request"
                                  disabled={acting === req._id + 'reject'}
                                  onClick={() => doAction(req._id, 'reject')}
                                  style={{ padding: '7px 14px', border: '1px solid #DC2626', background: 'white', color: '#DC2626', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, fontFamily: 'Inter', transition: 'all 0.15s ease' }}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = 'white'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#DC2626'; }}
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            ) : req.status === 'approved' ? (
                              <button type="button"
                                disabled={acting === req._id + 'issue'}
                                onClick={() => doAction(req._id, 'issue')}
                                style={{ padding: '7px 14px', border: '1px solid #1A73E8', background: 'white', color: '#1A73E8', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, fontFamily: 'Inter' }}
                              >
                                Issue Book
                              </button>
                            ) : (
                              <span style={{ fontSize: 13, color: '#9CA3AF' }}>—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Showing 1 to 7 of 48 results</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {['‹', '1', '2', '3', '...', '7', '›'].map((p, i) => (
                    <button key={i} type="button" style={{
                      minWidth: 32, height: 32, padding: '0 8px',
                      border: p === '1' ? 'none' : '1px solid transparent',
                      borderRadius: 8,
                      background: p === '1' ? '#1A73E8' : 'transparent',
                      color: p === '1' ? 'white' : (p === '‹' || p === '›' ? '#9CA3AF' : '#374151'),
                      fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter',
                    }}>{p}</button>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: '#6B7280' }}>7 / page</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{
            width: 280,
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            padding: '20px 16px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>

            {/* Recent Requests */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recent Requests</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#1A73E8', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(() => {
                  const recent = [...requests]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 4);
                  if (recent.length === 0) return (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: '#9CA3AF', fontSize: 12 }}>No requests yet</div>
                  );
                  return recent.map((req, i) => {
                    const isApproved = ['approved','issued','returned'].includes(req.status);
                    const isRejected = ['rejected','cancelled'].includes(req.status);
                    const statusLabel = isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending';
                    const statusColor = isApproved ? '#16A34A' : isRejected ? '#DC2626' : '#F59E0B';
                    const cover = BOOK_COLORS[i % BOOK_COLORS.length];
                    return (
                      <div key={req._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px', background: '#F9FAFB', borderRadius: 8 }}>
                        <div style={{ width: 32, height: 44, borderRadius: 3, background: cover, flexShrink: 0, boxShadow: '1px 1px 3px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden' }}>
                          <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', background: 'rgba(0,0,0,0.15)' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.bookId?.title || '—'}</div>
                          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>requested by {req.userId?.name || '—'}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{fmtRelativeTime(req.createdAt)}</div>
                          <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', background: statusColor + '20', color: statusColor, borderRadius: 9999, fontSize: 10, fontWeight: 600 }}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Request Summary (This Month) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Request Summary (This Month)</span>
              </div>
              {(() => {
                const now  = new Date();
                const mon  = requests.filter(r => {
                  const d = new Date(r.createdAt);
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                });
                const mTotal    = mon.length;
                const mPending  = mon.filter(r => r.status === 'requested').length;
                const mApproved = mon.filter(r => ['approved','issued','returned'].includes(r.status)).length;
                const mRejected = mon.filter(r => ['rejected','cancelled'].includes(r.status)).length;
                const pPending  = mTotal > 0 ? mPending  / mTotal : 0;
                const pApproved = mTotal > 0 ? mApproved / mTotal : 0;
                const pRejected = mTotal > 0 ? mRejected / mTotal : 0;
                const C = 377; // 2π×60
                return (
                  <>
                    {/* Donut Chart */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
                      <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="80" cy="80" r="60" fill="none" stroke="#F3F4F6" strokeWidth="24" />
                        {mTotal === 0 ? null : <>
                          <circle cx="80" cy="80" r="60" fill="none" stroke="#F59E0B" strokeWidth="24"
                            strokeDasharray={`${C * pPending} ${C}`} strokeDashoffset="0" />
                          <circle cx="80" cy="80" r="60" fill="none" stroke="#16A34A" strokeWidth="24"
                            strokeDasharray={`${C * pApproved} ${C}`} strokeDashoffset={`-${C * pPending}`} />
                          <circle cx="80" cy="80" r="60" fill="none" stroke="#DC2626" strokeWidth="24"
                            strokeDasharray={`${C * pRejected} ${C}`} strokeDashoffset={`-${C * (pPending + pApproved)}`} />
                        </>}
                      </svg>
                      <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{mTotal}</div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>Total</div>
                      </div>
                    </div>
                    {/* Legend */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { color: '#F59E0B', label: 'Pending',  count: mPending,  pct: pPending  },
                        { color: '#16A34A', label: 'Approved', count: mApproved, pct: pApproved },
                        { color: '#DC2626', label: 'Rejected', count: mRejected, pct: pRejected },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                            <span style={{ fontSize: 12, color: '#6B7280' }}>{item.label}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                            {item.count} {mTotal > 0 ? `(${(item.pct * 100).toFixed(1)}%)` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Quick Actions */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: <CheckCircle size={16} color="#16A34A" />, label: 'Approve All Pending', color: '#16A34A' },
                  { icon: <XCircle size={16} color="#DC2626" />, label: 'Reject All Pending', color: '#DC2626' },
                  { icon: <ClipboardList size={16} color="#1A73E8" />, label: 'View All Requests', color: '#1A73E8' },
                ].map((action, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: 8,
                      background: 'white',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F9FAFB';
                      e.currentTarget.style.borderColor = action.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    <div style={{ width: 32, height: 32, background: '#F3F4F6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {action.icon}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LibrarianLayout>
  );
}
