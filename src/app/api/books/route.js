import connectDB from '@/lib/db';
import Book from '@/models/Book';
import CollegeBook from '@/models/CollegeBook';
import BookCopy from '@/models/BookCopy';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/books — list books for a college (student/librarian)
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const available = searchParams.get('available');
    const language = searchParams.get('language') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const collegeId = session.user.collegeId;

    // Find college inventory
    let cbQuery = { collegeId };
    if (available === 'true') cbQuery.available = { $gt: 0 };

    const collegeBooks = await CollegeBook.find(cbQuery).lean();
    const bookIds = collegeBooks.map((cb) => cb.bookId);

    // Build book filter
    const bookQuery = { _id: { $in: bookIds } };
    if (search) {
      bookQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) bookQuery.category = { $regex: category, $options: 'i' };
    if (language) bookQuery.language = { $regex: language, $options: 'i' };

    const total = await Book.countDocuments(bookQuery);
    const sortParam = searchParams.get('sort') || '';
    const sortOrder = sortParam === 'title_asc' ? { title: 1 } : { createdAt: -1 };
    const books = await Book.find(bookQuery)
      .sort(sortOrder)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Merge with inventory data
    const cbMap = Object.fromEntries(collegeBooks.map((cb) => [cb.bookId.toString(), cb]));
    const result = books.map((b) => ({
      ...b,
      inventory: cbMap[b._id.toString()] || null,
    }));

    return NextResponse.json({ books: result, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[Books GET]', err);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

// POST /api/books — librarian adds a book to the college catalog
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !['librarian', 'super_admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title, author, isbn, publisher, publishedYear, cover, description,
      category, language, pages, source, googleBooksId, openLibraryId,
      copies, shelf, section, floor,
      accessionNumbers, // optional string[] of per-copy accession numbers
    } = body;

    if (!title || !author) {
      return NextResponse.json({ error: 'Title and author are required' }, { status: 400 });
    }

    await connectDB();
    const collegeId = session.user.collegeId;

    if (!collegeId) {
      return NextResponse.json({
        error: 'Your librarian account is not linked to a college. Please visit /api/fix-librarian to fix this, then log out and log back in.',
      }, { status: 400 });
    }

    // Find or create global book record (deduplicate by ISBN or googleBooksId)
    let book = null;
    if (isbn) book = await Book.findOne({ isbn });
    if (!book && googleBooksId) book = await Book.findOne({ googleBooksId });
    if (!book && openLibraryId) book = await Book.findOne({ openLibraryId });

    if (!book) {
      book = await Book.create({
        title: title.trim(), author: author.trim(), isbn: isbn || '',
        publisher: publisher || '', publishedYear: publishedYear || '',
        cover: cover || '', description: description || '',
        category: category || 'General', language: language || 'English',
        pages: pages || 0, source: source || 'manual',
        googleBooksId: googleBooksId || '', openLibraryId: openLibraryId || '',
      });
    }

    // Normalize accession numbers array
    const numCopies = parseInt(copies) || 1;
    const accNums = Array.isArray(accessionNumbers)
      ? accessionNumbers.map(n => (n || '').trim())
      : [];
    // Pad to match numCopies (fill missing entries with empty string)
    const paddedAccNums = Array.from({ length: numCopies }, (_, i) => accNums[i] || '');

    // Check if this college already has this book
    const existing = await CollegeBook.findOne({ collegeId, bookId: book._id });
    if (existing) {
      // Add more copies to existing inventory
      existing.total     += numCopies;
      existing.available += numCopies;
      if (shelf)   existing.shelf   = shelf;
      if (section) existing.section = section;
      if (floor)   existing.floor   = floor;
      await existing.save();

      // Create BookCopy documents for the new copies
      await BookCopy.insertMany(
        paddedAccNums.map(accNo => ({
          collegeId,
          bookId: book._id,
          accessionNo: accNo,
          status: 'available',
          addedBy: session.user.id,
        }))
      );

      return NextResponse.json({ success: true, collegeBook: existing, book });
    }

    // Create college inventory entry
    const collegeBook = await CollegeBook.create({
      collegeId,
      bookId:    book._id,
      total:     numCopies,
      available: numCopies,
      shelf:     shelf   || '',
      section:   section || '',
      floor:     floor   || '',
      addedBy:   session.user.id,
    });

    // Create BookCopy documents
    await BookCopy.insertMany(
      paddedAccNums.map(accNo => ({
        collegeId,
        bookId: book._id,
        accessionNo: accNo,
        status: 'available',
        addedBy: session.user.id,
      }))
    );

    return NextResponse.json({ success: true, collegeBook, book }, { status: 201 });
  } catch (err) {
    console.error('[Books POST]', err);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}

// PATCH /api/books — librarian updates copies or shelf for a college book
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || !['librarian', 'super_admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId, addCopies, removeCopies, shelf } = await req.json();
    if (!bookId) return NextResponse.json({ error: 'bookId required' }, { status: 400 });

    await connectDB();
    const cb = await CollegeBook.findOne({ collegeId: session.user.collegeId, bookId });
    if (!cb) return NextResponse.json({ error: 'Book not found in college inventory' }, { status: 404 });

    if (addCopies && addCopies > 0) {
      cb.total     += addCopies;
      cb.available += addCopies;
    }
    if (removeCopies && removeCopies > 0) {
      const canRemove = Math.min(removeCopies, cb.available);
      cb.total     = Math.max(0, cb.total     - canRemove);
      cb.available = Math.max(0, cb.available - canRemove);
    }
    if (shelf !== undefined) cb.shelf = shelf;

    await cb.save();
    return NextResponse.json({ success: true, collegeBook: cb });
  } catch (err) {
    console.error('[Books PATCH]', err);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

// DELETE /api/books?bookId=xxx — librarian removes book from college
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'librarian') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');
    if (!bookId) return NextResponse.json({ error: 'Book ID required' }, { status: 400 });

    await connectDB();
    await CollegeBook.findOneAndDelete({ collegeId: session.user.collegeId, bookId });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
