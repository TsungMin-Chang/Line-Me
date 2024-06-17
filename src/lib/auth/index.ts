import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from 'next-auth/providers/google'

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

import CredentialsProvider from "./CredentialsProvider";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub, Google, CredentialsProvider],
  callbacks: {
    async session({ session, token }) {
      const email = token.email || session?.user?.email;
      if (!email) return session;
      const [user] = await db
        .select({
          id: usersTable.id,
          username: usersTable.username,
          provider: usersTable.provider,
          email: usersTable.email,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();

      return {
        ...session,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          provider: user.provider,
        },
      };
    },
    async jwt({ token, account }) {
      // sign in with social account
      if (!account) return token;
      const { name, email, picture } = token;
      const provider = account.provider;
      if (!name || !email || !provider) return token;
      
      // check if email + provider combination exists
      const [existedUser] = await db
        .select({
          id: usersTable.id,
          provider: usersTable.provider,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email.toLowerCase()))
        .execute();

      // Yes: return
      if (existedUser && existedUser.provider === provider) return token;

      if ((provider !== "github") && (provider !== "google")) {
        return token;
      }
      // No: insert db and sign up
      await db.insert(usersTable).values({
        username: name,
        email: email.toLowerCase(),
        provider,
      });

      return token;
    },
  },
  pages: {
    signIn: "/",
  },
});
