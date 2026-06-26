'use client';
import { BookOpen, Star, TrendingUp, Sparkles, Users, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState('for-you');

  const stats = [
    { label: 'Personalized', value: '12', subtitle: 'Recommendations', icon: Sparkles, color: '#6C5CE7' },
    { label: 'Popular Now', value: '8', subtitle: 'Trending Books', icon: TrendingUp, color: '#F59E0B' },
    { label: 'New Arrivals', value: '15', subtitle: 'This Week', icon: Clock, color: '#10B981' },
  ];

  const forYouBooks = [
    { id: 1, title: 'Atomic Habits', author: 'James Clear', rating: 4.8, genre: 'Self-Help', reason: 'Based on your reading history', available: true, waitlist: 0 },
    { id: 2, title: 'The Psychology of Money', author: 'Morgan Housel', rating: 4.7, genre: 'Finance', reason: 'Readers like you enjoyed', available: true, waitlist: 0 },
    { id: 3, title: 'Educated', author: 'Tara Westover', rating: 4.9, genre: 'Biography', reason: 'Trending in your genre', available: false, waitlist: 3 },
    { id: 4, title: 'Sapiens', author: 'Yuval Noah Harari', rating: 4.6, genre: 'History', reason: 'Popular with students', available: true, waitlist: 0 },
    { id: 5, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rating: 4.5, genre: 'Psychology', reason: 'Matches your interests', available: true, waitlist: 0 },
    { id: 6, title: 'The Lean Startup', author: 'Eric Ries', rating: 4.4, genre: 'Business', reason: 'Based on your reading history', available: false, waitlist: 5 },
  ];

  const popularBooks = [
    { id: 1, title: 'Project Hail Mary', author: 'Andy Weir', rating: 4.9, genre: 'Sci-Fi', borrowCount: 45, available: false, waitlist: 8 },
    { id: 2, title: 'The Midnight Library', author: 'Matt Haig', rating: 4.7, genre: 'Fiction', borrowCount: 38, available: true, waitlist: 0 },
    { id: 3, title: 'Dune', author: 'Frank Herbert', rating: 4.8, genre: 'Sci-Fi', borrowCount: 32, available: true, waitlist: 0 },
    { id: 4, title: 'The Silent Patient', author: 'Alex Michaelides', rating: 4.6, genre: 'Thriller', borrowCount: 28, available: false, waitlist: 4 },
  ];

  const newArrivals = [
    { id: 1, title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', rating: 4.8, genre: 'Fiction', arrivedDate: '23 Jun 2024', available: true },
    { id: 2, title: 'The Wager', author: 'David Grann', rating: 4.7, genre: 'History', arrivedDate: '22 Jun 2024', available: true },
    { id: 3, title: 'Fourth Wing', author: 'Rebecca Yarros', rating: 4.9, genre: 'Fantasy', arrivedDate: '21 Jun 2024', available: false },
  ];

  const renderBooks = () => {
    let books = [];
    if (activeTab === 'for-you') books = forYouBooks;
    else if (activeTab === 'popular') books = popularBooks;
    else books = newArrivals;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {books.map(book => (
          <div key={book.id} style={{
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: 10,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              width: '100%',
              height: 200,
              background: 'linear-gradient(135deg, #6C5CE7, #A78BFA)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: 12,
            }}>
              <BookOpen size={40} color="rgba(255,255,255,0.6)" />
              {!book.available && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#DC2626',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: 6,
                }}>
                  Unavailable
                </div>
              )}
              {book.genre && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: 'rgba(255,255,255,0.9)',
                  color: '#6C5CE7',
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: 6,
                }}>
                  {book.genre}
                </div>
              )}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 4, lineHeight: 1.3 }}>{book.title}</div>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>{book.author}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{book.rating}</span>
              {book.borrowCount && (
                <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 4 }}>
                  ({book.borrowCount} borrows)
                </span>
              )}
            </div>
            {book.reason && (
              <div style={{ fontSize: 11, color: '#6C5CE7', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Sparkles size={12} />
                {book.reason}
              </div>
            )}
            {book.arrivedDate && (
              <div style={{ fontSize: 11, color: '#10B981', marginBottom: 12, fontWeight: 600 }}>
                🆕 Arrived: {book.arrivedDate}
              </div>
            )}
            {book.waitlist > 0 && (
              <div style={{ fontSize: 11, color: '#F59E0B', marginBottom: 8, fontWeight: 600 }}>
                ⏳ {book.waitlist} in waitlist
              </div>
            )}
            <button style={{
              width: '100%',
              padding: '10px',
              background: book.available ? '#6C5CE7' : '#F3F4F6',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              color: book.available ? 'white' : '#6B7280',
              cursor: 'pointer',
              fontFamily: 'Inter',
              transition: 'all 0.15s',
              marginTop: 'auto',
            }}
              onMouseEnter={e => {
                if (book.available) e.currentTarget.style.background = '#5B4BC5';
              }}
              onMouseLeave={e => {
                if (book.available) e.currentTarget.style.background = '#6C5CE7';
              }}
            >
              {book.available ? 'Request Book' : 'Join Waitlist'}
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Book Recommendations</h1>
        <p style={{ fontSize: 13, color: '#6B7280' }}>Discover books tailored to your interests and reading history</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'white',
            padding: '20px',
            borderRadius: 12,
            border: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={20} color={stat.color} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 2 }}>{stat.label}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Books Grid */}
        <div style={{ background: 'white', padding: '24px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #E5E7EB', paddingBottom: 12 }}>
            <button
              onClick={() => setActiveTab('for-you')}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'for-you' ? '2px solid #6C5CE7' : '2px solid transparent',
                fontSize: 13,
                fontWeight: 600,
                color: activeTab === 'for-you' ? '#6C5CE7' : '#6B7280',
                cursor: 'pointer',
                fontFamily: 'Inter',
                marginBottom: -12,
              }}
            >
              <Sparkles size={14} style={{ display: 'inline', marginRight: 6, marginBottom: -2 }} />
              For You
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'popular' ? '2px solid #6C5CE7' : '2px solid transparent',
                fontSize: 13,
                fontWeight: 600,
                color: activeTab === 'popular' ? '#6C5CE7' : '#6B7280',
                cursor: 'pointer',
                fontFamily: 'Inter',
                marginBottom: -12,
              }}
            >
              <TrendingUp size={14} style={{ display: 'inline', marginRight: 6, marginBottom: -2 }} />
              Popular Now
            </button>
            <button
              onClick={() => setActiveTab('new-arrivals')}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'new-arrivals' ? '2px solid #6C5CE7' : '2px solid transparent',
                fontSize: 13,
                fontWeight: 600,
                color: activeTab === 'new-arrivals' ? '#6C5CE7' : '#6B7280',
                cursor: 'pointer',
                fontFamily: 'Inter',
                marginBottom: -12,
              }}
            >
              <Clock size={14} style={{ display: 'inline', marginRight: 6, marginBottom: -2 }} />
              New Arrivals
            </button>
          </div>

          {renderBooks()}
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Your Reading Preferences */}
          <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Your Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Favorite Genres</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Fiction', 'Fantasy', 'Technical'].map(genre => (
                    <span key={genre} style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background: '#EEF2FF',
                      color: '#6C5CE7',
                    }}>
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 10, marginTop: 6 }}>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Favorite Authors</div>
                <div style={{ fontSize: 11, color: '#111827', lineHeight: 1.6 }}>
                  J.K. Rowling, George Orwell, Robert Martin
                </div>
              </div>
            </div>
            <button style={{
              width: '100%',
              padding: '8px',
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              color: '#6C5CE7',
              cursor: 'pointer',
              fontFamily: 'Inter',
              marginTop: 12,
            }}>
              Update Preferences
            </button>
          </div>

          {/* Trending Authors */}
          <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Trending Authors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'James Clear', books: 3 },
                { name: 'Morgan Housel', books: 2 },
                { name: 'Yuval Noah Harari', books: 4 },
              ].map((author, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6C5CE7, #A78BFA)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}>
                    {author.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{author.name}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>{author.books} books available</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Challenge */}
          <div style={{
            background: 'linear-gradient(135deg, #10B981, #34D399)',
            padding: '20px',
            borderRadius: 12,
            color: 'white',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8, textAlign: 'center' }}>📚</div>
            <div style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', marginBottom: 8 }}>
              2024 Reading Challenge
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
              24 / 30
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 3, marginBottom: 8 }}>
              <div style={{ width: '80%', height: '100%', background: 'white', borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, textAlign: 'center', opacity: 0.9 }}>
              6 books to go! Keep reading
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
