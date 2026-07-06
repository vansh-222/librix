'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Search, BookOpen, ClipboardList, DollarSign, Sparkles, History, Bell } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/search', icon: Search, label: 'Search Books' },
  { href: '/student/my-books', icon: BookOpen, label: 'My Books' },
  { href: '/student/requests', icon: ClipboardList, label: 'My Requests' },
  { href: '/student/fines', icon: DollarSign, label: 'Fines & Payments' },
  { href: '/student/recommendations', icon: Sparkles, label: 'Recommendations' },
  { href: '/student/history', icon: History, label: 'Reading History' },
  { href: '/student/notifications', icon: Bell, label: 'Notifications', badge: 3 },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 200,
      background: 'white',
      borderRight: '1px solid #E5E7EB',
      height: '100vh',
      display: 'flex',
      flexShrink: 0,
      flexDirection: 'column',
      padding: '20px 12px',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <Link href="/student/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, padding: '0 8px', textDecoration: 'none' }}>
        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6C5CE7, #A78BFA)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={18} color="white" />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', fontFamily: 'Inter' }}>Librarium</div>
          <div style={{ fontSize: 9, color: '#9CA3AF', fontFamily: 'Inter', marginTop: -2 }}>Library Management</div>
        </div>
      </Link>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                background: isActive ? '#6C5CE7' : 'transparent',
                color: isActive ? 'white' : '#6B7280',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: 'Inter',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.color = '#111827';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6B7280';
                }
              }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  minWidth: 20,
                  height: 20,
                  background: '#DC2626',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 6px',
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quote Card */}
      <div style={{
        marginTop: 'auto',
        padding: '16px',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
        borderRadius: 12,
        border: '1px solid #C7D2FE',
      }}>
        {/* Illustration placeholder */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 32 }}>📚</div>
        </div>
        <div style={{ fontSize: 12, color: '#4338CA', textAlign: 'center', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 8, fontFamily: 'Inter' }}>
          "Books are a uniquely portable magic."
        </div>
        <div style={{ fontSize: 11, color: '#6366F1', textAlign: 'center', fontWeight: 600, fontFamily: 'Inter' }}>
          — Stephen King
        </div>
      </div>
    </aside>
  );
}
