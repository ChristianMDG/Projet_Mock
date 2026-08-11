import { ROUTES } from '@/constants/routes';

const LANGUAGES = ['mg', 'fr', 'en'] as const;

function getBaseUrl(): string {
  const env: any =
    (typeof import.meta !== 'undefined' && (import.meta as any).env) ||
    (typeof process !== 'undefined' && process.env) ||
    {};
  const domain = env.VITE_DOMAIN_MAIN || env.DOMAIN_MAIN;

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

export function generateSitemapXml(): string {
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
      const alternates = LANGUAGES.map(lang => ({ lang, loc: route[lang] })).filter(
        (alt): alt is { lang: (typeof LANGUAGES)[number]; loc: string } => Boolean(alt.loc),
      );

      const allAlternates = [...alternates, { lang: 'x-default', loc: route.mg }].filter(alt => Boolean(alt.loc));
      return alternates.map(({ loc }) =>
        buildUrlEntry({ baseUrl, loc, alternates: allAlternates, priority, changefreq }),
      );
    }
    return [];
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${urlEntries.join('\n')}
    </urlset>`;
}
