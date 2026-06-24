'use client';
import { useState, useEffect } from 'react';
import { Search, Users, UserCheck, UserPlus, UserX, Eye, Edit, Trash2, ChevronRight, ChevronLeft, ChevronDown, Filter, Plus, Book, Bell, Settings, LayoutDashboard, BookMarked, FileText, IndianRupee, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function LibrarianMembersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
    setLoading(false);
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/librarian/dashboard' },
    { id: 'books', label: 'Books Management', icon: Book, href: '/librarian/books' },
    { id: 'members', label: 'Members', icon: Users, href: '/librarian/members' },
    { id: 'returns', label: 'Issue / Return', icon: BookMarked, href: '/librarian/returns' },
    { id: 'requests', label: 'Requests', icon: FileText, href: '/librarian/requests' },
    { id: 'fines', label: 'Fines & Payments', icon: IndianRupee, href: '/librarian/fines' },
    { id: 'reports', label: 'Reports', icon: BarChart3, href: '/librarian/reports' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/librarian/notifications', badge: 6 },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/librarian/settings' },
  ];

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FC', fontFamily: 'Inter' }}>
      {/* Sidebar */}
      <div style={{
        width: 185,
        background: 'white',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
        {/* Logo */}
        <div style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32,
              height: 40,
              background: '#6366F1',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Book size={24} color="white" />
            </div>
            <div>
              <div style={{ color: '#1E293B', fontSize: 18, fontWeight: 700, lineHeight: '28px' }}>LibraSys</div>
              <div style={{ color: '#64748B', fontSize: 12, lineHeight: '16px' }}>Library<br />Management</div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div style={{ paddingBottom: 24, paddingLeft: 16, paddingRight: 16 }}>
          <div style={{
            padding: 12,
            background: '#F9FAFB',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14,
              fontWeight: 700
            }}>
              AS
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#1E293B', fontSize: 14, fontWeight: 600 }}>Anita Sharma</div>
              <div style={{ color: '#64748B', fontSize: 12 }}>Librarian</div>
            </div>
            <ChevronDown size={12} color="#64748B" />
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          flex: 1,
          paddingLeft: 16,
          paddingRight: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          overflowY: 'auto'
        }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === 'members';
            
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  position: 'relative',
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: isActive ? '#6366F1' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={20} color={isActive ? 'white' : '#64748B'} />
                <span style={{
                  color: isActive ? 'white' : '#64748B',
                  fontSize: 14,
                  fontWeight: 500
                }}>
                  {item.label}
                </span>
                {item.badge && (
                  <div style={{
                    position: 'absolute',
                    right: 12,
                    width: 20,
                    height: 20,
                    background: '#EF4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    {item.badge}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Help Card */}
        <div style={{ padding: 24 }}>
          <div style={{
            padding: 16,
            background: '#F8F9FC',
            borderRadius: 12,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💡</div>
            <div style={{ color: '#1E293B', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Need Help?</div>
            <div style={{ color: '#64748B', fontSize: 12, marginBottom: 12, lineHeight: '16px' }}>
              If you need any<br />assistance, we're<br />here to help you.
            </div>
            <button style={{
              width: '100%',
              padding: '8px 16px',
              borderRadius: 8,
              border: '2px solid #6366F1',
              background: 'transparent',
              color: '#6366F1',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{ 
          background: 'white', 
          borderBottom: '1px solid #E5E7EB',
          padding: '16px 32px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ color: '#1E293B', fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4 }}>Members</h1>
              <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>Manage and view all library members</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{ 
                width: 400,
                background: '#F8F9FC',
                borderRadius: 8,
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <Search size={20} color="#64748B" />
                <input
                  type="text"
                  placeholder="Search members by name, ID, email, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    color: '#1E293B',
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Bell size={24} color="#64748B" />
                <div style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 20,
                  height: 20,
                  background: '#6366F1',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 12,
                  fontWeight: 600
                }}>9</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 700
                }}>
                  AS
                </div>
                <div>
                  <div style={{ color: '#1E293B', fontSize: 14, fontWeight: 600 }}>Anita Sharma</div>
                  <div style={{ color: '#64748B', fontSize: 12 }}>Librarian</div>
                </div>
                <ChevronDown size={16} color="#64748B" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ padding: '24px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 16 }}>
            {[
              { label: 'Total Members', value: totalMembers, bg: '#EEF2FF', icon: Users, iconColor: '#6366F1' },
              { label: 'Active Members', value: activeMembers, bg: '#D1FAE5', icon: UserCheck, iconColor: '#10B981' },
              { label: 'New This Month', value: newThisMonth, bg: '#FEF3C7', icon: UserPlus, iconColor: '#F59E0B' },
              { label: 'Inactive Members', value: inactiveMembers, bg: '#FEE2E2', icon: UserX, iconColor: '#EF4444' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} style={{ padding: 24, background: stat.bg, borderRadius: 12 }}>
                  <div style={{ width: 48, height: 48, background: 'white', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Icon size={24} color={stat.iconColor} />
                  </div>
                  <div style={{ color: '#1E293B', fontSize: 30, fontWeight: 700, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ color: '#64748B', fontSize: 14, marginBottom: 8 }}>{stat.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                    <span style={{ color: '#6366F1', fontSize: 14, fontWeight: 500 }}>View all</span>
                    <ChevronRight size={16} color="#6366F1" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div style={{ padding: '16px', background: 'white', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 240, background: '#F8F9FC', borderRadius: 8, padding: '8px 24px' }}>
                <input type="text" placeholder="Search members..." style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', color: '#9CA3AF', fontSize: 14 }} />
              </div>
              <div style={{ padding: '8px 16px', background: '#F8F9FC', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <span style={{ color: '#64748B', fontSize: 14 }}>All Membership Types</span>
                <ChevronDown size={16} color="#64748B" />
              </div>
              <div style={{ padding: '8px 16px', background: '#F8F9FC', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <span style={{ color: '#64748B', fontSize: 14 }}>All Status</span>
                <ChevronDown size={16} color="#64748B" />
              </div>
              <div style={{ padding: '8px 16px', background: '#F8F9FC', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Filter size={20} color="#64748B" />
                <span style={{ color: '#64748B', fontSize: 14 }}>Filters</span>
              </div>
            </div>
            <button style={{ padding: '8px 24px', background: '#6366F1', borderRadius: 8, border: 'none', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Plus size={20} color="white" />
              <span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>Add New Member</span>
            </button>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#F8F9FC', borderBottom: '1px solid #E5E7EB' }}>
                <tr>
                  {['MEMBER', 'MEMBER ID', 'MEMBERSHIP TYPE', 'EMAIL', 'BOOKS BORROWED', 'FINE (₹)', 'JOIN DATE', 'STATUS', 'ACTION'].map((header) => (
                    <th key={header} style={{ padding: '24px', textAlign: 'left', color: '#64748B', fontSize: 12, fontWeight: 600 }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member, idx) => {
                  const memberType = getMembershipType(member.role);
                  return (
                    <tr key={member._id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 700
                          }}>
                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ color: '#1E293B', fontSize: 14, fontWeight: 600 }}>{member.name}</div>
                            <div style={{ color: '#64748B', fontSize: 12 }}>{member.phone || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '24px', color: '#64748B', fontSize: 14 }}>
                        {member.studentId || member.teacherId || 'MEM' + String(1001 + idx).padStart(4, '0')}
                      </td>
                      <td style={{ padding: '24px' }}>
                        <span style={{ padding: '4px 12px', background: memberType.bg, color: memberType.color, borderRadius: 9999, fontSize: 12, fontWeight: 500 }}>
                          {memberType.label}
                        </span>
                      </td>
                      <td style={{ padding: '24px', color: '#64748B', fontSize: 14 }}>{member.email}</td>
                      <td style={{ padding: '24px', color: '#1E293B', fontSize: 14 }}>0</td>
                      <td style={{ padding: '24px', fontSize: 14, fontWeight: 600, color: '#10B981' }}>₹0.00</td>
                      <td style={{ padding: '24px', color: '#64748B', fontSize: 14 }}>{formatDate(member.createdAt)}</td>
                      <td style={{ padding: '24px' }}>
                        <span style={{
                          padding: '4px 12px',
                          background: member.isActive ? '#D1FAE5' : '#FEE2E2',
                          color: member.isActive ? '#059669' : '#DC2626',
                          borderRadius: 9999,
                          fontSize: 12,
                          fontWeight: 500
                        }}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <Eye size={20} color="#6366F1" style={{ cursor: 'pointer' }} />
                          <Edit size={20} color="#64748B" style={{ cursor: 'pointer' }} />
                          <Trash2 size={20} color="#EF4444" style={{ cursor: 'pointer' }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#64748B', fontSize: 14 }}>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} results
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={16} color="#64748B" />
                </button>
                {[...Array(Math.min(3, totalPages))].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E7EB', background: currentPage === i + 1 ? '#6366F1' : 'white', color: currentPage === i + 1 ? 'white' : '#64748B', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                    {i + 1}
                  </button>
                ))}
                {totalPages > 3 && <span style={{ padding: '0 8px', color: '#64748B' }}>...</span>}
                {totalPages > 3 && (
                  <button style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', color: '#64748B', cursor: 'pointer', fontSize: 14 }}>
                    {totalPages}
                  </button>
                )}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={16} color="#64748B" />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#64748B', fontSize: 14 }}>{itemsPerPage} / page</span>
                <ChevronDown size={16} color="#64748B" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
