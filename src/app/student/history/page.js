'use client';
import { BookOpen, Clock, TrendingUp, Calendar, Star } from 'lucide-react';
import { useState } from 'react';

export default function ReadingHistory() {
  const [filter, setFilter] = useState('all');

  const stats = [
    { label: 'Total Books Read', value: '24', subtitle: 'All Time', icon: BookOpen, color: '#6C5CE7' },
    { label: 'This Month', value: '4', subtitle: 'Books', icon: Calendar, color: '#10B981' },
    { label: 'Avg. Reading Time', value: '12 days', subtitle: 'Per Book', icon: Clock, color: '#F59E0B' },
    { label: 'Favorite Genre', value: 'Fiction', subtitle: '40% of reads', icon: Star, color: '#EC4899' },
  ];

  const history = [
    { id: 1, title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', borrowed: '01 May 2024', returned: '10 Jun 2024', genre: 'Fantasy', rating: 5, status: 'Returned' },
    { id: 2, title: 'The Hobbit', author: 'J.R.R. Tolkien', borrowed: '20 Apr 2024', returned: '08 Jun 2024', genre: 'Fantasy', rating: 5, status: 'Returned' },
    { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', borrowed: '15 Apr 2024', returned: '05 Jun 2024', genre: 'Classic', rating: 4, status: 'Returned Late' },
    { id: 4, title: 'Clean Code', author: 'Robert C. Martin', borrowed: '10 Apr 2024', returned: '10 Jun 2024', genre: 'Technical', rating: 5, status: 'Returned' },
    { id: 5, title: '1984', author: 'George Orwell', borrowed: '05 Apr 2024', returned: '25 May 2024', genre: 'Dystopian', rating: 5, status: 'Returned' },
    { id: 6, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', borrowed: '01 Apr 2024', returned: '15 May 2024', genre: 'Fiction', rating: 4, status: 'Returned' },
  ];

  const genreStats = [
    { genre: 'Fiction', count: 10, percentage: 42 },
    { genre: 'Fantasy', count: 6, percentage: 25 },
    { genre: 'Technical', count: 4, percentage: 17 },
    { genre: 'Classic', count: 4, percentage: 16 },
  ];

  const monthlyTrend = [
    { month: 'Jan', books: 3 },
    { month: 'Feb', books: 4 },
    { month: 'Mar', books: 5 },
    { month: 'Apr', books: 6 },
    { month: 'May', books: 4 },
    { month: 'Jun', books: 2 },
  ];

  const maxBooks = Math.max(...monthlyTrend.map(m => m.books));

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Reading History</h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>Track your reading journey and discover your reading patterns</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
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
          {/* History Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Reading History</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button 
                    onClick={() => setFilter('all')}
                    style={{
                      padding: '8px 16px',
                      background: filter === 'all' ? '#F9FAFB' : 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: filter === 'all' ? '#6C5CE7' : '#6B7280',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                    }}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilter('this-month')}
                    style={{
                      padding: '8px 16px',
                      background: filter === 'this-month' ? '#F9FAFB' : 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: filter === 'this-month' ? '#6C5CE7' : '#6B7280',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                    }}
                  >
                    This Month
                  </button>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Book</th>
                    <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Author</th>
                    <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Genre</th>
                    <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Borrowed</th>
                    <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Returned</th>
                    <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Rating</th>
                    <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id} className="tr-hover" style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px', fontSize: 13, color: '#111827', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32,
                            height: 44,
                            background: 'linear-gradient(135deg, #6C5CE7, #A78BFA)',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
                          }}>
                            <BookOpen size={14} color="rgba(255,255,255,0.6)" />
                          </div>
                          {item.title}
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, color: '#6B7280' }}>{item.author}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          background: '#F3F4F6',
                          color: '#6B7280',
                        }}>
                          {item.genre}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontSize: 13, color: '#6B7280' }}>{item.borrowed}</td>
                      <td style={{ padding: '12px', fontSize: 13, color: '#6B7280' }}>{item.returned}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          background: item.status === 'Returned' ? '#D1FAE5' : '#FEE2E2',
                          color: item.status === 'Returned' ? '#059669' : '#DC2626',
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Monthly Trend */}
            <div style={{ background: 'white', padding: '24px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Monthly Reading Trend</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height: 180 }}>
                {monthlyTrend.map((item, idx) => (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#6C5CE7', marginBottom: 4 }}>
                      {item.books}
                    </div>
                    <div style={{
                      width: '100%',
                      height: `${(item.books / maxBooks) * 140}px`,
                      background: 'linear-gradient(180deg, #6C5CE7, #A78BFA)',
                      borderRadius: '8px 8px 0 0',
                      transition: 'all 0.3s',
                    }} />
                    <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                      {item.month}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Genre Distribution */}
            <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Genre Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {genreStats.map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{item.genre}</span>
                      <span style={{ fontSize: 12, color: '#111827', fontWeight: 600 }}>{item.count} books</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #6C5CE7, #A78BFA)',
                        borderRadius: 3,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Streak */}
            <div style={{
              background: 'linear-gradient(135deg, #6C5CE7, #A78BFA)',
              padding: '20px',
              borderRadius: 12,
              color: 'white',
            }}>
              <div style={{ fontSize: 40, marginBottom: 8, textAlign: 'center' }}>🔥</div>
              <div style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
                12 Days
              </div>
              <div style={{ fontSize: 13, textAlign: 'center', opacity: 0.9 }}>
                Reading Streak
              </div>
              <div style={{ fontSize: 11, textAlign: 'center', opacity: 0.8, marginTop: 8 }}>
                Keep it up! You're doing great
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Quick Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Books This Year</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>24</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Avg. Rating Given</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>4.6 ⭐</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Late Returns</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#DC2626' }}>3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
