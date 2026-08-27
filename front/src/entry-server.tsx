import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import { createSSRQueryClient } from './utils/queryClient';
import { getVilles, getTopVilles } from './api/ville.api';
import { getKoperatives } from './api/koperative.api';
import { getRoutesByDepartureVilleId } from './api/route.api';
import dayjs from './utils/dayjs';

import { getDynamicPageBySlug, getDynamicPages, getSectionByComponent } from './api/dynamic-page.api';
import {
  getHeroContent,
  getGareBanner,
  getKoperativeBanner,
  getShopBanner,
  getPromotionBanner,
  getProducts,
} from './api/cms.api';
import { dehydrate } from '@tanstack/react-query';
import { setupAxiosAuthInterceptor } from './api/interceptor.api';
import { DEFAULT_LANGUAGE, ROUTES, syncLanguageFromPath } from './constants/routes';
import {
  HOME_PAGE_ESSENTIAL_SECTIONS,
  KOPERATIVE_PAGE_SECTIONS,
  GARE_PAGE_SECTIONS,
  ACCOUNT_PAGE_SECTIONS,
  RESERVATION_PAGE_SECTIONS,
  PAYMENT_PAGE_SECTIONS,
  OPERATOR_PAGE_SECTIONS,
} from './constants/section.types';
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
  const routes = Object.values(ROUTES.pageInformations);
  return routes.some(route => {
    const base = route.split(':')[0].replace(/\/$/, '');
    return pathname === base || pathname.startsWith(base + '/');
  });
}

/**
 * Check if URL matches gares/stations routes
 */
function isGareRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  const routes = [
    ...Object.values(ROUTES.garesList),
    ...Object.values(ROUTES.gareDetail),
    ...Object.values(ROUTES.gareCreate),
    ...Object.values(ROUTES.gareEdit),
  ];
  return routes.some(route => {
    const base = route.split(':')[0].replace(/\/$/, '');
    return pathname === base || pathname.startsWith(base + '/');
  });
}

/**
 * Check if URL matches koperatives/cooperatives routes
 */
function isKoperativeRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  const routes = [
    ...Object.values(ROUTES.koperativesList),
    ...Object.values(ROUTES.koperativeDetail),
    ...Object.values(ROUTES.koperativeCreate),
    ...Object.values(ROUTES.koperativeEdit),
    ...Object.values(ROUTES.koperativeVoyageScheduler),
    ...Object.values(ROUTES.cooperativeInfo),
  ];
  return routes.some(route => {
    const base = route.split(':')[0].replace(/\/$/, '');
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}

/**
 * Check if URL matches shop routes
 */
function isShopRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  const shopRoutes = [
    ...Object.values(ROUTES.shop),
    ...Object.values(ROUTES.shopProduct),
    ...Object.values(ROUTES.shopCheckout),
  ];
  return shopRoutes.some(route => {
    const base = route.split(':')[0].replace(/\/$/, '');
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}

/**
 * Check if URL matches account detail route
 */
function isAccountRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  const routes = Object.values(ROUTES.accountDetail);
  return routes.some(route => {
    const base = route.split(':')[0].replace(/\/$/, '');
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}

/**
 * Check if URL matches home route
 */
function isHomeRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  return Object.values(ROUTES.home).some(route => {
    return pathname === route || pathname === `${route}/`;
  });
}

/**
 * Check if URL matches reservation routes
 */
function isReservationRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  const routes = [
    ...Object.values(ROUTES.reservationsList),
    ...Object.values(ROUTES.reservationsByVoyage),
    ...Object.values(ROUTES.reservationConfirmation),
  ];
  return routes.some(route => {
    const base = route.split(':')[0].replace(/\/$/, '');
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}

/**
 * Check if URL matches payment routes
 */
function isPaymentRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  const routes = [
    ...Object.values(ROUTES.payment),
    ...Object.values(ROUTES.paymentVoyage),
    ...Object.values(ROUTES.paymentSuccess),
  ];
  return routes.some(route => {
    const base = route.split(':')[0].replace(/\/$/, '');
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}

/**
 * Check if URL matches operator routes
 */
function isOperatorRoute(url: string): boolean {
  const pathname = url.toLowerCase();
  const routes = [...Object.values(ROUTES.operators), ...Object.values(ROUTES.operatorBooking)];
  return routes.some(route => {
    const base = route.split(':')[0].replace(/\/$/, '');
    return pathname === base || pathname.startsWith(`${base}/`);
  });
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
  return pattern.exec(url)?.[1] ?? null;
}

export async function render(url: string, cookieHeader?: string) {
  setupAxiosAuthInterceptor();
  const queryClient = createSSRQueryClient();

  // Extract mode from cookies
  const mode = (/mui-mode=(light|dark)/.exec(cookieHeader ?? '')?.[1] ?? 'light') as 'light' | 'dark';

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
      queryFn: () => getKoperatives(),
    }),

    queryClient.fetchQuery({
      queryKey: ['cms', 'section', 'page.payment-section', 'page-template', language],
      queryFn: () => getSectionByComponent('page.payment-section', language, 'page-template'),
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
      ...GARE_PAGE_SECTIONS.map(sectionType =>
        queryClient.fetchQuery({
          queryKey: ['cms', 'section', sectionType, 'page-template', language],
          queryFn: () => getSectionByComponent(sectionType, language, 'page-template'),
        }),
      ),
    );
  }

  if (isKoperativeRoute(url)) {
    queries.push(
      queryClient.fetchQuery({
        queryKey: ['koperative-banner', language],
        queryFn: () => getKoperativeBanner(language),
      }),
      queryClient.fetchQuery({
        queryKey: ['topKoperatives', { ville: [], name: '' }],
        queryFn: () => getKoperatives({ top: 4 }),
      }),
      ...KOPERATIVE_PAGE_SECTIONS.map(sectionType =>
        queryClient.fetchQuery({
          queryKey: ['cms', 'section', sectionType, 'page-template', language],
          queryFn: () => getSectionByComponent(sectionType, language, 'page-template'),
        }),
      ),
    );
  }

  if (isShopRoute(url)) {
    queries.push(
      queryClient.fetchQuery({
        queryKey: ['shop-banner', language],
        queryFn: () => getShopBanner(language),
      }),
      queryClient.fetchQuery({
        queryKey: ['products', language],
        queryFn: () => getProducts(language),
      }),
    );
  }

  if (isAccountRoute(url)) {
    queries.push(
      queryClient.fetchQuery({
        queryKey: ['promotion-banner', language],
        queryFn: () => getPromotionBanner(language),
      }),
      ...ACCOUNT_PAGE_SECTIONS.map(sectionType =>
        queryClient.fetchQuery({
          queryKey: ['cms', 'section', sectionType, 'page-template', language],
          queryFn: () => getSectionByComponent(sectionType, language, 'page-template'),
        }),
      ),
    );
  }

  if (isHomeRoute(url)) {
    // Fetch top villes first to get the activeVilleId
    const topVilles = await queryClient.fetchQuery({
      queryKey: ['villes', 'top'],
      queryFn: getTopVilles,
    });

    if (topVilles && topVilles.length > 0) {
      const activeVilleId = topVilles[0].id;
      if (activeVilleId) {
        const date = dayjs().add(1, 'day').startOf('day').tz('Indian/Antananarivo', true).format('YYYY-MM-DD');
        queries.push(
          queryClient.fetchQuery({
            queryKey: ['routes', 'byDepartureVille', activeVilleId, date],
            queryFn: () => getRoutesByDepartureVilleId(activeVilleId, date),
          }),
        );
      }
    }

    queries.push(
      queryClient.fetchQuery({
        queryKey: ['hero-content', language],
        queryFn: () => getHeroContent(language),
      }),
      ...HOME_PAGE_ESSENTIAL_SECTIONS.map(sectionType =>
        queryClient.fetchQuery({
          queryKey: ['cms', 'section', sectionType, 'page-template', language],
          queryFn: () => getSectionByComponent(sectionType, language, 'page-template'),
        }),
      ),
    );
  }

  if (isReservationRoute(url)) {
    queries.push(
      ...RESERVATION_PAGE_SECTIONS.map(sectionType =>
        queryClient.fetchQuery({
          queryKey: ['cms', 'section', sectionType, 'page-template', language],
          queryFn: () => getSectionByComponent(sectionType, language, 'page-template'),
        }),
      ),
    );
  }

  if (isPaymentRoute(url)) {
    queries.push(
      ...PAYMENT_PAGE_SECTIONS.map(sectionType =>
        queryClient.fetchQuery({
          queryKey: ['cms', 'section', sectionType, 'page-template', language],
          queryFn: () => getSectionByComponent(sectionType, language, 'page-template'),
        }),
      ),
    );
  }

  if (isOperatorRoute(url)) {
    queries.push(
      ...OPERATOR_PAGE_SECTIONS.map(sectionType =>
        queryClient.fetchQuery({
          queryKey: ['cms', 'section', sectionType, 'page-template', language],
          queryFn: () => getSectionByComponent(sectionType, language, 'page-template'),
        }),
      ),
    );
  }

  // Fetch all essential data in parallel
  const results = await Promise.allSettled(queries);
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`[SSR] query #${i} failed:`, result.reason);
    }
  });

  const helmetContext = {};

  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <HelmetProvider context={helmetContext}>
          <QueryProvider client={queryClient} ssr>
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
