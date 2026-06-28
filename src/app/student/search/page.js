'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Grid, List, ChevronRight, ChevronLeft } from 'lucide-react';

export default function SearchBooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filters state
  const [availability, setAvailability] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedAuthor, setSelectedAuthor] = useState('All Authors');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [fromYear, setFromYear] = useState('');
  const [toYear, setToYear] = useState('');

  const books = [
    { id: 1, title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', pages: 320, published: 2018, category: 'Self Help', categoryColor: '#6366F1', available: true, copies: 3, cover: 'https://images-na.ssl-images-amazon.com/images/I/81YkqyaFVEL.jpg' },
    { id: 2, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', pages: 464, published: 2008, category: 'Programming', categoryColor: '#8B5CF6', available: true, copies: 2, cover: 'https://m.media-amazon.com/images/I/51E2055ZGUL.jpg' },
    { id: 3, title: 'The 5 AM Club', author: 'Robin Sharma', isbn: '978-9387944404', pages: 256, published: 2018, category: 'Self Help', categoryColor: '#F59E0B', available: false, copies: 0, cover: 'https://m.media-amazon.com/images/I/71zytzrg6lL.jpg' },
    { id: 4, title: 'Deep Work', author: 'Cal Newport', isbn: '978-1455586691', pages: 296, published: 2016, category: 'Productivity', categoryColor: '#EAB308', available: true, copies: 4, cover: 'https://m.media-amazon.com/images/I/71VStT787lL.jpg' },
    { id: 5, title: 'The Psychology of Money', author: 'Morgan Housel', isbn: '978-0857197689', pages: 256, published: 2020, category: 'Finance', categoryColor: '#10B981', available: true, copies: 1, cover: 'https://m.media-amazon.com/images/I/71g2ednj0JL.jpg' },
    { id: 6, title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', isbn: '978-1612680194', pages: 336, published: 2000, category: 'Finance', categoryColor: '#EC4899', available: true, copies: 2, cover: 'https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg' },
  ];

  const categories = [
    { name: 'Fiction', count: 32 },
    { name: 'Programming', count: 28 },
    { name: 'Self Help', count: 24 },
    { name: 'Science', count: 16 },
    { name: 'Finance', count: 14 },
  ];

  const totalResults = 628;
  const showing = `1-6 of ${totalResults}`;

  return (
    <div style={{ padding: '12px 24px', width: '100%', boxSizing: 'border-box' }}>
      {/* Main Grid - starts immediately */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, width: '100%', alignItems: 'start' }}>
        {/* Left Column - Search and Books */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          {/* Search Bar and Controls */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ flex: 1, position: 'relative', maxWidth: 400 }}>
              <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
              type="text"
              placeholder="Search by title, author, ISBN or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                fontSize: 13,
                outline: 'none',
                fontFamily: 'Inter',
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>Sort by:</span>
            <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 32px 8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              fontSize: 13,
              outline: 'none',
              fontFamily: 'Inter',
              fontWeight: 500,
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            <option>Relevance</option>
            <option>Title A-Z</option>
            <option>Title Z-A</option>
            <option>Author</option>
            <option>Newest</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: 4, border: '1px solid #E5E7EB', borderRadius: 6, padding: 4 }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 10px',
              background: viewMode === 'grid' ? '#6366F1' : 'transparent',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            <Grid size={16} color={viewMode === 'grid' ? 'white' : '#6B7280'} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '6px 10px',
              background: viewMode === 'list' ? '#6366F1' : 'transparent',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            <List size={16} color={viewMode === 'list' ? 'white' : '#6B7280'} />
          </button>
        </div>
      </div>
          {/* Results Count */}
          <div style={{ fontSize: 13, color: '#6B7280' }}>
            Showing <strong>{showing}</strong> results
          </div>

          {/* Books */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {books.map(book => (
            <div key={book.id} style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 10,
              padding: '16px',
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
            }}>
              {/* Book Cover */}
              <div style={{
                width: 70,
                height: 100,
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
                  }}
                />
              </div>

              {/* Book Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{book.title}</h3>
                <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{book.author}</div>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  background: `${book.categoryColor}15`,
                  color: book.categoryColor,
                  marginBottom: 12,
                }}>
                  {book.category}
                </span>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
                  <div><strong>ISBN:</strong> {book.isbn}</div>
                  <div><strong>Pages:</strong> {book.pages}</div>
                  <div><strong>Published:</strong> {book.published}</div>
                </div>
              </div>

              {/* Availability and Action */}
              <div style={{ textAlign: 'right', minWidth: 100, flexShrink: 0 }}>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  background: book.available ? '#D1FAE5' : '#FEE2E2',
                  color: book.available ? '#059669' : '#DC2626',
                  marginBottom: 8,
                }}>
                  {book.available ? 'Available' : 'Issued'}
                </div>
                <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12 }}>
                  {book.available ? `${book.copies} Copies` : `${book.copies} Copies`}
                </div>
                <Link href={`/student/book/${book.id}`} style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: '8px 16px',
                  background: 'white',
                  border: '1px solid #6366F1',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6366F1',
                  cursor: 'pointer',
                  fontFamily: 'Inter',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#6366F1'; }}
                >
                  {book.available ? 'View Details' : 'Join Waitlist'}
                </button>
                </Link>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <button style={{
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              fontSize: 12,
              color: '#6B7280',
              cursor: 'pointer',
              fontFamily: 'Inter',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <ChevronLeft size={14} />
              Previous
            </button>
            
            {[1, 2, 3, 4, 5].map(num => (
              <button key={num} style={{
                padding: '8px 12px',
                background: num === 1 ? '#6366F1' : 'white',
                border: '1px solid #E5E7EB',
                borderRadius: 6,
                fontSize: 12,
                color: num === 1 ? 'white' : '#6B7280',
                cursor: 'pointer',
                fontFamily: 'Inter',
                fontWeight: 600,
                minWidth: 36,
              }}>
                {num}
              </button>
            ))}
            
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>...</span>
            
            <button style={{
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              fontSize: 12,
              color: '#6B7280',
              cursor: 'pointer',
              fontFamily: 'Inter',
              minWidth: 36,
            }}>
              22
            </button>
            
            <button style={{
              padding: '8px 12px',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              fontSize: 12,
              color: '#6B7280',
              cursor: 'pointer',
              fontFamily: 'Inter',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              Next
              <ChevronRight size={14} />
            </button>
          </div>
          </div>
        </div>

        {/* Right Sidebar - Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Filters Card */}
          <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Filters</h3>
              <button style={{ fontSize: 12, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter' }}>
                Clear All
              </button>
            </div>

            {/* Availability */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Availability</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['All', 'Available', 'Issued'].map(option => (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={option === 'All'}
                      onChange={() => setAvailability(option.toLowerCase())}
                      style={{ width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 13, color: '#6B7280' }}>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Category</div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'Inter',
                  color: '#374151',
                }}
              >
                <option>All Categories</option>
                <option>Fiction</option>
                <option>Programming</option>
                <option>Self Help</option>
              </select>
            </div>

            {/* Author */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Author</div>
              <select 
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'Inter',
                  color: '#374151',
                }}
              >
                <option>All Authors</option>
              </select>
            </div>

            {/* Publication Year */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Publication Year</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  placeholder="From Year" 
                  value={fromYear}
                  onChange={(e) => setFromYear(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: 6,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'Inter',
                  }} 
                />
                <input 
                  placeholder="To Year" 
                  value={toYear}
                  onChange={(e) => setToYear(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: 6,
                    fontSize: 13,
                    outline: 'none',
                    fontFamily: 'Inter',
                  }} 
                />
              </div>
            </div>

            {/* Language */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 10 }}>Language</div>
              <select 
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: 6,
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'Inter',
                  color: '#374151',
                }}
              >
                <option>All Languages</option>
              </select>
            </div>

            {/* Apply Filters Button */}
            <button style={{
              width: '100%',
              padding: '10px',
              background: '#6366F1',
              border: 'none',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: 'white',
              cursor: 'pointer',
              fontFamily: 'Inter',
            }}>
              Apply Filters
            </button>
          </div>

          {/* Categories Card */}
          <div style={{ background: 'white', padding: '20px', borderRadius: 12, border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categories.map(cat => (
                <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
                  onMouseLeave={e => e.currentTarget.style.color = '#111827'}
                >
                  <span style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{cat.name}</span>
                  <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{cat.count}</span>
                </div>
              ))}
              <button style={{
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                color: '#6366F1',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter',
              }}>
                View All Categories
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Quote Card */}
          <div style={{
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            padding: '24px 20px',
            borderRadius: 12,
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 14, fontStyle: 'italic', marginBottom: 12, lineHeight: 1.6, fontWeight: 500 }}>
                "A library is a gateway to knowledge."
              </div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>- Roger Ebert</div>
            </div>
            {/* Illustration */}
            <div style={{
              marginTop: 16,
              fontSize: 60,
              opacity: 0.9,
            }}>
              📚
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        input::placeholder,
        input::-webkit-input-placeholder {
          color: #6B7280 !important;
          opacity: 1 !important;
        }
        input::-moz-placeholder {
          color: #6B7280 !important;
          opacity: 1 !important;
        }
        input:-ms-input-placeholder {
          color: #6B7280 !important;
          opacity: 1 !important;
        }
        select {
          color: #374151 !important;
        }
        select option {
          color: #374151 !important;
        }
      `}</style>
    </div>
  );
}
