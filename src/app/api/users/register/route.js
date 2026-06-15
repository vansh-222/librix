import connectDB from '@/lib/db';
import User from '@/models/User';
import College from '@/models/College';
import { NextResponse } from 'next/server';

// POST /api/users/register — student/teacher self-registration
export async function POST(req) {
  try {
    const body = await req.json();
    const { collegeId, name, email, password, role, studentId, rollNumber, department, phone } = body;

    if (!collegeId || !name || !email || !password || !role) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }
    if (!['student', 'teacher'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    await connectDB();

    // Verify college exists and is active
    const college = await College.findById(collegeId);
    if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 });
    if (college.status !== 'active') {
      return NextResponse.json({ error: 'This college is not yet active. Please contact your librarian.' }, { status: 403 });
    }
    if (!college.settings.allowStudentRegistration) {
      return NextResponse.json({ error: 'Self-registration is disabled for this college.' }, { status: 403 });
    }

    // Check duplicate email within same college
    const existing = await User.findOne({ email: email.toLowerCase(), collegeId });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists at this college' }, { status: 409 });
    }

    const passwordHash = await User.hashPassword(password);

    await User.create({
      collegeId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      studentId: studentId || '',
      rollNumber: rollNumber || '',
      department: department || '',
      phone: phone || '',
      isActive: true,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[User Register]', err);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
