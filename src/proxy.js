import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const ROLE_PREFIXES = {
  '/admin': 'super_admin',
  '/librarian': 'librarian',
  '/student': ['student', 'teacher'],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Public routes — no auth needed
  const publicRoutes = ['/', '/platform', '/ai-features', '/login', '/register', '/signup', '/forgot-password', '/reset-password', '/librarian/setup'];
  if (
    publicRoutes.some(r => pathname === r) ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/colleges/') ||      // all college registration + verification APIs
    pathname.startsWith('/api/librarian/setup') || // librarian account creation
    pathname.startsWith('/api/users/register')     // student self-registration
  ) {
    // Redirect authenticated users away from login/register
    if (session && (pathname === '/login' || pathname === '/signup' || pathname === '/register')) {
      const role = session.user.role;
      if (role === 'super_admin') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      if (role === 'librarian') return NextResponse.redirect(new URL('/librarian/dashboard', req.url));
      return NextResponse.redirect(new URL('/student/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = session.user.role;

  // Check role-based access
  for (const [prefix, allowedRole] of Object.entries(ROLE_PREFIXES)) {
    if (pathname.startsWith(prefix)) {
      const allowed = Array.isArray(allowedRole)
        ? allowedRole.includes(role)
        : role === allowedRole;
      if (!allowed) {
        // Redirect to correct dashboard
        if (role === 'super_admin') return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        if (role === 'librarian') return NextResponse.redirect(new URL('/librarian/dashboard', req.url));
        return NextResponse.redirect(new URL('/student/dashboard', req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
