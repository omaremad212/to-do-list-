import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        isDemo: { label: 'isDemo', type: 'boolean' },
        email: { label: 'email', type: 'string' },
        password: { label: 'password', type: 'string' },
      },
      async authorize(credentials) {
        if (credentials?.isDemo === 'true') {
          return {
            id: 'demo@taskflow.app',
            email: 'demo@taskflow.app',
            name: 'Demo User',
          };
        }
        if (credentials?.email && credentials?.password) {
          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email.split('@')[0],
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.isDemo = user.email === 'demo@taskflow.app';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).isDemo = token.isDemo as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };