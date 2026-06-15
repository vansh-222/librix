import connectDB from '@/lib/db';
import College from '@/models/College';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/colleges — admin: list all colleges
export async function GET(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = status ? { status } : {};

    const colleges = await College.find(query).sort({ createdAt: -1 }).lean();

    // Attach user counts
    const withCounts = await Promise.all(
      colleges.map(async (c) => {
        const userCount = await User.countDocuments({ collegeId: c._id });
        return { ...c, userCount };
      })
    );

    return NextResponse.json({ colleges: withCounts });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
  }
}

// PATCH /api/colleges — admin: update college status/plan
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { collegeId, ...updates } = await req.json();
    if (!collegeId) return NextResponse.json({ error: 'College ID required' }, { status: 400 });

    await connectDB();
    const college = await College.findByIdAndUpdate(collegeId, updates, { new: true });
    if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 });

    return NextResponse.json({ success: true, college });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
