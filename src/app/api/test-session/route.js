import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({
      session: session,
      user: session?.user,
      hasCollegeId: !!session?.user?.collegeId,
      collegeId: session?.user?.collegeId,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
