import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Request, Response, NextFunction } from 'express';
import { generateRobotsTxt, generateSitemapXml } from './src/utils/seo';
import dayjs from './src/utils/dayjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  app.disable('x-powered-by');
  const port = Number.parseInt(process.env.PORT ?? '3000', 10);

  app.use((_req, res, next) => {
    res.setHeader('Permissions-Policy', 'unload=(self)');
    next();
  });

  // SEO routes
  app.get('/robots.txt', (_req: Request, res: Response) => {
    res.set('Content-Type', 'text/plain').send(generateRobotsTxt());
  });

  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    res.set('Content-Type', 'application/xml; charset=utf-8').send(generateSitemapXml());
  });

  // Serve static files from dist/client
  app.use(
    '/assets',
    express.static(path.resolve(__dirname, 'dist/client/assets'), {
      maxAge: '1y',
      immutable: true,
    }),
  );

  app.use(
    express.static(path.resolve(__dirname, 'dist/client'), {
      index: false,
      maxAge: '1d',
    }),
  );

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy', timestamp: dayjs().toISOString() });
  });

  // SSR handler
  app.use('*', async (req: Request, res: Response, _next: NextFunction) => {
    const url = req.originalUrl;

    try {
      // Read the template
      const template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');

      // Import the server entry (dynamic import for production build)
      const entryServerPath = path.resolve(__dirname, 'dist/server/entry-server.js');
      const { render } = await import(/* @vite-ignore */ entryServerPath);

      // Render the app
      const { html: appHtml, dehydratedState, language, helmet } = await render(url, req.headers.cookie);

      // Inject the app HTML into the template
      let html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // Set the html lang attribute
      html = html.replace(/<html lang="[^"]*"/, `<html lang="${language}"`);

      // Inject dehydrated state for React Query
      // Extract mode from cookies just for the script injection
      const cookies = req.headers.cookie ?? '';
      const mode = /mui-mode=(light|dark)/.exec(cookies)?.[1] ?? 'light';

      const stateScript = `<script>
        window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};
        window.__SSR_LANGUAGE__ = ${JSON.stringify(language)};
        window.__MUI_MODE__ = ${JSON.stringify(mode)};
      </script>`;

      // Replace the existing title with the helmet title
      html = html.replace(/<title>.*<\/title>/, helmet.title.toString());

      const helmetHead = `
        ${helmet.priority.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      `;

      html = html.replace('</head>', `${helmetHead}${stateScript}</head>`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: unknown) {
      console.error('SSR Error:', e);
      // Fallback to client-side rendering
      try {
        const template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (fallbackError) {
        console.error('Fallback Error:', fallbackError);
        res.status(500).send('Internal Server Error');
      }
    }
  });

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server Error:', err.message);
    res.status(500).send('Internal Server Error');
  });

  app.listen(port, '0.0.0.0', () => {
    console.warn(`SSR Server running at http://0.0.0.0:${port}`);
  });
}

await createServer();
