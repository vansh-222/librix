import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './db';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: false,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          await connectDB();

          const email = credentials.email.trim().toLowerCase();

          // Find user by email (any role)
          const user = await User.findOne({ email }).select('+passwordHash');

          if (!user)           { console.log('[Auth] user not found:', email); return null; }
          if (!user.isActive)  { console.log('[Auth] user inactive:',  email); return null; }

          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) { console.log('[Auth] wrong password:', email); return null; }

          // Librarians must have a college assigned
          if (user.role === 'librarian' && !user.collegeId) {
            console.log('[Auth] librarian has no collegeId:', email);
            // Return a special error flag — UI can show a friendly message
            throw new Error('LIBRARIAN_NO_COLLEGE');
          }

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
          console.error('[Auth] authorize error:', err.message);
          // Re-throw so NextAuth passes the error message to the client
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        await connectDB();
        const email = user.email.trim().toLowerCase();
        const dbUser = await User.findOne({ email });
        
        if (!dbUser) {
          console.log('[Auth] Google login blocked - email not registered:', email);
          // Return a specific URL with an error query parameter
          return '/login?error=NotRegistered';
        }
        
        if (!dbUser.isActive) {
          console.log('[Auth] Google login blocked - user inactive:', email);
          return false;
        }

        // Attach DB user properties to the NextAuth user object for jwt callback
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
        user.collegeId = dbUser.collegeId ? dbUser.collegeId.toString() : null;
        user.avatarUrl = dbUser.avatarUrl || '';
        
        await User.findByIdAndUpdate(dbUser._id, { lastLogin: new Date() });
        return true;
      }
      return true; // For credentials provider
    },
    async jwt({ token, user, trigger, session }) {
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
