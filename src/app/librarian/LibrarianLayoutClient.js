'use client';
import Sidebar from '@/components/shared/Sidebar';
import {
  LayoutDashboard, BookOpen, Package, Users, ClipboardList,
  RotateCcw, BarChart3, Settings, Bell,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/librarian/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { type: 'divider', label: 'Library' },
  { href: '/librarian/books', icon: BookOpen, label: 'Books' },
  { href: '/librarian/inventory', icon: Package, label: 'Inventory' },
  { type: 'divider', label: 'Operations' },
  { href: '/librarian/requests', icon: ClipboardList, label: 'Requests' },
  { href: '/librarian/returns', icon: RotateCcw, label: 'Returns' },
  { type: 'divider', label: 'Members' },
  { href: '/librarian/members', icon: Users, label: 'Members' },
  { type: 'divider', label: 'Admin' },
  { href: '/librarian/reports', icon: BarChart3, label: 'Reports' },
  { href: '/librarian/settings', icon: Settings, label: 'Settings' },
];

export default function LibrarianLayoutClient({ children, user }) {
  return (
    <div className="main-layout">
      <Sidebar user={user} navItems={NAV_ITEMS} />
      <main className="main-content">{children}</main>
    </div>
  );
}
