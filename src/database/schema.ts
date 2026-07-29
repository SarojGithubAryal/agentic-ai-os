import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
  text,
  jsonb,
} from "drizzle-orm/pg-core";

// Users
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  })
);

// Applications
export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    apiKey: varchar("api_key", { length: 255 }).notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    apiKeyIdx: uniqueIndex("applications_api_key_idx").on(table.apiKey),
  })
);

// Memories
export const memories = pgTable("memories", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "cascade" }),
  namespace: varchar("namespace", { length: 255 }).default("default").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").default({}),
  embedding: text("embedding"), // placeholder for pgvector(vector) – will be altered later
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});