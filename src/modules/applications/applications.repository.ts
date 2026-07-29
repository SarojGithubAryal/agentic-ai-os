import { eq, and } from "drizzle-orm";
import { db } from "../../database/client.js";
import { applications } from "../../database/schema.js";

export const createApplication = async (data: {
  name: string;
  apiKeyHash: string;
  userId: string;
}) => {
  const [app] = await db
    .insert(applications)
    .values({
      name: data.name,
      apiKey: data.apiKeyHash,
      userId: data.userId,
    })
    .returning();
  return app;
};

export const findApplicationByApiKey = async (apiKey: string) => {
  const result = await db
    .select()
    .from(applications)
    .where(eq(applications.apiKey, apiKey))
    .limit(1);
  return result[0] || null;
};

export const findApplicationsByUserId = async (userId: string, limit = 20, offset = 0) => {
  return db
    .select({
      id: applications.id,
      name: applications.name,
      userId: applications.userId,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
    })
    .from(applications)
    .where(eq(applications.userId, userId))
    .limit(limit)
    .offset(offset);
};

export const findApplicationById = async (id: string) => {
  const result = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  return result[0] || null;
};

export const updateApplication = async (id: string, data: { name: string }) => {
  const [app] = await db
    .update(applications)
    .set({ name: data.name, updatedAt: new Date() })
    .where(eq(applications.id, id))
    .returning();
  return app;
};

export const deleteApplicationById = async (id: string) => {
  await db.delete(applications).where(eq(applications.id, id));
};