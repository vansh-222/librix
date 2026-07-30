'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/shared/Footer';
import { BookOpen, Star, Play, CheckCircle2, BarChart2, Users, Clock, ShieldCheck, Sparkles, Layers, Zap, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTypewriterPlaceholder } from '@/hooks/useTypewriterPlaceholder';

const BLUE = '#1A73E8';
const DARK = '#052033';

export default function PlatformPage() {
  const NAV = ['Home', 'Platform', 'AI Features', 'Institutions'];
  const searchPlaceholder = useTypewriterPlaceholder("Search library resources...|Search research papers...|Find digital archives...", 50, 20, 2500);

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
        /* Planet orbit animations — transform: rotate(θ) translateX(r) traces a full circle */
        @keyframes orbitInner {
          from { transform: rotate(0deg)    translateX(180px); }
          to   { transform: rotate(360deg)  translateX(180px); }
        }
        @keyframes orbitMidCCW {
          from { transform: rotate(0deg)   translateX(280px); }
          to   { transform: rotate(-360deg) translateX(280px); }
        }
        @keyframes orbitOuter {
          from { transform: rotate(0deg)   translateX(380px); }
          to   { transform: rotate(360deg) translateX(380px); }
        }
        @keyframes orbitExtraCCW {
          from { transform: rotate(0deg)   translateX(460px); }
          to   { transform: rotate(-360deg) translateX(460px); }
        }
        /* Faint orbit ring guides */
        .orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(99,102,241,0.12);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
      `}</style>

      {/* NAVBAR (Exact same as LandingPage) */}
      <div style={{ position: 'sticky', top: 16, zIndex: 100, padding: '0 27px' }}>
        <nav style={{ maxWidth: 1386, margin: '0 auto', background: 'white', boxShadow: '0px 4px 25.3px rgba(26,115,232,0.23)', borderRadius: 40, border: '1px solid #D9D9D9', padding: '0 40px', height: 71, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784448482/e2d37f27-b9e1-484c-a59b-79e086b1aec2_rah6h8.png" alt="Librix Logo" style={{ height: 50, width: 'auto', objectFit: 'contain', transform: 'scale(1.3)' }} />
           
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
            {NAV.map(l => (
              <Link
                key={l}
                href={l === 'Platform' ? '/platform' : l === 'AI Features' ? '/ai-features' : l === 'Institutions' ? '/institutions' : '/'}
                className="nl"
                style={{ color: l === 'Platform' ? BLUE : 'black', fontSize: 16, fontFamily: 'Inter', fontWeight: l === 'Platform' ? 600 : 400, transition: 'color 0.2s', borderBottom: l === 'Platform' ? `2px solid ${BLUE}` : 'none', paddingBottom: l === 'Platform' ? 2 : 0 }}
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

      {/* HERO SECTION */}
      <section style={{ position: 'relative', paddingTop: 120, paddingBottom: 120, textAlign: 'center', overflow: 'hidden', background: '#FAFAFF', minHeight: 600 }}>

        {/* Subtle Concentric Rings Background */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '200%', height: '200%',
          background: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 60px, rgba(99, 102, 241, 0.03) 60px, rgba(99, 102, 241, 0.03) 62px)',
          zIndex: 0, pointerEvents: 'none'
        }} />

        {/* ── Faint orbit guide rings (centered at 48%) ── */}
        <div className="orbit-ring" style={{ width: 360,  height: 360,  top: '48%', left: '50%' }} />
        <div className="orbit-ring" style={{ width: 560,  height: 560,  top: '48%', left: '50%' }} />
        <div className="orbit-ring" style={{ width: 760,  height: 760,  top: '48%', left: '50%' }} />
        <div className="orbit-ring" style={{ width: 920,  height: 920,  top: '48%', left: '50%' }} />

        {/* ══ INNER ORBIT — 180px · 5 books · CW · 18s ══ */}
        {[
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png',  delay: '0s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966543/1b5dd1dc0ba2203d7616047bc3e67e2539ab5ebd_hoyhdt.png', delay: '-3.6s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967246/a42412d3df3d12e6577cdb6a1418f0bde16fbdbe_fchgpo.png', delay: '-7.2s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967232/1ff261e52c8f2819a952d58c6e6bdc2974989328_dqwk84.png', delay: '-10.8s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967243/54a30c3a4505cafd2a8b753e026b73f80e8d97a3_kzzqey.png', delay: '-14.4s' },
        ].map((b, i) => (
          <img key={'in'+i} src={b.src} alt="book" style={{
            position: 'absolute', top: 'calc(48% - 24px)', left: 'calc(50% - 17px)',
            width: 34, height: 48, borderRadius: 6, objectFit: 'cover',
            boxShadow: '0 6px 20px rgba(0,0,0,0.22)', border: '2px solid white',
            zIndex: 1, animation: 'orbitInner 18s linear infinite', animationDelay: b.delay,
          }} />
        ))}

        {/* ══ MIDDLE ORBIT — 280px · 6 books · CCW · 28s ══ */}
        {[
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png',  delay: '0s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967270/587a99a4b332f8a653f7020f2f5b4655e03686ef_niq00b.png', delay: '-4.67s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967231/d69f6a3ad8778bdbf4149b18c012db676eff844f_sb5dq8.png',  delay: '-9.33s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966564/e31e8b25a45e30befb5e8134306d7302e20e480f_pljnqm.png', delay: '-14s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png',  delay: '-18.67s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967246/a42412d3df3d12e6577cdb6a1418f0bde16fbdbe_fchgpo.png', delay: '-23.33s' },
        ].map((b, i) => (
          <img key={'mid'+i} src={b.src} alt="book" style={{
            position: 'absolute', top: 'calc(48% - 27px)', left: 'calc(50% - 19px)',
            width: 38, height: 54, borderRadius: 6, objectFit: 'cover',
            boxShadow: '0 8px 24px rgba(0,0,0,0.20)', border: '2px solid white',
            zIndex: 1, animation: 'orbitMidCCW 28s linear infinite', animationDelay: b.delay,
          }} />
        ))}

        {/* ══ OUTER ORBIT — 380px · 7 books · CW · 38s ══ */}
        {[
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967232/1ff261e52c8f2819a952d58c6e6bdc2974989328_dqwk84.png', delay: '0s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967243/54a30c3a4505cafd2a8b753e026b73f80e8d97a3_kzzqey.png', delay: '-5.43s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967233/78cfcffed942089c708d535593091ab017a1bec8_l5uqod.png', delay: '-10.86s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png', delay: '-16.29s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967270/587a99a4b332f8a653f7020f2f5b4655e03686ef_niq00b.png', delay: '-21.71s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967231/d69f6a3ad8778bdbf4149b18c012db676eff844f_sb5dq8.png', delay: '-27.14s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966564/e31e8b25a45e30befb5e8134306d7302e20e480f_pljnqm.png', delay: '-32.57s' },
        ].map((b, i) => (
          <img key={'out'+i} src={b.src} alt="book" style={{
            position: 'absolute', top: 'calc(48% - 28px)', left: 'calc(50% - 20px)',
            width: 40, height: 56, borderRadius: 6, objectFit: 'cover',
            boxShadow: '0 10px 28px rgba(0,0,0,0.18)', border: '2px solid white',
            zIndex: 1, animation: 'orbitOuter 38s linear infinite', animationDelay: b.delay,
          }} />
        ))}

        {/* ══ EXTRA ORBIT — 460px · 6 books · CCW · 46s ══ */}
        {[
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966543/1b5dd1dc0ba2203d7616047bc3e67e2539ab5ebd_hoyhdt.png', delay: '0s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967246/a42412d3df3d12e6577cdb6a1418f0bde16fbdbe_fchgpo.png', delay: '-7.67s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967232/1ff261e52c8f2819a952d58c6e6bdc2974989328_dqwk84.png', delay: '-15.33s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png', delay: '-23s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967243/54a30c3a4505cafd2a8b753e026b73f80e8d97a3_kzzqey.png', delay: '-30.67s' },
          { src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png', delay: '-38.33s' },
        ].map((b, i) => (
          <img key={'ext'+i} src={b.src} alt="book" style={{
            position: 'absolute', top: 'calc(48% - 26px)', left: 'calc(50% - 18px)',
            width: 36, height: 52, borderRadius: 6, objectFit: 'cover',
            boxShadow: '0 8px 22px rgba(0,0,0,0.16)', border: '2px solid white',
            zIndex: 1, animation: 'orbitExtraCCW 46s linear infinite', animationDelay: b.delay,
          }} />
        ))}

        {/* Main Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* Top Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(99, 102, 241, 0.06)',
            border: '1px solid rgba(99, 102, 241, 0.15)', borderRadius: 40, padding: '5px 14px',
            marginBottom: 20
          }}>
            <Users size={13} color="#1557B0" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1557B0', letterSpacing: '0.01em' }}>Trusted by 1,200+ Libraries Worldwide</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 54, fontWeight: 900, fontFamily: 'Inter', letterSpacing: '-0.03em', lineHeight: 1.15, color: '#0F172A', marginBottom: 20, textShadow: '0 10px 40px rgba(26,115,232,0.1)' }}>
            All-in-one platform to manage your <span style={{ color: '#1A73E8' }}>Librix</span> library
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 16, color: '#64748B', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6, fontWeight: 400 }}>
            One secure platform for collections, resources &amp; student engagement.
          </p>

          {/* Search Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', width: '100%', maxWidth: 680, margin: '0 auto 0px',
            background: 'white', padding: '8px 8px 8px 24px', borderRadius: 999,
            border: '1px solid rgba(226, 232, 240, 0.8)', boxShadow: '0 12px 35px rgba(0,0,0,0.05)'
          }}>
            <Search size={22} color="#64748B" style={{ flexShrink: 0, marginRight: 12 }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, color: '#0F172A', background: 'transparent', minWidth: 0 }}
            />
            <button style={{
              background: '#1A73E8', color: 'white', padding: '12px 28px', borderRadius: 999,
              fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', transition: 'background 0.2s'
            }}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* DASHBOARD IMAGE SECTION — appears on scroll */}
      <section style={{ background: '#FFFFFF', paddingTop: 60, paddingBottom: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          {/* White Card wrapping the image */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px 24px 0 0',
            padding: '20px 20px 0',
            boxShadow: '0 -4px 60px rgba(99, 102, 241, 0.08), 0 30px 80px rgba(0,0,0,0.10)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            borderBottom: 'none',
            overflow: 'hidden'
          }}>
            <img
              src="/dashboard-preview.png"
              alt="Librix Platform Dashboard"
              style={{ width: '100%', height: 'auto', maxHeight: 480, objectFit: 'cover', objectPosition: 'top', display: 'block', borderRadius: '12px 12px 0 0' }}
            />
          </div>
        </div>
      </section>

      {/* WHITE FILL — continues behind feature cards */}
      <section style={{ background: '#FFFFFF', paddingTop: 0, paddingBottom: 0 }}>
        {/* 3 Horizontal Feature Cards Row */}
        <div style={{
          position: 'relative', zIndex: 3, maxWidth: 1200, margin: '0 auto', padding: '28px 32px 60px',
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
      <section style={{ padding: '40px 24px 70px', background: '#FAFAFA', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>

          <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Keep everything in one place
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', textAlign: 'center', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.55 }}>
            Manage books, members, circulation, and institutional reports in one unified dashboard.
          </p>

          {/* 2 Side-by-side Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* Left Card — Circulation Queue */}
            <div className="feature-card-hover" style={{
              background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0',
              padding: '24px 24px', boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18
            }}>
              {/* Mini mockup */}
              <div style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Active Circulation Queue</div>
                  <span style={{ fontSize: 10, background: '#DBEAFE', color: BLUE, padding: '2px 9px', borderRadius: 10, fontWeight: 600 }}>Live</span>
                </div>
                {[
                  { name: 'Dr. Robert Miller',  book: 'Advanced Quantum Mechanics',              status: 'Issued Today',  color: '#10B981' },
                  { name: 'Elena Rostova',       book: 'The Structure of Scientific Revolutions', status: 'Due Tomorrow', color: '#F59E0B' },
                  { name: 'Marcus Vance',        book: 'Artificial Intelligence: A Modern Approach', status: 'Reserved', color: BLUE },
                ].map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'white', borderRadius: 8, border: '1px solid #F1F5F9', marginBottom: idx < 2 ? 7 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: idx === 0 ? '#FEF3C7' : idx === 1 ? '#E0E7FF' : '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#334155' }}>
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{m.name}</div>
                        <div style={{ fontSize: 10, color: '#94A3B8' }}>{m.book}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: m.color }}>{m.status}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 5 }}>Seamless Circulation &amp; Collaboration</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.55 }}>
                  Track availability across campus departments and automate overdue notices without manual intervention.
                </p>
              </div>
            </div>

            {/* Right Card — Analytics */}
            <div className="feature-card-hover" style={{
              background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0',
              padding: '24px 24px', boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 18
            }}>
              {/* Mini bar chart mockup */}
              <div style={{ background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0', padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>Weekly Circulation Volume</div>
                    <div style={{ fontSize: 10, color: '#64748B' }}>Peak campus activity breakdown</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>88.4%</span>
                    <span style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>↑ +14%</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1, minHeight: 80, padding: '0 4px' }}>
                  {[
                    { day: 'Mon', h: 52, c: '#93C5FD' },
                    { day: 'Tue', h: 68, c: BLUE },
                    { day: 'Wed', h: 40, c: '#93C5FD' },
                    { day: 'Thu', h: 76, c: BLUE },
                    { day: 'Fri', h: 60, c: '#93C5FD' },
                    { day: 'Sat', h: 32, c: '#CBD5E1' },
                    { day: 'Sun', h: 24, c: '#CBD5E1' }
                  ].map((b, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 22, height: b.h, background: b.c, borderRadius: 5 }} />
                      <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{b.day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 5 }}>Time &amp; Analytics Management Tools</h3>
                <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.55 }}>
                  Real-time utilization charts, digital audit trails, automated fine reports, and customized export schedules.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section style={{ padding: '50px 24px 50px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 50 }}>
            <h2 style={{ fontSize: 44, fontWeight: 800, textAlign: 'left', color: '#0F172A', letterSpacing: '-0.02em', lineHeight:"1.3em", margin: 0 }}>
              People just like you<br />are already using <span style={{ color: '#1A73E8' }}>Librix</span>
            </h2>
            <div style={{ display: 'flex', gap: 12, paddingBottom: 10 }}>
              <button style={{ width: 48, height: 48, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <ChevronLeft size={24} color="#94A3B8" />
              </button>
              <button style={{ width: 48, height: 48, borderRadius: '50%', background: '#1A73E8', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(26,115,232,0.25)' }}>
                <ChevronRight size={24} color="#FFFFFF" />
              </button>
            </div>
          </div>

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

          {/* Scroll indicator dots */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }} />
            <div style={{ width: 24, height: 8, borderRadius: 4, background: '#1A73E8', animation: 'floatSlow 2s ease-in-out infinite' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#CBD5E1' }} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
