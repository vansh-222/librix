'use client';
import { useState, useEffect, useCallback } from 'react';
import { BookOpen, CreditCard, Download, ChevronRight, HeadphonesIcon, Loader2, Calendar } from 'lucide-react';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysBetween(a, b) {
  if (!a || !b) return 0;
  return Math.max(0, Math.ceil((new Date(b) - new Date(a)) / 86400000));
}

function BookCover({ cover, title }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: 44, height: 60, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
      {cover && !err
        ? <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#6366F1,#A78BFA)' }}><BookOpen size={16} color="white" /></div>
      }
    </div>
  );
}

function FineDonut({ unpaid, paid }) {
  const total = unpaid + paid || 1;
  const r = 52, cx = 64, cy = 64, C = 2 * Math.PI * r;
  const unpaidDash = (unpaid / total) * C;
  const paidDash   = (paid   / total) * C;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="12" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray={`${unpaidDash} ${C - unpaidDash}`} strokeDashoffset={0} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22C55E" strokeWidth="12" strokeDasharray={`${paidDash} ${C - paidDash}`} strokeDashoffset={-unpaidDash} />
    </svg>
  );
}

export default function StudentFines() {
  const [fines, setFines]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]       = useState('overview');
  const [toast, setToast]   = useState('');
  const [actionId, setActionId] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const loadFines = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all borrow records — filter those with fine > 0
      const res  = await fetch('/api/borrow');
      const data = await res.json();
      const withFine = (data.records || []).filter(r => r.fine > 0 || r.fineStatus === 'paid');
      setFines(withFine);
    } catch {
      showToast('Failed to load fines.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFines(); }, [loadFines]);

  const payFine = async (recordId) => {
    setActionId(recordId);
    try {
      const res = await fetch('/api/borrow', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, action: 'pay_fine' }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Payment failed.'); return; }
      showToast('Fine paid successfully! ✅');
      loadFines();
    } catch {
      showToast('Something went wrong.');
    } finally {
      setActionId('');
    }
  };

  const totalFine   = fines.reduce((s, r) => s + (r.fine || 0), 0);
  const pendingFine = fines.filter(r => r.fineStatus === 'pending').reduce((s, r) => s + (r.fine || 0), 0);
  const paidFine    = fines.filter(r => r.fineStatus === 'paid').reduce((s, r) => s + (r.fine || 0), 0);

  const lastPaid = fines
    .filter(r => r.fineStatus === 'paid')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

  const STAT_CARDS = [
    { icon: '🧾', label: 'Total Fine',    value: `₹${totalFine}`,   sub: 'Total outstanding', bg: '#FEF2F2' },
    { icon: '⏳', label: 'Pending Fine',  value: `₹${pendingFine}`, sub: 'To be paid',        bg: '#FFFBEB' },
    { icon: '💰', label: 'Paid Fine',     value: `₹${paidFine}`,    sub: 'This year',         bg: '#F0FDF4' },
    { icon: '📅', label: 'Last Payment',  value: lastPaid ? fmtDate(lastPaid.updatedAt) : '—', sub: lastPaid ? 'Last paid' : 'No payments yet', bg: '#EEF2FF' },
  ];

  const TABS = [
    { key: 'overview', label: 'Fine Overview'   },
    { key: 'history',  label: 'Payment History' },
    { key: 'txn',      label: 'Transactions'    },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', overflow: 'hidden' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#6366F1', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>
          {toast}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', minWidth: 0 }}>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {STAT_CARDS.map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 3 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', overflow: 'hidden' }}>
          {TABS.map((t, i) => {
            const isActive = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flex: 1, padding: '13px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14, fontWeight: isActive ? 600 : 500, color: isActive ? '#6366F1' : '#6B7280',
                borderBottom: isActive ? '2px solid #6366F1' : '2px solid transparent',
                borderRight: i < TABS.length - 1 ? '1px solid #E5E7EB' : 'none', transition: 'all 0.2s',
              }}>{t.label}</button>
            );
          })}
        </div>

        {/* Table */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '0 20px 20px' }}>
          <div style={{ paddingTop: 14, paddingBottom: 12, borderBottom: '1px solid #F3F4F6', marginBottom: 4 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Fine Overview</h2>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
              <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: '#6366F1' }} />
            </div>
          ) : fines.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <p style={{ color: '#9CA3AF', fontSize: 15 }}>🎉 No fines! You're all clear.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Book Details','Issued On','Due Date','Returned On','Days Late','Fine Amount','Status'].map(h => (
                    <th key={h} style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fines.map(rec => {
                  const isUnpaid  = rec.fineStatus === 'pending';
                  const daysLate  = daysBetween(rec.dueDate, rec.returnDate || new Date());
                  const isActing  = actionId === rec._id;
                  return (
                    <tr key={rec._id} style={{ borderTop: '1px solid #F3F4F6' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <BookCover cover={rec.bookId?.cover} title={rec.bookId?.title} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{rec.bookId?.title}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{rec.bookId?.author}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 12px', fontSize: 13, color: '#374151' }}>{fmtDate(rec.issueDate)}</td>
                      <td style={{ padding: '14px 12px', fontSize: 13, color: '#374151' }}>{fmtDate(rec.dueDate)}</td>
                      <td style={{ padding: '14px 12px', fontSize: 13, color: daysLate > 0 ? '#EF4444' : '#374151', fontWeight: daysLate > 0 ? 600 : 400 }}>{fmtDate(rec.returnDate)}</td>
                      <td style={{ padding: '14px 12px', fontSize: 13, color: daysLate > 0 ? '#EF4444' : '#374151', fontWeight: daysLate > 0 ? 600 : 400 }}>{daysLate} day{daysLate !== 1 ? 's' : ''}</td>
                      <td style={{ padding: '14px 12px', fontSize: 13, fontWeight: 700, color: rec.fine > 0 ? '#EF4444' : '#22C55E' }}>₹{rec.fine}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: isUnpaid ? '#FEF2F2' : '#F0FDF4', color: isUnpaid ? '#EF4444' : '#22C55E', border: `1px solid ${isUnpaid ? '#FECACA' : '#BBF7D0'}` }}>
                            {rec.fineStatus === 'paid' ? 'Paid' : rec.fineStatus === 'waived' ? 'Waived' : 'Unpaid'}
                          </span>
                          {isUnpaid ? (
                            <button onClick={() => payFine(rec._id)} disabled={isActing}
                              style={{ padding: '6px 14px', border: 'none', borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              {isActing ? '...' : 'Pay Now'}
                            </button>
                          ) : (
                            <button style={{ padding: '6px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div style={{ paddingTop: 16, borderTop: '1px solid #F3F4F6', marginTop: 8, fontSize: 13, color: '#9CA3AF' }}>
            Showing 1 to {fines.length} of {fines.length} records
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: 268, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Fine Summary Donut */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Fine Summary</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <FineDonut unpaid={pendingFine} paid={paidFine} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>₹{totalFine}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[{ color: '#EF4444', label: 'Unpaid', value: `₹${pendingFine}` }, { color: '#22C55E', label: 'Paid', value: `₹${paidFine}` }].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{item.label}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginLeft: 14 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Quick Actions</h3>
          {[
            { icon: CreditCard,  title: 'Pay Fine Online',  desc: 'Secure and quick payment'  },
            { icon: Download,    title: 'Download Receipt', desc: 'Get receipt of payments'    },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, width: '100%', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => showToast(`${item.title} — coming soon!`)}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color="#6366F1" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{item.desc}</div>
                </div>
                <ChevronRight size={15} color="#D1D5DB" />
              </button>
            );
          })}
        </div>

        {/* Important Notes */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Important Notes</h3>
          {['Fine is charged at ₹5–10 per day per book for overdue books.', 'Return the book to stop further fine accrual.', 'Online payments are updated instantly.'].map((note, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{['🕐','📖','⚡'][i]}</span>
              <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{note}</p>
            </div>
          ))}
        </div>

        {/* Need Help */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeadphonesIcon size={15} color="#6366F1" />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Need Help?</h3>
          </div>
          <p style={{ fontSize: 13, color: '#374151', margin: '0 0 6px' }}>Contact librarian</p>
          <a href="mailto:library@college.edu.in" style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none', fontWeight: 500, display: 'block', marginBottom: 4 }}>library@college.edu.in</a>
          <a href="tel:+919876543210" style={{ fontSize: 13, color: '#374151', textDecoration: 'none' }}>+91 98765 43210</a>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
