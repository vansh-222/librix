import connectDB from '@/lib/db';
import College from '@/models/College';
import { NextResponse } from 'next/server';

// POST /api/colleges/register — public college registration
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, address, plan } = body;

    if (!name || !email || !phone || !address) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    const existing = await College.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'A college with this email already exists' }, { status: 409 });
    }

    const college = await College.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      plan: plan || 'free',
      status: 'pending',
    });

    return NextResponse.json({ success: true, collegeId: college._id }, { status: 201 });
  } catch (err) {
    console.error('[College Register]', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
