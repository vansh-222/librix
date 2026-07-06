import Razorpay from 'razorpay';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import BorrowRecord from '@/models/BorrowRecord';
import { NextResponse } from 'next/server';

// POST /api/payments/create-order
// Creates a Razorpay order for a pending fine
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { recordId } = await req.json();
    if (!recordId) return NextResponse.json({ error: 'Missing recordId' }, { status: 400 });

    await connectDB();
    const record = await BorrowRecord.findById(recordId)
      .populate('bookId', 'title')
      .populate('userId', 'name email');

    if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    if (record.fineStatus !== 'pending') return NextResponse.json({ error: 'No pending fine' }, { status: 400 });

    // Make sure student can only pay their own fine
    if (record.userId._id.toString() !== session.user.id && session.user.role !== 'librarian') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount:   record.fine * 100, // Razorpay uses paise (₹1 = 100 paise)
      currency: 'INR',
      receipt:  `fine_${recordId.slice(-8)}`, // max 40 chars
      notes: {
        recordId,
        bookTitle: record.bookId?.title || '',
        studentName: record.userId?.name || '',
        collegeId: record.collegeId?.toString() || '',
      },
    });

    return NextResponse.json({
      orderId:  order.id,
      amount:   order.amount,   // in paise
      currency: order.currency,
      keyId:    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      // Pre-fill student info for checkout
      name:     record.userId?.name  || '',
      email:    record.userId?.email || '',
      description: `Library fine — ${record.bookId?.title || 'Book'}`,
    });
  } catch (err) {
    console.error('[create-order]', err);
    return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 500 });
  }
}
