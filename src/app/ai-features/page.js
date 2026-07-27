'use client';
import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Bot, Search, TrendingUp, ThumbsUp, FileText, Tag, 
  Copy, BarChart3, BookOpen, BellRing, RefreshCw, MessageSquare, 
  Database, Cpu, LineChart, Settings, Eye, Lock, ShieldCheck, 
  Users, Layers, ArrowRight
} from 'lucide-react';

const BLUE = '#1A73E8';
const DARK = '#052033';
const PRIMARY = '#004AC6';

export default function AIFeaturesPage() {
  const NAV = ['Home', 'Platform', 'AI Features', 'Institutions'];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#FAF8FF', color: '#131B2E', overflowX: 'hidden', minHeight: '100vh', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: auto !important; overflow: visible !important; min-height: 100vh; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; }
        .nl:hover { color: #1A73E8 !important; }
        .glass-card { 
          background: rgba(255, 255, 255, 0.75); 
          backdrop-filter: blur(12px); 
          border: 1px solid #E2E8F0; 
          box-shadow: 0 30px 40px -20px rgba(0, 0, 0, 0.04); 
          transition: all 0.3s ease;
        }
        .glass-card:hover { 
          border-color: rgba(37, 99, 235, 0.5); 
          transform: translateY(-4px); 
          box-shadow: 0 35px 50px -15px rgba(0, 74, 198, 0.08); 
        }
        .stats-card { 
          background: #FFFFFF;
          border: 1px solid #F1F5F9; 
          padding: 32px; 
          border-radius: 24px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          transition: transform 0.3s ease; 
        }
        .stats-card:hover { transform: translateY(-5px); }
        .btn-primary {
          background: #004AC6;
          color: white;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background: #003899;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 74, 198, 0.35);
        }
        .btn-secondary {
          background: white;
          color: #131B2E;
          border: 1px solid #D9D9D9;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background: #F2F3FF;
          border-color: #004AC6;
        }
        @keyframes floatSlow { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-12px); } 
        }
        .animate-float { animation: floatSlow 6s ease-in-out infinite; }
        .timeline-line { 
          background: repeating-linear-gradient(to right, #2563EB 0, #2563EB 6px, transparent 6px, transparent 12px); 
        }
      `}</style>

      {/* Global Background Glows */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(0, 74, 198, 0.05)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(70, 72, 212, 0.05)', filter: 'blur(120px)' }} />
      </div>

      {/* NAVBAR (Exact same consistent structure as Landing & Platform pages) */}
      <div style={{ position: 'sticky', top: 16, zIndex: 100, padding: '0 27px' }}>
        <nav style={{ maxWidth: 1386, margin: '0 auto', background: 'white', boxShadow: '0px 4px 25.3px rgba(26,115,232,0.23)', borderRadius: 40, border: '1px solid #D9D9D9', padding: '0 40px', height: 71, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="https://res.cloudinary.com/dadiutcqh/image/upload/v1784448482/e2d37f27-b9e1-484c-a59b-79e086b1aec2_rah6h8.png" alt="Librix Logo" style={{ height: 50, width: 'auto', objectFit: 'contain', transform: 'scale(1.3)' }} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
            {NAV.map(l => (
              <Link
                key={l}
                href={l === 'Platform' ? '/platform' : l === 'AI Features' ? '/ai-features' : l === 'Institutions' ? '/institutions' : '/'}
                className="nl"
                style={{ color: l === 'AI Features' ? BLUE : 'black', fontSize: 16, fontFamily: 'Inter', fontWeight: l === 'AI Features' ? 600 : 400, transition: 'color 0.2s', borderBottom: l === 'AI Features' ? `2px solid ${BLUE}` : 'none', paddingBottom: l === 'AI Features' ? 2 : 0 }}
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

      <main style={{ position: 'relative', zIndex: 10, maxWidth: 1320, margin: '0 auto', padding: '60px 24px 80px' }}>
        
        {/* HERO SECTION */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: 54, alignItems: 'center', marginBottom: 120 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop:50 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 30, background: 'rgba(0, 74, 198, 0.08)', border: '1px solid rgba(0, 74, 198, 0.2)' }}>
                <Sparkles size={16} color={PRIMARY} />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: PRIMARY }}>Next-Gen Library Intelligence</span>
              </div>
            </div>
            
            <h1 style={{ fontSize: 54, fontWeight: 800, fontFamily: 'Inter', letterSpacing: '-0.04em', lineHeight: 1.12, color: '#131B2E' }}>
              AI That Works Inside Every Library.
            </h1>
            
            <p style={{ fontSize: 18, color: '#434655', lineHeight: 1.6, maxWidth: 540 }}>
              Transform your institution with a Smart Library Management Platform. Automate repetitive tasks, enhance resource discovery, and gain predictive insights with our enterprise-grade AI core.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, paddingTop: 8 }}>
              <Link href="/register" className="btn-primary" style={{ padding: '16px 34px', borderRadius: 14, fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Explore Platform <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="btn-secondary" style={{ padding: '16px 34px', borderRadius: 14, fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                Request Demo
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-10px', background: 'rgba(0, 74, 198, 0.12)', filter: 'blur(30px)', borderRadius: '50%', zIndex: 0 }} />
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnXe-S4cZituDvwDNFKLfFsqKHrZOW-s1ynnbUKj3qYrAhaJ5VLNf8wJLWEe2zIYTDNmGmahc2MJCmGsUyPZlNA7XX2nZgazO7HZe-IxWlG5gyx22DyTOkzJF6rcV711iW81LKWHe2FGxKA2LKwd1kmob2RNAVVsi80pEOS7g8hd0eqwxgr0I-q2Xci8RCH6RTIL0bKcYeboIvwg4Jbpvd0LBcI2FoiKFvZFwx-G9DIVtJ7OD_wNV4Lg" 
              alt="AI Library Management"
              className="animate-float"
              style={{ width: '100%', height: 'auto', borderRadius: 24, boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)', position: 'relative', zIndex: 1, display: 'block' }}
            />
          </div>
        </section>

        {/* AI HIGHLIGHTS ROW */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 90 }}>
          <div className="glass-card" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(0, 74, 198, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: PRIMARY }}>
              <Cpu size={28} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#131B2E' }}>Intelligent Automation</h3>
            <p style={{ fontSize: 15, color: '#434655', lineHeight: 1.6 }}>Eliminate manual data entry with self-cataloging systems and AI-powered automated metadata tagging.</p>
          </div>

          <div className="glass-card" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(70, 72, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4648D4' }}>
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#131B2E' }}>AI Semantic Search</h3>
            <p style={{ fontSize: 15, color: '#434655', lineHeight: 1.6 }}>Natural language queries that understand deep context, providing researchers with exact relevant resources instantly.</p>
          </div>

          <div className="glass-card" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(107, 110, 112, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#525657' }}>
              <TrendingUp size={28} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#131B2E' }}>Predictive Insights</h3>
            <p style={{ fontSize: 15, color: '#434655', lineHeight: 1.6 }}>Anticipate collection needs, student demand, and peak library traffic with advanced analytics engines.</p>
          </div>
        </section>

        {/* DASHBOARD SHOWCASE */}
        <section style={{ marginBottom: 100, textAlign: 'center' }}>
          <div style={{ maxWidth: 720, margin: '0 auto 40px' }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.02em', color: '#131B2E', marginBottom: 16 }}>
              Command Your Knowledge Hub
            </h2>
            <p style={{ fontSize: 16, color: '#434655', lineHeight: 1.6 }}>
              A unified dashboard that combines traditional management with real-time AI intelligence.
            </p>
          </div>

          <div style={{ maxWidth: 1140, margin: '0 auto', background: 'rgba(255, 255, 255, 0.8)', padding: 16, borderRadius: 30, border: '2px solid white', boxShadow: '0 30px 80px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVdMzFttrf975NqsA4EK3_ttN9eP8HR6DFaSUzGfBmTt93YNZk6KJ6dedXeUz_BLk6zRbVbyRcEUEoh1h0vn25MAWsbSY1kXtuRv6bvGxDNFW914ashtfE_j_cWir4naKgUaBixRRZOg0ZkHpfcEoYQa83gmuli98bkN7PsIafLHMQ3-6G1Rx7PYTDlc5jPmKHGBmP3MdFGjqsAyS-7XjNGLeo7u3pDlmmfXGPhdw2rrvgGLI67__2ug" 
                alt="Librix AI Dashboard"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* CORE AI FEATURES GRID (12 PREMIUM CARDS) */}
        <section style={{ marginBottom: 100 }}>
          <div style={{ marginBottom: 44 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: '#131B2E', marginBottom: 10, letterSpacing: '-0.02em' }}>
              The Intelligence Layer
            </h2>
            <p style={{ fontSize: 16, color: '#434655' }}>
              Deeply integrated features that redefine the modern library experience.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 24 }}>
            {[
              { icon: <Sparkles size={24} color={PRIMARY} />, title: "Smart Search", desc: "Semantic discovery across all physical and digital assets." },
              { icon: <ThumbsUp size={24} color={PRIMARY} />, title: "Book Recommendations", desc: "Personalized reading paths based on past borrowing history." },
              { icon: <FileText size={24} color={PRIMARY} />, title: "OCR Scanner", desc: "High-fidelity text extraction from legacy manuscripts and journals." },
              { icon: <Tag size={24} color={PRIMARY} />, title: "Metadata Generator", desc: "Auto-generate ISBN, authors, and Dewey topics from scans." },
              { icon: <Copy size={24} color={PRIMARY} />, title: "Duplicate Detection", desc: "Intelligent automatic cleanup of redundant catalog entries." },
              { icon: <Bot size={24} color={PRIMARY} />, title: "Catalog Assistant", desc: "Conversational interface for complex cataloging workflows." },
              { icon: <BarChart3 size={24} color={PRIMARY} />, title: "Reading Analytics", desc: "Visualize student engagement levels across different genres." },
              { icon: <TrendingUp size={24} color={PRIMARY} />, title: "Book Demand Prediction", desc: "Forecasting which course titles will trend in the next semester." },
              { icon: <BookOpen size={24} color={PRIMARY} />, title: "Report Generator", desc: "Automated institutional audit and usage reports in seconds." },
              { icon: <BellRing size={24} color={PRIMARY} />, title: "Smart Notifications", desc: "Proactive automated alerts for due dates, fines, and reserves." },
              { icon: <RefreshCw size={24} color={PRIMARY} />, title: "Digital Resource Assistant", desc: "Optimizing multi-campus license usage for e-books and journals." },
              { icon: <MessageSquare size={24} color={PRIMARY} />, title: "Natural Language Assistant", desc: "Ask complex questions about your library data in plain English." }
            ].map((card, i) => (
              <div key={i} className="glass-card" style={{ padding: 28, borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ marginBottom: 14 }}>
                    {card.icon}
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 700, color: '#131B2E', marginBottom: 8 }}>{card.title}</h4>
                  <p style={{ fontSize: 14, color: '#434655', lineHeight: 1.5 }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* USER PERSONAS SECTION */}
        <section style={{ marginBottom: 100 }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, color: '#131B2E', marginBottom: 44, textAlign: 'center', letterSpacing: '-0.02em' }}>
            Built for Every Role
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { title: "Students", desc: "Find research material instantly with intelligent discovery paths and automated citation exports.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuWiD-JBw5p6YR_BwcwOR_jcsyI9PSCxXlWdNnfyFaSay4s1QouPv2qFya2CTy-l_Km0ZJgX07QRdTTibPNyzud5H8z7pkGRGImGxHAZRWlvSePRrMV6csnb2eeY7ZDripxmm357LfWB8-7Dlr0Lb9s0elULfeRjP2ApSycv9Fn3KEfIxf7S5qtqa4zrtIRp3M3AXuvLaf7qc9fFqiGmloRDH4X_L3OTRw38aMc_NdKflrupFcqrDZ1Q" },
              { title: "Faculty", desc: "Curate course reading lists, verify asset availability, and monitor class academic engagement effortlessly.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxYMIF7tlAaEj8kilFM211HAxFkXRqAxLFvDkHDCHJ15JkNkB50jEffIC67gHEr3TyEa0HbuzJcdS91c0kq8XQgFw1D4M1-PMAIF1WeSeJU_corPGiund5V70yRhPzNrLPdosFL8MZQ41CCj9EcQFsvO6y7cYfYvkdxju3Ocf7nM7-x62MR9HQczgudVD62vV8ykYXxj57pMxEYGy7AQt2Lyd920JSK9fQGKSDrzXAhz7OiNUgeZmV0w" },
              { title: "Librarians", desc: "Automate cataloging, barcode circulation, and manage vast multi-branch collections with AI assistance.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7wH5ffOMmrPFNMEbRDVHIjVmoGxQ_GejRU2JHxoinmsIHD_IZHBrIFVeai8Tq2033UHglAd3foueV-4MIfAagL4eCFu878J8UpUOk_xVVKtLqTClT3ZQLCy-G-y2ib35IbM44dIfrUkIwlXPIgxlqDM_BU1HbultfqC5YXuoKLOsZ2jXjy6c-6V-Ngyen6CZLwt7TWX81WKUmhpquqC1KPt4zf5SjI1q6dq-Bv3Woe-saLn1dq13-mw" },
              { title: "Administrators", desc: "Access real-time compliance reports and institutional financial analytics to drive smarter decisions.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3fIYbiodjfvhe4R6mksDFcN3weixJSkjNs66TmyjWx_nBpMSMROcFNdpBBVa4pv1GZvJvKxtkpcMKPkxmF5wZ_ulsNfC7ieGRWgvnDx7YSkIudz9pc44Wa98rfXH59n8iIlktGAK7ut2_nCs_Av4x0n1h247SjGSdZPlOKWxuN0qaF9c8yBmV7JjABq89vItaQSL31NaxQdvg2pPOqO80NmWMw0L2I8AXtKdrMtliMtqEaIDh555uPA" }
            ].map((p, i) => (
              <div key={i} className="glass-card" style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img src={p.img} alt={p.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ fontSize: 20, fontWeight: 700, color: '#131B2E', marginBottom: 8 }}>{p.title}</h4>
                  <p style={{ fontSize: 14, color: '#434655', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RESPONSIBLE AI BANNER */}
        <section style={{ marginBottom: 30, padding: '56px 48px', background: 'linear-gradient(135deg, #004AC6 0%, #002674 100%)', color: 'white', borderRadius: 32, boxShadow: '0 25px 60px rgba(0, 74, 198, 0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div>
              <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 20, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Built with Integrity:<br />Responsible AI
              </h2>
              <p style={{ fontSize: 16, opacity: 0.9, lineHeight: 1.6, marginBottom: 36, maxWidth: 520 }}>
                Librix is committed to ethical AI development, ensuring your institution&apos;s data remains private, strictly encrypted, and all operational decisions stay human-centered.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <Lock size={28} style={{ flexShrink: 0, opacity: 0.95 }} />
                  <div>
                    <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Data Privacy</h4>
                    <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.4 }}>Full GDPR/FERPA compliance with zero data leakage.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <ShieldCheck size={28} style={{ flexShrink: 0, opacity: 0.95 }} />
                  <div>
                    <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Secure Processing</h4>
                    <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.4 }}>Encryption at rest and in transit for all AI tasks.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <Users size={28} style={{ flexShrink: 0, opacity: 0.95 }} />
                  <div>
                    <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Role-based AI</h4>
                    <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.4 }}>AI capabilities scoped strictly by user credentials.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <Eye size={28} style={{ flexShrink: 0, opacity: 0.95 }} />
                  <div>
                    <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Transparent Suggestions</h4>
                    <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.4 }}>Every AI recommendation includes a clear &ldquo;Why&rdquo; explanation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw7ltrH6jrT2YAQGP0T7EZ087j5zuqmeuO1lUeMZiE2hKyYRwwdtOZ545r2fsFGK_uEbrt_Q58O8WyRORv1W86SIvZKj7dX4shG02FBXFMQPbXQwkOfOU-IJ68ME2DTQwOCpyDdasA34KB_GvlJBXRU0QRzl4_EDqUm1CLrPnCMw7k7FAX58riYLgGl3thzYpoHtYsnMTo2WgPizfwTA4EyWaEPHyIhKPK09ju5O9U5UjZijXvIIcIHg" 
                alt="Responsible AI Integrity"
                style={{ width: '100%', maxWidth: 380, height: 'auto', display: 'block', filter: 'drop-shadow(0 25px 40px rgba(0, 0, 0, 0.4))' }}
              />
            </div>
          </div>
        </section>

        
        
      </main>

      {/* FOOTER (Exact same as LandingPage & PlatformPage) */}
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
