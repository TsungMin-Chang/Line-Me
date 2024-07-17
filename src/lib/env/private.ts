import { z } from "zod";

const privateEnvSchema = z.object({
  POSTGRES_URL: z.string().url(),
  PUSHER_ID: z.string(),
  PUSHER_SECRET: z.string(),
  FIREBASE_API_KEY: z.string(),
  FIREBASE_AUTH_DOMAIN: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  FIREBASE_MESSAGING_SENDER_ID: z.string(),
  FIREBASE_APP_ID: z.string(),
});

type PrivateEnv = z.infer<typeof privateEnvSchema>;

export const privateEnv: PrivateEnv = {
  POSTGRES_URL: process.env.POSTGRES_URL!,
  PUSHER_ID: process.env.PUSHER_ID!,
  PUSHER_SECRET: process.env.PUSHER_SECRET!,
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY!,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN!,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID!,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET!,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID!,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID!,
};

privateEnvSchema.parse(privateEnv);
