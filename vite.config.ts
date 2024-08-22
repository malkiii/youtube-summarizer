import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';
import { languages as langs } from './src/lib/i18n/languages';

import { env } from './env';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ isSsrBuild }) => {
  const sitemapDir = path.resolve(__dirname, 'dist/client');

  return {
    plugins: [
      react(),
      !isSsrBuild &&
        Sitemap({
          hostname: env.PUBLIC_APP_URL,
          i18n: {
            languages: langs.map(lang => lang.code),
            strategy: 'prefix',
          },
          exclude: [`/${path.basename(sitemapDir)}`],
          dynamicRoutes: ['/'],
          outDir: sitemapDir,
        }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      copyPublicDir: !isSsrBuild,
    },
  };
});
