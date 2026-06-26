'use client';
import { BookOpen, Clock, AlertTriangle, DollarSign, Calendar, Bell, ChevronRight } from 'lucide-react';

export default function StudentDashboard() {
  const stats = [
    { 
      label: 'Books Borrowed', 
      value: '5', 
      subtitle: 'Currently Issued', 
      icon: BookOpen, 
      iconBg: '#EEF2FF',
      iconColor: '#6366F1'
    },
    { 
      label: 'Due Soon', 
      value: '2', 
      subtitle: 'Books to return', 
      icon: Clock, 
      iconBg: '#FEF3C7',
      iconColor: '#F59E0B'
    },
    { 
      label: 'Overdue', 
      value: '1', 
      subtitle: 'Return overdue', 
      icon: AlertTriangle, 
      iconBg: '#FEE2E2',
      iconColor: '#DC2626'
    },
    { 
      label: 'Total Fine', 
      value: '₹50', 
      subtitle: 'Pending amount', 
      icon: DollarSign, 
      iconBg: '#D1FAE5',
      iconColor: '#10B981'
    },
  ];

  const borrowedBooks = [
    { 
      id: 1, 
      title: 'Atomic Habits', 
      author: 'James Clear', 
      issued: '01 Jun 2026', 
      due: '20 Jun 2026', 
      daysLeft: 2,
      category: 'Self Help',
      categoryColor: '#6366F1',
      cover: 'https://images-na.ssl-images-amazon.com/images/I/81YkqyaFVEL.jpg'
    },
    { 
      id: 2, 
      title: 'Clean Code', 
      author: 'Robert C. Martin', 
      issued: '05 Jun 2026', 
      due: '20 Jun 2026', 
      daysLeft: 5,
      category: 'Programming',
      categoryColor: '#8B5CF6',
      cover: 'https://m.media-amazon.com/images/I/51E2055ZGUL.jpg'
    },
    { 
      id: 3, 
      title: 'The 5 AM Club', 
      author: 'Robin Sharma', 
      issued: '01 Jun 2026', 
      due: '15 Jun 2026', 
      returned: true,
      category: 'Self Help',
      categoryColor: '#10B981',
      cover: 'https://m.media-amazon.com/images/I/71zytzrg6lL.jpg'
    },
  ];

  const dueSoonReminders = [
    { title: 'Atomic Habits', dueDate: '20 Jun 2026', daysLeft: 2 },
    { title: 'Clean Code', dueDate: '20 Jun 2026', daysLeft: 5 },
  ];

  const recentlyReturned = [
    { title: 'Think Like a Monk', author: 'Jay Shetty', returned: '05 Jun 2026', status: 'On Time' },
    { title: 'The Power of Habit', author: 'Charles Duhigg', returned: '28 May 2026', status: 'On Time' },
    { title: 'Think Like a Monk', author: 'Jay Shetty', returned: '05 Jun 2026', status: 'On Time' },
    { title: 'The Power of Habit', author: 'Charles Duhigg', returned: '28 May 2026', status: 'On Time' },


  ];

  const recommended = [
    { title: 'Deep Work', author: 'Cal Newport', rating: 4.6, cover: 'https://m.media-amazon.com/images/I/71VStT787lL.jpg' },
    { title: 'The Psychology of Money', author: 'Morgan Housel', rating: 4.7, cover: 'https://m.media-amazon.com/images/I/71g2ednj0JL.jpg' },
    { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', rating: 4.5, cover: 'https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg' },
  ];

  return (
    <div style={{ padding: '16px 20px', width: '100%', boxSizing: 'border-box' }}>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'white',
            padding: '14px',
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 8, 
              background: stat.iconBg, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <stat.icon size={20} color={stat.iconColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', lineHeight: 1, marginBottom: 3 }}>{stat.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#111827', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.label}</div>
              <div style={{ fontSize: 9, color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{stat.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 12, width: '100%' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, overflow: 'hidden' }}>
          {/* Currently Borrowed Books */}
          <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Currently Borrowed Books</h2>
              <button style={{ 
                fontSize: 13, 
                color: '#6366F1', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 600, 
                fontFamily: 'Inter',
              }}>
                View All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {borrowedBooks.map(book => (
                <div key={book.id} style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                  {/* Book Cover */}
                  <div style={{
                    width: 60,
                    height: 85,
                    borderRadius: 6,
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = 'linear-gradient(135deg, #6366F1, #8B5CF6)';
                        e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;">📖</div>';
                      }}
                    />
                  </div>

                  {/* Book Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</div>
                    <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.author}</div>
                    <span style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background: `${book.categoryColor}15`,
                      color: book.categoryColor,
                    }}>
                      {book.category}
                    </span>
                  </div>

                  {/* Issued/Due Date */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Calendar size={14} color="#9CA3AF" />
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>Issued on</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{book.issued}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={14} color={book.returned ? '#10B981' : '#F59E0B'} />
                      <div>
                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>Due on</div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: book.returned ? '#10B981' : '#111827' }}>
                          {book.due}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status/Action */}
                  {book.returned ? (
                    <div style={{
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      background: '#D1FAE5',
                      color: '#059669',
                      flexShrink: 0,
                    }}>
                      Returned
                    </div>
                  ) : book.daysLeft <= 3 && (
                    <div style={{ textAlign: 'right', minWidth: 90, flexShrink: 0 }}>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        background: '#FEF3C7',
                        color: '#F59E0B',
                        marginBottom: 8,
                      }}>
                        Due in {book.daysLeft} days
                      </div>
                      <button style={{
                        padding: '8px 16px',
                        background: 'white',
                        border: '1px solid #6366F1',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#6366F1',
                        cursor: 'pointer',
                        fontFamily: 'Inter',
                      }}>
                        View Details
                      </button>
                    </div>
                  )}
                  {!book.returned && book.daysLeft > 3 && (
                    <button style={{
                      padding: '8px 16px',
                      background: 'white',
                      border: '1px solid #6366F1',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#6366F1',
                      cursor: 'pointer',
                      fontFamily: 'Inter',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}>
                      View Details
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recently Returned */}
          <div style={{ background: 'white', padding: '24px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Recently Returned</h2>
              <button style={{ fontSize: 13, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter' }}>
                View All
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '12px 16px' }}>Book Title</th>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '12px 16px' }}>Author</th>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '12px 16px' }}>Returned On</th>
                  <th style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textAlign: 'left', padding: '12px 16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentlyReturned.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '16px', fontSize: 13, color: '#111827', fontWeight: 500 }}>{item.title}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#6B7280' }}>{item.author}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#6B7280' }}>{item.returned}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        background: '#D1FAE5',
                        color: '#059669',
                      }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, width: 260 }}>
          {/* Due Soon Reminders */}
          <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Due Soon Reminders</h3>
              <button style={{ fontSize: 12, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter' }}>
                View All
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {dueSoonReminders.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px',
                  background: '#FEFCE8',
                  borderRadius: 8,
                  border: '1px solid #FDE68A',
                  alignItems: 'center',
                }}>
                  <Bell size={16} color="#F59E0B" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#92400E', marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: '#78350F' }}>{item.dueDate}</div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    background: '#FED7AA',
                    color: '#EA580C',
                  }}>
                    Due in {item.daysLeft} days
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fine Overview */}
          <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Fine Overview</h3>
              <button style={{ fontSize: 12, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter' }}>
                View Details
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Total Fine</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#F59E0B' }}>₹50</div>
              </div>
              <div style={{ width: 1, background: '#E5E7EB' }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Paid</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#10B981' }}>₹0</div>
              </div>
              <div style={{ width: 1, background: '#E5E7EB' }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>Pending</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#DC2626' }}>₹50</div>
              </div>
            </div>
            <button style={{
              width: '100%',
              padding: '12px',
              background: '#6366F1',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'Inter',
            }}>
              Pay Fine Now
            </button>
          </div>

          {/* Recommended For You */}
          <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Recommended For You</h3>
              <button style={{ fontSize: 12, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter' }}>
                View All
              </button>
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
              {recommended.map((book, idx) => (
                <div key={idx} style={{ 
                  minWidth: 90, 
                  textAlign: 'center',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 90,
                    height: 130,
                    borderRadius: 8,
                    overflow: 'hidden',
                    marginBottom: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}>
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = 'linear-gradient(135deg, #6366F1, #8B5CF6)';
                        e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;">📚</div>';
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#111827', marginBottom: 2, lineHeight: 1.2 }}>{book.title}</div>
                  <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 4 }}>{book.author}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#F59E0B' }}>⭐ {book.rating}</div>
                </div>
              ))}
              <button style={{
                minWidth: 40,
                height: 130,
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                background: '#F9FAFB',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ChevronRight size={20} color="#6B7280" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
