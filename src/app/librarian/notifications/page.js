'use client';
import { useState, useEffect, useCallback } from 'react';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import {
  Bell, CheckCircle, AlertTriangle, Bookmark, Eye, Trash2, Check, Settings, Mail, ChevronDown
} from 'lucide-react';

function timeAgo(d) {
  if (!d) return '—';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

const TYPE_ICON = {
  return_reminder: '📗', request_approved: '✅', request_rejected: '❌',
  book_issued: '📚', fine_added: '💰', overdue_alert: '⚠️',
  new_member: '👤', reservation_available: '🔖', general: '🔔',
};
const TYPE_BG = {
  return_reminder: '#DCFCE7', request_approved: '#DCFCE7', book_issued: '#DBEAFE',
  fine_added: '#FEE2E2', overdue_alert: '#FEF3C7', new_member: '#DBEAFE',
  request_rejected: '#FEE2E2', reservation_available: '#DBEAFE', general: '#EFF6FF',
};
const TYPE_COLOR = {
  return_reminder: '#15803D', request_approved: '#15803D', book_issued: '#1D4ED8',
  fine_added: '#DC2626', overdue_alert: '#D97706', new_member: '#1D4ED8',
  request_rejected: '#DC2626', reservation_available: '#1D4ED8', general: '#1A73E8',
};
const TYPE_LABEL = {
  return_reminder: 'Reminder', request_approved: 'Request', book_issued: 'System',
  fine_added: 'Payment', overdue_alert: 'Alert', new_member: 'System',
  request_rejected: 'Request', reservation_available: 'System', general: 'System',
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const load = useCallback(async () => {
    const res  = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data.notifications || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id) => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notificationId: id }) });
    setNotifications(prev => {
      const updated = prev.map(n => n._id === id ? { ...n, read: true } : n);
      const newUnread = updated.filter(n => !n.read).length;
      setTimeout(() => window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { count: newUnread } })), 0);
      return updated;
    });
  };

  const deleteOne = async (id) => {
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
    setNotifications(prev => {
      const updated = prev.filter(n => n._id !== id);
      const newUnread = updated.filter(n => !n.read).length;
      setTimeout(() => window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { count: newUnread } })), 0);
      return updated;
    });
  };

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAll: true }) });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setTimeout(() => window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { count: 0 } })), 0);
  };

  const deleteAllRead = async () => {
    const readIds = notifications.filter(n => n.read).map(n => n._id);
    await Promise.all(readIds.map(id => fetch(`/api/notifications?id=${id}`, { method: 'DELETE' })));
    setNotifications(prev => {
      const updated = prev.filter(n => !n.read);
      const newUnread = updated.filter(n => !n.read).length;
      setTimeout(() => window.dispatchEvent(new CustomEvent('notifications-updated', { detail: { count: newUnread } })), 0);
      return updated;
    });
  };

  const total    = notifications.length;
  const unread   = notifications.filter(n => !n.read).length;
  const system   = notifications.filter(n => ['book_issued','new_member','reservation_available','general'].includes(n.type)).length;
  const alerts   = notifications.filter(n => ['overdue_alert','fine_added'].includes(n.type)).length;
  const reminders = notifications.filter(n => n.type === 'return_reminder').length;

  const STATS = [
    { icon: <Bell size={22} color="#1A73E8" />, iconBg: '#EFF6FF', value: total,  label: 'Total Notifications',  link: 'View all →' },
    { icon: <CheckCircle size={22} color="#16A34A" />, iconBg: '#DCFCE7', value: unread, label: 'Unread Notifications', link: 'View all →' },
    { icon: <Bell size={22} color="#F59E0B" />, iconBg: '#FEF3C7', value: system, label: 'System Notifications',  link: 'View all →' },
    { icon: <AlertTriangle size={22} color="#DC2626" />, iconBg: '#FEE2E2', value: alerts, label: 'Important Alerts',     link: 'View all →' },
  ];

  const tabs = [
    { id: 'all',       label: 'All'       },
    { id: 'unread',    label: 'Unread'    },
    { id: 'system',    label: 'System'    },
    { id: 'reminders', label: 'Reminders' },
    { id: 'alerts',    label: 'Alerts'    },
  ];

  const NOTIFICATIONS = notifications.map(n => ({
    id:        n._id,
    icon:      TYPE_ICON[n.type] || '🔔',
    iconBg:    TYPE_BG[n.type]   || '#EFF6FF',
    title:     n.title,
    message:   n.message,
    type:      TYPE_LABEL[n.type] || 'System',
    typeBg:    TYPE_BG[n.type]   || '#EFF6FF',
    typeColor: TYPE_COLOR[n.type] || '#1A73E8',
    relatedTo: '',
    member:    '',
    date:      new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    time:      timeAgo(n.createdAt),
    status:    n.read ? 'Read' : 'Unread',
    _id:       n._id,
    _read:     n.read,
    _type:     n.type,
  }));

  const filteredNotifications = NOTIFICATIONS.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return notif.status === 'Unread';
    if (activeTab === 'system') return notif.type === 'System';
    if (activeTab === 'reminders') return notif.type === 'Reminder';
    if (activeTab === 'alerts') return notif.type === 'Alert';
    return true;
  });

  return (
    <LibrarianLayout
      title="Notifications"
      subtitle="View and manage all library notifications"
      searchPlaceholder="Search notifications..."
    >
      <div style={{ padding: '24px 24px 32px' }}>
        {/* Two column layout */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Left column */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 46, height: 46, background: s.iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {s.icon}
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{s.value}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#1A73E8', cursor: 'pointer' }}>{s.link}</div>
                </div>
              ))}
            </div>

            {/* Tabs and Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: 8 }}>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: 8,
                      background: activeTab === tab.id ? '#1A73E8' : 'white',
                      color: activeTab === tab.id ? 'white' : '#374151',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      boxShadow: activeTab === tab.id ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                      border: activeTab === tab.id ? 'none' : '1px solid #E5E7EB',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" onClick={() => {}} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Check size={15} color="#1A73E8" />
                  Filters
                </button>
                <button type="button" onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: 8, background: 'white', fontSize: 13, color: '#374151', cursor: 'pointer', fontFamily: 'Inter', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <Check size={15} color="#16A34A" />
                  Mark all as read
                </button>
              </div>
            </div>

            {/* Notifications Table */}
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '35%' }}>NOTIFICATION</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '12%' }}>TYPE</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '18%' }}>RELATED TO</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '15%' }}>DATE & TIME</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'left', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '10%' }}>STATUS</th>
                    <th style={{ padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.06em', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', width: '10%' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.map((notif, i) => (
                    <tr key={notif.id} className="tr-hover" style={{ borderBottom: i < filteredNotifications.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{ width: 40, height: 40, background: notif.iconBg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>
                            {notif.icon}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{notif.title}</div>
                            <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>{notif.message}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          background: notif.typeBg,
                          color: notif.typeColor,
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 500,
                          display: 'inline-block'
                        }}>
                          {notif.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{notif.relatedTo}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{notif.member}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{notif.date}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{notif.time}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: notif.status === 'Unread' ? '#1A73E8' : '#9CA3AF', flexShrink: 0 }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: notif.status === 'Unread' ? '#1A73E8' : '#6B7280' }}>{notif.status}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                            <button 
                              type="button"
                              title={notif._read ? 'Already read' : 'Mark as read'}
                              onClick={() => markRead(notif._id)}
                              style={{ 
                                padding: '7px',
                                border: '1px solid #E5E7EB',
                                background: notif._read ? '#F9FAFB' : 'white',
                                borderRadius: 6,
                                cursor: notif._read ? 'default' : 'pointer',
                                display: 'flex',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => { if (!notif._read) e.currentTarget.style.background = '#F9FAFB'; }}
                              onMouseLeave={(e) => { if (!notif._read) e.currentTarget.style.background = 'white'; }}
                            >
                              <Eye size={15} color={notif._read ? '#9CA3AF' : '#1A73E8'} />
                            </button>
                            <button 
                              type="button"
                              title="Delete"
                              onClick={() => deleteOne(notif._id)}
                              style={{ 
                                padding: '7px',
                                border: '1px solid #E5E7EB',
                                background: 'white',
                                borderRadius: 6,
                                cursor: 'pointer',
                                display: 'flex',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                              <Trash2 size={15} color="#DC2626" />
                            </button>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div style={{
            width: 280,
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            padding: '20px 16px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>

            {/* Notification Summary — Real Data */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Notification Summary</div>
              {(() => {
                const C = 2 * Math.PI * 50;
                const cats = [
                  { color: '#1A73E8', label: 'Unread',    count: unread },
                  { color: '#2563EB', label: 'System',    count: system },
                  { color: '#16A34A', label: 'Reminders', count: reminders },
                  { color: '#F59E0B', label: 'Alerts',    count: alerts },
                ];
                let offset = 0;
                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 16 }}>
                      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="70" cy="70" r="50" fill="none" stroke="#F3F4F6" strokeWidth="20" />
                        {cats.map((cat, i) => {
                          const frac = total > 0 ? cat.count / total : 0;
                          const dash = frac * C;
                          const el = (
                            <circle key={i} cx="70" cy="70" r="50" fill="none"
                              stroke={cat.color} strokeWidth="20"
                              strokeDasharray={`${dash} ${C - dash}`}
                              strokeDashoffset={-offset}
                            />
                          );
                          offset += dash;
                          return el;
                        })}
                      </svg>
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: 26, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{total}</div>
                        <div style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>Total</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {cats.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#F9FAFB', borderRadius: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                          <div style={{ flex: 1, fontSize: 12, color: '#6B7280' }}>{item.label}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                            {item.count} {total > 0 ? `(${Math.round(item.count / total * 100)}%)` : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Quick Actions */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: <Check size={16} color="#16A34A" />, label: 'Mark all as read', color: '#16A34A', action: markAllRead },
                  { icon: <Trash2 size={16} color="#DC2626" />, label: 'Delete all read', color: '#DC2626', action: deleteAllRead },
                  { icon: <Settings size={16} color="#1A73E8" />, label: 'Notification Settings', color: '#1A73E8', action: null },
                  { icon: <Mail size={16} color="#1A73E8" />, label: 'Email Preferences', color: '#1A73E8', action: null },
                ].map((action, i) => (
                  <button 
                    key={i} 
                    type="button"
                    onClick={() => action.action && action.action()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: 8,
                      background: 'white',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#F9FAFB';
                      e.currentTarget.style.borderColor = action.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                  >
                    <div style={{ width: 32, height: 32, background: '#F3F4F6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {action.icon}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: '#E5E7EB' }} />

            {/* Recent Notifications — Real Data */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recent Notifications</span>
              </div>
              {notifications.length === 0 ? (
                <div style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', padding: '12px 0' }}>No notifications.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {notifications.slice(0, 4).map((n, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: n.read ? '#F9FAFB' : '#EFF6FF', borderRadius: 8 }}>
                      <div style={{ width: 36, height: 36, background: TYPE_BG[n.type] || '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                        {TYPE_ICON[n.type] || '🔔'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{timeAgo(n.createdAt)}</div>
                      </div>
                      {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1A73E8', flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </LibrarianLayout>
  );
}
