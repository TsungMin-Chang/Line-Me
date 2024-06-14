import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit"

dotenv.config({ path: "./.env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
