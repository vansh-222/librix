'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Star, Play, CheckCircle2, BarChart2, Users, Clock, ShieldCheck, Sparkles, Layers, Zap } from 'lucide-react';

const BLUE = '#1A73E8';
const DARK = '#052033';

export default function PlatformPage() {
  const NAV = ['Home', 'Platform', 'AI Features', 'Institutions'];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#FFFFFF', color: '#0F172A', overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: auto !important; overflow: visible !important; min-height: 100vh; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; }
        .nl:hover { color: #1A73E8 !important; }
        .feature-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .feature-card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* NAVBAR (Exact same as LandingPage) */}
      <div style={{ position: 'sticky', top: 16, zIndex: 100, padding: '0 27px' }}>
        <nav style={{ maxWidth: 1386, margin: '0 auto', background: 'white', boxShadow: '0px 4px 25.3px rgba(26,115,232,0.23)', borderRadius: 40, border: '1px solid #D9D9D9', padding: '0 40px', height: 71, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784448482/e2d37f27-b9e1-484c-a59b-79e086b1aec2_rah6h8.png" alt="Librix Logo" style={{ height: 50, width: 'auto', objectFit: 'contain', transform: 'scale(1.3)' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
            {NAV.map(l => (
              <Link
                key={l}
                href={l === 'Platform' ? '/platform' : l === 'Home' ? '/' : `/#${l.toLowerCase().replace(' ', '-')}`}
                className="nl"
                style={{ color: l === 'Platform' ? BLUE : 'black', fontSize: 16, fontFamily: 'Inter', fontWeight: l === 'Platform' ? 600 : 400, transition: 'color 0.2s' }}
              >
                {l}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/register" style={{ padding: '7px 28px', borderRadius: 38, border: '1px solid rgba(5,32,51,0.42)', color: DARK, fontSize: 16, fontFamily: 'Inter', fontWeight: 400 }}>Register College</Link>
            <Link href="/login" style={{ padding: '7px 24px', borderRadius: 38, background: BLUE, color: 'white', fontSize: 16, fontFamily: 'Inter', fontWeight: 500 }}>Login</Link>
          </div>
        </nav>
      </div>

      {/* HERO SECTION WITH MULTI-COLOR AURA BACKDROP */}
      <section style={{ position: 'relative', padding: '70px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Subtle Pastel Glow Backdrop */}
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          width: '90%', maxWidth: 1400, height: 750,
          background: 'radial-gradient(circle at 30% 35%, rgba(254, 215, 170, 0.55) 0%, transparent 45%), radial-gradient(circle at 70% 35%, rgba(186, 230, 253, 0.55) 0%, transparent 45%), radial-gradient(circle at 50% 65%, rgba(187, 247, 208, 0.45) 0%, transparent 55%)',
          filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}>
          {/* Pill Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)',
            border: '1px solid #E2E8F0', borderRadius: 30, padding: '5px 16px 5px 6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)', marginBottom: 28
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1781960954/clients_ki_profile_pics_de_202606120001_2_dalgmu.png" alt="User" style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid white', objectFit: 'cover' }} />
              <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png" alt="User" style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid white', marginLeft: -10, objectFit: 'cover' }} />
              <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1781966397/7dc2c9ce9f7e759580caf98f5b105fd21d5d57f4_t1sghw.png" alt="User" style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid white', marginLeft: -10, objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>1,200+ Libraries Transformed</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 62, fontWeight: 800, fontFamily: 'Inter', letterSpacing: '-0.03em', lineHeight: 1.12, color: '#0F172A', marginBottom: 26 }}>
            Elevate your Library,<br />
            Operations and Success.
          </h1>

          {/* Subtitle (Optional brief touch) */}
          <p style={{ fontSize: 18, color: '#64748B', maxWidth: 620, margin: '0 auto 32px', lineHeight: 1.6 }}>
            The all-in-one smart platform designed to automate circulation, track assets, and connect campuses seamlessly.
          </p>

          {/* CTA Button */}
          <div style={{ marginBottom: 54 }}>
            <Link href="/register" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: '#18181B', color: 'white', padding: '15px 34px',
              borderRadius: 12, fontSize: 16, fontWeight: 600,
              boxShadow: '0 8px 24px rgba(24, 24, 27, 0.25)', transition: 'background 0.2s'
            }}>
              Schedule a demo
            </Link>
          </div>
        </div>

        {/* Big Center Mockup Image */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1140, margin: '0 auto' }}>
          <div style={{
            background: '#FFFFFF', borderRadius: 24, padding: 12,
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.12)', border: '1px solid rgba(226, 232, 240, 0.8)',
            overflow: 'hidden'
          }}>
            <img
              src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784617028/14d18450-1565-4045-b65b-4a3f94d8965f_kr8fct.png"
              alt="Librix Platform Dashboard"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }}
            />
          </div>
        </div>

        {/* 3 Horizontal Feature Pills / Cards Row */}
        <div style={{
          position: 'relative', zIndex: 3, maxWidth: 1140, margin: '28px auto 0',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20
        }}>
          {[
            {
              icon: <Layers size={22} color="#EA580C" />,
              bg: '#FFEDD5',
              title: 'Multi-task',
              desc: "The world's leading smart library workflow that automates everything from cataloging to student inquiries."
            },
            {
              icon: <Zap size={22} color="#2563EB" />,
              bg: '#DBEAFE',
              title: 'Effective',
              desc: 'Drives up circulation speed with 95% automated barcode issue/return and self-service verifications.'
            },
            {
              icon: <ShieldCheck size={22} color="#0D9488" />,
              bg: '#CCFBF1',
              title: 'Powerful',
              desc: 'Handles the most complex university collections with centralized multi-branch digital governance.'
            }
          ].map((item, i) => (
            <div key={i} className="feature-card-hover" style={{
              background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0',
              padding: '22px 24px', display: 'flex', alignItems: 'flex-start', gap: 16,
              textAlign: 'left', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KEEP EVERYTHING IN ONE PLACE SECTION */}
      <section style={{ padding: '90px 24px', background: '#FAFAFA', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          {/* Section Pill */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{
              display: 'inline-block', padding: '6px 18px', borderRadius: 20,
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              fontSize: 13, fontWeight: 600, color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              Features
            </span>
          </div>

          <h2 style={{ fontSize: 44, fontWeight: 800, textAlign: 'center', color: '#0F172A', marginBottom: 12, letterSpacing: '-0.02em' }}>
            Keep everything in one place
          </h2>
          <p style={{ fontSize: 16, color: '#64748B', textAlign: 'center', maxWidth: 560, margin: '0 auto 56px', lineHeight: 1.6 }}>
            Forget complex legacy software. Manage books, members, circulation, and institutional reports in one unified dashboard.
          </p>

          {/* 2 Big Feature Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 32 }}>
            {/* Left Card */}
            <div className="feature-card-hover" style={{
              background: '#FFFFFF', borderRadius: 24, border: '1px solid #E2E8F0',
              padding: '40px 36px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              {/* Mockup Graphic Box */}
              <div style={{ background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', padding: 24, marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Active Circulation Queue</div>
                  <span style={{ fontSize: 11, background: '#DBEAFE', color: BLUE, padding: '3px 10px', borderRadius: 12, fontWeight: 600 }}>Live Updates</span>
                </div>
                {[
                  { name: 'Dr. Robert Miller', book: 'Advanced Quantum Mechanics', status: 'Issued Today', color: '#10B981' },
                  { name: 'Elena Rostova', book: 'The Structure of Scientific Revolutions', status: 'Due Tomorrow', color: '#F59E0B' },
                  { name: 'Marcus Vance', book: 'Artificial Intelligence: A Modern Approach', status: 'Reserved', color: BLUE }
                ].map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'white', borderRadius: 10, border: '1px solid #F1F5F9', marginBottom: idx < 2 ? 10 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: idx === 0 ? '#FEF3C7' : idx === 1 ? '#E0E7FF' : '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#334155' }}>
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{m.book}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: m.color }}>{m.status}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>Seamless Circulation & Collaboration</h3>
                <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6 }}>
                  Work together with your library staff effortlessly, track availability instantly across campus departments, and automate overdue notices without manual intervention.
                </p>
              </div>
            </div>

            {/* Right Card */}
            <div className="feature-card-hover" style={{
              background: '#FFFFFF', borderRadius: 24, border: '1px solid #E2E8F0',
              padding: '40px 36px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}>
              {/* Mockup Graphic Box */}
              <div style={{ background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', padding: 24, marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Weekly Circulation Volume</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>Peak campus activity breakdown</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>88.4%</span>
                    <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>↑ +14%</span>
                  </div>
                </div>
                {/* Visual Bar Chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, padding: '0 10px' }}>
                  {[
                    { day: 'Mon', h: 65, c: '#93C5FD' },
                    { day: 'Tue', h: 85, c: BLUE },
                    { day: 'Wed', h: 50, c: '#93C5FD' },
                    { day: 'Thu', h: 95, c: BLUE },
                    { day: 'Fri', h: 75, c: '#93C5FD' },
                    { day: 'Sat', h: 40, c: '#CBD5E1' },
                    { day: 'Sun', h: 30, c: '#CBD5E1' }
                  ].map((b, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: b.h, background: b.c, borderRadius: 6, transition: 'height 0.3s' }} />
                      <span style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{b.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>Time & Analytics Management Tools</h3>
                <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6 }}>
                  Optimize resource allocations with integrated tools like real-time utilization charts, digital audit trails, automated fine reports, and customized export schedules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section style={{ padding: '90px 24px 110px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          {/* Section Pill */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{
              display: 'inline-block', padding: '6px 18px', borderRadius: 20,
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              fontSize: 13, fontWeight: 600, color: '#475569', boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              Testimonials
            </span>
          </div>

          <h2 style={{ fontSize: 44, fontWeight: 800, textAlign: 'center', color: '#0F172A', marginBottom: 56, letterSpacing: '-0.02em' }}>
            People just like you<br />are already using Librix
          </h2>

          {/* Testimonials Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
            {[
              {
                quote: "This library management system has completely transformed how our campus library operates. We track thousands of volumes across 4 branches effortlessly.",
                name: "John D.",
                role: "Head Librarian, State University",
                avatar: "https://res.cloudinary.com/dadiutcqh/image/upload/v1781960954/clients_ki_profile_pics_de_202606120001_2_dalgmu.png"
              },
              {
                quote: "An essential tool for any institution looking to digitize their collections. The automated student self-checkout and barcode verification saved us hundreds of hours.",
                name: "Sarah W.",
                role: "Campus IT Director",
                avatar: "https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png"
              },
              {
                quote: "The built-in analytics give me a complete overview of daily student footfall, popular titles, and overdue returns with just one click.",
                name: "Sam J.",
                role: "Academic Resource Coordinator",
                avatar: "https://res.cloudinary.com/dadiutcqh/image/upload/v1781966397/7dc2c9ce9f7e759580caf98f5b105fd21d5d57f4_t1sghw.png"
              },
              {
                quote: "I love how easy it is to issue and return books with barcode scanning. The platform interface makes daily desk duties feel effortless.",
                name: "Daniela T.",
                role: "Operations & Circulation Manager",
                avatar: "https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png"
              },
              {
                quote: "The automated fine tracking and digital WhatsApp notifications have dramatically improved our on-time book return rates across all departments.",
                name: "Alex M.",
                role: "Chief Library Officer",
                avatar: "https://res.cloudinary.com/dadiutcqh/image/upload/v1781966543/1b5dd1dc0ba2203d7616047bc3e67e2539ab5ebd_hoyhdt.png"
              }
            ].map((t, i) => (
              <div key={i} className="feature-card-hover" style={{
                background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0',
                padding: '28px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: '0 6px 20px rgba(0,0,0,0.03)'
              }}>
                <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.6, marginBottom: 24 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '1px solid #E2E8F0' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Video Review Card (matches exact design of bottom right card) */}
            <div className="feature-card-hover" style={{
              borderRadius: 20, overflow: 'hidden', position: 'relative',
              minHeight: 240, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
              padding: 20, boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
              background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 60%, transparent 100%), url(https://res.cloudinary.com/dadiutcqh/image/upload/v1781967270/587a99a4b332f8a653f7020f2f5b4655e03686ef_niq00b.png) center/cover no-repeat'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)'
              }} />

              {/* Watch Video Review Badge */}
              <div style={{
                position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(8px)',
                padding: '8px 16px', borderRadius: 30, boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Watch video review</span>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={12} fill="white" color="white" style={{ marginLeft: 2 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER (Exact same as LandingPage) */}
      <footer style={{ background: DARK }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '60px 70px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784448482/e2d37f27-b9e1-484c-a59b-79e086b1aec2_rah6h8.png" alt="Librix Logo" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
              </div>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 400, fontFamily: 'Inter', lineHeight: 1.6, marginBottom: 12 }}>Empowering smarter libraries worldwide</p>
              <p style={{ color: 'white', fontSize: 16, fontWeight: 400, fontFamily: 'Inter' }}>Info@librix.app</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Solutions', 'Pricing'] },
              { title: 'Platform', links: ['Student Portal', 'Librarian Dashboard', 'Book Management'] },
              { title: 'Resources', links: ['Help Center', 'FAQs', 'Contact Support'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Privacy Policy', 'Terms & Conditions'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 20, background: BLUE, borderRadius: 11 }} />
                  <div style={{ color: 'white', fontSize: 20, fontWeight: 500, fontFamily: 'Inter' }}>{col.title}</div>
                </div>
                {col.links.map(l => (
                  <div key={l} style={{ color: 'rgba(255,255,255,0.53)', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', marginBottom: 12, cursor: 'pointer' }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#0B1B2D', padding: '18px 24px', textAlign: 'center' }}>
          <div style={{ color: 'white', fontSize: 12, fontWeight: 500, fontFamily: 'Inter' }}>© 2026 Librix. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
