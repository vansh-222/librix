'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Users, ArrowLeftRight, ClipboardList,
  CreditCard, BarChart2, Bell, Settings
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

export default function LibrarianSidebar() {
  const pathname = usePathname();

  return (
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
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: '19px' }}>Librarium</div>
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
              <div className="nav-link" style={{
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

      <style jsx>{`
        .nav-link:hover {
          background: #F3F4F6 !important;
        }
      `}</style>
    </div>
  );
}
