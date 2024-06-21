import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { writeFile } from "fs/promises";
import path from "path";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { authSchema } from "@/validators/auth";

export default CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    username: { label: "Username", type: "text", optional: true },
    password: { label: "Password", type: "password" },
    picture: { label: "Picture", type: "text" },
  },
  async authorize(credentials) {
    let validatedCredentials: {
      email: string;
      username?: string;
      password: string;
      picture: string;
    };

    try {
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      console.log("Wrong credentials. Try again.");
      return null;
    }
    const { email, username, password, picture } = validatedCredentials;

    const [existedUser] = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        picture: usersTable.picture,
        provider: usersTable.provider,
        hashedPassword: usersTable.hashedPassword,
      })
      .from(usersTable)
      .where(eq(usersTable.email, validatedCredentials.email.toLowerCase()))
      .execute();

    if (!existedUser) {
      // Sign up
      if (!username) {
        console.log("Name is required.");
        return null;
      }
      if (!picture) {
        console.log("Picture is required.");
        return null;
      }

      // TODO: convert base64 string into buffer
      const buffer = new Buffer("base64 string");
      const filename = "credentials_" + email;
      const filepath = "public/pictures/" + filename;
      console.log(filename);
      try {
        await writeFile(path.join(process.cwd(), filepath), buffer);
      } catch (error) {
        console.log("Error occured ", error);
        return null;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [createdUser] = await db
        .insert(usersTable)
        .values({
          username,
          email: email.toLowerCase(),
          picture: filepath,
          hashedPassword,
          provider: "credentials",
        })
        .returning();
      return {
        email: createdUser.email,
        name: createdUser.username,
        id: createdUser.id,
        picture: createdUser.picture,
      };
    }

    // Sign in
    if (existedUser.provider !== "credentials") {
      console.log(`The email has registered with ${existedUser.provider}.`);
      return null;
    }
    if (!existedUser.hashedPassword) {
      console.log("The email has registered with social account.");
      return null;
    }

    const isValid = await bcrypt.compare(password, existedUser.hashedPassword);
    if (!isValid) {
      console.log("Wrong password. Try again.");
      return null;
    }
    return {
      email: existedUser.email,
      name: existedUser.username,
      id: existedUser.id,
      picture: existedUser.picture,
    };
  },
});
