import connectDB from '@/lib/db';
import BorrowRecord from '@/models/BorrowRecord';
import BookCopy from '@/models/BookCopy';
import CollegeBook from '@/models/CollegeBook';
import Reservation from '@/models/Reservation';
import Request from '@/models/Request';
import College from '@/models/College';
import { createNotification } from '@/lib/notifications';
import { fineAddedEmail, reservationAvailableEmail } from '@/lib/email';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/borrow — active borrow records
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = { collegeId: session.user.collegeId };
    if (['student', 'teacher'].includes(session.user.role)) {
      query.userId = session.user.id;
    }
    if (status) query.status = status;

    const records = await BorrowRecord.find(query)
      .populate('userId', 'name email studentId rollNumber avatarUrl')
      .populate('bookId', 'title author cover isbn category')
      .populate('copyId', 'accessionNo')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ records });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch borrow records' }, { status: 500 });
  }
}

// PATCH /api/borrow — handle return, extension, fine payment
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { recordId, action, condition, extensionDays, rating, reviewNote, upiTxnId } = await req.json();
    if (!recordId || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await connectDB();
    const record = await BorrowRecord.findById(recordId)
      .populate('userId', 'name email')
      .populate('bookId', 'title');
    if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });

    const college = await College.findById(record.collegeId).select('settings').lean();
    const settings = college?.settings || {};

    if (action === 'mark_return') {
      // Student marks book as ready to return
      if (record.userId._id.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      record.status = 'return_pending';
      await record.save();

      // Notify librarian
      const { default: User } = await import('@/models/User');
      const librarians = await User.find({ collegeId: record.collegeId, role: 'librarian' }).select('_id').lean();
      await Promise.all(librarians.map(l =>
        createNotification({
          userId: l._id,
          collegeId: record.collegeId,
          title: 'Return Pending',
          message: `${record.userId.name} has marked "${record.bookId.title}" for return.`,
          type: 'general',
          link: '/librarian/returns',
        })
      ));

    } else if (action === 'receive_book') {
      // Librarian confirms receipt
      if (session.user.role !== 'librarian') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const returnDate = new Date();
      const dueDate = new Date(record.dueDate);
      let fine = 0;

      // Calculate overdue fine
      if (returnDate > dueDate) {
        const lateDays = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
        fine = lateDays * (settings.finePerDay || 50);
      }

      // Extra fine for damage/loss
      const bookCondition = condition || 'good';
      if (bookCondition === 'damaged') fine += 200;
      if (bookCondition === 'lost') fine += 500;

      record.status = 'returned';
      record.returnDate = returnDate;
      record.condition = bookCondition;
      record.fine = fine;
      record.fineStatus = fine > 0 ? 'pending' : 'none';
      record.receivedBy = session.user.id;
      await record.save();

      // Restore inventory
      await CollegeBook.findOneAndUpdate(
        { collegeId: record.collegeId, bookId: record.bookId._id },
        { $inc: { available: 1 } }
      );

      // Update associated request status to 'returned' so student can request again
      if (record.requestId) {
        await Request.findByIdAndUpdate(record.requestId, { status: 'returned' }).catch(() => {});
      } else {
        await Request.findOneAndUpdate({ userId: record.userId._id, bookId: record.bookId._id, status: 'issued' }, { status: 'returned' }).catch(() => {});
      }

      // Fine notification
      if (fine > 0) {
        await createNotification({
          userId: record.userId._id,
          collegeId: record.collegeId,
          title: 'Fine Added',
          message: `A fine of ${settings.currencySymbol || '₹'}${fine} has been added for "${record.bookId.title}".`,
          type: 'fine_added',
          link: '/student/my-books',
          sendEmail: true,
          emailTemplate: fineAddedEmail({
            userName: record.userId.name,
            bookTitle: record.bookId.title,
            fineAmount: fine,
            symbol: settings.currencySymbol || '₹',
          }),
        });
      }

      // Check reservations — notify next in queue
      const nextReservation = await Reservation.findOne({
        collegeId: record.collegeId,
        bookId: record.bookId._id,
        status: 'waiting',
      }).sort({ position: 1 }).populate('userId', 'name email');

      if (nextReservation) {
        nextReservation.status = 'notified';
        nextReservation.notifiedAt = new Date();
        nextReservation.expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
        await nextReservation.save();

        await createNotification({
          userId: nextReservation.userId._id,
          collegeId: record.collegeId,
          title: 'Reserved Book Available!',
          message: `"${record.bookId.title}" is now available. Please collect within 48 hours.`,
          type: 'reservation_available',
          link: '/student/reservations',
          sendEmail: true,
          emailTemplate: reservationAvailableEmail({
            userName: nextReservation.userId.name,
            bookTitle: record.bookId.title,
          }),
        });
      }

    } else if (action === 'request_extension') {
      // Student requests extension
      if (record.userId._id.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      const maxExt = settings.maxExtensions || 2;
      if (record.extensionsUsed >= maxExt) {
        return NextResponse.json({ error: `Maximum ${maxExt} extensions already used` }, { status: 400 });
      }
      const days = extensionDays || settings.maxBorrowDays || 14;
      const newDue = new Date(record.dueDate);
      newDue.setDate(newDue.getDate() + days);
      record.dueDate = newDue;
      record.extensionsUsed += 1;
      await record.save();

      await createNotification({
        userId: record.userId._id,
        collegeId: record.collegeId,
        title: 'Extension Granted',
        message: `Your borrow period for "${record.bookId.title}" has been extended to ${newDue.toLocaleDateString('en-IN')}.`,
        type: 'extension_approved',
        link: '/student/my-books',
      });

    } else if (action === 'pay_fine') {
      // Student or librarian marks fine as paid
      const isOwner = record.userId._id.toString() === session.user.id;
      const isLibrarian = session.user.role === 'librarian';
      if (!isOwner && !isLibrarian) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      if (record.fineStatus !== 'pending') {
        return NextResponse.json({ error: 'No pending fine to pay' }, { status: 400 });
      }
      record.fineStatus = 'paid';
      record.finePaidAt = new Date();
      if (upiTxnId) record.upiTxnId = upiTxnId;
      await record.save();

      // Notify student
      await createNotification({
        userId: record.userId._id,
        collegeId: record.collegeId,
        title: 'Fine Paid ✅',
        message: `Your fine of ₹${record.fine} for "${record.bookId.title}" has been marked as paid.`,
        type: 'general',
        link: '/student/fines',
      });

      // Notify all librarians
      const { default: User } = await import('@/models/User');
      const librarians = await User.find({ collegeId: record.collegeId, role: 'librarian' }).select('_id').lean();
      await Promise.all(librarians.map(l =>
        createNotification({
          userId: l._id,
          collegeId: record.collegeId,
          title: 'Fine Payment Received 💰',
          message: `${record.userId.name} has paid ₹${record.fine} fine for "${record.bookId.title}".`,
          type: 'general',
          link: '/librarian/fines',
        })
      ));

    } else if (action === 'waive_fine') {
      // Librarian waives fine
      if (session.user.role !== 'librarian') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      record.fineStatus = 'waived';
      await record.save();

      await createNotification({
        userId: record.userId._id,
        collegeId: record.collegeId,
        title: 'Fine Waived',
        message: `Your fine of ${settings.currencySymbol || '₹'}${record.fine} for "${record.bookId.title}" has been waived by the librarian.`,
        type: 'general',
        link: '/student/fines',
      });

    } else if (action === 'rate') {
      // Student rates a returned book
      if (record.userId._id.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      if (record.status !== 'returned') {
        return NextResponse.json({ error: 'Can only rate returned books' }, { status: 400 });
      }
      const ratingVal = Math.min(5, Math.max(1, parseInt(rating) || 1));
      record.rating = ratingVal;
      if (reviewNote) record.reviewNote = reviewNote;
      await record.save();
    }

    return NextResponse.json({ success: true, record });
  } catch (err) {
    console.error('[Borrow PATCH]', err);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}
