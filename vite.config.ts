import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import { languages as langs } from './src/lib/i18n/languages';

import { env } from './env';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [
    react(),
    // Sitemap({
    //   hostname: env.PUBLIC_APP_URL,
    //   i18n: {
    //     languages: langs.map(lang => lang.code),
    //     strategy: 'prefix',
    //   },
    //   exclude: ['/client'],
    //   dynamicRoutes: ['/'],
    //   outDir: path.resolve(__dirname, './dist/client'),
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
