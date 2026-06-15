import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!session) redirect('/login');
  if (session.user.role !== 'super_admin') redirect('/login');
  return <AdminLayoutClient user={session.user}>{children}</AdminLayoutClient>;
}
