import { z } from "zod";

export const manifestFileSchema = z.object({
  name: z.string().min(1).max(255),
  hash: z.string().length(64), // SHA-256 hex
});

export const syncManifestSchema = z.object({
  files: z.array(manifestFileSchema),
});