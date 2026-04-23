import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Demo',
      credentials: {
        isDemo: { label: 'isDemo', type: 'boolean' }
      },
      async authorize(credentials) {
        // Demo mode login
        if (credentials?.isDemo === 'true') {
          return {
            id: 'demo@taskflow.app',
            email: 'demo@taskflow.app',
            name: 'Demo User',
          };
        }
        // Real user login - in production this would validate against a real auth provider
        // For now, any email/password that isn't demo will be treated as a real user
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Check if this is a demo user
      const isDemoUser = token.email === 'demo@taskflow.app';
      
      if (user) {
        token.id = user.id;
        token.isDemo = isDemoUser;
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