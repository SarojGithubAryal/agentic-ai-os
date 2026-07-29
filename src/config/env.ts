import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z
    .string()
    .url()
    .refine((url) => url.startsWith("postgresql://") || url.startsWith("postgres://"), {
      message: "DATABASE_URL must be a valid PostgreSQL connection string",
    }),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error", "fatal"]).default("info"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
  // OpenRouter (optional)
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().default("ling-3.0-flash"),
  OPENROUTER_BASE_URL: z.string().url().default("https://openrouter.ai/api/v1"),
});

export type EnvConfig = z.infer<typeof envSchema>;

let env: EnvConfig;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error(
    "❌ Invalid environment configuration. Please check your .env file.",
    (error as z.ZodError).format()
  );
  process.exit(1);
}

export const config = {
  ...env,
  isDev: env.NODE_ENV === "development",
  isProd: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
} as const;