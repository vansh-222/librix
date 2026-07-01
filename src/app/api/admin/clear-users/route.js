import connectDB from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// GET /api/admin/clear-users
// One-time endpoint to delete ALL users. DELETE THIS FILE AFTER USE.
export async function GET() {
  try {
    await connectDB();
    const users  = await User.find({}).select('name email role');
    const result = await User.deleteMany({});

    return NextResponse.json({
      success:  true,
      deleted:  result.deletedCount,
      accounts: users.map(u => ({ name: u.name, email: u.email, role: u.role })),
      message:  'All users deleted. You can now register a fresh college at /register',
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
