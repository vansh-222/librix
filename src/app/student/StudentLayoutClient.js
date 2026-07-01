'use client';
import StudentLayout from '@/components/student/StudentLayout';

export default function StudentLayoutClient({ children, user }) {
  return (
    <StudentLayout userName={user?.name || 'Student'} userEmail={user?.email || ''}>
      {children}
    </StudentLayout>
  );
}
