'use client';
import { useState } from 'react';
import {
  BookOpen, CreditCard, Download, ChevronRight,
  Clock, ShieldAlert, Zap, HeadphonesIcon,
  Calendar, Receipt, CheckCircle2
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_FINES = [
  {
    id: 'f1',
    book: 'The 5 AM Club',
    author: 'Robin Sharma',
    cover: 'https://covers.openlibrary.org/b/id/10387070-M.jpg',
    issuedOn:    '01 Jun 2026',
    dueDate:     '15 Jun 2026',
    returnedOn:  '16 Jun 2026',
    daysLate:    1,
    fineAmount:  10,
    status:      'unpaid',
  },
  {
    id: 'f2',
    book: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://covers.openlibrary.org/b/id/10519054-M.jpg',
    issuedOn:    '10 May 2026',
    dueDate:     '24 May 2026',
    returnedOn:  '24 May 2026',
    daysLate:    0,
    fineAmount:  0,
    status:      'paid',
  },
  {
    id: 'f3',
    book: 'Deep Work',
    author: 'Cal Newport',
    cover: 'https://covers.openlibrary.org/b/id/8739161-M.jpg',
    issuedOn:    '28 Apr 2026',
    dueDate:     '12 May 2026',
    returnedOn:  '18 May 2026',
    daysLate:    6,
    fineAmount:  60,
    status:      'paid',
  },
  {
    id: 'f4',
    book: 'Clean Code',
    author: 'Robert C. Martin',
    cover: 'https://covers.openlibrary.org/b/id/8621101-M.jpg',
    issuedOn:    '05 Apr 2026',
    dueDate:     '19 Apr 2026',
    returnedOn:  '29 Apr 2026',
    daysLate:    10,
    fineAmount:  100,
    status:      'paid',
  },
  {
    id: 'f5',
    book: 'The Psychology of Money',
    author: 'Morgan Housel',
    cover: 'https://covers.openlibrary.org/b/id/10789917-M.jpg',
    issuedOn:    '20 Mar 2026',
    dueDate:     '03 Apr 2026',
    returnedOn:  '03 Apr 2026',
    daysLate:    0,
    fineAmount:  0,
    status:      'paid',
  },
];

// ─── Book Cover ───────────────────────────────────────────────────────────────
function BookCover({ cover, title }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width: 44, height: 60, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
      {cover && !err ? (
        <img src={cover} alt={title} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#6366F1,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={16} color="white" />
        </div>
      )}
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function FineDonut({ unpaid, paid }) {
  const total = unpaid + paid || 1;
  const r = 52, cx = 64, cy = 64;
  const C = 2 * Math.PI * r;
  const unpaidDash = (unpaid / total) * C;
  const paidDash   = (paid   / total) * C;

  return (
    <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="12" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EF4444" strokeWidth="12"
        strokeDasharray={`${unpaidDash} ${C - unpaidDash}`} strokeDashoffset={0} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22C55E" strokeWidth="12"
        strokeDasharray={`${paidDash} ${C - paidDash}`} strokeDashoffset={-unpaidDash} strokeLinecap="round" />
    </svg>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StudentFines() {
  const [tab, setTab]   = useState('overview');
  const [filter, setFilter] = useState('all');
  const [fines, setFines]   = useState(MOCK_FINES);
  const [toast, setToast]   = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const totalFine   = fines.reduce((s, f) => s + f.fineAmount, 0);
  const pendingFine = fines.filter(f => f.status === 'unpaid').reduce((s, f) => s + f.fineAmount, 0);
  const paidFine    = fines.filter(f => f.status === 'paid').reduce((s, f) => s + f.fineAmount, 0);

  const filtered = filter === 'all' ? fines : fines.filter(f => f.status === filter);

  const payFine = (id) => {
    setFines(prev => prev.map(f => f.id === id ? { ...f, status: 'paid' } : f));
    showToast('Fine paid successfully!');
  };

  const TABS = [
    { key: 'overview', label: 'Fine Overview',     icon: Receipt },
    { key: 'history',  label: 'Payment History',   icon: Clock   },
    { key: 'txn',      label: 'Transactions',       icon: CreditCard },
  ];

  const STAT_CARDS = [
    {
      label: 'Total Fine',
      value: `₹${totalFine}`,
      sub: 'Total outstanding',
      iconBg: '#FEF2F2',
      iconColor: '#EF4444',
      icon: '🧾',
    },
    {
      label: 'Pending Fine',
      value: `₹${pendingFine}`,
      sub: 'To be paid',
      iconBg: '#FFFBEB',
      iconColor: '#F59E0B',
      icon: '⏳',
    },
    {
      label: 'Paid Fine',
      value: `₹${paidFine}`,
      sub: 'This year',
      iconBg: '#F0FDF4',
      iconColor: '#22C55E',
      icon: '💰',
    },
    {
      label: 'Last Payment',
      value: '—',
      sub: 'No payments yet',
      iconBg: '#EEF2FF',
      iconColor: '#6366F1',
      icon: '📅',
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: 'Inter, sans-serif', background: '#F9FAFB', overflow: 'hidden' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          background: '#6366F1', color: '#fff', padding: '10px 20px',
          borderRadius: 10, fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
        }}>{toast}</div>
      )}

      {/* ═══ MAIN ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', minWidth: 0 }}>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {STAT_CARDS.map((s, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 12, border: '1px solid #E5E7EB',
              padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 3 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab Bar ── */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', marginBottom: 0, overflow: 'hidden' }}>
          {TABS.map((t, i) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#6366F1' : '#6B7280',
                borderBottom: isActive ? '2px solid #6366F1' : '2px solid transparent',
                borderRight: i < TABS.length - 1 ? '1px solid #E5E7EB' : 'none',
                transition: 'all 0.2s',
              }}>
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ── Fine Overview Table ── */}
        <div style={{ background: 'white', borderRadius: '0 0 12px 12px', border: '1px solid #E5E7EB', borderTop: 'none', padding: '0 20px 20px' }}>
          <div style={{ padding: '16px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', marginBottom: 4 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Fine Overview</h2>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Book Details', 'Issued On', 'Due Date', 'Returned On', 'Days Late', 'Fine Amount', 'Status'].map(h => (
                  <th key={h} style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((fine, idx) => {
                const isUnpaid = fine.status === 'unpaid';
                return (
                  <tr key={fine.id} style={{ borderTop: '1px solid #F3F4F6' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Book Details */}
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <BookCover cover={fine.cover} title={fine.book} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{fine.book}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{fine.author}</div>
                        </div>
                      </div>
                    </td>

                    {/* Issued On */}
                    <td style={{ padding: '14px 12px', fontSize: 13, color: '#374151' }}>{fine.issuedOn}</td>

                    {/* Due Date */}
                    <td style={{ padding: '14px 12px', fontSize: 13, color: '#374151' }}>{fine.dueDate}</td>

                    {/* Returned On */}
                    <td style={{ padding: '14px 12px', fontSize: 13, color: fine.daysLate > 0 ? '#EF4444' : '#374151', fontWeight: fine.daysLate > 0 ? 600 : 400 }}>
                      {fine.returnedOn}
                    </td>

                    {/* Days Late */}
                    <td style={{ padding: '14px 12px', fontSize: 13, color: fine.daysLate > 0 ? '#EF4444' : '#374151', fontWeight: fine.daysLate > 0 ? 600 : 400 }}>
                      {fine.daysLate} day{fine.daysLate !== 1 ? 's' : ''}
                    </td>

                    {/* Fine Amount */}
                    <td style={{ padding: '14px 12px', fontSize: 13, fontWeight: 700, color: fine.fineAmount > 0 ? '#EF4444' : '#22C55E' }}>
                      {fine.fineAmount > 0 ? `₹${fine.fineAmount}` : '₹0'}
                    </td>

                    {/* Status + Action */}
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <span style={{
                          display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                          fontSize: 12, fontWeight: 600, textAlign: 'center',
                          background: isUnpaid ? '#FEF2F2' : '#F0FDF4',
                          color: isUnpaid ? '#EF4444' : '#22C55E',
                          border: `1px solid ${isUnpaid ? '#FECACA' : '#BBF7D0'}`,
                        }}>
                          {isUnpaid ? 'Unpaid' : 'Paid'}
                        </span>
                        {isUnpaid ? (
                          <button
                            onClick={() => payFine(fine.id)}
                            style={{
                              padding: '6px 14px', border: 'none', borderRadius: 8,
                              background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white',
                              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Pay Now
                          </button>
                        ) : (
                          <button
                            style={{
                              padding: '6px 14px', border: '1px solid #E5E7EB', borderRadius: 8,
                              background: 'white', color: '#374151',
                              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}
                          >
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer count */}
          <div style={{ paddingTop: 16, borderTop: '1px solid #F3F4F6', marginTop: 8, fontSize: 13, color: '#9CA3AF' }}>
            Showing 1 to {filtered.length} of {filtered.length} records
          </div>
        </div>
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div style={{ width: 268, flexShrink: 0, overflowY: 'auto', padding: '28px 20px 28px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Fine Summary Donut */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Fine Summary</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <FineDonut unpaid={pendingFine} paid={paidFine} />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>Total</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>₹{totalFine}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { color: '#EF4444', label: 'Unpaid', value: `₹${pendingFine}` },
                { color: '#22C55E', label: 'Paid',   value: `₹${paidFine}`   },
              ].map(item => (
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { icon: CreditCard,  title: 'Pay Fine Online',     desc: 'Secure and quick payment'    },
              { icon: Receipt,     title: 'Payment History',     desc: 'View all your payments'      },
              { icon: Download,    title: 'Download Receipt',    desc: 'Get receipt of payments'     },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, width: '100%', textAlign: 'left', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => showToast(`${item.title} — coming soon!`)}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
        </div>

        {/* Important Notes */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Important Notes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🕐', text: 'Fine is charged at ₹10 per day per book for overdue books.' },
              { icon: '📖', text: 'Return the book to stop further fine accrual.' },
              { icon: '⚡', text: 'Online payments are updated instantly.' },
            ].map((note, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{note.icon}</span>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{note.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Need Help */}
        <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeadphonesIcon size={15} color="#6366F1" />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Need Help?</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>Contact librarian</p>
            <a href="mailto:library@college.edu.in" style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none', fontWeight: 500 }}>library@college.edu.in</a>
            <a href="tel:+919876543210" style={{ fontSize: 13, color: '#374151', textDecoration: 'none' }}>+91 98765 43210</a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}
