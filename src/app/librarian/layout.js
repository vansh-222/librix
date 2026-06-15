import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LibrarianLayoutClient from './LibrarianLayoutClient';

export default async function LibrarianLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user.role !== 'librarian') redirect('/login');
  return <LibrarianLayoutClient user={session.user}>{children}</LibrarianLayoutClient>;
}
