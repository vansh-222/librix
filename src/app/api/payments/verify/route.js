import crypto from 'crypto';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/db';
import BorrowRecord from '@/models/BorrowRecord';
import User from '@/models/User';
import { createNotification } from '@/lib/notifications';
import { NextResponse } from 'next/server';

// POST /api/payments/verify
// Cryptographically verifies a Razorpay payment signature and marks fine as paid
export async function POST(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, recordId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !recordId) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
    }

    // ── CRYPTOGRAPHIC SIGNATURE VERIFICATION ──────────────────────────────────
    // Razorpay signs the payment using HMAC-SHA256 with your KEY_SECRET.
    // If this matches, the payment is 100% genuine and came from Razorpay's servers.
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('[verify] Signature mismatch — possible tampered request');
      return NextResponse.json({ error: 'Payment verification failed — invalid signature' }, { status: 400 });
    }
    // ─────────────────────────────────────────────────────────────────────────

    await connectDB();
    const record = await BorrowRecord.findById(recordId)
      .populate('userId', 'name email')
      .populate('bookId', 'title');

    if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    if (record.fineStatus === 'paid') {
      return NextResponse.json({ success: true, alreadyPaid: true }); // idempotent
    }
    if (record.fineStatus !== 'pending') {
      return NextResponse.json({ error: 'Fine is not in pending state' }, { status: 400 });
    }

    // Mark fine as paid with Razorpay payment ID
    record.fineStatus  = 'paid';
    record.finePaidAt  = new Date();
    record.upiTxnId    = razorpay_payment_id; // store Razorpay payment ID for records
    await record.save();

    // Notify student
    await createNotification({
      userId:    record.userId._id,
      collegeId: record.collegeId,
      title:     'Fine Paid ✅',
      message:   `Your fine of ₹${record.fine} for "${record.bookId.title}" was paid successfully via Razorpay.`,
      type:      'general',
      link:      '/student/fines',
    });

    // Notify all librarians
    const librarians = await User.find({ collegeId: record.collegeId, role: 'librarian' }).select('_id').lean();
    await Promise.all(librarians.map(l =>
      createNotification({
        userId:    l._id,
        collegeId: record.collegeId,
        title:     'Fine Payment Received 💰',
        message:   `${record.userId.name} paid ₹${record.fine} for "${record.bookId.title}" via Razorpay (ID: ${razorpay_payment_id}).`,
        type:      'general',
        link:      '/librarian/fines',
      })
    ));

    return NextResponse.json({
      success:   true,
      paymentId: razorpay_payment_id,
      amount:    record.fine,
    });
  } catch (err) {
    console.error('[verify]', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}
