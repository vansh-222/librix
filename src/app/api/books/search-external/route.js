import { NextResponse } from 'next/server';

// GET /api/books/search-external?q=query — search Google Books + Open Library
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  if (!query) return NextResponse.json({ results: [] });

  try {
    const [googleResults, openLibResults] = await Promise.allSettled([
      searchGoogleBooks(query),
      searchOpenLibrary(query),
    ]);

    const google = googleResults.status === 'fulfilled' ? googleResults.value : [];
    const openLib = openLibResults.status === 'fulfilled' ? openLibResults.value : [];

    // Merge, deduplicate by ISBN
    const seen = new Set();
    const results = [...google, ...openLib].filter((b) => {
      const key = b.isbn || `${b.title}-${b.author}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (err) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

async function searchGoogleBooks(query) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&langRestrict=en`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.items) return [];

  return data.items.map((item) => {
    const info = item.volumeInfo || {};
    const isbn = (info.industryIdentifiers || []).find(
      (id) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
    )?.identifier || '';
    return {
      googleBooksId: item.id,
      title: info.title || '',
      author: (info.authors || []).join(', '),
      isbn,
      publisher: info.publisher || '',
      publishedYear: info.publishedDate?.split('-')[0] || '',
      cover: info.imageLinks?.thumbnail?.replace('http://', 'https://') || '',
      description: info.description || '',
      category: (info.categories || [])[0] || 'General',
      language: info.language || 'en',
      pages: info.pageCount || 0,
      source: 'google_books',
    };
  });
}

async function searchOpenLibrary(query) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5&fields=key,title,author_name,isbn,publisher,first_publish_year,cover_i,subject,language,number_of_pages_median`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  if (!data.docs) return [];

  return data.docs.slice(0, 5).map((doc) => ({
    openLibraryId: doc.key,
    title: doc.title || '',
    author: (doc.author_name || []).join(', '),
    isbn: (doc.isbn || [])[0] || '',
    publisher: (doc.publisher || [])[0] || '',
    publishedYear: doc.first_publish_year?.toString() || '',
    cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : '',
    description: '',
    category: (doc.subject || [])[0] || 'General',
    language: (doc.language || [])[0] || 'en',
    pages: doc.number_of_pages_median || 0,
    source: 'open_library',
  }));
}
