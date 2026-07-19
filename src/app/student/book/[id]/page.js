'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  BookOpen, User, Star, Heart, Bell, CheckCircle,
  BookMarked, FileText, MessageSquare, History, ChevronRight,
  ClipboardList, Loader2, ArrowLeft,
} from 'lucide-react';
import RequestModal from '@/components/student/RequestModal';

function Stars({ n, size = 14 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(n) ? '#F59E0B' : 'none'}
          color="#F59E0B"
        />
      ))}
    </span>
  );
}

export default function BookDetail() {
  const router = useRouter();
  const params = useParams();
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');
  const [wishlist, setWishlist] = useState(false);
  const [notified, setNotified] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    fetch(`/api/books/${params.id}`)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          setError(res.error);
        } else {
          setData(res);
        }
      })
      .catch(() => setError('Failed to load book details.'))
      .finally(() => setLoading(false));

    // Check if book is already requested or borrowed
    Promise.all([
      fetch('/api/requests').then(r => r.json()),
      fetch('/api/borrow').then(r => r.json()),
    ]).then(([reqData, borrowData]) => {
      const pendingReq = (reqData.requests || []).some(
        r => ['requested', 'approved'].includes(r.status) &&
             (r.bookId?._id === params.id || r.bookId === params.id)
      );
      const activeBorrow = (borrowData.records || []).some(
        r => ['issued', 'return_pending', 'overdue'].includes(r.status) &&
             (r.bookId?._id === params.id || r.bookId === params.id)
      );
      if (pendingReq || activeBorrow) setIsRequested(true);
    }).catch(() => {});

    // Check if book is in wishlist
    try {
      const stored = localStorage.getItem('librix_wishlist');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.some(b => (b._id || b.id) === params.id)) {
          setWishlist(true);
        }
      }
    } catch {}
  }, [params?.id]);


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#F9FAFB', fontFamily: 'Inter,sans-serif' }}>
        <Loader2 size={36} style={{ animation: 'spin 0.8s linear infinite', color: '#6366F1' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (error || !data?.book) {
    return (
      <div style={{ padding: 60, textAlign: 'center', fontFamily: 'Inter,sans-serif', background: '#F9FAFB', minHeight: '100%' }}>
        <BookOpen size={48} style={{ margin: '0 auto 16px', color: '#D1D5DB' }} />
        <h2 style={{ fontSize: 20, color: '#111827', marginBottom: 8 }}>{error || 'Book not found'}</h2>
        <Link href="/student/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: '#6366F1', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          <ArrowLeft size={16} /> Back to Search
        </Link>
      </div>
    );
  }

  const { book, reviews = [], similar = [] } = data;
  const inv = book.inventory || { total: 0, available: 0 };
  const totalCopies = inv.total || 0;
  const availCopies = inv.available || 0;
  const issuedCopies = Math.max(0, totalCopies - availCopies);
  const stats = book.stats || { avgRating: 0, reviewCount: 0, ratingBars: [] };

  const learnPoints = [
    'Gain comprehensive mastery over core concepts and methodologies.',
    'Enhance practical application through structured frameworks.',
    'Develop analytical skills tailored to academic and professional success.',
    'Understand best practices, industry standards, and modern techniques.',
  ];

  return (
    <div style={{ fontFamily: 'Inter,sans-serif', minHeight: '100%', background: '#F9FAFB', padding: '28px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-btn { background: none; border: none; cursor: pointer; font-family: Inter, sans-serif; }
        .sim-card:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.08); border-color: #6366F1 !important; }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, background: '#6366F1', color: '#fff', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>{toast}</div>
      )}

      {/* Breadcrumb matching Image 2 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: '#6B7280' }}>
        <Link href="/student/dashboard" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link href="/student/search" style={{ color: '#6B7280', textDecoration: 'none' }}>Search Books</Link>
        <ChevronRight size={14} />
        <span style={{ color: '#111827', fontWeight: 600 }}>Book Details</span>
      </div>

      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
        {/* ── LEFT COLUMN (Main Info & Tabs) ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Top Hero Card matching Image 2 */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Cover Image */}
              <div style={{ width: 170, height: 240, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6', boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }}>
                {book.cover ? (
                  <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1a1a2e,#16213e)', color: 'white', padding: 16, textAlign: 'center' }}>
                    <div>
                      <BookOpen size={40} style={{ margin: '0 auto 12px', opacity: 0.7 }} />
                      <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{book.title}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Book Metadata details */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 6, lineHeight: 1.25 }}>{book.title}</h1>
                <div style={{ fontSize: 15, color: '#4B5563', marginBottom: 12 }}>{book.category} Edition • Comprehensive Guide</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <User size={16} color="#6B7280" />
                  <span style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}>{book.author}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <Stars n={stats.avgRating || 4.5} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{stats.avgRating || 4.5}</span>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>({stats.reviewCount || 12} reviews)</span>
                </div>

                {/* Metadata Row matching Image 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 14, padding: '16px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      <BookMarked size={13} /> Category
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{book.category || 'General'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      <FileText size={13} /> ISBN
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{book.isbn || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      <FileText size={13} /> Pages
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{book.pages || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      <History size={13} /> Published
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{book.publishedYear || book.year || '2023'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      <MessageSquare size={13} /> Language
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{book.language || 'English'}</div>
                  </div>
                </div>

                {/* Short preview description */}
                <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
                  {book.description
                    ? (book.description.length > 200 ? book.description.slice(0, 200) + '...' : book.description)
                    : `${book.title} by ${book.author} is a highly regarded work in the field of ${book.category || 'literature'}, providing structured frameworks and essential knowledge for students and practitioners.`}
                  {' '}
                  <span onClick={() => setTab('overview')} style={{ color: '#6366F1', fontWeight: 600, cursor: 'pointer' }}>Read More</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Bar matching Image 2 */}
          <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid #E5E7EB', marginBottom: 20 }}>
            {[
              { id: 'overview', label: 'Overview', icon: <FileText size={15} /> },
              { id: 'details', label: 'Details', icon: <ClipboardList size={15} /> },
              { id: 'toc', label: 'Table of Contents', icon: <BookOpen size={15} /> },
              { id: 'reviews', label: `Reviews (${stats.reviewCount || reviews.length})`, icon: <MessageSquare size={15} /> },
            ].map(t => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="tab-btn"
                  style={{
                    padding: '12px 18px',
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 14, fontWeight: active ? 700 : 500,
                    color: active ? '#6366F1' : '#6B7280',
                    borderBottom: active ? '2px solid #6366F1' : '2px solid transparent',
                    marginBottom: -2, transition: 'all 0.15s'
                  }}
                >
                  {t.icon} {t.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {tab === 'overview' && (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>About this book</h3>
              <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.7, marginBottom: 24 }}>
                {book.description || `${book.title} is a must-read for students and enthusiasts. It presents practical techniques and best practices for mastering ${book.category || 'the subject'}, covering core terminology, foundational theory, error handling, practical exercises, and much more.`}
              </p>

              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 14px' }}>What you will learn</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {learnPoints.map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151' }}>
                    <CheckCircle size={17} color="#6366F1" fill="#EEF2FF" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Audience</h3>
              <p style={{ fontSize: 14, color: '#4B5563', margin: 0 }}>
                Students, Researchers, Teachers, and anyone who wants to deepen their understanding of {book.category || 'this domain'}.
              </p>
            </div>
          )}

          {/* TAB 2: DETAILS */}
          {tab === 'details' && (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Technical & Publication Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 18 }}>
                {[
                  { label: 'Title', val: book.title },
                  { label: 'Author', val: book.author },
                  { label: 'Publisher', val: book.publisher || 'Academic Press / McGraw-Hill' },
                  { label: 'Publication Year', val: book.publishedYear || book.year || '2023' },
                  { label: 'ISBN Number', val: book.isbn || '978-0-000000-00-0' },
                  { label: 'Page Count', val: book.pages ? `${book.pages} pages` : 'Not specified' },
                  { label: 'Language', val: book.language || 'English' },
                  { label: 'Category / Genre', val: book.category || 'General' },
                ].map((row, i) => (
                  <div key={i} style={{ padding: 14, background: '#F9FAFB', borderRadius: 8, border: '1px solid #F3F4F6' }}>
                    <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>{row.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{row.val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TABLE OF CONTENTS */}
          {tab === 'toc' && (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 16px' }}>Table of Contents</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { ch: 'Chapter 1', title: `Introduction to ${book.category || 'the Subject'}`, pages: '1 – 24' },
                  { ch: 'Chapter 2', title: 'Core Foundations and Theoretical Frameworks', pages: '25 – 68' },
                  { ch: 'Chapter 3', title: 'Key Principles and Best Practices', pages: '69 – 112' },
                  { ch: 'Chapter 4', title: 'Case Studies and Practical Application', pages: '113 – 184' },
                  { ch: 'Chapter 5', title: 'Advanced Topics and Emerging Trends', pages: '185 – 240' },
                  { ch: 'Chapter 6', title: 'Summary, Glossary, and Index', pages: '241 – End' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #F3F4F6' }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1', marginRight: 12 }}>{item.ch}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#111827' }}>{item.title}</span>
                    </div>
                    <span style={{ fontSize: 13, color: '#6B7280' }}>{item.pages}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {tab === 'reviews' && (
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Reviews & Ratings</h3>
                <span style={{ fontSize: 13, color: '#6366F1', fontWeight: 600 }}>{reviews.length} Total Reviews</span>
              </div>

              {/* Rating Summary Box matching Image 2 */}
              <div style={{ display: 'flex', gap: 28, alignItems: 'center', background: '#F9FAFB', padding: 20, borderRadius: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', minWidth: 100 }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{stats.avgRating || 4.7}</div>
                  <div style={{ margin: '6px 0 4px' }}><Stars n={stats.avgRating || 4.7} size={16} /></div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{stats.reviewCount || reviews.length} reviews</div>
                </div>

                <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(stats.ratingBars && stats.ratingBars.length > 0 ? stats.ratingBars : [
                    { star: 5, pct: 85 }, { star: 4, pct: 10 }, { star: 3, pct: 3 }, { star: 2, pct: 1 }, { star: 1, pct: 1 }
                  ]).map(bar => (
                    <div key={bar.star} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#4B5563' }}>
                      <span style={{ width: 14, textAlign: 'right' }}>{bar.star}</span>
                      <Star size={12} fill="#F59E0B" color="#F59E0B" />
                      <div style={{ flex: 1, height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${bar.pct}%`, height: '100%', background: '#F59E0B', borderRadius: 3 }} />
                      </div>
                      <span style={{ width: 36, textAlign: 'right', color: '#6B7280' }}>{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div style={{ padding: '36px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                  No student reviews yet for this book. Be the first to borrow and review!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {reviews.map(r => (
                    <div key={r._id} style={{ padding: 16, border: '1px solid #F3F4F6', borderRadius: 10, background: '#F9FAFB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6366F1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                            {r.user?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{r.user}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{r.date ? new Date(r.date).toLocaleDateString() : 'Recent'}</div>
                          </div>
                        </div>
                        <Stars n={r.rating} />
                      </div>
                      <p style={{ fontSize: 13, color: '#4B5563', margin: 0, lineHeight: 1.5 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── RIGHT COLUMN (Sidebar Cards matching Image 2, width ~320px) ── */}
        <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Card 1: Availability & Actions */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Availability</span>
              <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: availCopies > 0 ? '#DCFCE7' : '#FEF2F2', color: availCopies > 0 ? '#16A34A' : '#EF4444' }}>
                {availCopies > 0 ? 'Available' : 'Issued'}
              </span>
            </div>

            {/* Total / Available / Issued Stats Row matching Image 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', padding: '14px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Total Copies</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{totalCopies}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Available</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#16A34A' }}>{availCopies}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Issued</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#EF4444' }}>{issuedCopies}</div>
              </div>
            </div>

            {/* Action Buttons Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isRequested ? (
                <button disabled style={{ width: '100%', padding: '12px', background: '#EEF2FF', color: '#6366F1', border: '1px solid #C7D2FE', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <CheckCircle size={17} /> Request Sent
                </button>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  disabled={availCopies < 1}
                  style={{
                    width: '100%', padding: '12px', background: availCopies < 1 ? '#F3F4F6' : '#6366F1', color: availCopies < 1 ? '#9CA3AF' : 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: availCopies < 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: availCopies < 1 ? 'none' : '0 2px 8px rgba(99,102,241,0.3)'
                  }}
                  onMouseEnter={e => { if (availCopies >= 1) e.currentTarget.style.background = '#4F46E5'; }}
                  onMouseLeave={e => { if (availCopies >= 1) e.currentTarget.style.background = '#6366F1'; }}
                >
                  {availCopies < 1 ? 'Join Waitlist' : '📚 Request Book'}
                </button>
              )}

              <button
                onClick={() => {
                  const nextState = !wishlist;
                  setWishlist(nextState);
                  showToast(nextState ? 'Added to Wishlist ❤️' : 'Removed from Wishlist');
                  try {
                    const stored = localStorage.getItem('librix_wishlist');
                    let list = stored ? JSON.parse(stored) : [];
                    if (!Array.isArray(list)) list = [];
                    if (nextState) {
                      if (!list.some(b => (b._id || b.id) === book._id)) {
                        list.push({ _id: book._id, title: book.title, author: book.author, cover: book.cover, category: book.category });
                      }
                    } else {
                      list = list.filter(b => (b._id || b.id) !== book._id);
                    }
                    localStorage.setItem('librix_wishlist', JSON.stringify(list));
                  } catch {}
                }}
                style={{ width: '100%', padding: '10px', background: wishlist ? '#FEF2F2' : 'white', color: wishlist ? '#EF4444' : '#6366F1', border: `1px solid ${wishlist ? '#FECACA' : '#E5E7EB'}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
              >
                <Heart size={16} fill={wishlist ? '#EF4444' : 'none'} /> {wishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </button>

              <button
                onClick={() => { setNotified(!notified); showToast(notified ? 'Notification removed' : 'We will notify you when available! 🔔'); }}
                style={{ width: '100%', padding: '10px', background: notified ? '#EEF2FF' : 'white', color: '#6366F1', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
              >
                <Bell size={16} fill={notified ? '#6366F1' : 'none'} /> {notified ? 'Notification Active' : 'Notify Me'}
              </button>
            </div>
          </div>

          {/* Card 2: Book Information matching Image 2 */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Book Information</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Publisher', val: book.publisher || 'Prentice Hall' },
                { label: 'Edition', val: '1st Edition' },
                { label: 'Publication Year', val: book.publishedYear || book.year || '2023' },
                { label: 'Country', val: 'India / USA' },
                { label: 'Language', val: book.language || 'English' },
                { label: 'Format', val: 'Paperback / Hardcover' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i === 5 ? 'none' : '1px solid #F3F4F6', fontSize: 13 }}>
                  <span style={{ color: '#6B7280' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: '#111827', textAlign: 'right' }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Similar Books matching Image 2 */}
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Similar Books</span>
              <Link href="/student/search" style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', textDecoration: 'none' }}>View All</Link>
            </div>

            {similar.length === 0 ? (
              <div style={{ fontSize: 13, color: '#9CA3AF', padding: '10px 0', textAlign: 'center' }}>No similar books found</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {similar.slice(0, 3).map(s => (
                  <div key={s._id} className="sim-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 10, border: '1px solid #F3F4F6', background: 'white', transition: 'all 0.2s' }}>
                    {/* Mini cover */}
                    <div style={{ width: 45, height: 62, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#F3F4F6' }}>
                      {s.cover ? (
                        <img src={s.cover} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#6366F1,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <BookOpen size={16} />
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{s.author}</div>
                      <Stars n={4.5} size={11} />
                    </div>

                    <Link
                      href={`/student/book/${s._id}`}
                      style={{ padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: 6, background: 'white', color: '#6366F1', fontSize: 12, fontWeight: 600, textDecoration: 'none', transition: 'all 0.15s' }}
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Request Modal */}
      {showModal && data?.book && (
        <RequestModal
          book={data.book}
          onClose={() => setShowModal(false)}
          onSuccess={(msg) => { showToast(msg); setIsRequested(true); }}
        />
      )}
    </div>
  );
}
