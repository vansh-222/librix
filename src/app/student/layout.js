import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import StudentLayoutClient from './StudentLayoutClient';

export default async function StudentLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/login');
  if (!['student', 'teacher'].includes(session.user.role)) redirect('/login');

  return <StudentLayoutClient user={session.user}>{children}</StudentLayoutClient>;
}
