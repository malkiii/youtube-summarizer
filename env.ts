import { z } from 'zod';

import 'dotenv/config';

const envSchema = z.object({
  PUBLIC_APP_URL: z.string().url(),
  WEB_SCRAPING_API_KEY: z.string(),
  GEMINI_API_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.literal('5173'),
});

export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
