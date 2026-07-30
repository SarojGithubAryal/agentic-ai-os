import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
  text,
  jsonb,
  integer,
  customType,
} from "drizzle-orm/pg-core";

// Custom vector type (maps to pgvector 'vector')
const vector = customType<{
  data: number[];
  driverData: string;
}>({
  dataType() {
    return 'vector';
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: unknown): number[] {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    if (Array.isArray(value)) {
      return value;
    }
    return [];
  },
});

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
  embedding: text("embedding"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Knowledge: documents
export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 127 }).notNull(),
  size: integer("size").notNull(),
  status: varchar("status", { length: 50 }).default("processing").notNull(),
  chunkCount: integer("chunk_count").default(0),
  // New columns for sync
  applicationId: uuid("application_id").references(() => applications.id, { onDelete: "set null" }),
  contentHash: varchar("content_hash", { length: 64 }), // SHA-256 hex
  source: varchar("source", { length: 50 }).default("manual").notNull(), // 'manual' or 'sync'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Knowledge: chunks (with vector embedding)
export const documentChunks = pgTable("document_chunks", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id")
    .references(() => documents.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1536 }),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});