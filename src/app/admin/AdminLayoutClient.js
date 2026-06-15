'use client';
import Sidebar from '@/components/shared/Sidebar';
import { LayoutDashboard, Building2, CreditCard, Users, BarChart3 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/colleges', icon: Building2, label: 'Colleges' },
  { href: '/admin/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { href: '/admin/librarians', icon: Users, label: 'Librarians' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function AdminLayoutClient({ children, user }) {
  return (
    <div className="main-layout">
      <Sidebar user={user} navItems={NAV_ITEMS} />
      <main className="main-content">{children}</main>
    </div>
  );
}
