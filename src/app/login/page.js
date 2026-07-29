'use client';
import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  BookOpen, Eye, EyeOff, Loader2, AlertCircle,
  ShieldCheck, Landmark, Users, BarChart3, Mail, Lock,
  Quote, UserPlus
} from 'lucide-react';

const SCROLL_AND_THEME = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  html, body {
    background: #F8FAFC !important;
    color: #0F172A !important;
    min-height: 100vh;
  }
  .login-page {
    --bg: #F8FAFC;
    --surface: #FFFFFF;
    --text: #0F172A;
    --muted: #64748B;
    --border: #E2E8F0;
    --brand: #2563EB;
    color: #0F172A;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  .login-page * {
    box-sizing: border-box;
  }
  .login-input {
    width: 100%;
    height: 46px;
    border: 1px solid #E2E8F0;
    border-radius: 10px;
    background: #FFFFFF;
    color: #0F172A;
    font-size: 14px;
    padding: 0 14px 0 42px;
    outline: none;
    transition: all 0.2s;
  }
  .login-input::placeholder { color: #94A3B8; }
  .login-input:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .login-select {
    width: 100%;
    height: 46px;
    border: 1px solid #E2E8F0;
    border-radius: 10px;
    background: #FFFFFF;
    color: #0F172A;
    font-size: 14px;
    padding: 0 38px 0 42px;
    outline: none;
    cursor: pointer;
    appearance: none;
    transition: all 0.2s;
    font-weight: 500;
  }
  .login-select:focus {
    border-color: #2563EB;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .feature-badge:hover {
    transform: translateX(4px);
  }
`;

function BuildingIllustration() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <svg width="240" height="150" viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background clouds / bushes */}
        <path d="M40 135 C30 135 25 125 32 118 C35 110 48 110 52 118 C58 115 68 120 65 130 Z" fill="#E2E8F0" opacity="0.6" />
        <path d="M190 135 C180 135 175 125 182 118 C185 110 198 110 202 118 C208 115 218 120 215 130 Z" fill="#E2E8F0" opacity="0.6" />
        
        {/* Flag structure */}
        <line x1="120" y1="20" x2="120" y2="45" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M121 21 L142 28 L121 35 Z" fill="#2563EB" />

        {/* Main building body */}
        <rect x="60" y="65" width="120" height="70" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        
        {/* Left & Right wings */}
        <rect x="42" y="80" width="18" height="55" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="180" y="80" width="18" height="55" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />

        {/* Center pediment / roof */}
        <path d="M54 65 L120 38 L186 65 Z" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
        <rect x="52" y="63" width="136" height="5" rx="2" fill="#2563EB" />

        {/* Clock inside pediment */}
        <circle cx="120" cy="52" r="7" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="120" y1="52" x2="120" y2="48" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="120" y1="52" x2="123" y2="52" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />

        {/* Main door & pillars */}
        <rect x="106" y="100" width="28" height="35" rx="2" fill="#1E293B" />
        <rect x="109" y="103" width="10" height="32" fill="#3B82F6" opacity="0.3" />
        <rect x="121" y="103" width="10" height="32" fill="#3B82F6" opacity="0.3" />
        <rect x="94" y="96" width="6" height="39" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />
        <rect x="140" y="96" width="6" height="39" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1" />

        {/* Windows - Center body */}
        <rect x="72" y="78" width="14" height="16" rx="2" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
        <rect x="154" y="78" width="14" height="16" rx="2" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
        <rect x="72" y="104" width="14" height="16" rx="2" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />
        <rect x="154" y="104" width="14" height="16" rx="2" fill="#DBEAFE" stroke="#60A5FA" strokeWidth="1.2" />

        {/* Windows - Side wings */}
        <rect x="46" y="90" width="10" height="12" rx="1.5" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
        <rect x="46" y="110" width="10" height="12" rx="1.5" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
        <rect x="184" y="90" width="10" height="12" rx="1.5" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
        <rect x="184" y="110" width="10" height="12" rx="1.5" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />

        {/* Trees */}
        <path d="M26 135 C18 135 15 120 26 112 C37 120 34 135 26 135 Z" fill="#3B82F6" opacity="0.8" />
        <path d="M214 135 C206 135 203 120 214 112 C225 120 222 135 214 135 Z" fill="#3B82F6" opacity="0.8" />
        <rect x="25" y="130" width="2" height="5" fill="#1E293B" />
        <rect x="213" y="130" width="2" height="5" fill="#1E293B" />

        {/* Ground */}
        <line x1="15" y1="135" x2="225" y2="135" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(
    searchParams.get('error') === 'NotRegistered' ? 'This email is not registered. Please sign up first.' :
    searchParams.get('error') ? 'Invalid credentials. Please try again.' : ''
  );

  useEffect(() => {
    // Auto-redirect if user is already authenticated (e.g. returning from Google OAuth)
    const checkSession = async () => {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      if (session?.user) {
        if (session.user.role === 'librarian' || session.user.role === 'super_admin') {
          router.push('/librarian/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      }
    };
    checkSession();
  }, [router]);

  const set = (k) => (e) => {
    setError('');
    setForm(f => ({ ...f, [k]: e.target.value }));
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    await signIn('google'); // NextAuth handles the redirect to Google
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      const msg = result.error.includes('LIBRARIAN_NO_COLLEGE')
        ? 'Your librarian account is not linked to a college. Please contact your administrator.'
        : 'Invalid email or password. Please check your credentials and try again.';
      setError(msg);
      setLoading(false);
      return;
    }

        // Fetch session and redirect based on role stored in DB
        const res      = await fetch('/api/auth/session');
        const session  = await res.json();
        const userRole = session?.user?.role;

    if (userRole === 'librarian' || userRole === 'super_admin') {
      router.push('/librarian/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', justifyItems: 'space-between' }}>
      <style>{SCROLL_AND_THEME}</style>

      {/* ── TOP HEADER NAVBAR ────────────────────────────────────────────── */}
      <header style={{
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
      }}>
               <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img
            src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784449649/c7205191-78c8-486e-9996-7894591bf72b_szzaji.png"
            alt="Librix Logo"
            style={{
              height: 42,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              Librix
            </div>

            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginTop: 2 }}>
              Smart Library Management
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
            Don&apos;t have an account?
          </span>
          <Link href="/signup" style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: '#2563EB',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 6px rgba(37,99,235,0.25)',
            transition: 'all 0.15s',
          }}>
            <UserPlus size={14} /> Create Account
          </Link>
          <Link href="/register" style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#2563EB',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}>
            Register Institution
          </Link>
        </div>
      </header>

      {/* ── MAIN CONTAINER WRAPPER ───────────────────────────────────────── */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1100,
          background: '#FFFFFF',
          borderRadius: 24,
          border: '1px solid #E2E8F0',
          boxShadow: '0 12px 40px rgba(0,0,0,0.04)',
          display: 'grid',
          gridTemplateColumns: '1fr 1.08fr',
          overflow: 'hidden',
        }}>

          {/* ══════════ LEFT COLUMN — WELCOME BACK & ILLUSTRATION ══════════ */}
          <div style={{
            background: '#F8FAFC',
            borderRight: '1px solid #E2E8F0',
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ textAlign: 'center', marginBottom: 6 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Welcome <span style={{ color: '#2563EB' }}>Back!</span>
                </h1>
                <p style={{ fontSize: 14, color: '#64748B', marginTop: 8, fontWeight: 500 }}>
                  Login to continue managing your library efficiently.
                </p>
              </div>

              {/* Building Vector Illustration */}
              <BuildingIllustration />

              {/* Feature Badges List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Secure & Trusted',
                    desc: 'Multi-layer security to keep your institution data safe.'
                  },
                  {
                    icon: Landmark,
                    title: 'Institution Verified',
                    desc: 'Only verified institutions can access the platform.'
                  },
                  {
                    icon: Users,
                    title: 'Role Based Access',
                    desc: 'Different dashboards for Librarians, Teachers, and Students.'
                  },
                  {
                    icon: BarChart3,
                    title: 'Smart & Efficient',
                    desc: 'Powerful tools to manage your library in one place.'
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="feature-badge" style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      transition: 'transform 0.2s',
                    }}>
                      <div style={{
                        width: 44, height: 44,
                        borderRadius: 12,
                        background: '#EFF6FF',
                        border: '1px solid #DBEAFE',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#2563EB',
                        flexShrink: 0,
                      }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B', marginTop: 3, lineHeight: 1.4 }}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonial Quote Card */}
            <div style={{
              marginTop: 32,
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              padding: '20px 22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}>
              <div style={{ color: '#3B82F6', marginBottom: 8 }}>
                <Quote size={22} style={{ transform: 'rotate(180deg)' }} />
              </div>
              <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: '0 0 12px', fontWeight: 500 }}>
                Librix has transformed the way we manage our library. Everything is now smarter and faster.
              </p>
              <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
                {'⭐⭐⭐⭐⭐'.split('').map((s, i) => <span key={i} style={{ fontSize: 13 }}>{s}</span>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                <div style={{ width: 14, height: 2, background: '#2563EB', borderRadius: 2 }} />
                Aman Bhalla Group of Institutes
              </div>
            </div>
          </div>

          {/* ══════════ RIGHT COLUMN — LOGIN FORM CARD ══════════ */}
          <div style={{
            padding: '48px 46px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid #E2E8F0',
              padding: '36px 36px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.03)',
            }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Login to Your Account
                </h2>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 6, fontWeight: 500 }}>
                  Enter your credentials to access your dashboard.
                </p>
              </div>

              {/* Error Box */}
              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 13,
                  color: '#EF4444',
                  fontWeight: 500,
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email / Username */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                    Email ID / Username <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: 14, color: '#64748B', pointerEvents: 'none' }}>
                      <Mail size={17} />
                    </div>
                    <input
                      type="email"
                      className="login-input"
                      placeholder="Enter your email or username"
                      value={form.email}
                      onChange={set('email')}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* 3. Password */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                    Password <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', left: 14, color: '#64748B', pointerEvents: 'none' }}>
                      <Lock size={17} />
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="login-input"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={set('password')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                      }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* 4. Remember Me & Forgot Password */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 24,
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    fontSize: 13,
                    color: '#334155',
                    fontWeight: 600,
                    userSelect: 'none',
                  }}>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      style={{
                        width: 16, height: 16,
                        accentColor: '#2563EB',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    />
                    Remember me
                  </label>
                  <Link href="/forgot-password" style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#2563EB',
                    textDecoration: 'none',
                  }}>
                    Forgot Password?
                  </Link>
                </div>

                {/* 5. Submit Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 10,
                    background: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.8 : 1,
                  }}
                >
                  {loading ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Logging in…</>
                  ) : (
                    <><Lock size={16} /> Login</>
                  )}
                </button>
              </form>

              {/* OR Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                margin: '22px 0',
              }}>
                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700 }}>OR</span>
                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 10,
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  color: '#1E293B',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'background 0.15s',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Login with Google
              </button>

              {/* Account Creation Options Box */}
              <div style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: '1px dashed #E2E8F0',
                textAlign: 'center',
              }}>
              </div>
            </div>

            {/* Bottom Security Note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              marginTop: 22,
              fontSize: 12,
              color: '#64748B',
              fontWeight: 500,
            }}>
              <ShieldCheck size={15} color="#64748B" />
              <span>Your data is 100% secure and protected with industry-standard encryption.</span>
            </div>
          </div>

        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12,
        color: '#64748B',
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
      }}>
        <div>© 2025 Librix. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/privacy" style={{ color: '#64748B', textDecoration: 'none' }}>Privacy Policy</Link>
          <span>|</span>
          <Link href="/terms" style={{ color: '#64748B', textDecoration: 'none' }}>Terms of Service</Link>
          <span>|</span>
          <Link href="/help" style={{ color: '#64748B', textDecoration: 'none' }}>Help</Link>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{SCROLL_AND_THEME}</style>
        <div style={{ width: 34, height: 34, border: '3px solid #E2E8F0', borderTop: '3px solid #2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

