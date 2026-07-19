'use client';
import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, CheckCheck, Trash2, Loader2, BookOpen, Star, AlertCircle, Calendar, BookMarked, Clock } from 'lucide-react';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return Math.floor(hrs / 24) + 'd ago';
}

const TYPE_CFG = {
  request_approved:      { icon: CheckCheck,   color: '#22C55E', bg: '#F0FDF4' },
  request_rejected:      { icon: AlertCircle,  color: '#EF4444', bg: '#FEF2F2' },
  book_issued:           { icon: BookOpen,     color: '#6366F1', bg: '#EEF2FF' },
  return_reminder:       { icon: Clock,        color: '#F59E0B', bg: '#FFFBEB' },
  return_received:       { icon: Check,        color: '#22C55E', bg: '#F0FDF4' },
  fine_added:            { icon: AlertCircle,  color: '#EF4444', bg: '#FEF2F2' },
  reservation_available: { icon: BookMarked,   color: '#6366F1', bg: '#EEF2FF' },
  extension_approved:    { icon: Calendar,     color: '#22C55E', bg: '#F0FDF4' },
  extension_rejected:    { icon: AlertCircle,  color: '#EF4444', bg: '#FEF2F2' },
  overdue_alert:         { icon: AlertCircle,  color: '#EF4444', bg: '#FEF2F2' },
  general:               { icon: Bell,         color: '#6366F1', bg: '#EEF2FF' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [toast, setToast]       = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch { showToast('Failed to load notifications.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id) => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notificationId: id }) });
    setNotifications(prev => {
      const next = prev.map(n => n._id === id ? { ...n, read: true } : n);
      const newUnread = next.filter(n => !n.read).length;
      window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { count: newUnread } }));
      return next;
    });
  };

  const markAll = async () => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAll: true }) });
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { count: 0 } }));
      return next;
    });
    showToast('All marked as read.');
  };

  const deleteOne = async (id) => {
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
    setNotifications(prev => {
      const next = prev.filter(n => n._id !== id);
      const newUnread = next.filter(n => !n.read).length;
      window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { count: newUnread } }));
      return next;
    });
  };

  const deleteAll = async () => {
    await fetch('/api/notifications?all=true', { method: 'DELETE' });
    setNotifications([]);
    window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { count: 0 } }));
    showToast('All notifications cleared.');
  };

  const filtered = filter === 'all'    ? notifications
                 : filter === 'unread' ? notifications.filter(n => !n.read)
                 : notifications.filter(n => n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ padding: '28px', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', minHeight: '100%' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#6366F1', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>Notifications
            {unreadCount > 0 && <span style={{ marginLeft: 10, background: '#6366F1', color: 'white', fontSize: 13, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{unreadCount}</span>}
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '4px 0 0' }}>Stay updated on your library activity</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={markAll} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; }}>
            <CheckCheck size={15} /> Mark All Read
          </button>
          <button onClick={deleteAll} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, fontWeight: 600, color: '#EF4444', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}>
            <Trash2 size={15} /> Clear All
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        <div>
          {/* Filter tabs */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', marginBottom: 16, overflow: 'hidden' }}>
            {[{ key: 'all', label: 'All' }, { key: 'unread', label: 'Unread' }, { key: 'read', label: 'Read' }].map((t, i) => {
              const isActive = filter === t.key;
              return (
                <button key={t.key} onClick={() => setFilter(t.key)} style={{
                  flex: 1, padding: '12px', border: 'none', background: 'transparent', cursor: 'pointer',
                  fontSize: 14, fontWeight: isActive ? 600 : 500, color: isActive ? '#6366F1' : '#6B7280',
                  borderBottom: isActive ? '2px solid #6366F1' : '2px solid transparent',
                  borderRight: i < 2 ? '1px solid #E5E7EB' : 'none', transition: 'all 0.2s',
                }}>{t.label}</button>
              );
            })}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
              <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: '#6366F1' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 60, textAlign: 'center' }}>
              <Bell size={40} style={{ margin: '0 auto 12px', color: '#D1D5DB' }} />
              <p style={{ color: '#9CA3AF', fontSize: 15 }}>No notifications here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(notif => {
                const cfg  = TYPE_CFG[notif.type] || TYPE_CFG.general;
                const Icon = cfg.icon;
                return (
                  <div key={notif._id}
                    style={{ background: 'white', borderRadius: 12, border: `1px solid ${notif.read ? '#E5E7EB' : '#C7D2FE'}`, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14, opacity: notif.read ? 0.75 : 1, transition: 'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} color={cfg.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                          {!notif.read && <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#6366F1', marginRight: 6, verticalAlign: 'middle' }} />}
                          {notif.title}
                        </div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{timeAgo(notif.createdAt)}</div>
                      </div>
                      <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 10px', lineHeight: 1.5 }}>{notif.message}</p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {!notif.read && (
                          <button onClick={() => markRead(notif._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid #E5E7EB', borderRadius: 6, background: 'white', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                            <Check size={12} /> Mark Read
                          </button>
                        )}
                        {notif.link && (
                          <a href={notif.link} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid #C7D2FE', borderRadius: 6, background: '#EEF2FF', fontSize: 12, fontWeight: 600, color: '#6366F1', textDecoration: 'none' }}>
                            View →
                          </a>
                        )}
                        <button onClick={() => deleteOne(notif._id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid #E5E7EB', borderRadius: 6, background: 'white', fontSize: 12, fontWeight: 600, color: '#EF4444', cursor: 'pointer', marginLeft: 'auto' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Summary</h3>
            {[
              { label: 'Total',   count: notifications.length,                      color: '#6366F1' },
              { label: 'Unread',  count: notifications.filter(n => !n.read).length, color: '#F59E0B' },
              { label: 'Read',    count: notifications.filter(n =>  n.read).length, color: '#22C55E' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>{item.label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.count}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', borderRadius: 12, border: '1px solid #C7D2FE', padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#4338CA', marginBottom: 8 }}>📬 Stay Informed</div>
            <p style={{ fontSize: 12, color: '#6366F1', lineHeight: 1.6, margin: 0 }}>
              You'll receive real-time alerts for request approvals, due date reminders, fine notices, and more.
            </p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
