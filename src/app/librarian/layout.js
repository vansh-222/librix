import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LibrarianLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user.role !== 'librarian') redirect('/login');
  // Pass user data via a wrapper — dashboard is now fully self-contained
  return <>{children}</>;
}
