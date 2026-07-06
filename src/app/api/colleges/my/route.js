import connectDB from '@/lib/db';
import College from '@/models/College';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/colleges/my — any authenticated user can fetch their own college's public settings
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const college = await College.findById(session.user.collegeId)
      .select('name settings status')
      .lean();

    if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 });

    return NextResponse.json({ college });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch college' }, { status: 500 });
  }
}

// PATCH /api/colleges/my — librarian updates their college settings
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'librarian') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    // Only allow updating safe settings fields
    const allowed = ['finePerDay', 'maxBorrowDays', 'maxExtensions', 'maxBooksPerUser', 'upiId', 'upiName'];
    const update = {};
    for (const key of allowed) {
      if (body[key] !== undefined) {
        update[`settings.${key}`] = body[key];
      }
    }

    const college = await College.findByIdAndUpdate(
      session.user.collegeId,
      { $set: update },
      { new: true }
    ).select('name settings').lean();

    return NextResponse.json({ college });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
