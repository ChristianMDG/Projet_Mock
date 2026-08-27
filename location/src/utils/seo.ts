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
  return 'https://location.taxibrousse.mg';
}

export function generateRobotsTxt(): string {
  const baseUrl = getBaseUrl();
  const host = baseUrl.replace(/^https?:\/\//, '');

  return `User-agent: *
Allow: /
Disallow: /api/

Host: ${host}
Sitemap: ${baseUrl}/sitemap.xml
`;
}

export function generateSitemapXml(): string {
  const baseUrl = getBaseUrl();

  const paths = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/utilitaires', priority: '0.8', changefreq: 'weekly' },
    { loc: '/voitures', priority: '0.8', changefreq: 'weekly' },
    { loc: '/agences', priority: '0.8', changefreq: 'weekly' },
    { loc: '/guide', priority: '0.7', changefreq: 'monthly' },
    { loc: '/conditions', priority: '0.5', changefreq: 'yearly' },
    { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
    { loc: '/a-propos', priority: '0.7', changefreq: 'monthly' },
  ];

  const urlEntries = paths.map(({ loc, priority, changefreq }) => {
    return `  <url>
    <loc>${baseUrl}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;
}
