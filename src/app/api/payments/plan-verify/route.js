import crypto from 'crypto';
import { NextResponse } from 'next/server';

const VALID_PLANS = ['standard', 'premium'];

// POST /api/payments/plan-verify
// Verifies Razorpay signature for plan purchase — no auth needed
export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!VALID_PLANS.includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Verify HMAC-SHA256 signature — same as Razorpay's standard verification
    const body     = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature — possible tampering' }, { status: 400 });
    }

    // Signature valid — payment is genuine
    return NextResponse.json({
      success:   true,
      paymentId: razorpay_payment_id,
      plan,
    });
  } catch (err) {
    console.error('[plan-verify]', err);
    return NextResponse.json({ error: err.message || 'Verification failed' }, { status: 500 });
  }
}
