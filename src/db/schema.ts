import {
  index,
  pgTable,
  uuid,
  varchar,
  unique,
} from "drizzle-orm/pg-core";

// Checkout the many-to-many relationship in the following tutorial:
// https://orm.drizzle.team/docs/rqb#many-to-many

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull().unique(),
    username: varchar("username", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    picture: varchar("picture", { length: 100 }).notNull(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "google", "credentials"],
    })
      .notNull()
      .default("credentials"),
  },
  (table) => ({
    emailAndProviderIndex: index("email_and_provider_index").on(
      table.email,
      table.provider,
    ),
    uniqCombination: unique().on(table.email, table.provider),
  }),
);
