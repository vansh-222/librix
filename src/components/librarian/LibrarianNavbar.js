'use client';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';

export default function LibrarianNavbar({ title, subtitle, searchPlaceholder = "Search books, members, ISBN..." }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

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
            placeholder={searchPlaceholder}
            style={{ width: '100%', padding: '9px 16px 9px 38px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#111827', outline: 'none', background: '#F9FAFB', fontFamily: 'Inter' }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color="#374151" />
          <div style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, background: '#2563EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>3</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6C5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>A</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Anita Sharma</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Librarian</div>
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
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Anita Sharma</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>librarian@apexcollege.edu</div>
              </div>
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
