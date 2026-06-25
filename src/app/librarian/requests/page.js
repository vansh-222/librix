'use client';
import { useState } from 'react';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import {
  BookOpen, ClipboardList, CheckCircle, XCircle, Filter, Plus, Clock, X, Check
} from 'lucide-react';

// Sample data
const SAMPLE_REQUESTS = [
  { id: 1, bookTitle: 'Atomic Habits', author: 'James Clear', isbn: '978-1847941831', memberName: 'Rahul Verma', memberId: 'MEM001', requestDate: 'May 16, 2026', requestTime: '10:30 AM', status: 'pending', cover: '#E05252' },
  { id: 2, bookTitle: 'Deep Work', author: 'Cal Newport', isbn: '978-0349414114', memberName: 'Arjun Mehta', memberId: 'MEM003', requestDate: 'May 15, 2026', requestTime: '02:45 PM', status: 'pending', cover: '#2B6CB0' },
  { id: 3, bookTitle: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', memberName: 'Neha Gupta', memberId: 'MEM004', requestDate: 'May 14, 2026', requestTime: '11:20 AM', status: 'approved', cover: '#9C27B0' },
  { id: 4, bookTitle: 'The Psychology of Money', author: 'Morgan Housel', isbn: '978-0857197689', memberName: 'Sneha Iyer', memberId: 'MEM006', requestDate: 'May 14, 2026', requestTime: '09:10 AM', status: 'approved', cover: '#F5F5F5' },
  { id: 5, bookTitle: 'The 5 AM Club', author: 'Robin Sharma', isbn: '978-1443456623', memberName: 'Vikram Patel', memberId: 'MEM005', requestDate: 'May 13, 2026', requestTime: '03:10 PM', status: 'rejected', cover: '#D4A017' },
  { id: 6, bookTitle: 'Ikigai', author: 'Héctor García', isbn: '978-1786330895', memberName: 'Priya Singh', memberId: 'MEM002', requestDate: 'May 12, 2026', requestTime: '01:05 PM', status: 'pending', cover: '#26C6DA' },
  { id: 7, bookTitle: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '978-0374275631', memberName: 'Aman Sharma', memberId: 'MEM007', requestDate: 'May 11, 2026', requestTime: '04:30 PM', status: 'rejected', cover: '#26C6DA' },
];

const STATS = [
  { icon: <ClipboardList size={22} color="#6C5CE7" />, iconBg: '#EDE9FE', value: '48', label: 'Total Requests' },
  { icon: <Clock size={22} color="#F59E0B" />, iconBg: '#FEF3C7', value: '22', label: 'Pending Requests' },
  { icon: <CheckCircle size={22} color="#16A34A" />, iconBg: '#DCFCE7', value: '18', label: 'Approved Requests' },
  { icon: <XCircle size={22} color="#DC2626" />, iconBg: '#FEE2E2', value: '8', label: 'Rejected Requests' },
];

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

  const tabs = [
    { id: 'all', label: 'All Requests' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  const filteredRequests = activeTab === 'all' 
    ? SAMPLE_REQUESTS 
    : SAMPLE_REQUESTS.filter(r => r.status === activeTab);

  return (
    <LibrarianLayout
      title="Requests"
      subtitle="Manage book requests from members"
      searchPlaceholder="Search books, members, ISBN..."
    >
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
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View details →</span>
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
                      background: activeTab === tab.id ? '#6C5CE7' : 'white',
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
                  <Filter size={15} color="#6C5CE7" />
                  Filters
                </button>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: 'none', borderRadius: 8, background: '#6C5CE7', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
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
                    const statusConfig = {
                      pending: { label: 'Pending', bg: '#FEF3C7', color: '#D97706' },
                      approved: { label: 'Approved', bg: '#DCFCE7', color: '#15803D' },
                      rejected: { label: 'Rejected', bg: '#FEE2E2', color: '#DC2626' }
                    };
                    const status = statusConfig[req.status];

                    return (
                      <tr key={req.id} className="tr-hover" style={{ borderBottom: i < filteredRequests.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <BookCover color={req.cover} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.bookTitle}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{req.author}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>ISBN: {req.isbn}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
                              {req.memberName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.memberName}</div>
                              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{req.memberId}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{req.requestDate}</div>
                          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{req.requestTime}</div>
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                            {req.status === 'pending' ? (
                              <>
                                <button 
                                  type="button"
                                  title="Approve Request"
                                  style={{ 
                                    padding: '7px 14px', 
                                    border: '1px solid #16A34A', 
                                    background: 'white', 
                                    color: '#16A34A',
                                    borderRadius: 6, 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 4,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    fontFamily: 'Inter',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#16A34A';
                                    e.currentTarget.style.color = 'white';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.color = '#16A34A';
                                  }}
                                >
                                  <Check size={14} />
                                  Approve
                                </button>
                                <button 
                                  type="button"
                                  title="Reject Request"
                                  style={{ 
                                    padding: '7px 14px', 
                                    border: '1px solid #DC2626', 
                                    background: 'white', 
                                    color: '#DC2626',
                                    borderRadius: 6, 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 4,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    fontFamily: 'Inter',
                                    transition: 'all 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#DC2626';
                                    e.currentTarget.style.color = 'white';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.color = '#DC2626';
                                  }}
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </>
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
                      background: p === '1' ? '#6C5CE7' : 'transparent',
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
                <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { title: 'Atomic Habits', member: 'Rahul Verma', time: 'Today, 10:30 AM', status: 'Pending', statusColor: '#F59E0B', cover: '#E05252' },
                  { title: 'Deep Work', member: 'Arjun Mehta', time: 'Today, 02:45 PM', status: 'Pending', statusColor: '#F59E0B', cover: '#2B6CB0' },
                  { title: 'Clean Code', member: 'Neha Gupta', time: 'Yesterday, 11:30 AM', status: 'Approved', statusColor: '#16A34A', cover: '#9C27B0' },
                  { title: 'The 5 AM Club', member: 'Vikram Patel', time: 'May 15, 03:15 PM', status: 'Rejected', statusColor: '#DC2626', cover: '#D4A017' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px', background: '#F9FAFB', borderRadius: 8 }}>
                    <div style={{ 
                      width: 32, 
                      height: 44, 
                      borderRadius: 3, 
                      background: item.cover, 
                      flexShrink: 0,
                      boxShadow: '1px 1px 3px rgba(0,0,0,0.15)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', background: 'rgba(0,0,0,0.15)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>requested by {item.member}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{item.time}</div>
                      <span style={{ 
                        display: 'inline-block',
                        marginTop: 4,
                        padding: '2px 8px', 
                        background: item.statusColor + '20', 
                        color: item.statusColor, 
                        borderRadius: 9999, 
                        fontSize: 10, 
                        fontWeight: 600 
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Request Summary (This Month) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Request Summary (This Month)</span>
              </div>
              
              {/* Donut Chart */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
                <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#F3F4F6" strokeWidth="24" />
                  {/* Pending - Orange (45.8%) */}
                  <circle
                    cx="80" cy="80" r="60"
                    fill="none" stroke="#F59E0B" strokeWidth="24"
                    strokeDasharray={`${377 * 0.458} 377`}
                    strokeDashoffset="0"
                  />
                  {/* Approved - Green (37.5%) */}
                  <circle
                    cx="80" cy="80" r="60"
                    fill="none" stroke="#16A34A" strokeWidth="24"
                    strokeDasharray={`${377 * 0.375} 377`}
                    strokeDashoffset={`-${377 * 0.458}`}
                  />
                  {/* Rejected - Red (16.7%) */}
                  <circle
                    cx="80" cy="80" r="60"
                    fill="none" stroke="#DC2626" strokeWidth="24"
                    strokeDasharray={`${377 * 0.167} 377`}
                    strokeDashoffset={`-${377 * (0.458 + 0.375)}`}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1 }}>48</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>Total</div>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { color: '#F59E0B', label: 'Pending', value: '22 (45.8%)' },
                  { color: '#16A34A', label: 'Approved', value: '18 (37.5%)' },
                  { color: '#DC2626', label: 'Rejected', value: '8 (16.7%)' },
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

            {/* Quick Actions */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: <CheckCircle size={16} color="#16A34A" />, label: 'Approve All Pending', color: '#16A34A' },
                  { icon: <XCircle size={16} color="#DC2626" />, label: 'Reject All Pending', color: '#DC2626' },
                  { icon: <ClipboardList size={16} color="#6C5CE7" />, label: 'View All Requests', color: '#6C5CE7' },
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
