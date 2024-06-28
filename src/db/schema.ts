import { sql, relations } from "drizzle-orm";
import {
  index,
  timestamp,
  pgTable,
  uuid,
  varchar,
  boolean,
  unique,
} from "drizzle-orm/pg-core";

// Users Table Definition
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().notNull().unique().primaryKey(),
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

// Users Relations Definition
export const usersRelations = relations(usersTable, ({ many }) => ({
  usersToChatroomsTable: many(usersToChatroomsTable),
  chatsTable: many(chatsTable),
}));

// Chatrooms Table Definition
export const chatroomsTable = pgTable("chatrooms", {
  id: uuid("id").defaultRandom().notNull().unique().primaryKey(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  type: boolean("type").notNull(),
  title: varchar("title", { length: 100 }),
  picture: varchar("picture", { length: 100 }),
});

// Chatrooms Relations Definition
export const chatroomsRelations = relations(chatroomsTable, ({ many }) => ({
  usersToChatroomsTable: many(usersToChatroomsTable),
  chatsTable: many(chatsTable),
}));

// Users to Chatrooms Table Definition
export const usersToChatroomsTable = pgTable(
  "users_to_chatrooms",
  {
    id: uuid("id").defaultRandom().notNull().unique().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    chatroomId: uuid("chatroom_id")
      .notNull()
      .references(() => chatroomsTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    userAndChatroomIniex: index("user_and_chatroom_index").on(
      table.userId,
      table.chatroomId,
    ),
    uniqCombination: unique().on(table.chatroomId, table.userId),
  }),
);

// Users to Chatrooms Relations Definition
export const usersToChatroomsRelations = relations(
  usersToChatroomsTable,
  ({ one }) => ({
    chatroom: one(chatroomsTable, {
      fields: [usersToChatroomsTable.chatroomId],
      references: [chatroomsTable.id],
    }),
    user: one(usersTable, {
      fields: [usersToChatroomsTable.userId],
      references: [usersTable.id],
    }),
  }),
);

// Chats Table Definition
export const chatsTable = pgTable(
  "chats",
  {
    id: uuid("id").defaultRandom().notNull().unique().primaryKey(),
    createdAt: timestamp("created_at")
      .default(sql`now()`)
      .notNull(),
    content: varchar("content", { length: 1000 }),
    usersToChatroomsId: uuid("users_to_chatrooms_id")
      .notNull()
      .references(() => usersToChatroomsTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    usersToChatroomsIdIndex: index("users_to_chatrooms_id_index").on(
      table.usersToChatroomsId,
    ),
  }),
);
