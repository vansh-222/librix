'use client';
import Sidebar from '@/components/shared/Sidebar';
import {
  LayoutDashboard, Search, BookMarked, BookOpen,
  Bookmark, Bell, User, ClipboardList,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/search', icon: Search, label: 'Search Books' },
  { href: '/student/my-books', icon: BookOpen, label: 'My Books' },
  { href: '/student/requests', icon: ClipboardList, label: 'My Requests' },
  { href: '/student/reservations', icon: Bookmark, label: 'Reservations' },
  { href: '/student/notifications', icon: Bell, label: 'Notifications' },
  { href: '/student/profile', icon: User, label: 'Profile' },
];

export default function StudentLayoutClient({ children, user }) {
  return (
    <div className="main-layout">
      <Sidebar user={user} navItems={NAV_ITEMS} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
