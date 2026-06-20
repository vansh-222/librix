import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import connectDB from './db';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: false,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        collegeId: { label: 'College ID', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          await connectDB();

          const email = credentials.email.trim().toLowerCase();
          const rawCollegeId = credentials.collegeId;

          // Treat empty / literal "undefined" / "null" as super_admin path
          const isSuperAdmin =
            !rawCollegeId ||
            rawCollegeId === 'undefined' ||
            rawCollegeId === 'null' ||
            rawCollegeId.trim() === '';

          const query = isSuperAdmin
            ? { email, role: 'super_admin' }
            : { email, collegeId: rawCollegeId };

          console.log('[Auth] query:', JSON.stringify(query));

          const user = await User.findOne(query).select('+passwordHash');
          if (!user) {
            console.log('[Auth] no user found');
            return null;
          }
          if (!user.isActive) {
            console.log('[Auth] user inactive');
            return null;
          }

          const isValid = await user.comparePassword(credentials.password);
          console.log('[Auth] password valid:', isValid);
          if (!isValid) return null;

          await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            collegeId: user.collegeId ? user.collegeId.toString() : null,
            avatarUrl: user.avatarUrl || '',
          };
        } catch (err) {
          console.error('[Auth] authorize error:', err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.collegeId = user.collegeId;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.collegeId = token.collegeId;
      session.user.avatarUrl = token.avatarUrl;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
});
