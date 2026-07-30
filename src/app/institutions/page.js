'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/shared/Footer';
import { BookOpen, MapPin, Building2, Users, ShieldCheck, ArrowRight, Star, Search, ChevronRight } from 'lucide-react';
import { useTypewriterPlaceholder } from '@/hooks/useTypewriterPlaceholder';

const BLUE = '#1A73E8';
const DARK = '#052033';

const AnimatedNumber = ({ endString }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  const numStr = endString.replace(/[^0-9.]/g, '');
  const endVal = parseFloat(numStr);
  const suffix = endString.replace(/[0-9.]/g, '');
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    const duration = 2000;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const animate = (time) => {
          if (!startTime) startTime = time;
          const progress = Math.min((time - startTime) / duration, 1);
          const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setCount(easeOut * endVal);
          if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
          }
        };
        animationFrame = requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [endVal]);
  
  const hasDecimals = numStr.includes('.');
  const displayVal = hasDecimals ? count.toFixed(1) : Math.floor(count);
  
  return <span ref={ref}>{displayVal}{suffix}</span>;
};

const NAV_LINKS = ['Home', 'Platform', 'AI Features', 'Institutions'];

const INSTITUTIONS = [
  {
    name: 'Indian Institute of Technology Delhi',
    location: 'New Delhi, India',
    type: 'Engineering Institute',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png',
    stats: [{ label: 'Books', val: '45,000+' }, { label: 'Students', val: '12,000+' }],
    tag: null,
  },
  {
    name: 'Lovely Professional University',
    location: 'Punjab, India',
    type: 'Private University',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png',
    stats: [],
    tag: 'Central Digital Library',
    tagColor: null,
  },
  {
    name: 'Aman Bhalla Group of Institutes',
    location: 'Punjab, India',
    type: 'College',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966564/e31e8b25a45e30befb5e8134306d7302e20e480f_pljnqm.png',
    stats: [],
    tag: 'AI-Powered Library',
    tagColor: '#1A73E8',
  },
  {
    name: 'Punjab Technical University',
    location: 'Punjab, India',
    type: 'State University',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967270/587a99a4b332f8a653f7020f2f5b4655e03686ef_niq00b.png',
    stats: [],
    tag: 'Digital Resource Center',
    tagColor: null,
  },
  {
    name: 'Delhi Public Library',
    location: 'New Delhi, India',
    type: 'Public Library',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967231/d69f6a3ad8778bdbf4149b18c012db676eff844f_sb5dq8.png',
    stats: [],
    tag: 'Community Learning',
    tagColor: null,
  },
  {
    name: 'CSIR Research Library',
    location: 'New Delhi, India',
    type: 'Research Institution',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967232/1ff261e52c8f2819a952d58c6e6bdc2974989328_dqwk84.png',
    stats: [],
    tag: 'Knowledge Repository',
    tagColor: null,
  },
  {
    name: 'Chandigarh University',
    location: 'Chandigarh, India',
    type: 'Private University',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png',
    stats: [{ label: 'Books', val: '60,000+' }, { label: 'Students', val: '28,000+' }],
    tag: null,
    tagColor: null,
  },
  {
    name: 'Amity University',
    location: 'Noida, India',
    type: 'Private University',
    image: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967264/cddacee78084dabbb4b846b509c20cd30ce44546_pkgfse.png',
    stats: [],
    tag: 'Smart Library System',
    tagColor: '#1A73E8',
  },
  {
    name: 'Jadavpur University',
    location: 'Kolkata, India',
    type: 'State University',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967243/54a30c3a4505cafd2a8b753e026b73f80e8d97a3_kzzqey.png',
    stats: [],
    tag: 'Research Hub',
    tagColor: null,
  },
  {
    name: 'Tata Institute of Social Sciences',
    location: 'Mumbai, India',
    type: 'Deemed University',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967246/a42412d3df3d12e6577cdb6a1418f0bde16fbdbe_fchgpo.png',
    stats: [{ label: 'Books', val: '30,000+' }, { label: 'Students', val: '5,000+' }],
    tag: null,
    tagColor: null,
  },
  {
    name: 'Banaras Hindu University',
    location: 'Varanasi, India',
    type: 'Central University',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967233/78cfcffed942089c708d535593091ab017a1bec8_l5uqod.png',
    stats: [],
    tag: 'Heritage Library',
    tagColor: '#D97706',
  },
  {
    name: 'NIT Trichy',
    location: 'Tiruchirappalli, India',
    type: 'Engineering Institute',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80',
    logo: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967270/587a99a4b332f8a653f7020f2f5b4655e03686ef_niq00b.png',
    stats: [],
    tag: 'AI-Powered Library',
    tagColor: '#1A73E8',
  },
];

export default function InstitutionsPage() {
  const [search, setSearch] = useState('');
  const searchPlaceholder = useTypewriterPlaceholder("Search institutions...|Search colleges...|Search universities...|Find your library...", 50, 20, 2500);

  const filtered = INSTITUTIONS.filter(inst =>
    inst.name.toLowerCase().includes(search.toLowerCase()) ||
    inst.location.toLowerCase().includes(search.toLowerCase()) ||
    inst.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#FFFFFF', color: '#0F172A', overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: auto !important; overflow: visible !important; min-height: 100vh; }
        a { text-decoration: none; }
        .nl:hover { color: #1A73E8 !important; }
        .inst-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .inst-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.10) !important; }
        .vp-link { color: #1A73E8; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; transition: gap 0.2s; }
        .vp-link:hover { gap: 8px; }
        .hero-btn-primary { background: #1A73E8; color: white; padding: 12px 28px; border-radius: 40px; font-size: 15px; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s, transform 0.2s; }
        .hero-btn-primary:hover { background: #1557B0; transform: translateY(-1px); }
        .hero-btn-outline { background: transparent; color: white; padding: 12px 28px; border-radius: 40px; font-size: 15px; font-weight: 600; border: 1.5px solid rgba(255,255,255,0.7); display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s; }
        .hero-btn-outline:hover { background: rgba(255,255,255,0.1); }
        .search-input:focus { outline: none; border-color: #1A73E8; box-shadow: 0 0 0 3px rgba(26,115,232,0.1); }
        .load-more-btn:hover { background: #F8FAFC !important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <div style={{ position: 'sticky', top: 16, zIndex: 100, padding: '0 27px' }}>
        <nav style={{ maxWidth: 1386, margin: '0 auto', background: 'white', boxShadow: '0px 4px 25.3px rgba(26,115,232,0.23)', borderRadius: 40, border: '1px solid #D9D9D9', padding: '0 40px', height: 71, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784448482/e2d37f27-b9e1-484c-a59b-79e086b1aec2_rah6h8.png" alt="Librix Logo" style={{ height: 50, width: 'auto', objectFit: 'contain', transform: 'scale(1.3)' }} />
  
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
            {NAV_LINKS.map(l => (
              <Link
                key={l}
                href={l === 'Platform' ? '/platform' : l === 'AI Features' ? '/ai-features' : l === 'Institutions' ? '/institutions' : '/'}
                className="nl"
                style={{
                  color: l === 'Institutions' ? BLUE : 'black',
                  fontSize: 16, fontFamily: 'Inter',
                  fontWeight: l === 'Institutions' ? 600 : 400,
                  transition: 'color 0.2s',
                  borderBottom: l === 'Institutions' ? `2px solid ${BLUE}` : 'none',
                  paddingBottom: l === 'Institutions' ? 2 : 0,
                }}
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

      {/* ── HERO SECTION ── */}
      <section style={{ position: 'relative', overflow: 'hidden', marginTop: -20 }}>
        {/* Background photo */}
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80) center/cover no-repeat', zIndex: 0 }} />
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,20,40,0.74) 0%, rgba(5,20,40,0.82) 100%)', zIndex: 1 }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '130px 24px 100px' }}>
          {/* Trust pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 30, padding: '6px 18px', marginBottom: 30 }}>
            <ShieldCheck size={14} color="#60A5FA" />
            <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Trusted by 500+ Institutions Across India</span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 800, color: 'white', lineHeight: 1.15, letterSpacing: '-0.025em', marginBottom: 20, maxWidth: 700 }}>
            Everything Your Institution Needs,<br />
            <span style={{ color: '#60A5FA' }}>All in One Platform.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, maxWidth: 540, marginBottom: 38 }}>
            Librix helps educational institutions digitize library operations, manage members, automate workflows, and deliver a seamless experience for students, faculty, and librarians.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="hero-btn-primary">
              Explore Now <ArrowRight size={16} />
            </Link>
            <Link href="/register" className="hero-btn-outline">
              Register Institution
            </Link>
          </div>
        </div>

        {/* Stats bar (overlaps hero bottom) */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', paddingBottom: 0 }}>
          <div style={{
            background: 'white', borderRadius: '20px 20px 0 0',
            boxShadow: '0 -4px 40px rgba(0,0,0,0.08)',
            width: '100%', maxWidth: 960,
            margin: '0 24px',
            padding: '28px 48px',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          }}>
            {[
              { icon: <Building2 size={28} color={BLUE} />, val: '500+', label: 'Institutions', sub: 'Trust Librix' },
              { icon: <Users size={28} color={BLUE} />, val: '100K+', label: 'Active Members', sub: 'Managed' },
              { icon: <BookOpen size={28} color={BLUE} />, val: '1M+', label: 'Books & Resources', sub: 'Digitized' },
              { icon: <ShieldCheck size={28} color={BLUE} />, val: '99.9%', label: 'Platform Uptime', sub: '& Reliability' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, borderRight: i < 3 ? '1px solid #F1F5F9' : 'none', padding: i > 0 ? '0 0 0 24px' : '0 24px 0 0', paddingRight: i < 3 ? 24 : 0 }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}><AnimatedNumber endString={s.val} /></div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginTop: 1 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTITUTIONS GRID SECTION ── */}
      <section style={{ background: '#F8FAFC', paddingTop: 70, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>

          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: 30, padding: '5px 16px', marginBottom: 18 }}>
              <ShieldCheck size={13} color={BLUE} />
              <span style={{ fontSize: 12, fontWeight: 600, color: BLUE }}>Trusted by Educational Institutions</span>
            </div>
            <h2 style={{ fontSize: 42, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 14 }}>
              Powering Libraries Across<br />Schools, Colleges &amp; Universities
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.65 }}>
              Librix supports institutions of every size—from schools and colleges to universities, public libraries, and research organizations.
            </p>

            {/* Search bar */}
            <div style={{ position: 'relative', maxWidth: 440, margin: '0 auto' }}>
              <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                className="search-input"
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '12px 16px 12px 44px', borderRadius: 40, border: '1.5px solid #E2E8F0', fontSize: 14, color: '#334155', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s', fontFamily: 'Inter' }}
              />
            </div>
          </div>

          {/* Cards grid */}
          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {filtered.map((inst, i) => (
                <div key={i} className="inst-card" style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  {/* Cover image */}
                  <div style={{ height: 160, overflow: 'hidden' }}>
                    <img src={inst.image} alt={inst.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }} />
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '16px 18px 14px' }}>
                    {/* Logo + Name row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                      <img
                        src={inst.logo}
                        alt={inst.name}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0', flexShrink: 0, background: 'white', padding: 2 }}
                      />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', lineHeight: 1.35 }}>{inst.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 5, flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#64748B' }}>
                            <MapPin size={10} color="#94A3B8" /> {inst.location}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#64748B' }}>
                            <Building2 size={10} color="#94A3B8" /> {inst.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats badges */}
                    {inst.stats && inst.stats.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                        {inst.stats.map((s, si) => (
                          <div key={si} style={{ background: '#F8FAFC', borderRadius: 8, padding: '4px 10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <BookOpen size={10} color={BLUE} />
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>{s.val}</span>
                            <span style={{ fontSize: 11, color: '#94A3B8' }}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tag */}
                    {inst.tag && (
                      <div style={{ marginBottom: 10 }}>
                        <span style={{
                          background: inst.tagColor ? '#EFF6FF' : '#F0FDF4',
                          color: inst.tagColor || '#16A34A',
                          fontSize: 11, fontWeight: 600,
                          padding: '4px 12px', borderRadius: 20,
                          border: `1px solid ${inst.tagColor ? '#BFDBFE' : '#DCFCE7'}`,
                          display: 'inline-flex', alignItems: 'center', gap: 4
                        }}>
                          {inst.tagColor ? '⚡' : '📚'} {inst.tag}
                        </span>
                      </div>
                    )}

                    {/* Footer row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <ShieldCheck size={13} color="#16A34A" />
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#16A34A' }}>Verified Institution</span>
                      </div>
                      <Link href="#" className="vp-link">
                        View Profile <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <BookOpen size={48} color="#E2E8F0" style={{ marginBottom: 16 }} />
              <div style={{ fontSize: 18, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>No institutions found</div>
              <div style={{ fontSize: 14, color: '#94A3B8' }}>Try a different search term</div>
            </div>
          )}

          {/* ── Explore more row ── */}
          {filtered.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 56 }}>

              {/* Modern gradient button */}
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'linear-gradient(135deg, #1A73E8, #1A73E8)',
                color: 'white', border: 'none', cursor: 'pointer',
                padding: '14px 36px', borderRadius: 40,
                fontSize: 15, fontWeight: 700, fontFamily: 'Inter',
                boxShadow: '0 8px 24px rgba(26,115,232,0.28)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                letterSpacing: '-0.01em',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,115,232,0.38)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,115,232,0.28)'; }}
              >
                Explore All Institutions
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}>
                  <ArrowRight size={14} color="white" />
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
