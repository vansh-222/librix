import connectDB from '@/lib/db';
import BorrowRecord from '@/models/BorrowRecord';
import Request from '@/models/Request';
import CollegeBook from '@/models/CollegeBook';
import User from '@/models/User';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/stats — role-aware dashboard statistics
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const collegeId = session.user.collegeId;
    const role = session.user.role;
    const userId = session.user.id;

    if (role === 'student' || role === 'teacher') {
      // ── Student stats ──
      const [activeBorrows, overdueBorrows, allBorrows, pendingRequests, pendingFines] =
        await Promise.all([
          BorrowRecord.countDocuments({ userId, status: { $in: ['issued', 'return_pending'] } }),
          BorrowRecord.countDocuments({ userId, status: 'issued', dueDate: { $lt: new Date() } }),
          BorrowRecord.find({ userId }).select('fine fineStatus status rating bookId').populate('bookId', 'category').lean(),
          Request.countDocuments({ userId, status: 'requested' }),
          BorrowRecord.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId), fineStatus: 'pending' } },
            { $group: { _id: null, total: { $sum: '$fine' } } },
          ]),
        ]);

      const completedBooks = allBorrows.filter(b => b.status === 'returned').length;
      const pendingFineTotal = pendingFines[0]?.total || 0;
      const ratings = allBorrows.filter(b => b.rating > 0).map(b => b.rating);
      const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;

      // Genre breakdown
      const genreMap = {};
      allBorrows.filter(b => b.status === 'returned' && b.bookId?.category).forEach(b => {
        const cat = b.bookId.category;
        genreMap[cat] = (genreMap[cat] || 0) + 1;
      });

      // Monthly reading (last 6 months)
      const monthly = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
        const count = allBorrows.filter(b =>
          b.status === 'returned' && b.updatedAt >= start && b.updatedAt <= end
        ).length;
        monthly.push({ month: start.toLocaleString('en', { month: 'short' }), val: count });
      }

      return NextResponse.json({
        activeBorrows,
        overdueBorrows,
        completedBooks,
        pendingRequests,
        pendingFineTotal,
        avgRating,
        genreBreakdown: genreMap,
        monthlyReading: monthly,
      });
    }

    if (role === 'librarian') {
      // ── Librarian stats ──
      const [
        totalBooks,
        activeBorrows,
        overdueCount,
        pendingRequests,
        pendingReturns,
        totalMembers,
        finesCollected,
        finesPending,
      ] = await Promise.all([
        CollegeBook.countDocuments({ collegeId }),
        BorrowRecord.countDocuments({ collegeId, status: { $in: ['issued', 'return_pending'] } }),
        BorrowRecord.countDocuments({ collegeId, status: 'issued', dueDate: { $lt: new Date() } }),
        Request.countDocuments({ collegeId, status: 'requested' }),
        BorrowRecord.countDocuments({ collegeId, status: 'return_pending' }),
        User.countDocuments({ collegeId, role: { $in: ['student', 'teacher'] }, isActive: true }),
        BorrowRecord.aggregate([
          { $match: { collegeId: new mongoose.Types.ObjectId(collegeId), fineStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$fine' } } },
        ]),
        BorrowRecord.aggregate([
          { $match: { collegeId: new mongoose.Types.ObjectId(collegeId), fineStatus: 'pending' } },
          { $group: { _id: null, total: { $sum: '$fine' } } },
        ]),
      ]);

      return NextResponse.json({
        totalBooks,
        activeBorrows,
        overdueCount,
        pendingRequests,
        pendingReturns,
        totalMembers,
        finesCollected: finesCollected[0]?.total || 0,
        finesPending:   finesPending[0]?.total   || 0,
      });
    }

    return NextResponse.json({ error: 'Unsupported role' }, { status: 400 });
  } catch (err) {
    console.error('[Stats GET]', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
