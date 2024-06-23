import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { eq, and } from "drizzle-orm";

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
      const provider = token.provider || session?.user?.provider; // TODO: find provider
      if (!email || !provider) return session;
      const [user] = await db
        .select({
          id: usersTable.id,
          username: usersTable.username,
          provider: usersTable.provider,
          email: usersTable.email,
          picture: usersTable.picture,
        })
        .from(usersTable)
        .where(
          and(
            eq(usersTable.email, email.toLowerCase()),
            eq(usersTable.provider, provider),
          ),
        )
        .execute();

      return {
        ...session,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          picture: user.picture,
          provider: user.provider,
        },
      };
    },
    async jwt({ token, account }) {
      // sign in with social account
      if (!account) return token;
      const { name, email, picture } = token;
      const provider = account.provider;
      if (!name || !email || !picture || !provider) return token;
      if (provider !== "github" && provider !== "google") {
        return token;
      }

      // check if email + provider combination exists
      const [existedUser] = await db
        .select({
          id: usersTable.id,
        })
        .from(usersTable)
        .where(
          and(
            eq(usersTable.email, email.toLowerCase()),
            eq(usersTable.provider, provider),
          ),
        )
        .execute();

      // Yes: return
      if (existedUser) return token;

      // No: insert db to sign up
      await db.insert(usersTable).values({
        username: name,
        email: email.toLowerCase(),
        picture,
        provider,
      });
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
});
