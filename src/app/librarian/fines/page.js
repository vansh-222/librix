'use client';
import { useState } from 'react';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import {
  DollarSign, Clock, AlertTriangle, Filter, Plus, Eye, Download, MoreHorizontal, Search, Calendar, ChevronDown, CheckCircle, XCircle
} from 'lucide-react';

// Sample data
const FINES_DATA = [
  { id: 1, memberName: 'Rahul Verma', memberId: 'MEM001', bookTitle: 'The 5 AM Club', isbn: '978-1443456623', fineAmount: 50, dueDate: 'May 20, 2026', daysOverdue: '4 days overdue', status: 'pending', paymentDate: null, cover: '#D4A017' },
  { id: 2, memberName: 'Priya Singh', memberId: 'MEM002', bookTitle: 'Atomic Habits', isbn: '978-1847941831', fineAmount: 60, dueDate: 'May 21, 2026', daysOverdue: '5 days overdue', status: 'pending', paymentDate: null, cover: '#E05252' },
  { id: 3, memberName: 'Arjun Mehta', memberId: 'MEM003', bookTitle: 'Deep Work', isbn: '978-0349414114', fineAmount: 60, dueDate: 'May 22, 2026', daysOverdue: '3 days overdue', status: 'paid', paymentDate: 'May 14, 2026', paymentTime: '10:20 AM', cover: '#2B6CB0' },
  { id: 4, memberName: 'Neha Gupta', memberId: 'MEM004', bookTitle: 'Clean Code', isbn: '978-0132350884', fineAmount: 30, dueDate: 'May 16, 2026', daysOverdue: '2 days overdue', status: 'paid', paymentDate: 'May 15, 2026', paymentTime: '02:15 PM', cover: '#9C27B0' },
  { id: 5, memberName: 'Vikram Patel', memberId: 'MEM005', bookTitle: 'The Power of Habit', isbn: '978-0812981605', fineAmount: 60, dueDate: 'May 17, 2026', daysOverdue: '1 day overdue', status: 'paid', paymentDate: 'May 14, 2026', paymentTime: '11:05 AM', cover: '#5B8CDB' },
  { id: 6, memberName: 'Sneha Iyer', memberId: 'MEM006', bookTitle: 'Ikigai', isbn: '978-1786330895', fineAmount: 50, dueDate: 'May 19, 2026', daysOverdue: '3 days overdue', status: 'pending', paymentDate: null, cover: '#26C6DA' },
  { id: 7, memberName: 'Dr. Amit Joshi', memberId: 'MEM007', bookTitle: 'Thinking, Fast and Slow', isbn: '978-0374275631', fineAmount: 40, dueDate: 'May 16, 2026', daysOverdue: 'Today', status: 'paid', paymentDate: 'May 16, 2026', paymentTime: '09:00 AM', cover: '#26C6DA' },
  { id: 8, memberName: 'Ritika Sharma', memberId: 'MEM008', bookTitle: 'Rich Dad Poor Dad', isbn: '978-1612680194', fineAmount: 70, dueDate: 'May 15, 2026', daysOverdue: 'Yesterday', status: 'overdue', paymentDate: null, cover: '#4CAF50' },
];

const STATS = [
  { icon: <DollarSign size={22} color="#6C5CE7" />, iconBg: '#EDE9FE', value: '₹12,450.00', label: 'Total Fine Collected', subtitle: 'This Month' },
  { icon: <Clock size={22} color="#F59E0B" />, iconBg: '#FEF3C7', value: '₹1,250.00', label: "Today's Collection", subtitle: 'May 16, 2026' },
  { icon: <AlertTriangle size={22} color="#DC2626" />, iconBg: '#FEE2E2', value: '₹2,180.00', label: 'Overdue Payments', subtitle: '7 Members' },
];

function BookCover({ color }) {
  return (
    <div style={{
      width: 32, height: 44, borderRadius: 3, flexShrink: 0, overflow: 'hidden', position: 'relative',
      boxShadow: '1px 2px 4px rgba(0,0,0,0.15)', background: color
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', background: 'rgba(0,0,0,0.15)' }} />
    </div>
  );
}

export default function FinesPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('May 10 - May 16, 2026');

  const filteredFines = FINES_DATA.filter(fine => {
    const matchesSearch = fine.memberName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          fine.bookTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fine.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <LibrarianLayout
      title="Fines & Payments"
      subtitle="Manage fines, payments and generate receipts"
      searchPlaceholder="Search members, books, receipts..."
    >
      <div style={{ padding: '24px 24px 32px' }}>
        {/* Two column layout */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Left column */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 46, height: 46, background: s.iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.subtitle}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View details →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {/* Search and Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
                <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by member or book..."
                  style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', outline: 'none', fontFamily: 'Inter', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                />
              </div>

              {/* Status Filter */}
              <div style={{ position: 'relative' }}>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '10px 36px 10px 14px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', appearance: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
                <ChevronDown size={14} color="#9CA3AF" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>

              {/* Date Range */}
              <div style={{ position: 'relative' }}>
                <Calendar size={15} color="#6B7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={dateRange}
                  readOnly
                  style={{ padding: '10px 36px 10px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', width: 200, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                />
                <ChevronDown size={14} color="#9CA3AF" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>

              {/* Filters Button */}
              <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <Filter size={15} color="#6C5CE7" />
                Filters
              </button>

              {/* Record Payment Button */}
              <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: 'none', borderRadius: 8, background: '#6C5CE7', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginLeft: 'auto' }}>
                <Plus size={16} />
                Record Payment
              </button>
              </div>

              {/* Table */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '16%' }}>MEMBER</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '20%' }}>BOOK DETAILS</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '10%' }}>FINE AMOUNT</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '13%' }}>DUE DATE</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '10%' }}>STATUS</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '13%' }}>PAYMENT DATE</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '18%' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFines.map((fine, i) => {
                    const statusConfig = {
                      pending: { label: 'Pending', bg: '#FEF3C7', color: '#D97706' },
                      paid: { label: 'Paid', bg: '#DCFCE7', color: '#15803D' },
                      overdue: { label: 'Overdue', bg: '#FEE2E2', color: '#DC2626' }
                    };
                    const status = statusConfig[fine.status];

                    return (
                      <tr key={fine.id} className="tr-hover" style={{ borderBottom: i < filteredFines.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
                              {fine.memberName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fine.memberName}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{fine.memberId}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <BookCover color={fine.cover} />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fine.bookTitle}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>ISBN: {fine.isbn}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#DC2626' }}>₹{fine.fineAmount}.00</div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{fine.dueDate}</div>
                          <div style={{ fontSize: 11, color: '#DC2626', marginTop: 2, fontWeight: 500 }}>{fine.daysOverdue}</div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{
                            padding: '4px 12px',
                            background: status.bg,
                            color: status.color,
                            borderRadius: 9999,
                            fontSize: 11,
                            fontWeight: 500,
                            display: 'inline-block'
                          }}>
                            {status.label}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          {fine.paymentDate ? (
                            <>
                              <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{fine.paymentDate}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{fine.paymentTime}</div>
                            </>
                          ) : (
                            <span style={{ fontSize: 13, color: '#9CA3AF' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                            <button 
                              type="button"
                              title="View Details"
                              style={{ 
                                padding: '7px',
                                border: '1px solid #E5E7EB',
                                background: 'white',
                                borderRadius: 6,
                                cursor: 'pointer',
                                display: 'flex',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                              <Eye size={15} color="#6C5CE7" />
                            </button>
                            {fine.status === 'paid' && (
                              <button 
                                type="button"
                                title="Download Receipt"
                                style={{ 
                                  padding: '7px',
                                  border: '1px solid #E5E7EB',
                                  background: 'white',
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                              >
                                <Download size={15} color="#16A34A" />
                              </button>
                            )}
                            <button 
                              type="button"
                              title="More Options"
                              style={{ 
                                padding: '7px',
                                border: '1px solid #E5E7EB',
                                background: 'white',
                                borderRadius: 6,
                                cursor: 'pointer',
                                display: 'flex',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                              <MoreHorizontal size={15} color="#6B7280" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Showing 1 to 8 of 18 results</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {['‹', '1', '2', '3', '...', '9', '›'].map((p, i) => (
                    <button key={i} type="button" style={{
                      minWidth: 32, height: 32, padding: '0 8px',
                      border: p === '1' ? 'none' : '1px solid transparent',
                      borderRadius: 8,
                      background: p === '1' ? '#6C5CE7' : 'transparent',
                      color: p === '1' ? 'white' : (p === '‹' || p === '›' ? '#9CA3AF' : '#374151'),
                      fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter',
                    }}>{p}</button>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: '#6B7280' }}>8 / page</span>
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

            {/* Payment Overview (This Month) */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Payment Overview (This Month)</div>
              
              {/* Donut Chart */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#F3F4F6" strokeWidth="24" />
                  {/* Collected - Purple (59%) */}
                  <circle
                    cx="80" cy="80" r="60"
                    fill="none" stroke="#6C5CE7" strokeWidth="24"
                    strokeDasharray={`${377 * 0.59} 377`}
                    strokeDashoffset="0"
                  />
                  {/* Pending - Orange (20.5%) */}
                  <circle
                    cx="80" cy="80" r="60"
                    fill="none" stroke="#F59E0B" strokeWidth="24"
                    strokeDasharray={`${377 * 0.205} 377`}
                    strokeDashoffset={`-${377 * 0.59}`}
                  />
                  {/* Overdue - Red (10.3%) */}
                  <circle
                    cx="80" cy="80" r="60"
                    fill="none" stroke="#DC2626" strokeWidth="24"
                    strokeDasharray={`${377 * 0.103} 377`}
                    strokeDashoffset={`-${377 * (0.59 + 0.205)}`}
                  />
                  {/* Waived - Gray (10.2%) */}
                  <circle
                    cx="80" cy="80" r="60"
                    fill="none" stroke="#6B7280" strokeWidth="24"
                    strokeDasharray={`${377 * 0.102} 377`}
                    strokeDashoffset={`-${377 * (0.59 + 0.205 + 0.103)}`}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', lineHeight: 1 }}>₹12,450</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>Total</div>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { color: '#6C5CE7', label: 'Collected', value: '₹10,459 (59%)' },
                  { color: '#F59E0B', label: 'Pending', value: '₹4,320 (20.5%)' },
                  { color: '#DC2626', label: 'Overdue', value: '₹2,180 (10.3%)' },
                  { color: '#6B7280', label: 'Waived', value: '₹600 (10.2%)' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                      <span style={{ fontSize: 12, color: '#6B7280' }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Recent Payments */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recent Payments</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'Rahul Verma', amount: 50, date: 'May 16, 10:22 AM' },
                  { name: 'Neha Gupta', amount: 20, date: 'May 15, 02:18 PM' },
                  { name: 'Vikram Patel', amount: 80, date: 'May 14, 11:35 AM' },
                  { name: 'Dr. Amit Joshi', amount: 40, date: 'May 14, 09:03 AM' },
                ].map((payment, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#F9FAFB', borderRadius: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle size={16} color="#16A34A" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{payment.name}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{payment.date}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#16A34A' }}>₹{payment.amount}.00</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Quick Actions */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: <Plus size={16} color="#6C5CE7" />, label: 'Record New Payment', color: '#6C5CE7' },
                  { icon: <XCircle size={16} color="#6C5CE7" />, label: 'Waive Fine', color: '#6C5CE7' },
                  { icon: <Download size={16} color="#6C5CE7" />, label: 'Generate Fine Report', color: '#6C5CE7' },
                  { icon: <DollarSign size={16} color="#6C5CE7" />, label: 'Payment History', color: '#6C5CE7' },
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
