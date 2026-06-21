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
        email:         { label: 'Email',          type: 'email'    },
        password:      { label: 'Password',       type: 'password' },
        librarianCode: { label: 'Librarian Code', type: 'text'     },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          await connectDB();

          const email = credentials.email.trim().toLowerCase();
          const isLibrarianLogin = !!credentials.librarianCode;

          // --- Librarian path: validate access code FIRST ---
          if (isLibrarianLogin) {
            const validCode = process.env.LIBRARIAN_ACCESS_CODE;
            if (!validCode || credentials.librarianCode.trim() !== validCode) {
              console.log('[Auth] invalid librarian access code');
              return null;
            }
            // Find user and enforce role = librarian
            const user = await User.findOne({ email, role: 'librarian' }).select('+passwordHash');
            if (!user || !user.isActive) return null;
            const isValid = await user.comparePassword(credentials.password);
            if (!isValid) return null;
            await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
            return {
              id:        user._id.toString(),
              name:      user.name,
              email:     user.email,
              role:      user.role,
              collegeId: user.collegeId ? user.collegeId.toString() : null,
              avatarUrl: user.avatarUrl || '',
            };
          }

          // --- Student path: no access code, role must NOT be librarian ---
          const user = await User.findOne({ email, role: { $ne: 'librarian' } }).select('+passwordHash');
          if (!user) {
            console.log('[Auth] student not found or tried librarian login without code');
            return null;
          }
          if (!user.isActive) return null;

          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) return null;

          await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

          return {
            id:        user._id.toString(),
            name:      user.name,
            email:     user.email,
            role:      user.role,
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
        token.id        = user.id;
        token.role      = user.role;
        token.collegeId = user.collegeId;
        token.avatarUrl = user.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id        = token.id;
      session.user.role      = token.role;
      session.user.collegeId = token.collegeId;
      session.user.avatarUrl = token.avatarUrl;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error:  '/login',
  },
  session: { strategy: 'jwt' },
});
