'use client';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Star } from 'lucide-react';

const BLUE = '#1A73E8';
const DARK = '#052033';
// Book cover images for spine section
const BOOK_IMGS = [
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966397/7dc2c9ce9f7e759580caf98f5b105fd21d5d57f4_t1sghw.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966543/1b5dd1dc0ba2203d7616047bc3e67e2539ab5ebd_hoyhdt.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966564/e31e8b25a45e30befb5e8134306d7302e20e480f_pljnqm.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967270/587a99a4b332f8a653f7020f2f5b4655e03686ef_niq00b.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967264/cddacee78084dabbb4b846b509c20cd30ce44546_pkgfse.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967246/a42412d3df3d12e6577cdb6a1418f0bde16fbdbe_fchgpo.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967243/54a30c3a4505cafd2a8b753e026b73f80e8d97a3_kzzqey.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967233/78cfcffed942089c708d535593091ab017a1bec8_l5uqod.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967232/1ff261e52c8f2819a952d58c6e6bdc2974989328_dqwk84.png',
  'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967231/d69f6a3ad8778bdbf4149b18c012db676eff844f_sb5dq8.png',
];
// Pre-computed rotations to avoid SSR hydration mismatch
const ROT_TOP = [-8, -3, 6, -12, 4, -6, 9, -4, 7, -10, 3, -8, 5, -7, 11, -3, 8, -5, 6, -9, 4, -6, 7, -3, 10, -8, 5, -4, 9, -7];
const ROT_BOT = [7, 4, -9, 3, -5, 8, -4, 6, -8, 5, -11, 4, -6, 9, -3, 7, -5, 8, -7, 4, -9, 5, -3, 8, -6, 4, -10, 6, -4, 8];
const H_TOP = [140, 115, 160, 100, 130, 170, 110, 145, 95, 125, 165, 105, 140, 115, 135, 148, 102, 120, 158, 108, 130, 95, 148, 112, 135, 155, 100, 124, 140, 115];
const H_BOT = [125, 100, 148, 112, 135, 95, 155, 118, 140, 105, 128, 162, 108, 132, 98, 148, 114, 136, 102, 142, 120, 155, 103, 130, 112, 140, 96, 124, 148, 108];
const W_ARR = [72, 78, 66, 80, 74, 62, 84, 72, 78, 66, 80, 74, 62, 84, 72, 78, 66, 80, 74, 62, 84, 72, 78, 66, 80, 74, 62, 84, 72, 78];
const TS = Array.from({ length: 30 }, (_, i) => ({ src: BOOK_IMGS[i % BOOK_IMGS.length], h: H_TOP[i], w: W_ARR[i], r: ROT_TOP[i] }));
const BS = Array.from({ length: 30 }, (_, i) => ({ src: BOOK_IMGS[(i + 6) % BOOK_IMGS.length], h: H_BOT[i], w: W_ARR[i], r: ROT_BOT[i] }));

const Sp = ({ src, h, w = 72, r = 0 }) => (
  <img src={src} alt="book" style={{
    width: w, height: h, objectFit: 'cover', borderRadius: 6, flexShrink: 0,
    boxShadow: '4px 4px 14px rgba(0,0,0,0.22)', display: 'block',
    transform: `rotate(${r}deg)`, transition: 'transform 0.2s',
  }} />
);

const BookMock = () => (
  <div style={{ background: '#F4F8FE', borderRadius: 20, padding: 24, boxShadow: '0 4px 30px rgba(26,115,232,0.1)' }}>
    <div style={{ background: DARK, borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', gap: 6 }}>
      {['#DD4D4D', '#D3DB58', '#0D725D'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {[BLUE, DARK, '#1A73E8', '#10B981', '#E8341A', '#F59E0B'].map((c, i) => <div key={i} style={{ height: 90, background: c, borderRadius: 8 }} />)}
    </div>
  </div>
);

const RecordMock = () => (
  <div style={{ background: '#F4F8FE', borderRadius: 20, padding: 24, boxShadow: '0 4px 30px rgba(26,115,232,0.1)' }}>
    <div style={{ background: DARK, borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', gap: 6 }}>
      {['#DD4D4D', '#D3DB58', '#0D725D'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
    </div>
    {['Atomic Habits', 'Clean Code', 'Sapiens'].map((t, i) => (
      <div key={t} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
        <div style={{ width: 40, height: 56, background: [BLUE, DARK, '#1A73E8'][i], borderRadius: 6, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 11, background: 'rgba(0,0,0,0.12)', borderRadius: 6, marginBottom: 6, width: '65%' }} />
          <div style={{ height: 9, background: 'rgba(0,0,0,0.07)', borderRadius: 6, width: '40%' }} />
        </div>
        <div style={{ padding: '4px 12px', background: BLUE, borderRadius: 20, color: 'white', fontSize: 12, fontWeight: 500 }}>Issued</div>
      </div>
    ))}
  </div>
);

export default function LandingPage() {
  const NAV = ['Home', 'Platform', 'AI Features', 'Institutions'];
  const T = (s, extra = {}) => ({ fontFamily: 'Inter', wordWrap: 'break-word', ...extra, ...s });

  const WORDS = ['Education', 'Learning', 'Libraries', 'Campuses'];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % WORDS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const TYPING_WORDS = ['Institutions', 'Colleges', 'Schools', 'Universities'];
  const [typewriterText, setTypewriterText] = useState('');
  const [typingIdx, setTypingIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[typingIdx];
    let typingSpeed = isDeleting ? 40 : 100;
    
    if (!isDeleting && typewriterText === word) {
      typingSpeed = 2000;
    } else if (isDeleting && typewriterText === '') {
      typingSpeed = 400;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting && typewriterText === word) {
        setIsDeleting(true);
      } else if (isDeleting && typewriterText === '') {
        setIsDeleting(false);
        setTypingIdx((prev) => (prev + 1) % TYPING_WORDS.length);
      } else {
        setTypewriterText((prev) =>
          isDeleting ? word.substring(0, prev.length - 1) : word.substring(0, prev.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, typingIdx]);

  // Scroll-triggered animation for book cards
  const cardsRef = useRef(null);
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.card-hidden').forEach((card) => {
            card.classList.remove('card-hidden');
            card.classList.add('card-visible');
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll-triggered animation for left text column
  const textRef = useRef(null);
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.txt-hidden').forEach((node) => {
            node.classList.remove('txt-hidden');
            node.classList.add('txt-visible');
          });
          el.querySelectorAll('.line-hidden').forEach((node) => {
            node.classList.remove('line-hidden');
            node.classList.add('line-visible');
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll-triggered animation for Feature rows
  useEffect(() => {
    const rows = document.querySelectorAll('.feature-row');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.querySelectorAll('.anim-left-hidden').forEach((node) => {
              node.classList.remove('anim-left-hidden'); node.classList.add('anim-left-visible');
            });
            el.querySelectorAll('.anim-right-hidden').forEach((node) => {
              node.classList.remove('anim-right-hidden'); node.classList.add('anim-right-visible');
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    rows.forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  // Scroll-triggered animation for Trusted section
  const trustedRef = useRef(null);
  useEffect(() => {
    const el = trustedRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.txt-hidden').forEach((node) => {
            node.classList.remove('txt-hidden'); node.classList.add('txt-visible');
          });
          el.querySelectorAll('.line-hidden').forEach((node) => {
            node.classList.remove('line-hidden'); node.classList.add('line-visible');
          });
          el.querySelectorAll('.logo-hidden').forEach((node) => {
            node.classList.remove('logo-hidden'); node.classList.add('logo-visible');
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: 'Inter,sans-serif', background: 'white', color: 'black', overflowX: 'hidden', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:auto!important;overflow:visible!important;min-height:100vh}
        html{scroll-behavior:smooth}a{text-decoration:none}
        .nl:hover{color:#1A73E8!important}.hl:hover{opacity:.85}
        @keyframes slideRightToLeftFade {
          0% { opacity: 0; transform: translateX(15px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .word-rotate {
          display: inline-block;
        }
        .letter-rotate {
          display: inline-block;
          opacity: 0;
          animation: slideRightToLeftFade 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .cursor-blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes floatBooks {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-22px); }
        }
        @keyframes flipCover {
          0%, 2% { transform: rotateY(0deg); z-index: 2; }
          4% { z-index: 0; }
          6%, 28% { transform: rotateY(-180deg); z-index: 0; }
          30% { z-index: 2; }
          32%, 100% { transform: rotateY(0deg); z-index: 2; }
        }
        @keyframes flipChapter1 {
          0%, 13% { transform: rotateY(0deg); z-index: 1; }
          17%, 24% { transform: rotateY(-180deg); z-index: 1; }
          28%, 100% { transform: rotateY(0deg); z-index: 1; }
        }
        @keyframes moveProgressBar {
          0%, 30% { transform: translateX(0%); }
          33.33%, 63.33% { transform: translateX(100%); }
          66.66%, 96.66% { transform: translateX(200%); }
          100% { transform: translateX(0%); }
        }
        @keyframes scrollUpVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.3333%); }
        }
        @keyframes scrollDownVertical {
          0% { transform: translateY(-33.3333%); }
          100% { transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0%   { opacity: 0; transform: translateY(60px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .card-hidden { opacity: 0; transform: translateY(60px); }
        .card-visible {
          animation: fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes growDown {
          0%   { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes slideInLeft {
          0%   { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .txt-hidden  { opacity: 0; transform: translateX(-40px); }
        .txt-visible { animation: slideInLeft 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .line-hidden  { opacity: 0; transform: scaleY(0); transform-origin: top; }
        .line-visible { animation: growDown 0.7s cubic-bezier(0.22,1,0.36,1) both; transform-origin: top; }
        @keyframes slideInRight {
          0%   { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .anim-left-hidden { opacity: 0; transform: translateX(-40px); }
        .anim-left-visible { animation: slideInLeft 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-right-hidden { opacity: 0; transform: translateX(40px); }
        .anim-right-visible { animation: slideInRight 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes popUp {
          0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .logo-hidden  { opacity: 0; transform: translateY(40px) scale(0.95); }
        .logo-visible { animation: popUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* NAVBAR */}
      <div style={{ position: 'sticky', top: 16, zIndex: 100, padding: '0 27px' }}>
        <nav style={{ maxWidth: 1386, margin: '0 auto', background: 'white', boxShadow: '0px 4px 25.3px rgba(26,115,232,0.23)', borderRadius: 40, border: '1px solid #D9D9D9', padding: '0 40px', height: 71, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784448482/e2d37f27-b9e1-484c-a59b-79e086b1aec2_rah6h8.png" alt="Librix Logo" style={{ height: 50, width: 'auto', objectFit: 'contain', transform: 'scale(1.3)' }} />
            
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
            {NAV.map(l => <Link key={l} href={l === 'Platform' ? '/platform' : l === 'AI Features' ? '/ai-features' : l === 'Institutions' ? '/institutions' : '/'} className="nl" style={{ color: l === 'Home' ? BLUE : 'black', fontSize: 16, fontFamily: 'Inter', fontWeight: l === 'Home' ? 600 : 400, transition: 'color 0.2s', borderBottom: l === 'Home' ? `2px solid ${BLUE}` : 'none', paddingBottom: l === 'Home' ? 2 : 0 }}>{l}</Link>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/register" style={{ padding: '7px 28px', borderRadius: 38, border: '1px solid rgba(5,32,51,0.42)', color: DARK, fontSize: 16, fontFamily: 'Inter', fontWeight: 400 }}>Register College</Link>
            <Link href="/login" style={{ padding: '7px 24px', borderRadius: 38, background: BLUE, color: 'white', fontSize: 16, fontFamily: 'Inter', fontWeight: 500 }}>Login</Link>
          </div>
        </nav>
      </div>

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Hero background image — 3D books left & right */}
        <img
          src="/hero-bg.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-5%', left: '-2%',
            width: '104%', height: '110%',
            objectFit: 'cover',
            objectPosition: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            animation: 'floatBooks 5s ease-in-out infinite',
          }}
        />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', color: BLUE, fontSize: 16, fontFamily: 'Inter', fontWeight: 400, marginBottom: 24, padding: '6px 20px', background: 'rgba(26,115,232,0.06)', borderRadius: 30, border: '1px solid rgba(26,115,232,0.2)' }}>
            Digital Library Platform for Institutions
          </div>
          <h1 style={{ fontSize: 54, fontWeight: 700, fontFamily: 'Inter', lineHeight: 1.15, marginBottom: 24 }}>
            Smart Library Management for Modern{' '}
            <span style={{ color: BLUE }}>
              {typewriterText}
              <span className="cursor-blink">|</span>
            </span>
          </h1>
          <p style={{ fontSize: 16, fontWeight: 400, fontFamily: 'Inter', color: 'rgba(0,0,0,0.60)', lineHeight: 1.6, maxWidth: 682, margin: '0 auto 40px' }}>
            Librix is an all-in-one library management system to manage books, members, requests, issue &amp; return, fines and reports — designed for colleges, universities, and modern libraries.
          </p>
          <div style={{ display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <Link href="/signup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 231, height: 47, background: DARK, borderRadius: 38, color: 'white', fontSize: 20, fontFamily: 'Inter', fontWeight: 500 }}>
              Start Your Library
            </Link>
            <a href="#features" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 212, height: 47, background: 'white', borderRadius: 38, border: `1px solid ${BLUE}`, color: BLUE, fontSize: 20, fontFamily: 'Inter', fontWeight: 500 }}>
              Explore Features
            </a>
          </div>
          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ display: 'flex' }}>
              {[
                'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
                'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&q=80'
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Student"
                  style={{ width: 30, height: 30, borderRadius: '50%', border: `2px solid ${BLUE}`, marginLeft: i > 0 ? -10 : 0, boxShadow: '0 2px 6px rgba(0,0,0,0.2)', objectFit: 'cover' }}
                />
              ))}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: 500, fontFamily: 'Inter', color: 'black', textTransform: 'capitalize' }}>10M+ students worldwide</div>
              <div style={{ display: 'flex', gap: 2, alignItems: 'center', marginTop: 2 }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={BLUE} color={BLUE} />)}
                <span style={{ fontSize: 8, fontWeight: 400, fontFamily: 'Inter', color: 'black', textTransform: 'capitalize', marginLeft: 4 }}>4.5/5 (35k Reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <section style={{ padding: '90px 70px', maxWidth: 1320, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 60, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* LEFT: Text + arrows */}
          <div ref={textRef} style={{ flex: '0 0 298px', minWidth: 240 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
              {/* Blue line — grows downward */}
              <div
                className="line-hidden"
                style={{ width: 7, minHeight: 72, background: BLUE, borderRadius: 11, flexShrink: 0, marginTop: 4, animationDelay: '0s' }}
              />
              <div>
                {/* GET MORE CLOSER */}
                <div
                  className="txt-hidden"
                  style={{ fontSize: 16, fontFamily: 'Inter', fontWeight: 400, marginBottom: 6, animationDelay: '0.15s' }}
                >
                  <span style={{ color: 'black' }}>GET MORE </span><span style={{ color: BLUE }}>CLOSER</span>
                </div>
                {/* Big heading */}
                <div
                  className="txt-hidden"
                  style={{ fontSize: 48, fontWeight: 500, fontFamily: 'Inter', lineHeight: 1.15, animationDelay: '0.28s' }}
                >
                  <span style={{ color: 'black' }}>Marketplace<br />for </span><span style={{ color: BLUE }}>Creativity</span>
                </div>
              </div>
            </div>
            {/* Description */}
            <p
              className="txt-hidden"
              style={{ color: 'rgba(0,0,0,0.60)', fontSize: 16, fontWeight: 400, fontFamily: 'Inter', lineHeight: 1.6, marginBottom: 32, animationDelay: '0.42s' }}
            >
              Organize books, track availability, manage members and simplify daily library operations.
            </p>
            {/* Navigation arrows */}
            <div className="txt-hidden" style={{ display: 'flex', gap: 8, animationDelay: '0.55s' }}>
              {['←', '→'].map((arrow, i) => (
                <button key={i} style={{
                  width: 37, height: 37, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer',
                  fontSize: 14, color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}>{arrow}</button>
              ))}
            </div>
          </div>

          {/* RIGHT: Cards + View All */}
          <div style={{ flex: 1, minWidth: 300 }}>
            {/* View All aligned top-right */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <Link href="/register" style={{
                padding: '10px 24px', height: 39, borderRadius: 38,
                background: BLUE, color: 'white', fontSize: 16, fontWeight: 500,
                fontFamily: 'Inter', display: 'inline-flex', alignItems: 'center',
              }}>View All</Link>
            </div>

            {/* 3 Book cards — staggered wave: down → up → down */}
            <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 12, alignItems: 'start' }}>
              {[
                { title: 'Best Author', img1: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png', img2: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966397/7dc2c9ce9f7e759580caf98f5b105fd21d5d57f4_t1sghw.png', offset: 40 },
                { title: 'Deep Understanding', img1: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966485/5d9d4ba558d3c5f069df8b6dba80b4871fe18641_aiv1sb.png', img2: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966543/1b5dd1dc0ba2203d7616047bc3e67e2539ab5ebd_hoyhdt.png', offset: 80 },
                { title: 'Educational books', img1: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966564/e31e8b25a45e30befb5e8134306d7302e20e480f_pljnqm.png', img2: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966160/2b6bdc8890caf6725bac452d668983177171fe75_pd81vb.png', offset: 0 },
              ].map(({ title, img1, img2, offset }, idx) => (
                <div
                  key={title}
                  className="card-hidden"
                  style={{
                    background: 'white', borderRadius: 14,
                    border: '1px solid rgba(0,0,0,0.19)',
                    overflow: 'hidden',
                    marginTop: offset,
                    animationDelay: `${idx * 0.18}s`,
                  }}
                >
                  {/* 3D Book Page Flip */}
                  <div style={{ position: 'relative', height: 209, display: 'flex', perspective: '1200px' }}>
                    {/* Left static page (img1) */}
                    <div style={{ width: '50%', height: '100%', overflow: 'hidden', borderRight: '1px solid rgba(0,0,0,0.1)' }}>
                      <img src={img1} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    {/* Right static page (Chapter 2) */}
                    <div style={{
                      width: '50%', height: '100%', overflow: 'hidden',
                      background: '#FDFCF0', padding: '12px 14px',
                      boxShadow: 'inset 5px 0 10px rgba(0,0,0,0.04)',
                      color: '#333', fontFamily: 'serif',
                      fontSize: '6px', lineHeight: 1.5, textAlign: 'justify'
                    }}>
                      <div style={{ fontWeight: 'bold', fontSize: '8px', marginBottom: '6px', textAlign: 'center' }}>CHAPTER 2</div>
                      <p style={{ marginBottom: '4px', textIndent: '10px' }}>In hac habitasse platea dictumst. Vivamus sit amet congue nisl. Sed interdum, turpis sed fringilla congue, orci tellus tristique nisi, nec congue.</p>
                      <p style={{ textIndent: '10px' }}>Nullam congue eros non ipsum ullamcorper, eu varius felis tristique. Mauris laoreet justo id arcu ullamcorper, vel finibus est feugiat.</p>
                    </div>
                    
                    {/* Flipping page 2 (Chapter 1) */}
                    <div style={{
                      position: 'absolute', top: 0, left: '50%', width: '50%', height: '100%',
                      transformOrigin: 'left center', transformStyle: 'preserve-3d',
                      animation: `flipChapter1 15s ease-in-out infinite`, animationDelay: idx === 0 ? '0s' : idx === 1 ? '-10s' : '-5s', zIndex: 1
                    }}>
                      {/* Front face (Chapter 1) */}
                      <div style={{
                        position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden',
                        background: '#FDFCF0', padding: '12px 14px', boxShadow: 'inset 5px 0 10px rgba(0,0,0,0.04)',
                        color: '#333', fontFamily: 'serif', fontSize: '6px', lineHeight: 1.5, textAlign: 'justify'
                      }}>
                        <div style={{ fontWeight: 'bold', fontSize: '8px', marginBottom: '6px', textAlign: 'center' }}>CHAPTER 1</div>
                        <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&q=80" alt="Chapter illustration" style={{ width: '100%', height: 45, objectFit: 'cover', borderRadius: 2, marginBottom: '6px' }} />
                        <p style={{ marginBottom: '4px', textIndent: '10px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <p style={{ textIndent: '10px' }}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
                      </div>
                      {/* Back face (Blank) */}
                      <div style={{
                        position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                        background: '#FDFCF0', padding: '12px 14px', boxShadow: 'inset -5px 0 10px rgba(0,0,0,0.04)'
                      }}>
                      </div>
                    </div>

                    {/* Flipping page 1 (Cover) */}
                    <div style={{
                      position: 'absolute', top: 0, left: '50%', width: '50%', height: '100%',
                      transformOrigin: 'left center', transformStyle: 'preserve-3d',
                      animation: `flipCover 15s ease-in-out infinite`, animationDelay: idx === 0 ? '0s' : idx === 1 ? '-10s' : '-5s', zIndex: 2
                    }}>
                      <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>
                        <img src={img2} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <img src={img2} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </div>
                  </div>
                  {/* Label */}
                  <div style={{ padding: '10px 12px', color: 'black', fontSize: 16, fontWeight: 500, fontFamily: 'Inter' }}>
                    {title}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar spanning all 3 cards */}
            <div style={{ height: 5, background: 'rgba(0,0,0,0.12)', borderRadius: 27, width: '100%' }}>
              <div style={{
                width: '33.33%', height: '100%', background: DARK, borderRadius: 27,
                animation: 'moveProgressBar 15s ease-in-out infinite'
              }} />
            </div>
          </div>

        </div>
      </section>


      {/* VISION */}
      <section id="about" style={{ background: 'rgba(26,115,232,0.05)', padding: '80px 80px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', gap: 60, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* LEFT column */}
          <div style={{ flex: '0 0 420px', minWidth: 280 }}>
            {/* Small icon top-left */}
            <div style={{ width: 30, height: 30, borderRadius: 12, border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A73E8" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            </div>

            <h2 style={{ fontSize: 48, fontWeight: 600, fontFamily: 'Inter', lineHeight: 1.2, marginBottom: 16 }}>
              <span style={{ color: 'black' }}>Our vision for Digital </span>
              <span key={wordIdx} className="word-rotate" style={{ color: BLUE }}>
                {WORDS[wordIdx].split('').map((char, i) => (
                  <span key={i} className="letter-rotate" style={{ animationDelay: `${i * 0.08}s` }}>
                    {char}
                  </span>
                ))}
              </span>
            </h2>
            <p style={{ color: 'black', fontSize: 16, fontWeight: 400, fontFamily: 'Inter', lineHeight: 1.7, marginBottom: 28 }}>
              Building smarter campuses through simple and efficient library technology.
            </p>
            <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 24px', height: 39, borderRadius: 38, border: '1px solid rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.81)', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', marginBottom: 48 }}>
              Learn More
            </a>

            {/* Scattered app/integration icons */}
            <div style={{ position: 'relative', height: 140, width: '100%' }}>
              {[
                { top: 0,   left: 20,  src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1782013762/b3a987cea2e498984971cfc2731b4913ef10fecb_dznqwa.png' },
                { top: 10,  left: 100, src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1782013761/2d38b483c75df2b40e70d9d424e08568cb14e0ad_wnmgub.png' },
                { top: 0,   left: 180, src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1782013758/ec070c4d0d94568b1dbac3768f7e6d115fbd7488_gqlkj4.png' },
                { top: -20,  left: 260,   src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1782013756/146063117eebaaf335d7359721918fd29e27a8c2_mka5ay.png' },
                { top: 70,  left: 50, src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1782013755/6f8addfb06251431ead80835267843f16a8532e0_kqtzuh.png' },
                { top: 70,  left: 150, src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1782013746/52f2e660feb571c8566cfe781c4414c338d8602a_vm6llz.png' },
                { top: 50,  left: 240, src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1782013744/533bfd07bcaf92a339876fcb9c18ed03475f8094_ofuqlt.png' },
                { top: -70, left: 205,  src: 'https://res.cloudinary.com/dadiutcqh/image/upload/v1782013742/e406aef0637df5f89df3b5c916d8c59020092e25_mkem3z.png' },
              ].map((item, i) => (
                <div key={i} style={{
                  position: 'absolute', top: item.top, left: item.left,
                  width: 62, height: 62, borderRadius: 46,
                  background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={item.src} alt={`Logo ${i + 1}`} style={{ width: 36, height: 36, objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Dashboard panel */}
          <div style={{ flex: 1, minWidth: 440 }}>
            {/* "Business" tab sits ABOVE the card, outside */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, marginBottom: 0 }}>
              <div style={{
                padding: '12px 24px', color: 'black', fontSize: 24, fontWeight: 500, fontFamily: 'Inter',
                background: 'white', borderRadius: '14px 14px 0 0',
                border: '1px solid rgba(0,0,0,0.08)', borderBottom: 'none',
              }}>Business</div>
            </div>

            {/* White card */}
            <div style={{ background: 'white', borderRadius: '0 14px 14px 14px', overflow: 'hidden', boxShadow: '0 4px 30px rgba(0,0,0,0.1)' }}>
              {/* Personal tab bar (active, dark bg) */}
              <div style={{ background: DARK, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 0 }}>
                <div style={{ color: 'white', fontSize: 24, fontWeight: 500, fontFamily: 'Inter', flex: 1 }}>Personal</div>
                {/* Traffic lights */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginRight: 12 }}>
                  {['#DD4D4D', '#D3DB58', '#0D725D'].map(c => (
                    <div key={c} style={{ width: 13, height: 13, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                {/* Create button */}
                <div style={{ background: '#F4F8FE', borderRadius: 24, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: BLUE }} />
                  <span style={{ color: 'black', fontSize: 16, fontWeight: 500, fontFamily: 'Inter' }}>Create</span>
                </div>
              </div>

              {/* 4 Vertical scrolling columns */}
              <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, height: 322, overflow: 'hidden' }}>
                {[
                  [
                    'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967270/587a99a4b332f8a653f7020f2f5b4655e03686ef_niq00b.png',
                    'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967233/78cfcffed942089c708d535593091ab017a1bec8_l5uqod.png',
                  ],
                  [
                    'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967264/cddacee78084dabbb4b846b509c20cd30ce44546_pkgfse.png',
                    'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967232/1ff261e52c8f2819a952d58c6e6bdc2974989328_dqwk84.png',
                  ],
                  [
                    'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967246/a42412d3df3d12e6577cdb6a1418f0bde16fbdbe_fchgpo.png',
                    'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967231/d69f6a3ad8778bdbf4149b18c012db676eff844f_sb5dq8.png',
                  ],
                  [
                    'https://res.cloudinary.com/dadiutcqh/image/upload/v1781967243/54a30c3a4505cafd2a8b753e026b73f80e8d97a3_kzzqey.png',
                    'https://res.cloudinary.com/dadiutcqh/image/upload/v1781966564/e31e8b25a45e30befb5e8134306d7302e20e480f_pljnqm.png',
                  ]
                ].map((col, i) => (
                  <div key={i} style={{ overflow: 'hidden', height: 290, position: 'relative' }}>
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: 10,
                      animation: i % 2 === 0 ? 'scrollUpVertical 8s linear infinite' : 'scrollDownVertical 8s linear infinite',
                      height: 'max-content'
                    }}>
                      {[...col, ...col, ...col].map((src, idx) => (
                        <img key={idx} src={src} alt="Book" style={{
                          width: '100%', height: 140, objectFit: 'cover',
                          borderRadius: 8, boxShadow: '1px 2px 6px rgba(0,0,0,0.2)',
                          display: 'block', flexShrink: 0
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* BOOK SPINES — text sandwiched between two rows */}
      <section style={{ padding: '60px 0', overflow: 'hidden' }}>
        {/* Top row — infinite scroll right → left */}
        <div style={{ overflow: 'hidden', paddingBottom: 8 }}>
          <div style={{
            display: 'flex', gap: 30, alignItems: 'flex-end',
            width: 'max-content',
            animation: 'scrollLeft 40s linear infinite',
          }}>
            {[...TS, ...TS].map((s, i) => <Sp key={`t${i}`} src={s.src} h={s.h} w={s.w} r={s.r} />)}
          </div>
        </div>

        {/* Centre text */}
        <div style={{ textAlign: 'center', padding: '66px 24px', background: 'white', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 48, fontWeight: 600, fontFamily: 'Inter', lineHeight: 1.2 }}>
            <span style={{ color: 'black' }}>Building the Future of Digital </span><span style={{ color: BLUE }}>Libraries</span>
          </h2>
          <p style={{ fontSize: 16, fontWeight: 400, fontFamily: 'Inter', color: 'rgba(0,0,0,0.60)', marginTop: 12, maxWidth: 440, margin: '12px auto 0' }}>
            A complete digital system for colleges, universities and libraries.
          </p>
        </div>

        {/* Bottom row — infinite scroll left → right */}
        <div style={{ overflow: 'hidden', paddingTop: 8 }}>
          <div style={{
            display: 'flex', gap: 30, alignItems: 'flex-start',
            width: 'max-content',
            animation: 'scrollRight 40s linear infinite',
          }}>
            {[...BS, ...BS].map((s, i) => <Sp key={`b${i}`} src={s.src} h={s.h} w={s.w} r={s.r} />)}
          </div>
        </div>
      </section>

      {/* TRUSTED */}
      <section style={{ padding: '80px 80px' }}>
        <div ref={trustedRef} style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
            {/* Blue line grows down */}
            <div
              className="line-hidden"
              style={{ width: 7, height: 61, background: BLUE, borderRadius: 11, flexShrink: 0, marginTop: 4, animationDelay: '0s' }}
            />
            <div>
              <h2
                className="txt-hidden"
                style={{ fontSize: 32, fontWeight: 600, fontFamily: 'Inter', animationDelay: '0.15s' }}
              >
                <span style={{ color: 'black' }}>Trusted by the </span><span style={{ color: BLUE }}>best.</span>
              </h2>
              <p
                className="txt-hidden"
                style={{ fontSize: 16, fontWeight: 400, fontFamily: 'Inter', color: 'rgba(0,0,0,0.60)', marginTop: 8, animationDelay: '0.28s' }}
              >
                Our growth hackers are experts in the identifying and capitalizing on the most
              </p>
            </div>
          </div>
          {/* Logo cards — staggered pop-up */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 20, marginTop: 32 }}>
            {[
              'https://res.cloudinary.com/dadiutcqh/image/upload/v1782017261/2decbdfc393cbd31588216ba72e677316ba73125_tqtah5.png',
              'https://res.cloudinary.com/dadiutcqh/image/upload/v1782017284/2f8c789ce17bd7ed3d26af13b68b51a32e6d69e1_p56sol.png',
              'https://res.cloudinary.com/dadiutcqh/image/upload/v1782017261/2decbdfc393cbd31588216ba72e677316ba73125_tqtah5.png',
              'https://res.cloudinary.com/dadiutcqh/image/upload/v1782017284/2f8c789ce17bd7ed3d26af13b68b51a32e6d69e1_p56sol.png',
              'https://res.cloudinary.com/dadiutcqh/image/upload/v1782017261/2decbdfc393cbd31588216ba72e677316ba73125_tqtah5.png',
            ].map((src, i) => (
              <div
                key={i}
                className="logo-hidden"
                style={{
                  background: 'white', boxShadow: '0 4px 4px rgba(0,0,0,0.05)',
                  borderRadius: 10, padding: '28px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid rgba(0,0,0,0.06)',
                  animationDelay: `${0.35 + i * 0.1}s`,
                }}
              >
                <img src={src} alt={`Partner ${i + 1}`} style={{ maxHeight: 40, maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '50px 80px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <div className="feature-row" style={{ display: 'flex', gap: 60, alignItems: 'center', marginBottom: 100, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div className="anim-left-hidden" style={{ flex: '1 1 0', maxWidth: 500, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 30px rgba(26,115,232,0.1)' }}>
              <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784617028/14d18450-1565-4045-b65b-4a3f94d8965f_kr8fct.png" alt="Digital library experience" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="anim-right-hidden" style={{ flex: '1 1 0', maxWidth: 500, minWidth: 260 }}>
              <h2 style={{ fontSize: 32, fontWeight: 600, fontFamily: 'Inter', color: 'black', marginBottom: 16 }}>Digital library experience</h2>
              <p style={{ fontSize: 16, fontWeight: 500, fontFamily: 'Inter', color: 'rgba(0,0,0,0.60)', lineHeight: 1.6, marginBottom: 24 }}>
                Librix makes it simple to search, explore, and access resources while giving colleges a smarter way to manage books, members, requests, and everyday library operations.
              </p>
              <Link href="/register" style={{ display: 'inline-flex', padding: '10px 24px', borderRadius: 38, background: BLUE, color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter' }}>View All</Link>
            </div>
          </div>
          <div className="feature-row" style={{ display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div className="anim-left-hidden" style={{ flex: '1 1 0', maxWidth: 500, minWidth: 260 }}>
              <h2 style={{ fontSize: 32, fontWeight: 600, fontFamily: 'Inter', color: 'black', marginBottom: 16 }}>Complete library control</h2>
              <p style={{ fontSize: 16, fontWeight: 500, fontFamily: 'Inter', color: 'rgba(0,0,0,0.60)', lineHeight: 1.6, marginBottom: 24 }}>
                Librix provides colleges with a centralized library management system that simplifies book tracking, automates workflows, and helps librarians make smarter decisions with detailed insights.
              </p>
              <Link href="/register" style={{ display: 'inline-flex', padding: '10px 24px', borderRadius: 38, background: BLUE, color: 'white', fontSize: 16, fontWeight: 500, fontFamily: 'Inter' }}>View All</Link>
            </div>
            <div className="anim-right-hidden" style={{ flex: '1 1 0', maxWidth: 500, borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 30px rgba(26,115,232,0.1)' }}>
              <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784617837/afcbcb5b-40f5-4a4e-b590-cce3850eab54_ofaagn.png" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '40px 24px 60px' }}>
        <div style={{ maxWidth: 1203, margin: '0 auto', background: 'linear-gradient(127deg,#08655A 29%,#0D725D 50%,#2FCC72 100%)', borderRadius: 30, padding: '48px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -30, top: -60, width: 317, height: 317, background: 'rgba(255,255,255,0.09)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: -80, bottom: -80, width: 172, height: 172, background: 'rgba(255,255,255,0.09)', borderRadius: '50%', pointerEvents: 'none' }} />
          {/* Icon placeholder */}
          <div style={{ width: 67, height: 65, background: 'rgba(217,217,217,0.31)', borderRadius: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={28} color="white" />
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2 style={{ color: 'white', fontSize: 24, fontWeight: 600, fontFamily: 'Inter', marginBottom: 12 }}>Transform Your Library Today</h2>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 16, fontWeight: 400, fontFamily: 'Inter', maxWidth: 539, lineHeight: 1.6, marginBottom: 16 }}>
              Join colleges using Librix to simplify library management and transform the way they handle books, students, and daily operations.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['1000+ Members', 'Daily Updates', 'Active Discussions'].map(t => (
                <div key={t} style={{ background: 'rgba(255,255,255,0.21)', borderRadius: 28, padding: '4px 16px', color: 'white', fontSize: 14, fontWeight: 400, fontFamily: 'Inter' }}>{t}</div>
              ))}
            </div>
          </div>
          <Link href="/register" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'white', borderRadius: 38, color: 'rgba(0,0,0,0.81)', fontSize: 16, fontWeight: 500, fontFamily: 'Inter', flexShrink: 0 }}>
            <BookOpen size={20} color={DARK} /> Get Started
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: DARK }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '60px 70px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16}}>
                <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784448482/e2d37f27-b9e1-484c-a59b-79e086b1aec2_rah6h8.png" alt="Librix Logo" style={{ height: 44, width: 'auto', objectFit: 'contain', borderRadius: 6 }} />
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
          {/* Payment Methods */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ color: 'white', fontSize: 18, fontWeight: 600, fontFamily: 'Inter', marginBottom: 20 }}>Payment Methods Accepted</h4>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{src: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo_2014.svg', alt: 'Visa'}, {src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg', alt: 'Mastercard'}, {src: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Maestro_logo.svg', alt: 'Maestro'}, {src: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', alt: 'PayPal'}].map((card, idx) => (
                <div key={idx} style={{ width: 64, height: 40, background: 'white', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
                  <img src={card.src} alt={card.alt} style={{ width: '100%', height: 'auto', maxHeight: 24, objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: DARK, padding: '18px 24px', textAlign: 'center' }}>
          <div style={{ color: 'white', fontSize: 12, fontWeight: 500, fontFamily: 'Inter' }}>© 2026 Librix. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
