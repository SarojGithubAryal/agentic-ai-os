import { db } from "./client.js";
import { sql } from "drizzle-orm";

export const setupDatabase = async () => {
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector`);
};