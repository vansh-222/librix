import connectDB from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// POST /api/users/register — student self-registration (single-college mode)
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, collegeId, studentId, rollNumber, department, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }
    if (role && role !== 'student') {
      return NextResponse.json({ error: 'Only student accounts can self-register' }, { status: 403 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await connectDB();

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await User.hashPassword(password);

    await User.create({
      collegeId: collegeId || null,
      name:      name.trim(),
      email:     email.toLowerCase().trim(),
      passwordHash,
      role:      'student',
      studentId:  studentId  || '',
      rollNumber: rollNumber || '',
      department: department || '',
      phone:      phone      || '',
      isActive:   true,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[User Register]', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
