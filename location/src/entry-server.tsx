import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import { createQueryClient } from './utils/queryClient';
import { dehydrate } from '@tanstack/react-query';
import { setupAxiosAuthInterceptor } from './api/interceptor.api';
import { syncLanguageFromPath } from './constants/routes';
import i18n from './utils/i18n';

export async function render(url: string, cookieHeader?: string) {
  setupAxiosAuthInterceptor();
  const queryClient = createQueryClient();

  // Extract mode from cookies
  const mode = (/mui-mode=(light|dark)/.exec(cookieHeader ?? '')?.[1] ?? 'light') as 'light' | 'dark';

  // Sync i18n language from URL and get the resolved language
  const language = await syncLanguageFromPath(url, i18n);

  // Set i18n language for SSR to match client hydration
  if (i18n.language !== language) {
    await i18n.changeLanguage(language);
  }

  const helmetContext = {};

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <HelmetProvider context={helmetContext}>
          <QueryProvider client={queryClient}>
            <App initialMode={mode} />
          </QueryProvider>
        </HelmetProvider>
      </StaticRouter>
    </StrictMode>,
  );

  const dehydratedState = dehydrate(queryClient);
  // @ts-ignore - helmetContext is populated by HelmetProvider
  const { helmet } = helmetContext;

  return { html, dehydratedState, language, helmet, url };
}
