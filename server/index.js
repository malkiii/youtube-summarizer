import 'dotenv/config';

import express from 'express';
import fs from 'node:fs/promises';
import { getAbsolutePath, minifyHTML } from './lib/utils.js';
import cookieParser from 'cookie-parser';
// import cors from 'cors';

import * as routers from './routers.js';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile(getAbsolutePath('./dist/client/index.html'), 'utf-8')
  : '';
const ssrManifest = isProduction
  ? await fs.readFile(getAbsolutePath('./dist/client/.vite/ssr-manifest.json'), 'utf-8')
  : undefined;

// Create http server
const app = express().use(cookieParser());

// Use all the app routers
app.get('/summerize', routers.summerizeYoutubeVideo);

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv(getAbsolutePath('./dist/client'), { extensions: [] }));
}

const languageRoute = `/:lang(${Object.keys(routers.languages).join('|')})`;

// Serve HTML
app.use(languageRoute, async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile(getAbsolutePath('./index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule(getAbsolutePath('./src/entry-server.tsx'))).render;
    } else {
      template = templateHtml;
      render = (await import(getAbsolutePath('./dist/server/entry-server.js'))).render;
    }

    const rendered = await render(url, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(minifyHTML(html));
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    res.status(500).end(e.stack);
  }
});

app.use('*', routers.locales);

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
