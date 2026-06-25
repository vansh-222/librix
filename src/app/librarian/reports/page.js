'use client';
import { useState } from 'react';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import {
  BookOpen, Users, ArrowLeftRight, Clock, TrendingUp, TrendingDown, Calendar, Filter, Plus, ChevronRight, FileText, BarChart3, Activity, Download
} from 'lucide-react';

// Sample data
const STATS = [
  { icon: <BookOpen size={22} color="#6C5CE7" />, iconBg: '#EDE9FE', value: '58', label: 'Total Books Issued', change: '+12%', isPositive: true, subtitle: 'vs last week' },
  { icon: <Users size={22} color="#16A34A" />, iconBg: '#DCFCE7', value: '342', label: 'Active Members', change: '+8%', isPositive: true, subtitle: 'vs last week' },
  { icon: <ArrowLeftRight size={22} color="#F59E0B" />, iconBg: '#FEF3C7', value: '42', label: 'Books Returned', change: '+15%', isPositive: true, subtitle: 'vs last week' },
  { icon: <Clock size={22} color="#DC2626" />, iconBg: '#FEE2E2', value: '12', label: 'Overdue Books', change: '-8%', isPositive: false, subtitle: 'vs last week' },
  { icon: <TrendingUp size={22} color="#6C5CE7" />, iconBg: '#EDE9FE', value: '₹1240', label: 'Fines Collected', change: '+6%', isPositive: true, subtitle: 'vs last week' },
];

const TOP_BORROWED = [
  { title: 'Atomic Habits', author: 'James Clear', count: 28, cover: '#E05252' },
  { title: 'Deep Work', author: 'Cal Newport', count: 24, cover: '#2B6CB0' },
  { title: 'The 5 AM Club', author: 'Robin Sharma', count: 21, cover: '#D4A017' },
  { title: 'The Power of Habit', author: 'Charles Duhigg', count: 18, cover: '#5B8CDB' },
  { title: 'Clean Code', author: 'Robert C. Martin', count: 15, cover: '#1F2937' },
];

const MONTHLY_TRENDS = [
  { label: 'Books Issued', value: '1,245', change: '+5%', isPositive: true, chartData: [20, 25, 30, 28, 35, 40, 38] },
  { label: 'Books Returned', value: '1,102', change: '+11%', isPositive: true, chartData: [15, 20, 25, 30, 32, 35, 38] },
  { label: 'New Members', value: '156', change: '+22%', isPositive: true, chartData: [5, 8, 12, 15, 18, 20, 22] },
  { label: 'Fines Collected', value: '₹48,750', change: '-10%', isPositive: false, chartData: [50, 45, 40, 35, 38, 40, 42] },
  { label: 'Overdue Books', value: '35', change: '-8%', isPositive: true, chartData: [45, 40, 38, 35, 32, 30, 28] },
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

function MiniSparkline({ data, color }) {
  const max = Math.max(...data);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 60;
    const y = 20 - (val / max) * 20;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width="60" height="20" style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('May 10 - May 16, 2026');

  return (
    <LibrarianLayout
      title="Reports"
      subtitle="View library statistics and generate detailed reports"
      searchPlaceholder="Search books, members, ISBN..."
    >
      <div style={{ padding: '24px 24px 32px' }}>
        {/* Two column layout */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Left column */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Date Range and Export Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Date Range */}
              <div style={{ position: 'relative' }}>
                <Calendar size={15} color="#6B7280" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={dateRange}
                  readOnly
                  style={{ padding: '10px 14px 10px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', width: 200, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Filter size={15} color="#6C5CE7" />
                  Filters
                </button>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: 'none', borderRadius: 8, background: '#6C5CE7', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Plus size={16} />
                  Export Report
                </button>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, background: s.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{s.value}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {s.isPositive ? <TrendingUp size={12} color="#16A34A" /> : <TrendingDown size={12} color="#DC2626" />}
                    <span style={{ fontSize: 11, fontWeight: 600, color: s.isPositive ? '#16A34A' : '#DC2626' }}>{s.change}</span>
                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>{s.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              
              {/* Books Issued Overview Chart */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Books Issued Overview</span>
                  <select style={{ padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: 12, color: '#6B7280', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter' }}>
                    <option>Last 7 Days</option>
                  </select>
                </div>
                {/* Simple Line Chart Area */}
                <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 8, paddingTop: 10 }}>
                  {[40, 60, 55, 70, 50, 80, 90, 75].map((height, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: '100%', height: `${height}%`, background: 'linear-gradient(180deg, rgba(108,92,231,0.2) 0%, rgba(108,92,231,0.05) 100%)', border: '2px solid #6C5CE7', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: '#6B7280', fontWeight: 600 }}>{Math.round(height * 1.2)}</div>
                      </div>
                      <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>May {10+i}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, background: '#6C5CE7', borderRadius: 2 }} />
                  <span style={{ fontSize: 11, color: '#6B7280' }}>Books Issued</span>
                </div>
              </div>

              {/* Top Borrowed Books */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Top Borrowed Books</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View All</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {TOP_BORROWED.map((book, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', background: '#F9FAFB', borderRadius: 8 }}>
                      <BookCover color={book.cover} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{book.author}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#6C5CE7', flexShrink: 0 }}>{book.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              
              {/* Books Issued vs Returned */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Books Issued vs Returned</span>
                  <select style={{ padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: 12, color: '#6B7280', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter' }}>
                    <option>Last 7 Days</option>
                  </select>
                </div>
                {/* Simple Bar Chart */}
                <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 8, paddingTop: 10 }}>
                  {[
                    { issued: 70, returned: 50 },
                    { issued: 80, returned: 60 },
                    { issued: 75, returned: 65 },
                    { issued: 85, returned: 70 },
                    { issued: 78, returned: 68 },
                    { issued: 82, returned: 60 },
                    { issued: 90, returned: 75 }
                  ].map((data, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: '100%' }}>
                        <div style={{ flex: 1, height: `${data.issued}%`, background: '#6C5CE7', borderRadius: '3px 3px 0 0' }} />
                        <div style={{ flex: 1, height: `${data.returned}%`, background: '#16A34A', borderRadius: '3px 3px 0 0' }} />
                      </div>
                      <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>May {10+i}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, background: '#6C5CE7', borderRadius: 2 }} />
                    <span style={{ fontSize: 11, color: '#6B7280' }}>Issued</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, background: '#16A34A', borderRadius: 2 }} />
                    <span style={{ fontSize: 11, color: '#6B7280' }}>Returned</span>
                  </div>
                </div>
              </div>

              {/* Member Activity */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Member Activity</span>
                  <select style={{ padding: '6px 10px', border: '1px solid #E5E7EB', borderRadius: 6, fontSize: 12, color: '#6B7280', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter' }}>
                    <option>This Month</option>
                  </select>
                </div>
                
                {/* Donut Chart */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="70" cy="70" r="50" fill="none" stroke="#F3F4F6" strokeWidth="20" />
                      {/* Active Members - Purple (69.6%) */}
                      <circle
                        cx="70" cy="70" r="50"
                        fill="none" stroke="#6C5CE7" strokeWidth="20"
                        strokeDasharray={`${314 * 0.696} 314`}
                        strokeDashoffset="0"
                      />
                      {/* Inactive Members - Orange (22.8%) */}
                      <circle
                        cx="70" cy="70" r="50"
                        fill="none" stroke="#F59E0B" strokeWidth="20"
                        strokeDasharray={`${314 * 0.228} 314`}
                        strokeDashoffset={`-${314 * 0.696}`}
                      />
                      {/* New Members - Green (7.6%) */}
                      <circle
                        cx="70" cy="70" r="50"
                        fill="none" stroke="#16A34A" strokeWidth="20"
                        strokeDasharray={`${314 * 0.076} 314`}
                        strokeDashoffset={`-${314 * (0.696 + 0.228)}`}
                      />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1 }}>342</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>Total</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { color: '#6C5CE7', label: 'Active Members', value: '238 (69.6%)', bg: '#EDE9FE' },
                      { color: '#F59E0B', label: 'Inactive Members', value: '78 (22.8%)', bg: '#FEF3C7' },
                      { color: '#16A34A', label: 'New Members', value: '26 (7.6%)', bg: '#DCFCE7' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: item.bg, borderRadius: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, color: '#6B7280' }}>{item.label}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Trends */}
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Monthly Trends (Last 6 Months)</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
                {MONTHLY_TRENDS.map((trend, i) => (
                  <div key={i} style={{ padding: '16px', background: '#F9FAFB', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{trend.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{trend.value}</div>
                    <MiniSparkline data={trend.chartData} color={trend.isPositive ? '#16A34A' : '#DC2626'} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {trend.isPositive ? <TrendingUp size={12} color="#16A34A" /> : <TrendingDown size={12} color="#DC2626" />}
                      <span style={{ fontSize: 11, fontWeight: 600, color: trend.isPositive ? '#16A34A' : '#DC2626' }}>{trend.change}</span>
                      <span style={{ fontSize: 10, color: '#9CA3AF' }}>vs last</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8 }}>
              <div style={{ width: 6, height: 6, background: '#6C5CE7', borderRadius: '50%', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#6B7280' }}>Reports are generated based on the selected date range and filters.</span>
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

            {/* Library Summary (This Month) */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Library Summary (This Month)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: <Users size={16} color="#6C5CE7" />, label: 'Total Members', value: '342' },
                  { icon: <Users size={16} color="#16A34A" />, label: 'New Members', value: '26' },
                  { icon: <BookOpen size={16} color="#6C5CE7" />, label: 'Books Issued', value: '226' },
                  { icon: <ArrowLeftRight size={16} color="#16A34A" />, label: 'Books Returned', value: '184' },
                  { icon: <Clock size={16} color="#DC2626" />, label: 'Overdue Books', value: '12' },
                  { icon: <Activity size={16} color="#F59E0B" />, label: 'Pending Requests', value: '22' },
                  { icon: <TrendingUp size={16} color="#6C5CE7" />, label: 'Fines Collected', value: '₹12,450.00' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#F9FAFB', borderRadius: 8 }}>
                    <div style={{ width: 32, height: 32, background: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #E5E7EB' }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>{item.label}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Report Categories */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Report Categories</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { icon: <BarChart3 size={16} color="#6C5CE7" />, label: 'Circulation Reports' },
                  { icon: <Users size={16} color="#6C5CE7" />, label: 'Member Reports' },
                  { icon: <BookOpen size={16} color="#6C5CE7" />, label: 'Books Reports' },
                  { icon: <TrendingUp size={16} color="#6C5CE7" />, label: 'Fines Reports' },
                  { icon: <Activity size={16} color="#6C5CE7" />, label: 'Activity Reports' },
                ].map((item, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
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
                      e.currentTarget.style.borderColor = '#6C5CE7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: '#F3F4F6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{item.label}</span>
                    </div>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Quick Actions */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: <Plus size={16} color="#6C5CE7" />, label: 'Generate Custom Report' },
                  { icon: <Calendar size={16} color="#6C5CE7" />, label: 'Schedule Report' },
                  { icon: <Download size={16} color="#6C5CE7" />, label: 'Download Reports' },
                  { icon: <FileText size={16} color="#6C5CE7" />, label: 'Report Settings' },
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
                      e.currentTarget.style.borderColor = '#6C5CE7';
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

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Export Reports */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Export Reports</div>
              <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12 }}>Download reports in multiple formats</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {[
                  { label: 'PDF', color: '#DC2626', bg: '#FEE2E2' },
                  { label: 'Excel', color: '#16A34A', bg: '#DCFCE7' },
                  { label: 'CSV', color: '#6C5CE7', bg: '#EDE9FE' },
                  { label: 'Print', color: '#2563EB', bg: '#DBEAFE' },
                ].map((format, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    style={{
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: 8,
                      background: 'white',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = format.bg;
                      e.currentTarget.style.borderColor = format.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    <Download size={20} color={format.color} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{format.label}</span>
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
