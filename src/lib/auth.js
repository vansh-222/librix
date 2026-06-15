import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import connectDB from './db';
import User from '@/models/User';

import { AuthError } from 'next-auth';

class CustomAuthError extends AuthError {
  constructor(message) {
    super();
    this.message = message;
    this.type = 'CredentialsSignin';
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        collegeId: { label: 'College ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        // Normalize email
        const email = credentials.email.trim().toLowerCase();

        // NextAuth sometimes coerces empty/null to string "undefined" or "null"
        const isSuperAdmin = !credentials.collegeId || credentials.collegeId === 'undefined' || credentials.collegeId === 'null' || credentials.collegeId.trim() === '';

        const query = isSuperAdmin
          ? { email: email, role: 'super_admin' }
          : { email: email, collegeId: credentials.collegeId };

        console.log('[Auth] Attempting login with query:', query);

        const user = await User.findOne(query);
        if (!user) {
          throw new CustomAuthError('User not found in DB with query: ' + JSON.stringify(query));
        }
        if (!user.isActive) {
          throw new CustomAuthError('User account is inactive');
        }

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) {
          throw new CustomAuthError('Invalid password provided');
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          collegeId: user.collegeId?.toString() || null,
          avatarUrl: user.avatarUrl || '',
        };
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
