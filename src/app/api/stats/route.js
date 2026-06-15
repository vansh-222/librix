import connectDB from '@/lib/db';
import College from '@/models/College';
import User from '@/models/User';
import CollegeBook from '@/models/CollegeBook';
import BorrowRecord from '@/models/BorrowRecord';
import Request from '@/models/Request';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'librarian';

    if (session.user.role === 'super_admin') {
      // Platform-wide stats
      const [colleges, users, borrows] = await Promise.all([
        College.countDocuments(),
        User.countDocuments(),
        BorrowRecord.countDocuments(),
      ]);
      const activeColleges = await College.countDocuments({ status: 'active' });
      const pendingColleges = await College.countDocuments({ status: 'pending' });
      const totalFines = await BorrowRecord.aggregate([
        { $group: { _id: null, total: { $sum: '$fine' } } },
      ]);

      return NextResponse.json({
        stats: {
          totalColleges: colleges,
          activeColleges,
          pendingColleges,
          totalUsers: users,
          totalBorrows: borrows,
          totalRevenue: totalFines[0]?.total || 0,
        },
      });
    }

    if (session.user.role === 'librarian') {
      const cid = session.user.collegeId;
      const [totalBooks, students, teachers, pendingRequests] = await Promise.all([
        CollegeBook.aggregate([
          { $match: { collegeId: require('mongoose').Types.ObjectId.createFromHexString ? require('mongoose').Types.ObjectId.createFromHexString(cid) : cid } },
          { $group: { _id: null, total: { $sum: '$total' }, available: { $sum: '$available' } } },
        ]),
        User.countDocuments({ collegeId: cid, role: 'student', isActive: true }),
        User.countDocuments({ collegeId: cid, role: 'teacher', isActive: true }),
        Request.countDocuments({ collegeId: cid, status: 'requested' }),
      ]);

      const now = new Date();
      const [issued, overdue, pendingFines] = await Promise.all([
        BorrowRecord.countDocuments({ collegeId: cid, status: 'issued' }),
        BorrowRecord.countDocuments({ collegeId: cid, status: 'issued', dueDate: { $lt: now } }),
        BorrowRecord.aggregate([
          { $match: { collegeId: cid, fineStatus: 'pending' } },
          { $group: { _id: null, total: { $sum: '$fine' } } },
        ]),
      ]);

      const bookStats = totalBooks[0] || { total: 0, available: 0 };

      return NextResponse.json({
        stats: {
          totalBooks: bookStats.total,
          availableBooks: bookStats.available,
          issuedBooks: issued,
          overdueBooks: overdue,
          totalStudents: students,
          totalTeachers: teachers,
          pendingRequests,
          pendingFines: pendingFines[0]?.total || 0,
        },
      });
    }

    // Student stats
    const userId = session.user.id;
    const [borrowedCount, pendingFine, pendingRequests] = await Promise.all([
      BorrowRecord.countDocuments({ userId, status: { $in: ['issued', 'return_pending'] } }),
      BorrowRecord.aggregate([
        { $match: { userId, fineStatus: 'pending' } },
        { $group: { _id: null, total: { $sum: '$fine' } } },
      ]),
      Request.countDocuments({ userId, status: { $in: ['requested', 'approved'] } }),
    ]);
    const now = new Date();
    const dueSoon = await BorrowRecord.countDocuments({
      userId, status: 'issued',
      dueDate: { $gte: now, $lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) },
    });

    return NextResponse.json({
      stats: {
        borrowedBooks: borrowedCount,
        dueSoon,
        pendingRequests,
        pendingFine: pendingFine[0]?.total || 0,
      },
    });
  } catch (err) {
    console.error('[Stats]', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
