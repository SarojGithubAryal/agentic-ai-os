import { eq, like, and } from "drizzle-orm";
import { db } from "../../../database/client.js";
import { memories } from "../../../database/schema.js";

export const insertMemory = async (data: {
  content: string;
  namespace?: string;
  userId?: string;
  applicationId?: string;
  metadata?: Record<string, unknown>;
}) => {
  const [memory] = await db.insert(memories).values(data).returning();
  return memory;
};

export const findMemories = async (filters: {
  namespace?: string;
  userId?: string;
  applicationId?: string;
  query?: string;
  limit?: number;
}) => {
  const conditions = [];
  if (filters.namespace) conditions.push(eq(memories.namespace, filters.namespace));
  if (filters.userId) conditions.push(eq(memories.userId, filters.userId));
  if (filters.applicationId) conditions.push(eq(memories.applicationId, filters.applicationId));
  if (filters.query) conditions.push(like(memories.content, `%${filters.query}%`));

  const rows = await db
    .select()
    .from(memories)
    .where(and(...conditions))
    .limit(filters.limit ?? 10)
    .orderBy(memories.createdAt);
  return rows;
};

export const deleteMemory = async (id: string) => {
  await db.delete(memories).where(eq(memories.id, id));
};