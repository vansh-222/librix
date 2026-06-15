import connectDB from '@/lib/db';
import Reservation from '@/models/Reservation';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/reservations — student's reservations or librarian view
export async function GET(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    let query = { collegeId: session.user.collegeId };
    if (['student', 'teacher'].includes(session.user.role)) {
      query.userId = session.user.id;
    }

    const reservations = await Reservation.find(query)
      .populate('bookId', 'title author cover isbn')
      .populate('userId', 'name email studentId')
      .sort({ position: 1 })
      .lean();

    return NextResponse.json({ reservations });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

// POST /api/reservations — student reserves an unavailable book
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !['student', 'teacher'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId } = await req.json();
    if (!bookId) return NextResponse.json({ error: 'Book ID required' }, { status: 400 });

    await connectDB();

    // Check not already reserved
    const existing = await Reservation.findOne({
      userId: session.user.id,
      bookId,
      collegeId: session.user.collegeId,
      status: { $in: ['waiting', 'notified'] },
    });
    if (existing) {
      return NextResponse.json({ error: 'You already have a reservation for this book' }, { status: 409 });
    }

    // Get queue position
    const queueCount = await Reservation.countDocuments({
      bookId,
      collegeId: session.user.collegeId,
      status: { $in: ['waiting', 'notified'] },
    });

    const reservation = await Reservation.create({
      collegeId: session.user.collegeId,
      bookId,
      userId: session.user.id,
      position: queueCount + 1,
      status: 'waiting',
    });

    return NextResponse.json({ success: true, reservation, position: queueCount + 1 }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

// DELETE /api/reservations?reservationId=xxx
export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const reservationId = searchParams.get('reservationId');

    await connectDB();
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (reservation.userId.toString() !== session.user.id && session.user.role !== 'librarian') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    // Shift queue positions
    await Reservation.updateMany(
      { bookId: reservation.bookId, collegeId: reservation.collegeId, position: { $gt: reservation.position }, status: 'waiting' },
      { $inc: { position: -1 } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to cancel reservation' }, { status: 500 });
  }
}
