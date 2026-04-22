import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (credentials.email === 'demo@taskflow.app' && credentials.password === 'demo123') {
          return {
            id: 'demo@taskflow.app',
            email: 'demo@taskflow.app',
            name: 'Demo User',
            image: null,
          };
        }

        const userRef = doc(db, 'users', credentials.email);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          return null;
        }

        const userData = userSnap.data();

        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          image: userData.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const userRef = doc(db, 'users', user.email);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            id: user.email,
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          await setDoc(userRef, {
            ...userSnap.data(),
            name: user.name,
            image: user.image,
            updatedAt: new Date(),
          }, { merge: true });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isDemo = user.email === 'demo@taskflow.app';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isDemo = token.isDemo;
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
  secret: process.env.NEXTAUTH_SECRET,
};