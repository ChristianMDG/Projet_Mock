import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import { createQueryClient } from './utils/queryClient';
import { getVilles } from './api/ville.api';
import { getKoperatives } from './api/koperative.api';
import { getGares } from './api/gare.api';
import { getDynamicPageBySlug, getDynamicPages } from './api/dynamic-page.api';
import { getHeroContent, getGareBanner, getKoperativeBanner, getPromotionBanner } from './api/cms.api';
import { dehydrate } from '@tanstack/react-query';
import { setupAxiosAuthInterceptor } from './api/interceptor.api';
import { DEFAULT_LANGUAGE, ROUTES, syncLanguageFromPath } from './constants/routes';
import i18n from './utils/i18n';

// Dynamic page path patterns per language
const DYNAMIC_PAGE_PATHS: Record<string, string> = {
  mg: 'pejy',
  fr: 'page',
  en: 'page',
};

/**
 * Check if URL matches the pageInformations route (list of dynamic pages)
 */
function isPageInformationsRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  return Object.values(ROUTES.pageInformations).some(route => pathname.startsWith(route));
}

/**
 * Check if URL matches gares/stations routes
 */
function isGareRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  return Object.values(ROUTES.garesList).some(route => pathname.startsWith(route));
}

/**
 * Check if URL matches koperatives/cooperatives routes
 */
function isKoperativeRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  return Object.values(ROUTES.koperativesList).some(route => pathname.startsWith(route));
}

/**
 * Check if URL matches account detail route
 */
function isAccountRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  return Object.values(ROUTES.accountDetail).some(route => pathname.startsWith(route));
}

/**
 * Check if URL matches home route
 */
function isHomeRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  return Object.values(ROUTES.home).some(route => pathname === route || pathname === route + '/');
}

/**
 * Extract dynamic page slug from URL
 * mg (default): /pejy/{slug} | fr/en: /{lang}/page/{slug}
 */
function getDynamicPageSlug(url: string, language: string): string | null {
  const pagePath = DYNAMIC_PAGE_PATHS[language];
  const pattern =
    language === DEFAULT_LANGUAGE
      ? new RegExp(`^/${pagePath}/([^/]+)`)
      : new RegExp(`^/${language}/${pagePath}/([^/]+)`);
  return url.match(pattern)?.[1] ?? null;
}

export async function render(url: string, cookieHeader?: string) {
  setupAxiosAuthInterceptor();
  const queryClient = createQueryClient();

  // Extract mode from cookies
  const mode = (cookieHeader?.match(/mui-mode=(light|dark)/)?.[1] || 'light') as 'light' | 'dark';

  // Sync i18n language from URL and get the resolved language
  const language = await syncLanguageFromPath(url, i18n);

  // Set i18n language for SSR to match client hydration
  if (i18n.language !== language) {
    await i18n.changeLanguage(language);
  }

  const dynamicPageSlug = getDynamicPageSlug(url, language);

  // Base queries to prefetch
  const queries: Promise<unknown>[] = [
    queryClient.fetchQuery({
      queryKey: ['villes'],
      queryFn: getVilles,
    }),
    queryClient.fetchQuery({
      queryKey: ['koperatives', undefined],
      queryFn: () => getKoperatives(undefined),
    }),
    queryClient.fetchQuery({
      queryKey: ['gares', undefined],
      queryFn: () => getGares(undefined),
    }),
    queryClient.fetchQuery({
      queryKey: ['cms', 'dynamic-page', 'page-template', language],
      queryFn: () => getDynamicPageBySlug('page-template', language),
    }),
  ];

  // Prefetch the specific dynamic page if slug is present
  if (dynamicPageSlug) {
    queries.push(
      queryClient.fetchQuery({
        queryKey: ['cms', 'dynamic-page', dynamicPageSlug, language],
        queryFn: () => getDynamicPageBySlug(dynamicPageSlug, language),
      }),
    );
  }

  // Prefetch list of dynamic pages for pageInformations route
  if (isPageInformationsRoute(url)) {
    queries.push(
      queryClient.fetchQuery({
        queryKey: ['cms', 'dynamic-pages', language],
        queryFn: () => getDynamicPages(language),
      }),
    );
  }

  // Prefetch banners based on route
  if (isGareRoute(url)) {
    queries.push(
      queryClient.fetchQuery({
        queryKey: ['gare-banner', language],
        queryFn: () => getGareBanner(language),
      }),
    );
  }

  if (isKoperativeRoute(url)) {
    queries.push(
      queryClient.fetchQuery({
        queryKey: ['koperative-banner', language],
        queryFn: () => getKoperativeBanner(language),
      }),
    );
  }

  if (isAccountRoute(url)) {
    queries.push(
      queryClient.fetchQuery({
        queryKey: ['promotion-banner', language],
        queryFn: () => getPromotionBanner(language),
      }),
    );
  }

  if (isHomeRoute(url)) {
    queries.push(
      queryClient.fetchQuery({
        queryKey: ['hero-content', language],
        queryFn: () => getHeroContent(language),
      }),
    );
  }

  // Fetch all essential data in parallel
  try {
    await Promise.allSettled(queries);
  } catch (e) {
    console.error('SSR data fetching error:', e);
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
