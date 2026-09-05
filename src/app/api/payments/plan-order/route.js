import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const PLAN_PRICES = {
  standard: 39900, // ₹399 in paise
  premium:  79900, // ₹799 in paise
};

const PLAN_LABELS = {
  standard: 'Librix Standard Plan — ₹399/year',
  premium:  'Librix Premium Plan — ₹799/year',
};

// POST /api/payments/plan-order
// No auth needed — institution is not registered yet
export async function POST(req) {
  try {
    const { plan, contactName, email } = await req.json();

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id:     process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount:   PLAN_PRICES[plan],
      currency: 'INR',
      receipt:  `plan_${plan}_${Date.now().toString().slice(-8)}`,
      notes: {
        plan,
        contactName: contactName || '',
        email:       email || '',
      },
    });

    return NextResponse.json({
      orderId:     order.id,
      amount:      order.amount,
      currency:    order.currency,
      keyId:       process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      description: PLAN_LABELS[plan],
      name:        contactName || '',
      email:       email || '',
    });
  } catch (err) {
    console.error('[plan-order]', err);
    return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 500 });
  }
}
