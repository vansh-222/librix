import connectDB from '@/lib/db';
import User from '@/models/User';
import College from '@/models/College';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET /api/users — librarian: list members, admin: platform-wide
export async function GET(req) {
  try {
    const session = await auth();
    console.log('[Users API] Session:', session?.user);
    
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search') || '';

    let query = {};

    if (session.user.role === 'super_admin') {
      if (role) query.role = role;
    } else if (session.user.role === 'librarian') {
      query.collegeId = session.user.collegeId;
      query.role = { $in: ['student', 'teacher'] };
      if (role && ['student', 'teacher'].includes(role)) query.role = role;
      console.log('[Users API] Librarian query:', JSON.stringify(query));
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();

    console.log('[Users API] Found users:', users.length);
    return NextResponse.json({ users });
  } catch (err) {
    console.error('[Users API] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users — librarian/admin creates user (librarian creation by admin)
export async function POST(req) {
  try {
    const session = await auth();
    if (!session || !['super_admin', 'librarian'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { collegeId, name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    await connectDB();

    const targetCollegeId = session.user.role === 'super_admin' ? collegeId : session.user.collegeId;

    const existing = await User.findOne({ email: email.toLowerCase(), collegeId: targetCollegeId });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists at this college' }, { status: 409 });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      collegeId: targetCollegeId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      isActive: true,
    });

    return NextResponse.json({ success: true, userId: user._id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PATCH /api/users — update user profile
export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, ...updates } = await req.json();
    await connectDB();

    // Users can update their own profile
    const isSelf = session.user.id === userId;
    const isAdmin = ['super_admin', 'librarian'].includes(session.user.role);

    if (!isSelf && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Define allowed fields based on role
    let allowedUpdates = [];
    if (isSelf) {
      allowedUpdates = ['department', 'phone', 'rollNumber', 'studentId'];
    }
    if (isAdmin) {
      allowedUpdates = ['isActive', 'department', 'phone', 'rollNumber', 'studentId', 'name', 'email'];
    }

    const safeUpdates = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowedUpdates.includes(k))
    );

    const user = await User.findByIdAndUpdate(userId, safeUpdates, { new: true }).select('-passwordHash');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('[Users PATCH]', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
