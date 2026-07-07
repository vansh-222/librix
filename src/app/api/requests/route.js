import connectDB from '@/lib/db';
import Request from '@/models/Request';
import BorrowRecord from '@/models/BorrowRecord';
import CollegeBook from '@/models/CollegeBook';
import College from '@/models/College';
import { createNotification } from '@/lib/notifications';
import { requestApprovedEmail } from '@/lib/email';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/requests — list requests for college
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = { collegeId: session.user.collegeId };
    if (session.user.role === 'student' || session.user.role === 'teacher') {
      query.userId = session.user.id;
    }
    if (status) query.status = status;

    const requests = await Request.find(query)
      .populate('userId', 'name email studentId rollNumber avatarUrl')
      .populate('bookId', 'title author cover isbn')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ requests });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

// POST /api/requests — student creates a book request
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !['student', 'teacher'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId, daysNeeded, reason } = await req.json();
    if (!bookId) return NextResponse.json({ error: 'Book ID required' }, { status: 400 });
    if (!daysNeeded || daysNeeded < 1 || daysNeeded > 60) {
      return NextResponse.json({ error: 'Days needed must be between 1 and 60' }, { status: 400 });
    }

    await connectDB();

    // Check for existing pending request
    const existing = await Request.findOne({
      userId: session.user.id,
      bookId,
      collegeId: session.user.collegeId,
      status: { $in: ['requested', 'approved'] },
    });
    if (existing) {
      return NextResponse.json({ error: 'You already have a pending request for this book' }, { status: 409 });
    }

    // Check if already borrowed
    const activeBorrow = await BorrowRecord.findOne({
      userId: session.user.id,
      bookId,
      status: { $in: ['issued', 'return_pending'] },
    });
    if (activeBorrow) {
      return NextResponse.json({ error: 'You already have this book borrowed' }, { status: 409 });
    }

    const request = await Request.create({
      collegeId: session.user.collegeId,
      userId:    session.user.id,
      bookId,
      daysNeeded: daysNeeded || 14,
      reason:     reason?.trim() || '',
      status:    'requested',
    });

    // Populate book title for notification
    const Book = (await import('@/models/Book')).default;
    const book = await Book.findById(bookId).select('title author').lean();

    // Notify librarians — fetch librarian IDs
    const User = (await import('@/models/User')).default;
    const librarians = await User.find({ collegeId: session.user.collegeId, role: 'librarian' }).select('_id').lean();
    await Promise.all(librarians.map(l =>
      createNotification({
        userId:    l._id,
        collegeId: session.user.collegeId,
        title:     '📚 New Book Request',
        message:   `${session.user.name} requested "${book?.title || 'a book'}" for ${daysNeeded} day${daysNeeded > 1 ? 's' : ''}${reason ? ` — Reason: ${reason}` : ''}.`,
        type:      'general',
        link:      '/librarian/requests',
      })
    ));

    return NextResponse.json({ success: true, request }, { status: 201 });
  } catch (err) {
    console.error('[Requests POST]', err);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}

// PATCH /api/requests — librarian approves/rejects/issues OR student cancels
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { requestId, action, note } = await req.json();
    if (!requestId || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await connectDB();

    const request = await Request.findById(requestId)
      .populate('userId', 'name email')
      .populate('bookId', 'title author');
    if (!request) return NextResponse.json({ error: 'Request not found' }, { status: 404 });

    // Student can only cancel their own pending request
    if (action === 'cancel') {
      if (request.userId._id.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      if (request.status !== 'requested') {
        return NextResponse.json({ error: 'Only pending requests can be cancelled' }, { status: 400 });
      }
      request.status = 'cancelled';
      await request.save();
      return NextResponse.json({ success: true });
    }

    // Everything below is librarian-only
    if (session.user.role !== 'librarian') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'approve') {
      // Check availability
      const inv = await CollegeBook.findOne({ collegeId: request.collegeId, bookId: request.bookId._id });
      if (!inv || inv.available < 1) {
        return NextResponse.json({ error: 'No copies available' }, { status: 400 });
      }

      request.status = 'approved';
      request.respondedBy = session.user.id;
      request.respondedAt = new Date();
      await request.save();

      // Notify student
      const college = await College.findById(request.collegeId).select('settings').lean();
      const approvedDays = request.daysNeeded || college?.settings?.maxBorrowDays || 14;
      await createNotification({
        userId: request.userId._id,
        collegeId: request.collegeId,
        title: 'Book Request Approved!',
        message: `Your request for "${request.bookId.title}" has been approved. Please collect it from the library.`,
        type: 'request_approved',
        link: '/student/requests',
        sendEmail: true,
        emailTemplate: requestApprovedEmail({
          userName: request.userId.name,
          bookTitle: request.bookId.title,
          dueDate: `${approvedDays} days from issue`,
        }),
      });
    } else if (action === 'reject') {
      request.status = 'rejected';
      request.note = note || '';
      request.respondedBy = session.user.id;
      request.respondedAt = new Date();
      await request.save();

      await createNotification({
        userId: request.userId._id,
        collegeId: request.collegeId,
        title: 'Book Request Rejected',
        message: `Your request for "${request.bookId.title}" was rejected.${note ? ` Reason: ${note}` : ''}`,
        type: 'request_rejected',
        link: '/student/requests',
      });
    } else if (action === 'issue') {
      // Mark physically issued — create borrow record
      if (request.status !== 'approved') {
        return NextResponse.json({ error: 'Request must be approved first' }, { status: 400 });
      }

      const college = await College.findById(request.collegeId).select('settings').lean();
      const maxDays = request.daysNeeded || college?.settings?.maxBorrowDays || 14;
      const issueDate = new Date();
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + maxDays);

      await BorrowRecord.create({
        collegeId: request.collegeId,
        userId: request.userId._id,
        bookId: request.bookId._id,
        requestId: request._id,
        issueDate,
        dueDate,
        issuedBy: session.user.id,
        status: 'issued',
      });

      // Decrement inventory
      await CollegeBook.findOneAndUpdate(
        { collegeId: request.collegeId, bookId: request.bookId._id },
        { $inc: { available: -1 } }
      );

      request.status = 'issued';
      await request.save();

      await createNotification({
        userId: request.userId._id,
        collegeId: request.collegeId,
        title: 'Book Issued',
        message: `"${request.bookId.title}" has been issued to you. Due date: ${dueDate.toLocaleDateString('en-IN')}.`,
        type: 'book_issued',
        link: '/student/my-books',
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Requests PATCH]', err);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
