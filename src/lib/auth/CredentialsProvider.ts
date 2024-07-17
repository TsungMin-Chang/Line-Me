import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import type { StorageReference } from "firebase/storage";

// import { writeFile } from "fs/promises";
// import path from "path";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { storage } from "@/lib/firebaseConfig";
import { authSchema } from "@/validators/auth";

const uploadImageWithTimeout = async (
  storageRef: StorageReference,
  blob: Blob,
) => {
  const timeoutPromise = (ms: number) =>
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout after " + ms + " ms")), ms),
    );

  const uploadTask = uploadBytesResumable(storageRef, blob);
  const uploadPromise = new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        // const progressPercent = progress * 100;
        // console.log("Upload is " + progressPercent + "% done");
      },
      (error) => {
        console.log("Error uploading to Firebase: ", error);
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (error) {
          console.log("Error getting download URL from Firebase: ", error);
          reject(error);
        }
      },
    );
  });

  try {
    const downloadURL = await Promise.race([
      uploadPromise,
      timeoutPromise(10000),
    ]); // 10 seconds timeout
    return downloadURL;
  } catch (error) {
    console.log("Error occurred:", error);
    return null;
  }
};



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
      picture?: string;
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
      .where(
        and(
          eq(usersTable.email, validatedCredentials.email.toLowerCase()),
          eq(usersTable.provider, "credentials"),
        ),
      )
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

      // Convert base64 string into buffer
      const base64Pattern = /^data:image\/(\w+);base64,/;
      const matches = picture.match(base64Pattern);
      if (!matches) {
        return null;
      }
      const mimeType = `image/${matches[1]}`;
      const base64Data = picture.replace(base64Pattern, "");

      // yarn start mode - store images at google firebase, send in blob: hangs sometimes
      const buffer = Buffer.from(base64Data, "base64");
      const blob = new Blob([buffer], { type: mimeType });
      const filename = email + "_credentials";
      const storageRef = ref(storage, filename);
      const downloadURL = await uploadImageWithTimeout(storageRef, blob);
      if (downloadURL === null) {
        console.log("downloadURL is null.");
        return null;
      }

      // yarn dev mode - store images at public folder
      // const semiFilepath = "/pictures/" + filename;
      // const filepath = "/public" + semiFilepath;
      // try {
      //   await writeFile(path.join(process.cwd(), filepath), buffer);
      // } catch (error) {
      //   console.log("Error occured ", error);
      //   return null;
      // }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [createdUser] = await db
        .insert(usersTable)
        .values({
          username,
          email: email.toLowerCase(),
          picture: (downloadURL as string) ?? "",
          hashedPassword,
          provider: "credentials",
        })
        .returning();

      return {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.username,
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
      id: existedUser.id,
      email: existedUser.email,
      name: existedUser.username,
      picture: existedUser.picture,
    };
  },
});
