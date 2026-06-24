'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight, ClipboardList,
  CreditCard, BarChart2, Bell, Settings, ChevronRight, ChevronDown,
  Search, Plus, Eye, Edit, Trash2, Filter, UserCheck, UserPlus, UserX,
  Upload, LayoutGrid, LogOut
} from 'lucide-react';

const NAV = [
  { href: '/librarian/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/librarian/books', icon: BookOpen, label: 'Books Management' },
  { href: '/librarian/members', icon: Users, label: 'Members' },
  { href: '/librarian/returns', icon: ArrowLeftRight, label: 'Issue / Return' },
  { href: '/librarian/requests', icon: ClipboardList, label: 'Requests' },
  { href: '/librarian/fines', icon: CreditCard, label: 'Fines & Payments' },
  { href: '/librarian/reports', icon: BarChart2, label: 'Reports' },
  { href: '/librarian/notifications', icon: Bell, label: 'Notifications', badge: 6 },
  { href: '/librarian/settings', icon: Settings, label: 'Settings' },
];

export default function LibrarianMembersPage() {
  const pathname = usePathname();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      console.log('API Response:', data);
      console.log('Users fetched:', data.users?.length || 0);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalMembers = users.length;
  const activeMembers = users.filter(u => u.isActive).length;
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const newThisMonth = users.filter(u => new Date(u.createdAt) >= thisMonth).length;
  const inactiveMembers = users.filter(u => !u.isActive).length;

  // Filter
  const filteredMembers = users.filter(user => {
    const searchLower = search.toLowerCase();
    return user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(search);
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage);

  const getMembershipType = (role) => {
    if (role === 'student') return { label: 'Student', bg: '#DBEAFE', color: '#1D4ED8' };
    if (role === 'teacher') return { label: 'Faculty', bg: '#E0E7FF', color: '#6366F1' };
    return { label: 'Staff', bg: '#FEF3C7', color: '#D97706' };
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F9FAFB', fontFamily: 'Inter,sans-serif', overflow: 'hidden', minHeight: 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #__next { height: 100%; }
        /* Hide scrollbars but keep functionality */
        ::-webkit-scrollbar { width: 0px; height: 0px; }
        ::-webkit-scrollbar-thumb { background: transparent; }
        ::-webkit-scrollbar-track { background: transparent; }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        .nav-link:hover { background: #F3F4F6 !important; }
        .act-btn:hover { background: #F3F4F6 !important; border-radius: 6px; }
        .tr-hover:hover td { background: #FAFAFA; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: 200,
        background: 'white',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, background: '#6C5CE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: '19px' }}>LibraSys</div>
              <div style={{ fontSize: 10, color: '#9CA3AF', lineHeight: '14px' }}>Library Management</div>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8, paddingBottom: 8 }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none', display: 'block', padding: '2px 8px' }}>
                <div className={active ? '' : 'nav-link'} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  background: active ? '#6C5CE7' : 'transparent',
                  borderRadius: 8, cursor: 'pointer',
                }}>
                  <item.icon size={16} color={active ? 'white' : '#6B7280'} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'white' : '#374151', lineHeight: '18px' }}>{item.label}</span>
                  {item.badge && (
                    <div style={{ minWidth: 18, height: 18, background: active ? 'rgba(255,255,255,0.25)' : '#2563EB', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', padding: '0 4px' }}>
                      {item.badge}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Help box */}
        <div style={{ padding: '12px 12px 16px' }}>
          <div style={{ background: '#FAF5FF', borderRadius: 12, padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, border: '1px solid #EDE9FE' }}>
            {/* Book stack illustration */}
            <div style={{ width: 72, height: 48, position: 'relative', marginBottom: 2 }}>
              <div style={{ width: 24, height: 38, background: '#C4B5FD', position: 'absolute', left: 10, bottom: 0, borderRadius: '2px 2px 0 0' }} />
              <div style={{ width: 24, height: 44, background: '#8B5CF6', position: 'absolute', left: 26, bottom: 0, borderRadius: '2px 2px 0 0' }} />
              <div style={{ width: 20, height: 32, background: '#DDD6FE', position: 'absolute', left: 44, bottom: 0, borderRadius: '2px 2px 0 0' }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>Need Help?</div>
            <div style={{ fontSize: 10, color: '#6B7280', textAlign: 'center', lineHeight: '14px' }}>If you need assistance, we're here to help.</div>
            <button type="button" style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid #6C5CE7', background: 'transparent', color: '#6C5CE7', fontSize: 12, fontWeight: 500, cursor: 'pointer', marginTop: 2 }}>
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, minHeight: 0 }}>

        {/* Topbar */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #E5E7EB',
          padding: '0 28px',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: 20,
        }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: '26px' }}>Members</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>Manage and view all library members</div>
          </div>

          <div style={{ flex: 1, maxWidth: 380 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search members by name, email, phone..."
                style={{ width: '100%', padding: '9px 16px 9px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', background: '#F9FAFB', fontFamily: 'Inter' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color="#374151" />
              <div style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>8</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>A</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Anita Sharma</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Librarian</div>
              </div>
              <ChevronDown size={13} color="#9CA3AF" />
            </div>
          </div>
        </div>

        {/* Content row */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

          {/* Center scrollable */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 24px 32px', minWidth: 0, minHeight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Total Members', value: totalMembers, iconBg: '#EDE9FE', icon: <Users size={22} color="#6C5CE7" /> },
                  { label: 'Active Members', value: activeMembers, iconBg: '#DCFCE7', icon: <UserCheck size={22} color="#16A34A" /> },
                  { label: 'New This Month', value: newThisMonth, iconBg: '#FFEDD5', icon: <UserPlus size={22} color="#EA580C" /> },
                  { label: 'Inactive Members', value: inactiveMembers, iconBg: '#FEE2E2', icon: <UserX size={22} color="#DC2626" /> }
                ].map((s, i) => (
                  <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                      <div style={{ width: 46, height: 46, background: s.iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {s.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#6C5CE7', cursor: 'pointer' }}>View all</span>
                          <ChevronRight size={12} color="#6C5CE7" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', minWidth: 160 }}>
                  <Search size={14} color="#9CA3AF" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    placeholder="Search members..."
                    style={{ width: '100%', padding: '8px 12px 8px 32px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', fontFamily: 'Inter', background: 'white' }}
                  />
                </div>
                {['All Membership Types', 'All Status'].map((label, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <select style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', appearance: 'none', paddingRight: 28 }}>
                      <option>{label}</option>
                    </select>
                    <ChevronDown size={12} color="#6B7280" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                ))}
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter' }}>
                  <Filter size={14} color="#6C5CE7" />
                  Filters
                </button>
                <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: 'none', borderRadius: 8, background: '#6C5CE7', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter', marginLeft: 'auto' }}>
                  <Plus size={16} />
                  Add New Member
                </button>
              </div>

              {/* Members table */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '18%' }}>MEMBER</th>
                      <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '12%' }}>MEMBER ID</th>
                      <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '12%' }}>TYPE</th>
                      <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '20%' }}>EMAIL</th>
                      <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '10%' }}>BORROWED</th>
                      <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '12%' }}>JOIN DATE</th>
                      <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '10%' }}>STATUS</th>
                      <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '6%' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMembers.map((member, idx) => {
                      const memberType = getMembershipType(member.role);
                      return (
                        <tr key={member._id} className="tr-hover" style={{ borderBottom: idx < paginatedMembers.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                          <td style={{ padding: '0 16px', fontSize: 13, color: '#374151', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
                              <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                background: '#6C5CE7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 12,
                                fontWeight: 700
                              }}>
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.name}</div>
                                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{member.phone || '—'}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '0 16px', fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {member.studentId || member.teacherId || 'MEM' + String(1001 + idx).padStart(4, '0')}
                          </td>
                          <td style={{ padding: '0 16px', fontSize: 13, color: '#374151' }}>
                            <span style={{ padding: '3px 10px', background: memberType.bg, color: memberType.color, borderRadius: 9999, fontSize: 11, fontWeight: 500, display: 'inline-block' }}>
                              {memberType.label}
                            </span>
                          </td>
                          <td style={{ padding: '0 16px', fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</td>
                          <td style={{ padding: '0 16px', fontSize: 13, color: '#374151', textAlign: 'center' }}>0</td>
                          <td style={{ padding: '0 16px', fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatDate(member.createdAt)}</td>
                          <td style={{ padding: '0 16px', fontSize: 13, color: '#374151' }}>
                            <span style={{
                              padding: '3px 10px',
                              background: member.isActive ? '#DCFCE7' : '#FEE2E2',
                              color: member.isActive ? '#15803D' : '#DC2626',
                              borderRadius: 9999,
                              fontSize: 11,
                              fontWeight: 500,
                              display: 'inline-block'
                            }}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
                              <button type="button" className="act-btn" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
                                <Eye size={16} color="#6C5CE7" />
                              </button>
                              <button type="button" className="act-btn" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
                                <Edit size={16} color="#6C5CE7" />
                              </button>
                              <button type="button" className="act-btn" style={{ padding: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
                                <Trash2 size={16} color="#EF4444" />
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
                  <span style={{ fontSize: 13, color: '#6B7280' }}>
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} results
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ minWidth: 32, height: 32, padding: '0 8px', border: '1px solid transparent', borderRadius: 8, background: 'transparent', color: '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: currentPage === 1 ? 'default' : 'pointer', fontFamily: 'Inter' }}>‹</button>
                    {[...Array(Math.min(3, totalPages))].map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} style={{
                        minWidth: 32, height: 32, padding: '0 8px',
                        border: currentPage === i + 1 ? 'none' : '1px solid transparent',
                        borderRadius: 8,
                        background: currentPage === i + 1 ? '#6C5CE7' : 'transparent',
                        color: currentPage === i + 1 ? 'white' : '#374151',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter',
                      }}>{i + 1}</button>
                    ))}
                    {totalPages > 3 && <span style={{ padding: '0 8px', color: '#6B7280' }}>...</span>}
                    {totalPages > 3 && (
                      <button onClick={() => setCurrentPage(totalPages)} style={{ minWidth: 32, height: 32, padding: '0 8px', border: '1px solid transparent', borderRadius: 8, background: 'transparent', color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter' }}>
                        {totalPages}
                      </button>
                    )}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ minWidth: 32, height: 32, padding: '0 8px', border: '1px solid transparent', borderRadius: 8, background: 'transparent', color: '#9CA3AF', fontSize: 13, fontWeight: 500, cursor: currentPage === totalPages ? 'default' : 'pointer', fontFamily: 'Inter' }}>›</button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <select style={{ padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', appearance: 'none', paddingRight: 28 }}>
                      <option>{itemsPerPage} / page</option>
                    </select>
                    <ChevronDown size={12} color="#6B7280" style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div style={{
            width: 280,
            background: 'white',
            borderLeft: '1px solid #E5E7EB',
            padding: '20px 16px',
            overflowY: 'auto',
            overflowX: 'hidden',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            minHeight: 0,
          }}>

            {/* Membership Overview - Donut Chart */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Membership Overview</span>
              </div>

              {/* Donut Chart */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 16, position: 'relative' }}>
                <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background circle */}
                  <circle cx="90" cy="90" r="70" fill="none" stroke="#F3F4F6" strokeWidth="28" />

                  {/* Students - Purple segment (87.13%) */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="#6C5CE7"
                    strokeWidth="28"
                    strokeDasharray={`${439.8 * 0.8713} 439.8`}
                    strokeDashoffset="0"
                  />

                  {/* Faculty - Blue segment (9.4%) starting after students */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="28"
                    strokeDasharray={`${439.8 * 0.094} 439.8`}
                    strokeDashoffset={`-${439.8 * 0.8713}`}
                  />

                  {/* Staff - Orange segment (3.5%) starting after faculty */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="28"
                    strokeDasharray={`${439.8 * 0.035} 439.8`}
                    strokeDashoffset={`-${439.8 * (0.8713 + 0.094)}`}
                  />
                </svg>

                {/* Center text */}
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{totalMembers}</div>
                  <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>Total Members</div>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6C5CE7' }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Students</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                    {users.filter(u => u.role === 'student').length} ({totalMembers > 0 ? ((users.filter(u => u.role === 'student').length / totalMembers) * 100).toFixed(2) : 0}%)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#3B82F6' }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Faculty</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                    {users.filter(u => u.role === 'teacher').length} ({totalMembers > 0 ? ((users.filter(u => u.role === 'teacher').length / totalMembers) * 100).toFixed(2) : 0}%)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F97316' }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Staff</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>
                    {users.filter(u => u.role !== 'student' && u.role !== 'teacher').length} ({totalMembers > 0 ? ((users.filter(u => u.role !== 'student' && u.role !== 'teacher').length / totalMembers) * 100).toFixed(2) : 0}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Membership Types */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Membership Types</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { icon: <Users size={15} color="#6C5CE7" />, bg: '#F3F4F6', label: 'Student', count: users.filter(u => u.role === 'student').length },
                  { icon: <Users size={15} color="#3B82F6" />, bg: '#F3F4F6', label: 'Faculty', count: users.filter(u => u.role === 'teacher').length },
                  { icon: <Users size={15} color="#F97316" />, bg: '#F3F4F6', label: 'Staff', count: users.filter(u => u.role !== 'student' && u.role !== 'teacher').length },
                ].map((t, i) => (
                  <div key={i} className="cat-row" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, cursor: 'pointer' }}>
                    <div style={{ width: 32, height: 32, background: t.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {t.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#111827' }}>{t.label}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{t.count}</div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 6, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 10, paddingRight: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Total</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{totalMembers}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Quick Actions</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: <Plus size={15} color="#6C5CE7" />, label: 'Add New Member' },
                  { icon: <Upload size={15} color="#6C5CE7" />, label: 'Import Members' },
                  { icon: <Upload size={15} color="#6C5CE7" />, label: 'Export Members' },
                  { icon: <LayoutGrid size={15} color="#6C5CE7" />, label: 'Member Categories' },
                ].map((action, i) => (
                  <button key={i} type="button" className="qa-row" style={{
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
                  }}>
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
    </div>
  );
}
