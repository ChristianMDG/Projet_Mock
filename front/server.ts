import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  let vite: ViteDevServer;

  // Create Vite server in middleware mode
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // SEO routes - defined before any middleware
  app.get('/robots.txt', async (_req: Request, res: Response) => {
    try {
      const { generateRobotsTxt } = await vite.ssrLoadModule('/src/utils/seo.ts');
      res.setHeader('Content-Type', 'text/plain');
      res.end(generateRobotsTxt());
    } catch (e) {
      console.error('Error generating robots.txt:', e);
      res.status(500).end('Error generating robots.txt');
    }
  });

  app.get('/sitemap.xml', async (_req: Request, res: Response) => {
    try {
      const { generateSitemapXml } = await vite.ssrLoadModule('/src/utils/seo.ts');
      const xml = generateSitemapXml();
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.send(xml);
    } catch (e) {
      console.error('Error generating sitemap.xml:', e);
      res.status(500).send('<?xml version="1.0"?><error>Failed to generate sitemap</error>');
    }
  });

  // Vite middleware
  app.use(vite.middlewares);

  // SSR handler for all other routes
  app.use('*', async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);

      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

      const {
        html: appHtml,
        dehydratedState,
        helmet,
        language,
        url: renderedUrl,
      } = await render(url, req.headers.cookie);

      let html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // Inject both query state and SSR metadata for hydration matching

      // Extract mode from cookies just for the script injection (render already extracts it via entry-server)
      const cookies = req.headers.cookie || '';
      const mode = cookies.match(/mui-mode=(light|dark)/)?.[1] || 'light';

      const stateScript = `<script>
        window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};
        window.__SSR_LANGUAGE__ = ${JSON.stringify(language)};
        window.__SSR_URL__ = ${JSON.stringify(renderedUrl)};
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
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(5173, () => {
    console.warn('Server started at http://localhost:5173');
  });
}

createServer().then(_ => {});
