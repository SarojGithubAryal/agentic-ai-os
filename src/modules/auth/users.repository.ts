import { eq } from "drizzle-orm";
import { db } from "../../database/client.js";
import { users } from "../../database/schema.js";

export const findUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
};

export const createUser = async (data: { email: string; passwordHash: string; name?: string }) => {
  const [newUser] = await db.insert(users).values(data).returning();
  return newUser;
};