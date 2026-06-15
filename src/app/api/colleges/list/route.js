import connectDB from '@/lib/db';
import College from '@/models/College';
import { NextResponse } from 'next/server';

// GET /api/colleges/list — public, returns active colleges for login/signup dropdowns
export async function GET() {
  try {
    await connectDB();
    const colleges = await College.find({ status: 'active' })
      .select('_id name')
      .sort({ name: 1 })
      .lean();
    return NextResponse.json({ colleges });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }
}
