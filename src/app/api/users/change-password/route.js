import connectDB from '@/lib/db';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Verify the user is changing their own password
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash and update new password
    const newPasswordHash = await User.hashPassword(newPassword);
    user.passwordHash = newPasswordHash;
    await user.save();

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('[Change Password]', err);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
