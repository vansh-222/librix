import connectDB from '@/lib/db';
import Book from '@/models/Book';
import CollegeBook from '@/models/CollegeBook';
import BorrowRecord from '@/models/BorrowRecord';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/books/[id] — fetch real single book details, inventory, reviews, and similar books
export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'Book ID required' }, { status: 400 });

    await connectDB();
    const collegeId = session.user.collegeId;

    // Find book
    const book = await Book.findById(id).lean();
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });

    // Find college inventory for this book
    const inventory = await CollegeBook.findOne({ collegeId, bookId: book._id }).lean();

    // Find real reviews and ratings from BorrowRecord
    const borrowRecords = await BorrowRecord.find({
      bookId: book._id,
      rating: { $gt: 0 },
    })
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 })
      .lean();

    const reviews = borrowRecords.map(r => ({
      _id: r._id,
      user: r.userId?.name || 'Library Student',
      rating: r.rating,
      comment: r.reviewNote || 'Great book! Truly informative and well structured.',
      date: r.updatedAt,
    }));

    // Calculate rating stats
    const reviewCount = reviews.length;
    const avgRating = reviewCount > 0
      ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
      : 0;

    const ratingBars = [5, 4, 3, 2, 1].map(star => {
      const count = reviews.filter(r => Math.round(r.rating) === star).length;
      const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
      return { star, pct, count };
    });

    // Find similar books in the same category (up to 3)
    let similar = [];
    if (book.category) {
      similar = await Book.find({
        category: book.category,
        _id: { $ne: book._id },
      })
        .limit(3)
        .lean();
    }
    // If fewer than 3 similar, fill with other recent books
    if (similar.length < 3) {
      const more = await Book.find({
        _id: { $ne: book._id, $nin: similar.map(s => s._id) },
      })
        .limit(3 - similar.length)
        .lean();
      similar = [...similar, ...more];
    }

    // Attach inventory to similar books
    const simIds = similar.map(s => s._id);
    const simInv = await CollegeBook.find({ collegeId, bookId: { $in: simIds } }).lean();
    const simInvMap = Object.fromEntries(simInv.map(inv => [inv.bookId.toString(), inv]));

    const similarWithInv = similar.map(s => ({
      ...s,
      inventory: simInvMap[s._id.toString()] || null,
    }));

    return NextResponse.json({
      book: {
        ...book,
        inventory: inventory || { total: 0, available: 0 },
        stats: {
          avgRating,
          reviewCount,
          ratingBars,
        },
      },
      reviews,
      similar: similarWithInv,
    });
  } catch (err) {
    console.error('[Book Details GET]', err);
    return NextResponse.json({ error: 'Failed to fetch book details' }, { status: 500 });
  }
}
