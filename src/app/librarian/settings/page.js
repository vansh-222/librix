'use client';
import { useState, useEffect } from 'react';
import LibrarianLayout from '@/components/librarian/LibrarianLayout';
import {
  Settings as SettingsIcon, Building2, Users, RotateCcw, DollarSign, Mail, Cloud, Zap, 
  Globe, Clock, Calendar, Sun, Moon, FileText, Bell, CloudUpload, Timer, 
  Lock, Shield, Trash2, RefreshCcw, Info, Check
} from 'lucide-react';

const SETTINGS_CATEGORIES = [
  { id: 'general', label: 'General', icon: <SettingsIcon size={16} color="#1A73E8" /> },
  { id: 'library', label: 'Library Information', icon: <Building2 size={16} color="#1A73E8" /> },
  { id: 'members', label: 'Members & Access', icon: <Users size={16} color="#1A73E8" /> },
  { id: 'circulation', label: 'Circulation Rules', icon: <RotateCcw size={16} color="#1A73E8" /> },
  { id: 'fines', label: 'Fines & Payments', icon: <DollarSign size={16} color="#1A73E8" /> },
  { id: 'email', label: 'Email Notifications', icon: <Mail size={16} color="#1A73E8" /> },
  { id: 'backup', label: 'Backup & Restore', icon: <Cloud size={16} color="#1A73E8" /> },
  { id: 'integrations', label: 'Integrations', icon: <Zap size={16} color="#1A73E8" /> },
  { id: 'activity', label: 'Activity Logs', icon: <FileText size={16} color="#1A73E8" /> },
];

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('(GMT+05:30) Asia/Kolkata');
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY (31 Dec 2024)');
  const [theme, setTheme] = useState('light');
  const [autoIssueID, setAutoIssueID] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30 Minutes');

  // Removed UPI settings per user request (now using Razorpay)

  return (
    <LibrarianLayout
      title="Settings"
      subtitle="Manage your library system preferences"
      searchPlaceholder="Search notifications..."
    >
      <div style={{ background: '#F9FAFB', padding: '24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ maxWidth: 1000, display: 'flex', gap: 24 }}>
            
            {/* Left Column - Settings Sections */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* General Settings */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '24px' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 4 }}>General Settings</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>Configure basic preferences for your library system.</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Language */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#DBEAFE', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Globe size={20} color="#2563EB" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Language</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Choose your preferred language</div>
                    </div>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      style={{ padding: '8px 32px 8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', width: 200 }}
                    >
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>

                  {/* Time Zone */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#DCFCE7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={20} color="#16A34A" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Time Zone</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Set the time zone for your library</div>
                    </div>
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      style={{ padding: '8px 32px 8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', width: 200 }}
                    >
                      <option>(GMT+05:30) Asia/Kolkata</option>
                      <option>(GMT-05:00) America/New_York</option>
                      <option>(GMT+00:00) UTC</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#EFF6FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Calendar size={20} color="#1A73E8" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Date Format</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Select the date format</div>
                    </div>
                    <select 
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      style={{ padding: '8px 32px 8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', width: 200 }}
                    >
                      <option>DD MMM YYYY (31 Dec 2024)</option>
                      <option>MM/DD/YYYY (12/31/2024)</option>
                      <option>YYYY-MM-DD (2024-12-31)</option>
                    </select>
                  </div>

                  {/* Theme */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#FEF3C7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sun size={20} color="#F59E0B" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Theme</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Choose your preferred theme</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setTheme('light')}
                        style={{
                          padding: '8px 16px',
                          border: theme === 'light' ? '2px solid #1A73E8' : '1px solid #E5E7EB',
                          borderRadius: 8,
                          background: 'white',
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#374151',
                          cursor: 'pointer',
                          fontFamily: 'Inter'
                        }}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        style={{
                          padding: '8px 16px',
                          border: theme === 'dark' ? '2px solid #1A73E8' : '1px solid #E5E7EB',
                          borderRadius: 8,
                          background: 'white',
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#374151',
                          cursor: 'pointer',
                          fontFamily: 'Inter'
                        }}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Preferences */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '24px' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 4 }}>System Preferences</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 24 }}>Configure system wide preferences and options.</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Auto Issue ID */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#EFF6FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={20} color="#1A73E8" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Auto Issue ID</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Automatically generate issue ID for new transactions</div>
                    </div>
                    <button
                      onClick={() => setAutoIssueID(!autoIssueID)}
                      style={{
                        width: 48,
                        height: 26,
                        borderRadius: 13,
                        background: autoIssueID ? '#1A73E8' : '#E5E7EB',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: 2,
                        left: autoIssueID ? 24 : 2,
                        transition: 'left 0.2s'
                      }} />
                    </button>
                  </div>

                  {/* Email Alerts */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#DCFCE7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bell size={20} color="#16A34A" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Email Alerts</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Send email notifications for requests, returns and reminders</div>
                    </div>
                    <button
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      style={{
                        width: 48,
                        height: 26,
                        borderRadius: 13,
                        background: emailAlerts ? '#1A73E8' : '#E5E7EB',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: 2,
                        left: emailAlerts ? 24 : 2,
                        transition: 'left 0.2s'
                      }} />
                    </button>
                  </div>

                  {/* Automatic Backup */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#DBEAFE', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CloudUpload size={20} color="#2563EB" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Automatic Backup</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Schedule automatic backup of your library data</div>
                    </div>
                    <button
                      onClick={() => setAutoBackup(!autoBackup)}
                      style={{
                        width: 48,
                        height: 26,
                        borderRadius: 13,
                        background: autoBackup ? '#1A73E8' : '#E5E7EB',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: 2,
                        left: autoBackup ? 24 : 2,
                        transition: 'left 0.2s'
                      }} />
                    </button>
                  </div>

                  {/* Session Timeout */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: '#FEF3C7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Timer size={20} color="#F59E0B" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 2 }}>Session Timeout</div>
                      <div style={{ fontSize: 12, color: '#6B7280' }}>Automatically log out inactive users</div>
                    </div>
                    <select 
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      style={{ padding: '8px 32px 8px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, color: '#374151', background: 'white', cursor: 'pointer', outline: 'none', fontFamily: 'Inter', width: 140 }}
                    >
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                      <option>2 Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Security */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '24px' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 4 }}>Security</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>Manage your account security.</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button 
                    type="button" 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      border: '1px solid #E5E7EB',
                      borderRadius: 8,
                      background: 'white',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, background: '#EFF6FF', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Lock size={16} color="#1A73E8" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Change Password</span>
                    </div>
                    <span style={{ fontSize: 18, color: '#9CA3AF' }}>›</span>
                  </button>

                  <button 
                    type="button" 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      border: '1px solid #E5E7EB',
                      borderRadius: 8,
                      background: 'white',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, background: '#DCFCE7', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Shield size={16} color="#16A34A" />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Two-Factor Authentication</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: 6 }}>On</span>
                        <span style={{ fontSize: 18, color: '#9CA3AF' }}>›</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 12, padding: '24px' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#DC2626', marginBottom: 4 }}>Danger Zone</div>
                <div style={{ fontSize: 13, color: '#991B1B', marginBottom: 20 }}>Irreversible and sensitive actions.</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button 
                    type="button" 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      border: '1px solid #FEE2E2',
                      borderRadius: 8,
                      background: 'white',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, background: '#FEE2E2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Trash2 size={16} color="#DC2626" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Clear Cache</span>
                    </div>
                    <span style={{ fontSize: 18, color: '#9CA3AF' }}>›</span>
                  </button>

                  <button 
                    type="button" 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      border: '1px solid #FEE2E2',
                      borderRadius: 8,
                      background: 'white',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, background: '#FEE2E2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <RefreshCcw size={16} color="#DC2626" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Reset All Settings</span>
                    </div>
                    <span style={{ fontSize: 18, color: '#9CA3AF' }}>›</span>
                  </button>
                </div>
              </div>

              {/* System Information */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, padding: '24px' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>System Information</div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Library System</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>LibraSys v2.4.0</span>
                  </div>
                  <div style={{ height: 1, background: '#F3F4F6' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Last Backup</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>May 16, 2026 02:30 AM</span>
                  </div>
                  <div style={{ height: 1, background: '#F3F4F6' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Total Books</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>12,458</span>
                  </div>
                  <div style={{ height: 1, background: '#F3F4F6' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Total Members</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>2,350</span>
                  </div>
                  <div style={{ height: 1, background: '#F3F4F6' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>System Status</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: 6 }}>All Systems Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', maxWidth: 1000 }}>
            <button 
              type="button" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 32px',
                border: 'none',
                borderRadius: 8,
                background: '#1A73E8',
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#5B4BC6'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1A73E8'}
            >
              <Check size={18} />
              Save Changes
            </button>
          </div>
        </div>
    </LibrarianLayout>
  );
}
