import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api/v1'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment configuration')
}

export const env = parsed.data