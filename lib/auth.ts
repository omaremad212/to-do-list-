import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        isDemo: { label: 'isDemo', type: 'string' },
        email: { label: 'email', type: 'string' },
        password: { label: 'password', type: 'string' },
        mode: { label: 'mode', type: 'string' },
      },
      async authorize(credentials) {
        if (credentials?.isDemo === 'true') {
          return {
            id: 'demo@taskflow.app',
            email: 'demo@taskflow.app',
            name: 'Demo User',
          };
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { getFirebaseAuth } = await import('./firebase');
          const firebaseAuth = await getFirebaseAuth();
          let userCredential;

          if (credentials.mode === 'signup') {
            userCredential = await createUserWithEmailAndPassword(
              firebaseAuth,
              credentials.email,
              credentials.password
            );
          } else {
            userCredential = await signInWithEmailAndPassword(
              firebaseAuth,
              credentials.email,
              credentials.password
            );
          }

          return {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName || credentials.email.split('@')[0],
          };
        } catch (error: unknown) {
          console.error("Firebase auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isDemo = user.email === 'demo@taskflow.app';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; isDemo?: boolean }).id = token.id as string;
        (session.user as { id?: string; isDemo?: boolean }).isDemo = token.isDemo as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };