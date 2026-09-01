import connectDB from '@/lib/db';
import BookCopy from '@/models/BookCopy';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/books/copies?bookId=xxx
// Librarian-only: returns all physical copies (with accession numbers) for a book
export async function GET(req) {
  try {
    const session = await auth();
    if (!session || !['librarian', 'super_admin'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');
    if (!bookId) return NextResponse.json({ error: 'bookId required' }, { status: 400 });

    await connectDB();

    const copies = await BookCopy.find({
      collegeId: session.user.collegeId,
      bookId,
    })
      .sort({ accessionNo: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({ copies });
  } catch (err) {
    console.error('[BookCopies GET]', err);
    return NextResponse.json({ error: 'Failed to fetch copies' }, { status: 500 });
  }
}
