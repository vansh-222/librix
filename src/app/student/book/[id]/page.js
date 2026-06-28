'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, User, Star, Heart, Bell, CheckCircle,
  BookMarked, FileText, MessageSquare, History, ChevronRight,
  ClipboardList,
} from 'lucide-react';

const LEARN = [
  'Write clean and maintainable code',
  'Improve code readability and teamwork',
  'Refactor and improve existing code',
  'Follow best practices and coding standards',
];

const SIMILAR = [
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt',    rating: 4.6, bg: '#1a1a2e' },
  { title: 'Code Complete',            author: 'Steve McConnell', rating: 4.5, bg: '#16213e' },
  { title: 'Refactoring',             author: 'Martin Fowler',   rating: 4.8, bg: '#0f3460' },
];

const BARS = [
  { star: 5, pct: 85 }, { star: 4, pct: 10 },
  { star: 3, pct: 3  }, { star: 2, pct: 1  }, { star: 1, pct: 1 },
];

function Stars({ n, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size}
          fill={i <= Math.round(n) ? '#F59E0B' : 'none'}
          color="#F59E0B" />
      ))}
    </span>
  );
}

export default function BookDetail() {
  const [tab, setTab] = useState('overview');

  return (
    <div style={{ fontFamily: 'Inter,sans-serif', height: '100%', overflowY: 'auto', background: '#F9FAFB', padding: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .tab-btn { background: none; border: none; cursor: pointer; font-family: Inter; }
        .view-btn:hover { background: #6C5CE7 !important; color: white !important; }
        .issue-btn:hover { opacity: 0.9; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: '#6B7280' }}>
        <Link href="/student/dashboard" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link href="/student/search" style={{ color: '#6B7280', textDecoration: 'none' }}>Search Books</Link>
        <ChevronRight size={14} />
        <span style={{ color: '#111827', fontWeight: 500 }}>Book Details</span>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* ── LEFT CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Book header card */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              {/* Cover */}
              <div style={{ width: 155, height: 215, background: 'linear-gradient(145deg,#1a1a2e,#16213e)', borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 16px rgba(0,0,0,0.25)', padding: 16 }}>
                <div style={{ textAlign: 'center', color: 'white' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>Clean Code</div>
                  <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1.4 }}>A Handbook of Agile Software Craftsmanship</div>
                  <div style={{ marginTop: 16, fontSize: 10, color: '#64748B' }}>Robert C. Martin</div>
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Clean Code</h1>
                <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 12 }}>A Handbook of Agile Software Craftsmanship</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <User size={15} color="#6B7280" />
                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>Robert C. Martin</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <Stars n={4.7} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>4.7</span>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>(125 reviews)</span>
                </div>

                {/* Meta row */}
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', padding: '14px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', marginBottom: 14 }}>
                  {[
                    { icon: <BookMarked size={13} color="#6B7280" />, label: 'Category',  val: 'Programming' },
                    { icon: <FileText size={13} color="#6B7280" />,    label: 'ISBN',      val: '978-0132350884' },
                    { icon: <FileText size={13} color="#6B7280" />,    label: 'Pages',     val: '464' },
                    { icon: <History size={13} color="#6B7280" />,     label: 'Published', val: 'August 2008' },
                    { icon: <MessageSquare size={13} color="#6B7280"/>, label: 'Language', val: 'English' },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {m.icon}
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>{m.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{m.val}</span>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>
                  Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Clean code is not just about making code work, but about making it right, making it efficient, and making it maintainable.{' '}
                  <span style={{ color: '#6C5CE7', fontWeight: 500, cursor: 'pointer' }}>Read More</span>
                </p>
              </div>
            </div>
          </div>

          {/* Tabs card */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB' }}>
              {[
                { id: 'overview', icon: <BookOpen size={14} />,      label: 'Overview' },
                { id: 'details',  icon: <FileText size={14} />,       label: 'Details' },
                { id: 'toc',      icon: <ClipboardList size={14} />,  label: 'Table of Contents' },
                { id: 'reviews',  icon: <MessageSquare size={14} />,  label: 'Reviews (125)' },
              ].map(t => (
                <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '13px 18px',
                  fontSize: 13, fontWeight: 500,
                  color: tab === t.id ? '#6C5CE7' : '#6B7280',
                  borderBottom: tab === t.id ? '2px solid #6C5CE7' : '2px solid transparent',
                }}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 10 }}>About this book</h3>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>Clean Code is a must-read for every programmer. It presents practical techniques and best practices for writing clean, maintainable, and efficient code. The book covers naming conventions, functions, comments, error handling, unit testing, and much more.</p>
              </div>

              <div style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 12 }}>What you will learn</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {LEARN.map((l, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle size={16} color="#6C5CE7" fill="#EDE9FE" />
                      <span style={{ fontSize: 14, color: '#374151' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Audience</h3>
                <p style={{ fontSize: 14, color: '#6B7280' }}>Software Developers, Programmers, Students, and anyone who wants to write better code.</p>
              </div>

              {/* Reviews */}
              <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Reviews & Ratings</h3>
                  <span style={{ fontSize: 13, color: '#6C5CE7', fontWeight: 500, cursor: 'pointer' }}>View All Reviews</span>
                </div>
                <div style={{ display: 'flex', gap: 28 }}>
                  {/* Big score */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 52, fontWeight: 700, color: '#111827', lineHeight: 1 }}>4.7</div>
                    <Stars n={4.7} size={16} />
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>125 reviews</div>
                  </div>
                  {/* Bars */}
                  <div style={{ flex: 1 }}>
                    {BARS.map(b => (
                      <div key={b.star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: '#6B7280', width: 10, textAlign: 'right' }}>{b.star}</span>
                        <Star size={11} fill="#F59E0B" color="#F59E0B" />
                        <div style={{ flex: 1, height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${b.pct}%`, height: '100%', background: '#F59E0B', borderRadius: 4 }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#9CA3AF', width: 28 }}>{b.pct}%</span>
                      </div>
                    ))}
                  </div>
                  {/* Sample review */}
                  <div style={{ flex: 1, background: '#F9FAFB', borderRadius: 10, padding: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 30, height: 30, background: '#6C5CE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>A</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Aman Sharma</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>20 May 2026</div>
                      </div>
                      <Stars n={5} size={12} />
                    </div>
                    <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>Excellent book! Helped me a lot in improving my coding skills and understanding best practices.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ width: 268, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Availability */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Availability</span>
              <span style={{ padding: '3px 10px', background: '#DCFCE7', color: '#15803D', fontSize: 12, fontWeight: 600, borderRadius: 9999 }}>Available</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Total Copies',     val: '5', color: '#111827' },
                { label: 'Available Copies', val: '2', color: '#16A34A' },
                { label: 'Issued Copies',    val: '3', color: '#DC2626' },
              ].map((c, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.val}</div>
                  <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2, lineHeight: 1.3 }}>{c.label}</div>
                </div>
              ))}
            </div>
            <button className="issue-btn" style={{ width: '100%', padding: '11px', background: '#6C5CE7', border: 'none', borderRadius: 8, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Issue Book</button>
            <button style={{ width: '100%', padding: '10px', background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Heart size={15} color="#6B7280" /> Add to Wishlist
            </button>
            <button style={{ width: '100%', padding: '10px', background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, color: '#374151', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Bell size={15} color="#6B7280" /> Notify Me
            </button>
          </div>

          {/* Book Information */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 14 }}>Book Information</div>
            {[
              ['Publisher',        'Prentice Hall'],
              ['Edition',          '1st Edition'],
              ['Publication Year', '2008'],
              ['Country',          'United States'],
              ['Language',         'English'],
              ['Format',           'Paperback'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                <span style={{ fontSize: 13, color: '#6B7280' }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Similar Books */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Similar Books</span>
              <span style={{ fontSize: 13, color: '#6C5CE7', fontWeight: 500, cursor: 'pointer' }}>View All</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SIMILAR.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 58, background: b.bg, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={15} color="rgba(255,255,255,0.6)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>{b.author}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
                      <Star size={11} fill="#F59E0B" color="#F59E0B" />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{b.rating}</span>
                    </div>
                  </div>
                  <button className="view-btn" style={{ padding: '5px 12px', border: '1px solid #E5E7EB', borderRadius: 6, background: 'white', color: '#374151', fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}>View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
