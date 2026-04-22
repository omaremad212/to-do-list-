import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        const userRef = doc(db, "users", user.email);
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
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};