'use client';
import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Loader2, CheckCircle2, HeadphonesIcon, QrCode, CreditCard, AlertCircle } from 'lucide-react';

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
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EF4444" strokeWidth="12" strokeDasharray={`${unpaidDash} ${C - unpaidDash}`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22C55E" strokeWidth="12" strokeDasharray={`${paidDash} ${C - paidDash}`} strokeDashoffset={-unpaidDash} />
    </svg>
  );
}

// ── Load Razorpay checkout script ──────────────────────────────────────────────
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function StudentFines() {
  const [fines, setFines]         = useState([]);
  const [college, setCollege]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [paying, setPaying]       = useState('');  // recordId being paid
  const [toast, setToast]         = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [borrowRes, collegeRes] = await Promise.all([
        fetch('/api/borrow'),
        fetch('/api/colleges/my'),
      ]);
      const borrowData  = await borrowRes.json();
      const collegeData = await collegeRes.json();

      const withFine = (borrowData.records || []).filter(r => (r.fine > 0) || r.fineStatus === 'paid');
      setFines(withFine);
      setCollege(collegeData.college);
    } catch {
      showToast('Failed to load fines.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Razorpay Payment Flow ──────────────────────────────────────────────────
  const payWithRazorpay = async (rec) => {
    setPaying(rec._id);
    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) { showToast('Failed to load payment gateway. Check your internet.', 'error'); return; }

      // 2. Create order on backend
      const orderRes = await fetch('/api/payments/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ recordId: rec._id }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) { showToast(orderData.error || 'Could not create payment.', 'error'); return; }

      // 3. Open Razorpay checkout popup
      const options = {
        key:         orderData.keyId,
        amount:      orderData.amount,   // in paise
        currency:    orderData.currency,
        name:        college?.name || 'Library',
        description: orderData.description,
        order_id:    orderData.orderId,
        prefill: {
          name:  orderData.name,
          email: orderData.email,
        },
        theme: { color: '#6366F1' },
        modal: {
          ondismiss: () => { setPaying(''); },
        },
        handler: async (response) => {
          // 4. Verify payment signature on backend (HMAC-SHA256)
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                recordId:            rec._id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              showToast(verifyData.error || 'Payment verification failed.', 'error');
            } else {
              showToast(`₹${rec.fine} paid successfully! Payment ID: ${response.razorpay_payment_id}`, 'success');
              loadData(); // refresh list
            }
          } catch {
            showToast('Payment verification error.', 'error');
          } finally {
            setPaying('');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        showToast(`Payment failed: ${response.error?.description || 'Unknown error'}`, 'error');
        setPaying('');
      });
      rzp.open();
    } catch (err) {
      showToast('Payment error: ' + err.message, 'error');
      setPaying('');
    }
  };

  const totalFine   = fines.reduce((s, r) => s + (r.fine || 0), 0);
  const pendingFine = fines.filter(r => r.fineStatus === 'pending').reduce((s, r) => s + (r.fine || 0), 0);
  const paidFine    = fines.filter(r => r.fineStatus === 'paid').reduce((s, r) => s + (r.fine || 0), 0);
  const lastPaid    = fines.filter(r => r.fineStatus === 'paid').sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
  const finePerDay  = college?.settings?.finePerDay || 50;

  const STAT_CARDS = [
    { icon: '🧾', label: 'Total Fine',   value: `₹${totalFine}`,   sub: 'Overall outstanding',  bg: '#FEF2F2' },
    { icon: '⏳', label: 'Pending Fine', value: `₹${pendingFine}`, sub: 'To be paid',            bg: '#FFFBEB' },
    { icon: '💰', label: 'Paid Fine',    value: `₹${paidFine}`,    sub: 'Confirmed via Razorpay', bg: '#F0FDF4' },
    { icon: '📅', label: 'Last Payment', value: lastPaid ? fmtDate(lastPaid.finePaidAt || lastPaid.updatedAt) : '—', sub: lastPaid ? 'Last paid' : 'No payments yet', bg: '#EEF2FF' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', overflow: 'hidden' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Toast */}
      {toast.msg && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.type === 'error' ? '#EF4444' : '#22C55E',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14,
          fontWeight: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 8, maxWidth: 420,
        }}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ─── MAIN ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', minWidth: 0 }}>

        {/* Razorpay info banner */}
        <div style={{ background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', border: '1px solid #C7D2FE', borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(99,102,241,0.15)' }}>
            <CreditCard size={20} color="#6366F1" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#4338CA' }}>Secure Payments via Razorpay</div>
            <div style={{ fontSize: 12, color: '#6366F1' }}>Pay using UPI, Debit/Credit card, Net Banking — payments are verified automatically.</div>
          </div>
        </div>

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

        {/* Table */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12 }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Fine Overview</h2>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>₹{finePerDay}/day overdue rate</span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: '#6366F1' }} />
            </div>
          ) : fines.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <p style={{ color: '#6B7280', fontSize: 15, fontWeight: 600, margin: '0 0 4px' }}>No fines! You're all clear.</p>
              <p style={{ color: '#9CA3AF', fontSize: 13 }}>Return books on time to keep it this way.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Book Details', 'Issued On', 'Due Date', 'Returned On', 'Days Late', 'Fine Amount', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 14px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fines.map(rec => {
                    const isUnpaid  = rec.fineStatus === 'pending';
                    const daysLate  = daysBetween(rec.dueDate, rec.returnDate || new Date());
                    const isPaying  = paying === rec._id;
                    return (
                      <tr key={rec._id} style={{ borderTop: '1px solid #F3F4F6' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <BookCover cover={rec.bookId?.cover} title={rec.bookId?.title} />
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rec.bookId?.title}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{rec.bookId?.author}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px', fontSize: 13, color: '#374151' }}>{fmtDate(rec.issueDate)}</td>
                        <td style={{ padding: '14px', fontSize: 13, color: '#374151' }}>{fmtDate(rec.dueDate)}</td>
                        <td style={{ padding: '14px', fontSize: 13, color: daysLate > 0 ? '#EF4444' : '#374151', fontWeight: daysLate > 0 ? 600 : 400 }}>{fmtDate(rec.returnDate)}</td>
                        <td style={{ padding: '14px', fontSize: 13, color: daysLate > 0 ? '#EF4444' : '#374151', fontWeight: daysLate > 0 ? 600 : 400 }}>{daysLate}d</td>
                        <td style={{ padding: '14px', fontSize: 14, fontWeight: 800, color: rec.fine > 0 ? '#EF4444' : '#22C55E' }}>₹{rec.fine}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{
                            display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                            background: isUnpaid ? '#FEF2F2' : rec.fineStatus === 'waived' ? '#FFFBEB' : '#F0FDF4',
                            color: isUnpaid ? '#EF4444' : rec.fineStatus === 'waived' ? '#D97706' : '#22C55E',
                            border: `1px solid ${isUnpaid ? '#FECACA' : rec.fineStatus === 'waived' ? '#FDE68A' : '#BBF7D0'}`,
                          }}>
                            {rec.fineStatus === 'paid' ? '✅ Paid' : rec.fineStatus === 'waived' ? '⚡ Waived' : '🔴 Unpaid'}
                          </span>
                          {rec.fineStatus === 'paid' && rec.upiTxnId && (
                            <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3, fontFamily: 'monospace' }}>
                              ID: {rec.upiTxnId.slice(0, 14)}…
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {isUnpaid ? (
                            <button
                              onClick={() => payWithRazorpay(rec)}
                              disabled={!!paying}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 16px', border: 'none', borderRadius: 8,
                                background: paying ? '#A78BFA' : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                                color: 'white', fontSize: 12, fontWeight: 700,
                                cursor: paying ? 'wait' : 'pointer', whiteSpace: 'nowrap',
                              }}
                            >
                              {isPaying
                                ? <><Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Opening...</>
                                : <><CreditCard size={13} /> Pay ₹{rec.fine}</>
                              }
                            </button>
                          ) : (
                            <span style={{ fontSize: 12, color: '#9CA3AF' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #F3F4F6', fontSize: 13, color: '#9CA3AF' }}>
            {fines.length} fine record{fines.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
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

        {/* Pay All Pending */}
        {pendingFine > 0 && (
          <div style={{ background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', borderRadius: 12, padding: 18, color: 'white' }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Total Pending</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>₹{pendingFine}</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 12 }}>Click "Pay" on any row to clear it</div>
            <div style={{ fontSize: 12, background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 12px' }}>
              🔒 Verified by Razorpay
            </div>
          </div>
        )}

        {/* How it works */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>How payments work</h3>
          {[
            ['🛡️', 'Click "Pay" → Razorpay popup opens'],
            ['💳', 'Pay via UPI, card, or net banking'],
            ['✅', 'Payment auto-verified by Razorpay'],
            ['🔔', 'Librarian gets notified instantly'],
          ].map(([icon, text], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
              <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{text}</p>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Important Notes</h3>
          {[
            `Fine rate: ₹${finePerDay}/day overdue`,
            'Return books on time to avoid fines.',
            'Payments are non-refundable once confirmed.',
          ].map((note, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{['🕐', '📖', '⚠️'][i]}</span>
              <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{note}</p>
            </div>
          ))}
        </div>

        {/* Support */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeadphonesIcon size={15} color="#6366F1" />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Need Help?</h3>
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Contact your librarian for fine disputes or waiver requests.</p>
        </div>
      </div>
    </div>
  );
}
