import connectDB from '@/lib/db';
import User from '@/models/User';
import College from '@/models/College';
import { NextResponse } from 'next/server';

// POST /api/users/register — student self-registration using College Code
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, collegeCode, studentId, rollNumber, department, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }
    if (!collegeCode || !collegeCode.trim()) {
      return NextResponse.json({ error: 'College Library ID is required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await connectDB();

    // Validate library code — try libraryCode first, then old collegeCode (backward compat)
    const college = await College.findOne({
      $or: [
        { libraryCode: collegeCode.trim().toUpperCase(), status: 'active' },
        { collegeCode: collegeCode.trim().toUpperCase(), status: 'active' },
      ],
    });
    if (!college) {
      return NextResponse.json({
        error: 'Invalid Library Code. Please check with your college librarian.',
      }, { status: 400 });
    }

    // Check duplicate email globally (email is a unique index in MongoDB)
    const existing = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await User.hashPassword(password);

    await User.create({
      collegeId:  college._id,
      name:       name.trim(),
      email:      email.toLowerCase().trim(),
      passwordHash,
      role:       'student',
      studentId:  studentId  || '',
      rollNumber: rollNumber || '',
      department: department || '',
      phone:      phone      || '',
      isActive:   true,
    });

    return NextResponse.json({ success: true, collegeName: college.name }, { status: 201 });
  } catch (err) {
    console.error('[User Register]', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
