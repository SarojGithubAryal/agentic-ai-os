import { z } from "zod";

export const createMemorySchema = z.object({
  content: z.string().min(1),
  namespace: z.string().optional(),
  userId: z.string().uuid().optional(),
  applicationId: z.string().uuid().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const searchMemorySchema = z.object({
  query: z.string().optional(),
  namespace: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).default(10),
});