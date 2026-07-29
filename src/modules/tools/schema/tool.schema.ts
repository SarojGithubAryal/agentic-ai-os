import { z } from "zod";

export const executeToolSchema = z.object({
  input: z.record(z.unknown()).default({}),
});