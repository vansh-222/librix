'use client';
import { useState, useEffect } from 'react';
import TopBar from '@/components/shared/TopBar';
import { Bell, BookOpen, IndianRupee, Bookmark, CheckCheck, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const TYPE_ICON = {
  request_approved:      { icon: BookOpen,      color: '#22C55E' },
  request_rejected:      { icon: BookOpen,      color: '#EF4444' },
  book_issued:           { icon: BookOpen,      color: '#6366F1' },
  due_reminder:          { icon: Bell,          color: '#F59E0B' },
  overdue_alert:         { icon: Bell,          color: '#EF4444' },
  fine_added:            { icon: IndianRupee,   color: '#EF4444' },
  reservation_available: { icon: Bookmark,      color: '#22C55E' },
  extension_approved:    { icon: CheckCheck,    color: '#22C55E' },
  general:               { icon: Bell,          color: '#6366F1' },
};

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const fetchData = () => {
    fetch('/api/notifications').then(r => r.json()).then(d => {
      setNotifications(d.notifications || []);
      setLoading(false);
    });
  };

  useEffect(fetchData, []);

  const markAllRead = async () => {
    setMarking(true);
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    setMarking(false);
    fetchData();
  };

  const markOne = async (id) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
        <TopBar title="Notifications" subtitle={`${unreadCount} unread`} />
        {unreadCount > 0 && (
          <button onClick={markAllRead} disabled={marking} className="btn btn-sm"
            style={{ marginRight: 24, gap: 6, color: 'var(--brand)', background: 'rgba(99,102,241,0.1)', border: 'none' }}>
            {marking ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCheck size={13} />}
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--brand)' }} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <Bell size={40} style={{ margin: '0 auto 12px', color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)' }}>You&apos;re all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {notifications.map(n => {
            const typeCfg = TYPE_ICON[n.type] || TYPE_ICON.general;
            const Icon = typeCfg.icon;
            return (
              <div key={n._id} onClick={() => !n.read && markOne(n._id)}
                style={{
                  display: 'flex', gap: 14, padding: '14px 18px',
                  background: n.read ? 'var(--card)' : 'rgba(99,102,241,0.05)',
                  border: `1px solid ${n.read ? 'var(--border)' : 'rgba(99,102,241,0.2)'}`,
                  borderRadius: 12, cursor: n.read ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: `${typeCfg.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={17} color={typeCfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{formatDate(n.createdAt)}</div>
                </div>
                {!n.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366F1', flexShrink: 0, marginTop: 6 }} />
                )}
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
