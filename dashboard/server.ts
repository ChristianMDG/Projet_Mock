import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  app.use((_req, res, next) => {
    res.setHeader('Permissions-Policy', 'unload=(self)');
    next();
  });

  let vite: ViteDevServer;

  // Create Vite server in middleware mode
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // Vite middleware
  app.use(vite.middlewares);

  // SSR handler for all routes
  app.use('*', async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    try {
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);

      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

      const { html: appHtml, dehydratedState, mode } = await render(url, req.headers.cookie);

      let html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // Inject dehydrated state for React Query and MUI mode
      const stateScript = `<script>
        window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};
        window.__MUI_MODE__ = ${JSON.stringify(mode)};
      </script>`;

      html = html.replace('</head>', `${stateScript}</head>`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(3001, () => {
    console.log('Dashboard SSR Server running at http://localhost:3001');
  });
}

createServer().then((_) => {});
