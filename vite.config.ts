import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { z } from 'zod';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));

  envVariables.parse(process.env);

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});

export const envVariables = z.object({
  PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type EnvVariables = z.infer<typeof envVariables>;
