'use client';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { useTypewriterPlaceholder } from '@/hooks/useTypewriterPlaceholder';

export default function LibrarianNavbar({ title, subtitle, searchPlaceholder = "Search books, members, ISBN...", unreadCount = 0 }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const animatedPlaceholder = useTypewriterPlaceholder(searchPlaceholder + "|Search by author...|Find member IDs...", 50, 20, 3000);
  const { data: session } = useSession();
  const userName = session?.user?.name || "Librarian";
  const userEmail = session?.user?.email || "librarian@college.edu";

  return (
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
        <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: '26px' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>{subtitle}</div>
      </div>

      <div style={{ flex: 1, maxWidth: 380 }}>
        <div style={{ position: 'relative' }}>
          <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            placeholder={animatedPlaceholder}
            style={{ width: '100%', padding: '9px 16px 9px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', background: '#F9FAFB', fontFamily: 'Inter' }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="#374151" />
          {unreadCount > 0 && (
            <div style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>{unreadCount}</div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1A73E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{userName}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Librix</div>
            </div>
            <ChevronDown size={13} color="#9CA3AF" />
          </div>

          {/* Dropdown Menu */}
          {showUserMenu && (
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
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{userName}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{userEmail}</div>
              </div>
              <Link
                href="/librarian/profile"
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderBottom: '1px solid #F3F4F6',
                  background: 'transparent',
                  textAlign: 'left',
                  fontSize: 13,
                  color: '#374151',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'Inter',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  fontSize: 13,
                  color: '#DC2626',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'Inter'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
