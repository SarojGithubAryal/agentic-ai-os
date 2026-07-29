import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z.string().min(1),
  provider: z.string().optional(),
  model: z.string().optional(),
  maxTokens: z.number().int().positive().optional(),
  temperature: z.number().min(0).max(2).optional(),
});