'use client';
import { useState, useEffect } from 'react';
import LibrarianSidebar from './LibrarianSidebar';
import LibrarianNavbar from './LibrarianNavbar';

export default function LibrarianLayout({ 
  userName,
  userEmail,
  title, 
  subtitle, 
  searchPlaceholder,
  children 
}) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/notifications?unread=true')
      .then(res => res.json())
      .then(data => {
        if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount);
        }
      })
      .catch(() => {});
  }, []);

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

      {/* Sidebar */}
      <LibrarianSidebar unreadCount={unreadCount} />

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
        {/* Navbar */}
        <LibrarianNavbar 
          userName={userName}
          userEmail={userEmail}
          title={title} 
          subtitle={subtitle} 
          searchPlaceholder={searchPlaceholder}
          unreadCount={unreadCount}
        />

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
