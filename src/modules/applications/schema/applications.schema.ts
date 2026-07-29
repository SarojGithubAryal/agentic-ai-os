import { z } from "zod";

export const createApplicationSchema = z.object({
  name: z.string().min(1).max(255),
});

export const updateApplicationSchema = z.object({
  name: z.string().min(1).max(255),
});

export const listApplicationsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});