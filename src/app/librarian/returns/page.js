'use client';
import { useState } from 'react';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import {
  BookOpen, ArrowLeftRight, Clock, AlertCircle, Calendar, Search, Filter, Plus, Eye, RotateCcw, MoreHorizontal, FileText, ChevronDown, CheckCircle
} from 'lucide-react';

// Sample data for issued books
const ISSUED_BOOKS = [
  { id: 1, bookTitle: 'Atomic Habits', author: 'James Clear', isbn: '978-1847941831', memberName: 'Rahul Verma', memberId: 'MEM001', issueDate: 'May 10, 2026', issueTime: '10:30 AM', dueDate: 'May 20, 2026', daysLeft: '4 days left', status: 'issued', cover: '#E05252' },
  { id: 2, bookTitle: 'The Power of Habit', author: 'Charles Duhigg', isbn: '978-0812981605', memberName: 'Priya Singh', memberId: 'MEM002', issueDate: 'May 11, 2026', issueTime: '09:15 AM', dueDate: 'May 21, 2026', daysLeft: '5 days left', status: 'issued', cover: '#5B8CDB' },
  { id: 3, bookTitle: 'Deep Work', author: 'Cal Newport', isbn: '978-0349414114', memberName: 'Arjun Mehta', memberId: 'MEM003', issueDate: 'May 12, 2026', issueTime: '02:45 PM', dueDate: 'May 22, 2026', daysLeft: '6 days left', status: 'issued', cover: '#2B6CB0' },
  { id: 4, bookTitle: 'The 5 AM Club', author: 'Robin Sharma', isbn: '978-1443456623', memberName: 'Neha Gupta', memberId: 'MEM004', issueDate: 'May 08, 2026', issueTime: '11:20 AM', dueDate: 'May 18, 2026', daysLeft: '2 days overdue', status: 'overdue', cover: '#D4A017' },
  { id: 5, bookTitle: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', isbn: '978-1612680194', memberName: 'Vikram Patel', memberId: 'MEM005', issueDate: 'May 07, 2026', issueTime: '03:10 PM', dueDate: 'May 17, 2026', daysLeft: '3 days overdue', status: 'overdue', cover: '#4CAF50' },
];

const STATS = [
  { icon: <BookOpen size={22} color="#6C5CE7" />, iconBg: '#EDE9FE', value: '58', label: 'Books Issued' },
  { icon: <ArrowLeftRight size={22} color="#16A34A" />, iconBg: '#DCFCE7', value: '42', label: 'Books Returned' },
  { icon: <Clock size={22} color="#F59E0B" />, iconBg: '#FEF3C7', value: '12', label: 'Overdue Books' },
  { icon: <AlertCircle size={22} color="#DC2626" />, iconBg: '#FEE2E2', value: '7', label: 'Due Today' },
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

export default function IssueReturnPage() {
  const [activeTab, setActiveTab] = useState('issued');
  const [selectedDate, setSelectedDate] = useState('May 16, 2026');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const tabs = [
    { id: 'issued', label: 'Issued Books', count: 58 },
    { id: 'returned', label: 'Returned Books', count: 42 },
  ];

  return (
    <LibrarianLayout
      title="Issue / Return"
      subtitle="Issue new books or manage return transactions"
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

            {/* Tabs and Filters - All in one line with better spacing */}
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

              {/* Actions with better spacing */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Date Picker */}
                <div style={{ position: 'relative' }}>
                  <Calendar size={15} color="#6B7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={selectedDate}
                    readOnly
                    style={{ padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', width: 160, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                  />
                </div>

                {/* Filters Dropdown */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                  >
                    <Filter size={15} color="#6C5CE7" />
                    Filters
                    <ChevronDown size={14} color="#9CA3AF" />
                  </button>

                  {/* Dropdown Menu */}
                  {showFilterMenu && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 8,
                      width: 200,
                      background: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: 8,
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                      zIndex: 50,
                      overflow: 'hidden'
                    }}>
                      <div style={{ padding: '8px 0' }}>
                        <div style={{ padding: '8px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter by Status</div>
                        {[
                          { id: 'overdue', label: 'Overdue Books', count: 12, color: '#DC2626' },
                          { id: 'due', label: 'Due Today', count: 7, color: '#F59E0B' },
                        ].map(filter => (
                          <button
                            key={filter.id}
                            onClick={() => {
                              setActiveTab(filter.id);
                              setShowFilterMenu(false);
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 16px',
                              border: 'none',
                              background: activeTab === filter.id ? '#F9FAFB' : 'transparent',
                              color: '#374151',
                              fontSize: 13,
                              fontWeight: 500,
                              cursor: 'pointer',
                              fontFamily: 'Inter',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                            onMouseLeave={(e) => e.currentTarget.style.background = activeTab === filter.id ? '#F9FAFB' : 'transparent'}
                          >
                            <span>{filter.label}</span>
                            <span style={{
                              padding: '2px 8px',
                              background: filter.color + '20',
                              color: filter.color,
                              borderRadius: 9999,
                              fontSize: 11,
                              fontWeight: 600
                            }}>
                              {filter.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Issue New Book Button */}
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: 'none', borderRadius: 8, background: '#6C5CE7', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Plus size={16} />
                  Issue New Book
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '22%' }}>BOOK DETAILS</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '18%' }}>MEMBER DETAILS</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '14%' }}>ISSUE DATE</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '14%' }}>DUE DATE</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '14%' }}>STATUS</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '18%' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {ISSUED_BOOKS.map((book, i) => (
                    <tr key={book.id} className="tr-hover" style={{ borderBottom: i < ISSUED_BOOKS.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <BookCover color={book.cover} />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.bookTitle}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{book.author}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>ISBN: {book.isbn}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700 }}>
                            {book.memberName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.memberName}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{book.memberId}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{book.issueDate}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{book.issueTime}</div>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{book.dueDate}</div>
                        <div style={{ fontSize: 11, color: book.status === 'overdue' ? '#DC2626' : '#16A34A', marginTop: 2, fontWeight: 500 }}>{book.daysLeft}</div>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          background: book.status === 'overdue' ? '#FEE2E2' : '#DCFCE7',
                          color: book.status === 'overdue' ? '#DC2626' : '#15803D',
                          borderRadius: 9999,
                          fontSize: 11,
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>
                          {book.status === 'overdue' ? 'Overdue' : 'Issued'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                          <button
                            type="button"
                            title="Process Return"
                            className="act-btn"
                            style={{
                              padding: '7px 12px',
                              border: '1px solid #6C5CE7',
                              background: 'white',
                              borderRadius: 6,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#6C5CE7';
                              e.currentTarget.querySelector('svg').style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.querySelector('svg').style.color = '#6C5CE7';
                            }}
                          >
                            <CheckCircle size={15} color="#6C5CE7" style={{ transition: 'color 0.15s ease' }} />
                          </button>
                          <button
                            type="button"
                            title="More Options"
                            className="act-btn"
                            style={{
                              padding: '7px',
                              border: '1px solid #E5E7EB',
                              background: 'white',
                              borderRadius: 6,
                              cursor: 'pointer',
                              display: 'flex',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#F9FAFB';
                              e.currentTarget.style.borderColor = '#D1D5DB';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.borderColor = '#E5E7EB';
                            }}
                          >
                            <MoreHorizontal size={16} color="#6B7280" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Showing 1 to 5 of 58 results</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {['‹', '1', '2', '3', '...', '12', '›'].map((p, i) => (
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
                <span style={{ fontSize: 13, color: '#6B7280' }}>5 / page</span>
              </div>
            </div>

            {/* Policy Reminder */}
            <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, background: '#6C5CE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={20} color="white" />
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Library Policy Reminders</div>
                  <ul style={{ fontSize: 13, color: '#4B5563', lineHeight: '20px', margin: 0, paddingLeft: 20 }}>
                    <li>Books must be returned by the due date to avoid fines.</li>
                    <li>You can renew issued books if not requested by others.</li>
                    <li>Handle library books with care.</li>
                  </ul>
                </div>
                <button type="button" style={{ padding: '8px 16px', border: '1px solid #6C5CE7', background: 'white', color: '#6C5CE7', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  View All Policies
                </button>
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

            {/* Quick Issue */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Quick Issue</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Select Member</label>
                  <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter' }}>
                    <option>Choose a member</option>
                  </select>
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Search Book by title or ISBN</label>
                  <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: 32, transform: 'translateY(-50%)' }} />
                  <input
                    placeholder="Search..."
                    style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', fontFamily: 'Inter', background: 'white' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Due Date</label>
                  <input
                    type="date"
                    value="2026-05-16"
                    readOnly
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', fontFamily: 'Inter' }}
                  />
                </div>
                <button type="button" style={{ width: '100%', padding: '10px', border: 'none', borderRadius: 8, background: '#6C5CE7', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', marginTop: 4 }}>
                  Issue Book
                </button>
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Recent Returns */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recent Returns</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { title: 'Atomic Habits', member: 'Rahul Verma', time: 'Today, 09:20 PM', icon: '📗' },
                  { title: 'Deep Work', member: 'Priya Singh', time: 'Today, 08:47 PM', icon: '📗' },
                  { title: 'The Power of Habit', member: 'Arjun Mehta', time: 'Yesterday, 06:10 PM', icon: '📗' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px', background: '#F9FAFB', borderRadius: 8 }}>
                    <div style={{ fontSize: 20 }}>{item.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>returned by {item.member}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Summary (This Week) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Summary (This Week)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: <BookOpen size={16} color="#6C5CE7" />, label: 'Books Issued', value: '326', bg: '#F3F4F6' },
                  { icon: <ArrowLeftRight size={16} color="#16A34A" />, label: 'Books Returned', value: '298', bg: '#F3F4F6' },
                  { icon: <Clock size={16} color="#F59E0B" />, label: 'Overdue Books', value: '12', bg: '#F3F4F6' },
                  { icon: <AlertCircle size={16} color="#DC2626" />, label: 'Pending Returns', value: '28', bg: '#F3F4F6' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', background: item.bg, borderRadius: 8 }}>
                    <div style={{ width: 32, height: 32, background: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{item.label}</div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  
    </LibrarianLayout >
  );
}
