import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import { languages as langs } from './src/lib/i18n/languages';
import { z } from 'zod';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  const env = envVariables.parse(process.env);
  const languages = langs.map(lang => lang.code);

  return {
    plugins: [
      react(),
      Sitemap({
        hostname: env.PUBLIC_APP_URL,
        i18n: { languages, strategy: 'prefix' },
        outDir: 'dist/client',
        exclude: ['/client'],
        dynamicRoutes: ['/'],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});

export const envVariables = z.object({
  PUBLIC_APP_URL: z.string().url(),
  GEMINI_API_KEY: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type EnvVariables = z.infer<typeof envVariables>;
