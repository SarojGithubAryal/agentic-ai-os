import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z.string().min(1),
  limit: z.coerce.number().int().positive().max(20).default(5),
});

export const listDocumentsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});