'use client';
import { useState, useEffect, useCallback } from 'react';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import {
  BookOpen, Users, ArrowLeftRight, Clock, TrendingUp, TrendingDown, Calendar, Filter, Plus, ChevronRight, FileText, BarChart3, Activity, Download
} from 'lucide-react';

const BOOK_COVER_COLORS = ['#E05252','#2B6CB0','#D4A017','#5B8CDB','#1F2937','#9C27B0'];


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
  const [dateRange, setDateRange]   = useState('Last 7 Days');
  const [statsData, setStatsData]   = useState({});
  const [topBooks, setTopBooks]     = useState([]);
  const [toast, setToast]           = useState('');
  const [dailyChart, setDailyChart] = useState([]);
  const [monthlyChart, setMonthlyChart] = useState({ issued: [], returned: [] });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    const [statsRes, borrowRes] = await Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/borrow?limit=100').then(r => r.json()),
    ]);
    setStatsData(statsRes);

    // Build top borrowed from borrow records
    const countMap = {};
    (borrowRes.records || []).forEach(rec => {
      const id = rec.bookId?._id || rec.bookId;
      if (!id) return;
      if (!countMap[id]) countMap[id] = { title: rec.bookId?.title || 'Unknown', author: rec.bookId?.author || '', count: 0 };
      countMap[id].count++;
    });
    const sorted = Object.values(countMap).sort((a, b) => b.count - a.count).slice(0, 5);
    setTopBooks(sorted);

    // Build Daily Chart (Last 7 Days)
    const dChart = [];
    for (let i = 6; i >= 0; i--) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      const dateStr = dt.toISOString().slice(0, 10);
      const issued = (borrowRes.records || []).filter(r => (r.issueDate || '').slice(0, 10) === dateStr).length;
      const returned = (borrowRes.records || []).filter(r => r.returnDate && (r.returnDate || '').slice(0, 10) === dateStr).length;
      dChart.push({ label: dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), issued, returned });
    }
    setDailyChart(dChart);

    // Build Monthly Trends (Last 6 Months)
    const mIssued = [];
    const mReturned = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mStr = d.toISOString().slice(0, 7); // YYYY-MM
      const issued = (borrowRes.records || []).filter(r => (r.issueDate || '').slice(0, 7) === mStr).length;
      const returned = (borrowRes.records || []).filter(r => r.returnDate && (r.returnDate || '').slice(0, 7) === mStr).length;
      mIssued.push(issued);
      mReturned.push(returned);
    }
    setMonthlyChart({ issued: mIssued, returned: mReturned });

  }, []);

  useEffect(() => { load(); }, [load]);

  const s = statsData;
  const totalMembers    = s.totalMembers     || 0;
  const activeBorrows   = s.activeBorrows    || 0;
  const overdueCount    = s.overdueCount     || 0;
  const pendingRequests = s.pendingRequests  || 0;
  const finesCollected  = s.finesCollected   || 0;
  const finesPending    = s.finesPending     || 0;
  const totalBooks      = s.totalBooks       || 0;
  const pendingReturns  = s.pendingReturns   || 0;

  const TOP_BORROWED = topBooks.length > 0 ? topBooks : [
    { title: '—', author: '', count: 0 },
  ];

  const STATS = [
    { icon: <BookOpen size={22} color="#1A73E8" />, iconBg: '#EFF6FF', value: activeBorrows || '…', label: 'Total Books Issued', change: '—', isPositive: true, subtitle: 'currently' },
    { icon: <Users size={22} color="#16A34A" />,   iconBg: '#DCFCE7', value: totalMembers  || '…', label: 'Active Members',    change: '—', isPositive: true, subtitle: 'registered' },
    { icon: <ArrowLeftRight size={22} color="#F59E0B" />, iconBg: '#FEF3C7', value: pendingReturns || '…', label: 'Pending Returns', change: '—', isPositive: true, subtitle: 'in queue' },
    { icon: <Clock size={22} color="#DC2626" />,   iconBg: '#FEE2E2', value: overdueCount  || '…', label: 'Overdue Books',    change: overdueCount > 5 ? '⚠️' : '✔️', isPositive: overdueCount <= 5, subtitle: 'books' },
    { icon: <TrendingUp size={22} color="#1A73E8" />, iconBg: '#EFF6FF', value: `₹${finesCollected}`, label: 'Fines Collected', change: '—', isPositive: true, subtitle: 'total' },
  ];

  const exportCSV = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Members', totalMembers],
      ['Total Books', totalBooks],
      ['Active Borrows', activeBorrows],
      ['Overdue Books', overdueCount],
      ['Pending Requests', pendingRequests],
      ['Fines Collected', finesCollected],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `library_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Report exported successfully! 📊');
  };

  const MONTHLY_TRENDS = [
    { label: 'Books Issued',    value: String(activeBorrows),  change: '—', isPositive: true,  chartData: monthlyChart.issued },
    { label: 'Overdue Books',   value: String(overdueCount),   change: '—', isPositive: false, chartData: [5,8,10,overdueCount,overdueCount,overdueCount] },
    { label: 'Pending Requests',value: String(pendingRequests),change: '—', isPositive: true,  chartData: [2,5,8,pendingRequests,pendingRequests,pendingRequests] },
    { label: 'Fines Collected', value: `₹${finesCollected}`,  change: '—', isPositive: true,  chartData: [10,20,30,40,finesCollected,finesCollected] },
    { label: 'Books Returned',  value: String(monthlyChart.returned.reduce((a,b)=>a+b, 0)), change: '—', isPositive: true, chartData: monthlyChart.returned },
  ];

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
                <button type="button" onClick={() => showToast('Filters applied.')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Filter size={15} color="#1A73E8" />
                  Filters
                </button>
                <button type="button" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', border: 'none', borderRadius: 8, background: '#1A73E8', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Download size={16} />
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
                <div style={{ height: 180, display: 'flex', alignItems: 'stretch', gap: 8, paddingTop: 10, position: 'relative' }}>
                  {dailyChart.length > 0 && dailyChart.every(d => d.issued === 0) ? (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>No data for the last 7 days.</div>
                  ) : dailyChart.map((d, i) => {
                    const maxV = Math.max(5, ...dailyChart.map(x => x.issued));
                    const height = (d.issued / maxV) * 100;
                    return (
                    <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <div style={{ width: '100%', height: `${Math.max(2, height)}%`, background: 'linear-gradient(180deg, rgba(26,115,232,0.2) 0%, rgba(26,115,232,0.05) 100%)', border: '2px solid #1A73E8', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: '#6B7280', fontWeight: 600 }}>{d.issued}</div>
                      </div>
                      <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>{d.label}</span>
                    </div>
                  )})}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, background: '#1A73E8', borderRadius: 2 }} />
                  <span style={{ fontSize: 11, color: '#6B7280' }}>Books Issued</span>
                </div>
              </div>

              {/* Top Borrowed Books */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Top Borrowed Books</span>
                  <span onClick={() => showToast('Viewing all top books.')} style={{ fontSize: 12, fontWeight: 500, color: '#1A73E8', cursor: 'pointer' }}>View All</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {TOP_BORROWED.map((book, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', background: '#F9FAFB', borderRadius: 8 }}>
                      <BookCover color={BOOK_COVER_COLORS[i % BOOK_COVER_COLORS.length]} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{book.author}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1A73E8', flexShrink: 0 }}>{book.count}</div>
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
                <div style={{ height: 180, display: 'flex', alignItems: 'stretch', gap: 8, paddingTop: 10, position: 'relative' }}>
                  {dailyChart.length > 0 && dailyChart.every(d => d.issued === 0 && d.returned === 0) ? (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 13 }}>No data for the last 7 days.</div>
                  ) : dailyChart.map((d, i) => {
                    const maxV = Math.max(5, ...dailyChart.map(x => Math.max(x.issued, x.returned)));
                    const hI = (d.issued / maxV) * 100;
                    const hR = (d.returned / maxV) * 100;
                    return (
                    <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                      <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: '100%' }}>
                        <div style={{ flex: 1, height: `${hI > 0 ? Math.max(4, hI) : 0}%`, background: '#1A73E8', borderRadius: '3px 3px 0 0', position: 'relative' }}>
                          {d.issued > 0 && <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: '#6B7280', fontWeight: 600 }}>{d.issued}</div>}
                        </div>
                        <div style={{ flex: 1, height: `${hR > 0 ? Math.max(4, hR) : 0}%`, background: '#16A34A', borderRadius: '3px 3px 0 0', position: 'relative' }}>
                          {d.returned > 0 && <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 10, color: '#6B7280', fontWeight: 600 }}>{d.returned}</div>}
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4 }}>{d.label}</span>
                    </div>
                  )})}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, background: '#1A73E8', borderRadius: 2 }} />
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
                      {/* Active Members - Purple */}
                      <circle cx="70" cy="70" r="50" fill="none" stroke="#1A73E8" strokeWidth="20"
                        strokeDasharray={`${314 * (totalMembers > 0 ? activeBorrows / totalMembers : 0.6)} 314`}
                        strokeDashoffset="0"
                      />
                      {/* Overdue - Orange */}
                      <circle cx="70" cy="70" r="50" fill="none" stroke="#F59E0B" strokeWidth="20"
                        strokeDasharray={`${314 * (totalMembers > 0 ? overdueCount / totalMembers : 0.2)} 314`}
                        strokeDashoffset={`-${314 * (totalMembers > 0 ? activeBorrows / totalMembers : 0.6)}`}
                      />
                      {/* Pending - Green */}
                      <circle cx="70" cy="70" r="50" fill="none" stroke="#16A34A" strokeWidth="20"
                        strokeDasharray={`${314 * (totalMembers > 0 ? pendingRequests / totalMembers : 0.1)} 314`}
                        strokeDashoffset={`-${314 * (totalMembers > 0 ? (activeBorrows + overdueCount) / totalMembers : 0.8)}`}
                      />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{totalMembers || '…'}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>Total</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { color: '#1A73E8', label: 'Active Borrows',   value: `${activeBorrows}`, bg: '#EFF6FF' },
                      { color: '#F59E0B', label: 'Overdue Books',    value: `${overdueCount}`,  bg: '#FEF3C7' },
                      { color: '#16A34A', label: 'Pending Requests', value: `${pendingRequests}`, bg: '#DCFCE7' },
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
              <div style={{ width: 6, height: 6, background: '#1A73E8', borderRadius: '50%', flexShrink: 0 }} />
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
                  { icon: <Users size={16} color="#1A73E8" />,        label: 'Total Members',    value: totalMembers    || '…' },
                  { icon: <BookOpen size={16} color="#1A73E8" />,      label: 'Total Books',      value: totalBooks      || '…' },
                  { icon: <BookOpen size={16} color="#EA580C" />,      label: 'Books Issued',     value: activeBorrows   || '…' },
                  { icon: <ArrowLeftRight size={16} color="#16A34A" />,label: 'Pending Returns',  value: pendingReturns  || '…' },
                  { icon: <Clock size={16} color="#DC2626" />,         label: 'Overdue Books',    value: overdueCount    || '…' },
                  { icon: <Activity size={16} color="#F59E0B" />,      label: 'Pending Requests', value: pendingRequests || '…' },
                  { icon: <TrendingUp size={16} color="#1A73E8" />,    label: 'Fines Collected',  value: `₹${finesCollected}` },
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
                  { icon: <BarChart3 size={16} color="#1A73E8" />, label: 'Circulation Reports' },
                  { icon: <Users size={16} color="#1A73E8" />, label: 'Member Reports' },
                  { icon: <BookOpen size={16} color="#1A73E8" />, label: 'Books Reports' },
                  { icon: <TrendingUp size={16} color="#1A73E8" />, label: 'Fines Reports' },
                  { icon: <Activity size={16} color="#1A73E8" />, label: 'Activity Reports' },
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
                    onClick={() => showToast(`Opening ${item.label}...`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F9FAFB';
                      e.currentTarget.style.borderColor = '#1A73E8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, background: '#EFF6FF', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{item.label}</span>
                    </div>
                    <ChevronRight size={14} color="#9CA3AF" />
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
                  { icon: <Plus size={16} color="#1A73E8" />, label: 'Generate Custom Report' },
                  { icon: <Calendar size={16} color="#1A73E8" />, label: 'Schedule Report' },
                  { icon: <Download size={16} color="#1A73E8" />, label: 'Download Reports' },
                  { icon: <FileText size={16} color="#1A73E8" />, label: 'Report Settings' },
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
                      e.currentTarget.style.borderColor = '#1A73E8';
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
                  { label: 'CSV', color: '#1A73E8', bg: '#EFF6FF' },
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
