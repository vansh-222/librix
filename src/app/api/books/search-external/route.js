import { NextResponse } from 'next/server';

// GET /api/books/search-external?q=query — search Google Books + Open Library
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  if (!query || !query.trim()) return NextResponse.json({ results: [] });

  console.log('[Search External] Query:', query);

  try {
    const [googleResults, openLibResults] = await Promise.allSettled([
      searchGoogleBooks(query.trim()),
      searchOpenLibrary(query.trim()),
    ]);

    const google  = googleResults.status  === 'fulfilled' ? googleResults.value  : [];
    const openLib = openLibResults.status === 'fulfilled' ? openLibResults.value : [];

    if (googleResults.status === 'rejected')  console.error('[Search External] Google failed:', googleResults.reason);
    if (openLibResults.status === 'rejected') console.error('[Search External] OpenLib failed:', openLibResults.reason);

    console.log(`[Search External] Google: ${google.length} results, OpenLib: ${openLib.length} results`);

    // Merge, deduplicate by ISBN then by title+author
    const seen    = new Set();
    const results = [...google, ...openLib].filter((b) => {
      const key = b.isbn ? b.isbn : `${b.title}||${b.author}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ results: results.slice(0, 20) });
  } catch (err) {
    console.error('[Search External] Fatal error:', err);
    return NextResponse.json({ error: 'Search failed', details: err.message }, { status: 500 });
  }
}

async function searchGoogleBooks(query) {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY || '';
  // Build URL — works with or without API key (100 req/day free without key)
  let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=15&printType=books`;
  if (apiKey) url += `&key=${apiKey}`;

  console.log('[Google Books] Fetching:', url.replace(apiKey, 'KEY_HIDDEN'));

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[Google Books] HTTP Error:', res.status, errText.slice(0, 200));
    return [];
  }

  const data = await res.json();

  if (data.error) {
    console.error('[Google Books] API Error:', data.error);
    return [];
  }

  if (!data.items || data.items.length === 0) {
    console.log('[Google Books] No items found');
    return [];
  }

  return data.items.map((item) => {
    const info = item.volumeInfo || {};
    const isbn13 = (info.industryIdentifiers || []).find(id => id.type === 'ISBN_13')?.identifier || '';
    const isbn10 = (info.industryIdentifiers || []).find(id => id.type === 'ISBN_10')?.identifier || '';
    const isbn   = isbn13 || isbn10;

    // Use higher-res cover when available
    const cover = (info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '')
      .replace('http://', 'https://')
      .replace('&zoom=1', '&zoom=2');  // request slightly larger image

    return {
      googleBooksId: item.id,
      title:         info.title        || 'Unknown Title',
      author:        (info.authors     || ['Unknown Author']).join(', '),
      isbn,
      publisher:     info.publisher    || '',
      publishedYear: info.publishedDate?.split('-')[0] || '',
      cover,
      description:   info.description  || '',
      category:      (info.categories  || [])[0] || 'General',
      language:      info.language     || 'en',
      pages:         info.pageCount    || 0,
      source:        'google_books',
    };
  });
}

async function searchOpenLibrary(query) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&fields=key,title,author_name,isbn,publisher,first_publish_year,cover_i,subject,language,number_of_pages_median`;

  console.log('[Open Library] Fetching:', url);

  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    console.error('[Open Library] HTTP Error:', res.status);
    return [];
  }

  const data = await res.json();

  if (!data.docs || data.docs.length === 0) {
    console.log('[Open Library] No docs found');
    return [];
  }

  return data.docs
    .filter(doc => doc.title && doc.author_name?.length)
    .slice(0, 10)
    .map((doc) => ({
      openLibraryId: doc.key     || '',
      title:         doc.title   || '',
      author:        (doc.author_name || []).join(', '),
      isbn:          (doc.isbn   || [])[0] || '',
      publisher:     (doc.publisher || [])[0] || '',
      publishedYear: doc.first_publish_year?.toString() || '',
      cover:         doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : '',
      description:   '',
      category:      (doc.subject || [])[0] || 'General',
      language:      (doc.language || [])[0] || 'en',
      pages:         doc.number_of_pages_median || 0,
      source:        'open_library',
    }));
}
