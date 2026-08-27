import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Request, Response, NextFunction } from 'express';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  const port = parseInt(process.env.PORT || '3001', 10);

  app.use((_req, res, next) => {
    res.setHeader('Permissions-Policy', 'unload=(self)');
    next();
  });

  // Serve static files from dist/client
  app.use(
    '/assets',
    express.static(path.resolve(__dirname, 'dist/client/assets'), {
      maxAge: '1y',
      immutable: true,
    })
  );

  app.use(
    express.static(path.resolve(__dirname, 'dist/client'), {
      index: false,
      maxAge: '1d',
    })
  );

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
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
      const { html: appHtml, dehydratedState, mode } = await render(url, req.headers.cookie);

      // Inject the app HTML into the template
      let html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // Inject dehydrated state for React Query and MUI mode
      const stateScript = `<script>
        window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};
        window.__MUI_MODE__ = ${JSON.stringify(mode)};
      </script>`;

      html = html.replace('</head>', `${stateScript}</head>`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      console.error('SSR Error:', e.message);
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
    console.log(`Dashboard SSR Server running at http://0.0.0.0:${port}`);
  });
}

createServer();
