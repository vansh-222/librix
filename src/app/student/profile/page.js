import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/db';
import User from '@/models/User';
import ProfilePageClient from './ProfilePageClient';

export default async function StudentProfilePage() {
  const session = await auth();
  if (!session) redirect('/login');

  // Fetch complete user data from database
  await connectDB();
  const userData = await User.findById(session.user.id)
    .select('-passwordHash')
    .lean();

  if (!userData) redirect('/login');

  // Convert MongoDB ObjectId and Dates to strings for client component
  const userForClient = {
    ...userData,
    _id: userData._id.toString(),
    collegeId: userData.collegeId?.toString() || null,
    createdAt: userData.createdAt?.toISOString() || null,
    updatedAt: userData.updatedAt?.toISOString() || null,
    lastLogin: userData.lastLogin?.toISOString() || null,
  };

  return <ProfilePageClient user={userForClient} />;
}
