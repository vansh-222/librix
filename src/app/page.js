'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  BookOpen, Search, RotateCcw, DollarSign, Shield, Users,
  BarChart3, Bell, ChevronRight, Star, CheckCircle, Menu, X, ArrowRight
} from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Digital Library',
    desc: 'Complete book catalog with covers, metadata, and real-time inventory tracking per institution.',
    color: 'var(--brand)',
  },
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'Find any book instantly with full-text search, filters by category, author, availability and language.',
    color: '#22C55E',
  },
  {
    icon: RotateCcw,
    title: 'Automated Returns',
    desc: 'Streamlined borrow → return workflow with automated reminders and overdue tracking.',
    color: '#F59E0B',
  },
  {
    icon: DollarSign,
    title: 'Fine Management',
    desc: 'Configurable fine rates per college. Automatic calculation on overdue, damaged, or lost books.',
    color: '#EF4444',
  },
  {
    icon: Shield,
    title: 'Multi-Tenant',
    desc: 'Each college gets a fully isolated library. Zero data leakage between institutions.',
    color: '#8B5CF6',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    desc: 'Super Admin, Librarian, Student, and Teacher roles with tailored interfaces and permissions.',
    color: '#06B6D4',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    desc: 'Book usage, member activity, fine collection, and popular categories — all in one dashboard.',
    color: '#F97316',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Real-time in-app + email alerts for requests, returns, fines, and reservation queues.',
    color: '#EC4899',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['Up to 500 books', '50 students', 'Basic reports', 'Email support'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: '₹2,499',
    period: '/month',
    features: ['Up to 5,000 books', '500 students & teachers', 'Full analytics', 'Priority support', 'Email notifications'],
    cta: 'Start Basic',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '₹7,999',
    period: '/month',
    features: ['Unlimited books', 'Unlimited members', 'Advanced analytics', '24/7 support', 'Custom branding', 'API access'],
    cta: 'Go Premium',
    highlighted: false,
  },
];

const TESTIMONIALS = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Head Librarian, Apex College of Engineering',
    text: 'Librarium transformed our manual, paper-based system into a fully digital operation in less than a week. Our students love it.',
    stars: 5,
  },
  {
    name: 'Ravi Menon',
    role: 'Dean of Students, GlobalTech University',
    text: 'The multi-tenant isolation gives us complete peace of mind. Our data stays ours. The reservation queue feature alone saved us countless headaches.',
    stars: 5,
  },
  {
    name: 'Anjali Patel',
    role: 'Librarian, City Commerce College',
    text: 'Fine tracking used to take days. Now it\'s instant and automatic. The reports page is incredibly useful for our monthly review meetings.',
    stars: 5,
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(15,17,23,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(42,45,58,0.6)',
        padding: '0 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Librar<span style={{ color: 'var(--brand)' }}>ium</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {['Features', 'Pricing', 'About'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted)'}
            >{item}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'none' }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 20, padding: '6px 16px', marginBottom: 32,
          fontSize: 13, fontWeight: 600, color: '#818CF8',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
          SaaS Library Management Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 7vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 24,
          maxWidth: 800,
        }}>
          Smart Library Management
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            for Modern Institutions
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: 'var(--muted)',
          maxWidth: 600, lineHeight: 1.7, marginBottom: 48,
        }}>
          Librarium is a multi-tenant platform that gives every college its own
          fully isolated digital library — with books, members, borrowing, fines,
          and analytics all in one place.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/register" className="btn btn-primary btn-lg" style={{ gap: 10 }}>
            Register Your College
            <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            Sign In to Library
          </Link>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 64, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--bg)',
                  background: `hsl(${240 + i * 30}, 70%, 60%)`,
                  marginLeft: i > 1 ? -10 : 0,
                }} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--text)' }}>500+</strong> libraries managed
            </span>
          </div>
          <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
            <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 4 }}>4.9 / 5 rating</span>
          </div>
        </div>

        {/* Dashboard preview */}
        <div style={{
          marginTop: 80, width: '100%', maxWidth: 900,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 16, padding: 24, boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.6s ease',
        }}>
          {/* Mock dashboard header */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22C55E' }} />
            <div style={{ flex: 1, height: 20, background: 'var(--surface-2)', borderRadius: 4, marginLeft: 8 }} />
          </div>
          {/* Mock stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Total Books', value: '2,847', color: '#6366F1' },
              { label: 'Issued', value: '342', color: '#F59E0B' },
              { label: 'Available', value: '2,505', color: '#22C55E' },
              { label: 'Overdue', value: '12', color: '#EF4444' },
            ].map((s) => (
              <div key={s.label} style={{
                background: 'var(--surface-2)', borderRadius: 8, padding: '12px 14px',
                border: `1px solid ${s.color}22`,
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {/* Mock table */}
          <div style={{ background: 'var(--surface-2)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16 }}>
              {['Book Title', 'Author', 'Status', 'Due Date'].map(h => (
                <div key={h} style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
              ))}
            </div>
            {[
              { title: 'Atomic Habits', author: 'James Clear', status: 'Issued', statusColor: '#F59E0B', due: '20 Jun' },
              { title: 'Clean Code', author: 'Robert Martin', status: 'Available', statusColor: '#22C55E', due: '—' },
              { title: 'The Lean Startup', author: 'Eric Ries', status: 'Overdue', statusColor: '#EF4444', due: '10 Jun' },
            ].map((row, i) => (
              <div key={i} style={{
                padding: '10px 16px',
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16,
                borderTop: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{row.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{row.author}</div>
                <div><span style={{
                  background: `${row.statusColor}22`, color: row.statusColor,
                  padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                }}>{row.status}</span></div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{row.due}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '100px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-brand" style={{ marginBottom: 16, fontSize: 12 }}>Features</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Everything a modern library needs
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 560, margin: '0 auto' }}>
            Built for real libraries, designed for real people. Every feature you need, nothing you don't.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card" style={{ cursor: 'default' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <f.icon size={20} color={f.color} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 48px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-success" style={{ marginBottom: 16 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Live in 3 simple steps
          </h2>
        </div>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { step: '01', title: 'Register Your College', desc: 'Fill out the registration form. Super Admin reviews and approves your institution in minutes.' },
            { step: '02', title: 'Set Up Library', desc: 'Librarian adds books via Google Books API, sets inventory, and creates member accounts.' },
            { step: '03', title: 'Students Go Digital', desc: 'Students browse, request, and track borrowed books — all from their personal dashboard.' },
          ].map((s) => (
            <div key={s.step} style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: '#fff',
              }}>{s.step}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-warning" style={{ marginBottom: 16 }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Simple, transparent pricing
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>Start free. Upgrade as you grow.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{
              background: plan.highlighted ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))' : 'var(--surface)',
              border: plan.highlighted ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--border)',
              borderRadius: 16, padding: '32px 28px',
              position: 'relative', overflow: 'hidden',
              boxShadow: plan.highlighted ? '0 0 40px rgba(99,102,241,0.15)' : 'none',
            }}>
              {plan.highlighted && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  padding: '4px 12px', borderRadius: 20,
                }}>POPULAR</div>
              )}
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--muted)', marginBottom: 8 }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em' }}>{plan.price}</span>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, fontSize: 14 }}>
                    <CheckCircle size={15} color="#22C55E" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', justifyContent: 'center' }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 48px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-purple" style={{ marginBottom: 16 }}>Testimonials</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Trusted by librarians across India
          </h2>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card">
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 48px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 700, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 24, padding: '64px 48px',
          boxShadow: '0 0 60px rgba(99,102,241,0.1)',
        }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Ready to modernize your library?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 40, lineHeight: 1.7 }}>
            Join hundreds of institutions already running their libraries on Librarium. 
            Free to start, easy to scale.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Register Your College <ChevronRight size={18} />
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">Login</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '40px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={15} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Librarium</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>
          © {new Date().getFullYear()} Librarium. Smart library management for modern institutions.
        </p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href="#" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
