import { z } from 'zod';

import 'dotenv/config';

const envSchema = z.object({
  PORT: z.literal('5173'),
  PUBLIC_APP_URL: z.string().url(),
  GEMINI_API_KEY: z.string(),
  RAPIDAPI_KEY: z.string(),
  RAPIDAPI_KEY_2: z.string().optional(),
  RAPIDAPI_KEY_3: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
