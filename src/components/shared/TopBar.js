'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TopBar({ title, subtitle, actions }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?unread=false');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications.slice(0, 8));
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  };

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    setUnreadCount(0);
    setNotifications(n => n.map(x => ({ ...x, read: true })));
  };

  const NOTIF_ICONS = {
    request_approved: '✅', request_rejected: '❌', book_issued: '📚',
    return_reminder: '⏰', fine_added: '💰', reservation_available: '🔔',
    extension_approved: '✅', general: '📢', overdue_alert: '⚠️',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 32, flexWrap: 'wrap', gap: 16,
    }}>
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {actions}

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(s => !s)}
            style={{
              position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: 'var(--muted)',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center',
            }}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 8, height: 8, borderRadius: '50%',
                background: '#EF4444', border: '2px solid var(--bg)',
              }} />
            )}
          </button>

          {showDropdown && (
            <>
              <div onClick={() => setShowDropdown(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 8,
                width: 340, background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, zIndex: 50, boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                animation: 'slideUp 0.15s ease',
              }}>
                <div style={{
                  padding: '14px 16px', borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--brand)' }}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                      No notifications yet
                    </div>
                  ) : notifications.map((n) => (
                    <div key={n._id} style={{
                      padding: '12px 16px', borderBottom: '1px solid var(--border)',
                      background: n.read ? 'transparent' : 'rgba(99,102,241,0.04)',
                      display: 'flex', gap: 10, cursor: 'default',
                    }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{NOTIF_ICONS[n.type] || '📢'}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{formatDate(n.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
