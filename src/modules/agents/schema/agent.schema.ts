import { z } from "zod";

export const runAgentSchema = z.object({
  goal: z.string().min(1),
  context: z.record(z.unknown()).optional(),
});