import { ROUTES } from '@/constants/routes';
import { getKoperatives } from '@/api/koperative.api';
import { getGares } from '@/api/gare.api';
import { getDynamicPages, DynamicPageItem } from '@/api/dynamic-page.api';

import { SEO_LANGUAGES } from '@/constants/seo.keywords';

function getBaseUrl(): string {
  const env: Record<string, string | undefined> =
    (typeof import.meta !== 'undefined' && (import.meta as { env: Record<string, string | undefined> }).env) ||
    (typeof process !== 'undefined' && process.env) ||
    {};
  const domain = env.VITE_DOMAIN_MAIN ?? env.DOMAIN_MAIN;

  if (domain) {
    const normalized = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${normalized}`;
  }
  return 'https://taxibrousse.mg';
}

export function generateRobotsTxt(): string {
  const baseUrl = getBaseUrl();
  const host = baseUrl.replace(/^https?:\/\//, '');

  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /kaontiko
Disallow: /fr/mon-compte
Disallow: /en/my-account

Host: ${host}
Sitemap: ${baseUrl}/sitemap.xml
`;
}

function buildUrlEntry({
  baseUrl,
  loc,
  alternates,
  priority,
  changefreq,
}: {
  loc: string;
  baseUrl: string;
  alternates: Array<{ lang: string; loc: string }>;
  priority: string;
  changefreq: string;
}): string {
  const alternateLinks = alternates
    .map(alt => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${baseUrl}${alt.loc}" />`)
    .join('\n');

  return `  <url>
    <loc>${baseUrl}${loc}</loc>
${alternateLinks}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export async function generateSitemapXml(): Promise<string> {
  const baseUrl = getBaseUrl();

  const staticRoutes = [
    { key: 'home', priority: '1.0', changefreq: 'daily' },
    { key: 'aboutUs', priority: '0.8', changefreq: 'monthly' },
    { key: 'services', priority: '0.8', changefreq: 'monthly' },
    { key: 'destinations', priority: '0.8', changefreq: 'weekly' },
    { key: 'bookingRates', priority: '0.7', changefreq: 'monthly' },
    { key: 'safetyInsurance', priority: '0.6', changefreq: 'monthly' },
    { key: 'legalInformation', priority: '0.5', changefreq: 'yearly' },
    { key: 'promotions', priority: '0.7', changefreq: 'weekly' },
    { key: 'pageInformations', priority: '0.6', changefreq: 'weekly' },
    { key: 'koperativesList', priority: '0.9', changefreq: 'daily' },
    { key: 'garesList', priority: '0.9', changefreq: 'daily' },
    { key: 'searchResults', priority: '0.8', changefreq: 'daily' },
  ];

  const urlEntries = staticRoutes.flatMap(({ key, priority, changefreq }) => {
    const route = ROUTES[key];
    if (route) {
      const alternates = SEO_LANGUAGES.map(lang => ({ lang, loc: route[lang] })).filter(
        (alt): alt is { lang: (typeof SEO_LANGUAGES)[number]; loc: string } => Boolean(alt.loc),
      );

      const allAlternates = [...alternates, { lang: 'x-default', loc: route.mg }].filter(alt => Boolean(alt.loc));
      return alternates.map(({ loc }) =>
        buildUrlEntry({ baseUrl, loc, alternates: allAlternates, priority, changefreq }),
      );
    }
    return [];
  });

  try {
    const [koperatives, gares, dynamicPagesMg, dynamicPagesFr, dynamicPagesEn] = await Promise.all([
      getKoperatives().catch(() => []),
      getGares().catch(() => []),
      getDynamicPages('mg').catch(() => ({ data: [] })),
      getDynamicPages('fr').catch(() => ({ data: [] })),
      getDynamicPages('en').catch(() => ({ data: [] })),
    ]);

    // Dynamic Koperatives
    if (Array.isArray(koperatives)) {
      koperatives.forEach(kop => {
        if (kop.id) {
          const route = ROUTES.koperativeDetail;
          const alternates = SEO_LANGUAGES.map(lang => ({ lang, loc: route[lang].replace(':id', kop.id!.toString()) }));
          const allAlternates = [
            ...alternates,
            { lang: 'x-default', loc: route.mg.replace(':id', kop.id!.toString()) },
          ];
          alternates.forEach(({ loc }) => {
            urlEntries.push(
              buildUrlEntry({ baseUrl, loc, alternates: allAlternates, priority: '0.8', changefreq: 'weekly' }),
            );
          });
        }
      });
    }

    // Dynamic Gares
    if (Array.isArray(gares)) {
      gares.forEach(gare => {
        if (gare.id) {
          const route = ROUTES.gareDetail;
          const alternates = SEO_LANGUAGES.map(lang => ({
            lang,
            loc: route[lang].replace(':id', gare.id!.toString()),
          }));
          const allAlternates = [
            ...alternates,
            { lang: 'x-default', loc: route.mg.replace(':id', gare.id!.toString()) },
          ];
          alternates.forEach(({ loc }) => {
            urlEntries.push(
              buildUrlEntry({ baseUrl, loc, alternates: allAlternates, priority: '0.8', changefreq: 'weekly' }),
            );
          });
        }
      });
    }

    // Dynamic Pages
    const pagesBySlug = new Map<string, { mg?: string; fr?: string; en?: string }>();
    const processPages = (pages: DynamicPageItem[], lang: 'mg' | 'fr' | 'en') => {
      pages.forEach(page => {
        const locales = pagesBySlug.get(page.slug) ?? {};
        locales[lang] = ROUTES.dynamicPage[lang].replace(':slug', page.slug);
        pagesBySlug.set(page.slug, locales);
      });
    };

    if (dynamicPagesMg?.data) processPages(dynamicPagesMg.data, 'mg');
    if (dynamicPagesFr?.data) processPages(dynamicPagesFr.data, 'fr');
    if (dynamicPagesEn?.data) processPages(dynamicPagesEn.data, 'en');

    pagesBySlug.forEach(locales => {
      const alternates = SEO_LANGUAGES.map(lang => ({ lang, loc: locales[lang] })).filter(
        (alt): alt is { lang: (typeof SEO_LANGUAGES)[number]; loc: string } => Boolean(alt.loc),
      );
      if (alternates.length > 0) {
        const mgLoc = locales.mg ?? alternates[0].loc;
        const allAlternates = [...alternates, { lang: 'x-default', loc: mgLoc }];
        alternates.forEach(({ loc }) => {
          urlEntries.push(
            buildUrlEntry({ baseUrl, loc, alternates: allAlternates, priority: '0.7', changefreq: 'weekly' }),
          );
        });
      }
    });
  } catch (error) {
    console.error('Error generating dynamic sitemap routes', error);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${urlEntries.join('\n')}
    </urlset>`;
}
