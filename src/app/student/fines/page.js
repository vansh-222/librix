'use client';
import { DollarSign, Clock, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';

export default function StudentFines() {
  const stats = [
    { label: 'Total Fine', value: '₹50', subtitle: 'Pending Payment', icon: DollarSign, color: '#DC2626' },
    { label: 'Paid Fines', value: '₹120', subtitle: 'All Time', icon: CheckCircle, color: '#10B981' },
    { label: 'Overdue Books', value: '1', subtitle: 'Active', icon: AlertTriangle, color: '#F59E0B' },
  ];

  const fines = [
    { id: 1, book: 'The Great Gatsby', reason: 'Late Return (5 days)', amount: 50, date: '20 Jun 2024', status: 'Pending', dueDate: '15 Jun 2024' },
    { id: 2, book: 'Clean Code', reason: 'Late Return (2 days)', amount: 20, date: '10 Jun 2024', status: 'Paid', dueDate: '08 Jun 2024' },
    { id: 3, book: 'The Hobbit', reason: 'Late Return (7 days)', amount: 70, date: '05 Jun 2024', status: 'Paid', dueDate: '28 May 2024' },
    { id: 4, book: 'Atomic Habits', reason: 'Late Return (3 days)', amount: 30, date: '01 Jun 2024', status: 'Paid', dueDate: '29 May 2024' },
  ];

  const pendingTotal = fines.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0);

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Fines & Payments</h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>Manage your library fines and payment history</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '20px',
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 2 }}>{stat.label}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{stat.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
          {/* Fines Table */}
          <div style={{ background: 'white', padding: '24px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Fine History</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{
                  padding: '8px 16px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6C5CE7',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                }}>
                  All
                </button>
                <button style={{
                  padding: '8px 16px',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                }}>
                  Pending
                </button>
                <button style={{
                  padding: '8px 16px',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                }}>
                  Paid
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Book</th>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Reason</th>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Due Date</th>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Fine Date</th>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Amount</th>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Status</th>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {fines.map(fine => (
                  <tr key={fine.id} className="tr-hover" style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '12px', fontSize: 13, color: '#111827', fontWeight: 500 }}>{fine.book}</td>
                    <td style={{ padding: '12px', fontSize: 13, color: '#6B7280' }}>{fine.reason}</td>
                    <td style={{ padding: '12px', fontSize: 13, color: '#6B7280' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Calendar size={12} color="#9CA3AF" />
                        {fine.dueDate}
                      </div>
                    </td>
                    <td style={{ padding: '12px', fontSize: 13, color: '#6B7280' }}>{fine.date}</td>
                    <td style={{ padding: '12px', fontSize: 13, fontWeight: 600, color: '#DC2626' }}>₹{fine.amount}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: fine.status === 'Paid' ? '#D1FAE5' : '#FEE2E2',
                        color: fine.status === 'Paid' ? '#059669' : '#DC2626',
                      }}>
                        {fine.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {fine.status === 'Pending' && (
                        <button style={{
                          padding: '6px 12px',
                          background: '#6C5CE7',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'white',
                          cursor: 'pointer',
                          fontFamily: 'Inter',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#5B4BC5'}
                        onMouseLeave={e => e.currentTarget.style.background = '#6C5CE7'}
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Payment Summary */}
            {pendingTotal > 0 && (
              <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Payment Summary</h3>
                <div style={{
                  padding: '16px',
                  background: '#FEE2E2',
                  borderRadius: 8,
                  marginBottom: 16,
                }}>
                  <div style={{ fontSize: 11, color: '#991B1B', marginBottom: 4, fontWeight: 600 }}>Total Pending</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#DC2626' }}>₹{pendingTotal}</div>
                </div>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  background: '#DC2626',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                  transition: 'all 0.15s',
                  marginBottom: 8,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#B91C1C'}
                onMouseLeave={e => e.currentTarget.style.background = '#DC2626'}
                >
                  Pay All Fines
                </button>
                <div style={{ fontSize: 11, color: '#6B7280', textAlign: 'center' }}>
                  Visit library counter or pay online
                </div>
              </div>
            )}

            {/* Fine Policy */}
            <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Fine Policy</h3>
              <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, color: '#111827', marginBottom: 4 }}>Late Return</div>
                  <div>₹10 per day after due date</div>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, color: '#111827', marginBottom: 4 }}>Book Damage</div>
                  <div>₹50 - ₹500 based on damage</div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#111827', marginBottom: 4 }}>Lost Book</div>
                  <div>Full replacement cost</div>
                </div>
              </div>
            </div>

            {/* Help */}
            <div style={{
              background: '#FEF3C7',
              padding: '16px',
              borderRadius: 12,
              border: '1px solid #FCD34D',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#92400E', marginBottom: 8 }}>
                💡 Need Help?
              </div>
              <div style={{ fontSize: 11, color: '#78350F', lineHeight: 1.5, marginBottom: 12 }}>
                Contact the library for payment assistance or to discuss your fines
              </div>
              <button style={{
                width: '100%',
                padding: '8px',
                background: 'white',
                border: '1px solid #FCD34D',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                color: '#92400E',
                cursor: 'pointer',
                fontFamily: 'Inter',
              }}>
                Contact Library
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
