import connectDB from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/users/me — return current user's full profile
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.user.id)
      .select('-passwordHash')
      .populate('collegeId', 'name')
      .lean();

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('[Users/me GET]', err);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PATCH /api/users/me — update own profile fields
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const allowed = ['name', 'phone', 'department', 'avatarUrl', 'studentId', 'rollNumber'];
    const updates = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true, select: '-passwordHash' }
    ).lean();

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('[Users/me PATCH]', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
