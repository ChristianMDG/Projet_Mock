import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { buildSeoKeywordsContent, toSeoLanguage, SeoLanguage } from '@/constants';

type CanonicalQueryParams = 'none' | 'all' | string[];

interface BreadcrumbItem {
  name: string;
  path?: string;
  item?: string;
}

interface SeoJsonLd {
  '@context'?: string;
  '@type'?: string;
  [key: string]: unknown;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string | string[];
  extraKeywords?: string | Array<string | null | undefined> | null;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;

  canonicalQueryParams?: CanonicalQueryParams;
  alternates?: Partial<Record<SeoLanguage, string>>;

  breadcrumbs?: BreadcrumbItem[];
  siteSearchUrlTemplate?: string;
  jsonLd?: SeoJsonLd | SeoJsonLd[];
}

const BASE_URL = import.meta.env.VITE_DOMAIN_MAIN
  ? `https://${import.meta.env.VITE_DOMAIN_MAIN}`
  : 'https://taxibrousse.mg';

const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

const TRACKING_QUERY_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
];

function toAbsoluteUrl(value: string): string {
  if (value === '') return BASE_URL;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${BASE_URL}${value}`;
  return `${BASE_URL}/${value}`;
}

function normalizeCanonicalUrl(input: string, canonicalQueryParams: CanonicalQueryParams): string {
  const url = new URL(input);

  TRACKING_QUERY_PARAMS.forEach(key => url.searchParams.delete(key));

  if (canonicalQueryParams === 'none') {
    url.search = '';
    return url.toString();
  }

  if (canonicalQueryParams === 'all') {
    return url.toString();
  }

  const kept = new URLSearchParams();
  canonicalQueryParams.forEach(key => {
    const values = url.searchParams.getAll(key);
    values.forEach(value => kept.append(key, value));
  });

  url.search = kept.toString() ? `?${kept.toString()}` : '';
  return url.toString();
}

function buildBreadcrumbJsonLd(items: BreadcrumbItem[], currentUrl: string): SeoJsonLd | null {
  if (items.length > 0) {
    const itemListElement = items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item ?? (crumb.path ? toAbsoluteUrl(crumb.path) : currentUrl),
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };
  }

  return null;
}

function buildWebSiteSearchJsonLd(urlTemplate: string): SeoJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: `${BASE_URL}/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: toAbsoluteUrl(urlTemplate),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export default function SEO({
  title,
  description,
  keywords,
  extraKeywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
  canonicalQueryParams = 'none',
  alternates,
  breadcrumbs,
  siteSearchUrlTemplate,
  jsonLd,
}: Readonly<SEOProps>) {
  const { i18n } = useTranslation();
  const location = useLocation();

  const seoLanguage = toSeoLanguage(i18n.language);
  const siteName = 'Taxibrousse - National';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const currentUrl = normalizeCanonicalUrl(
    url ?? `${BASE_URL}${location.pathname}${location.search}`,
    canonicalQueryParams,
  );

  const absoluteImageUrl = toAbsoluteUrl(image);

  const buildKeywordsContent = (): string => {
    if (Array.isArray(keywords)) return keywords.join(', ');
    if (keywords) return keywords;
    return buildSeoKeywordsContent(seoLanguage, extraKeywords);
  };

  const keywordsContent = buildKeywordsContent();
  const locale = { mg: 'mg_MG', fr: 'fr_FR', en: 'en_US' } as const;
  const ogLocale = locale[seoLanguage as keyof typeof locale] ?? 'mg_MG';

  const getAlternateEntries = (): Array<[SeoLanguage, string]> => {
    if (!alternates) return [];
    return Object.entries(alternates) as Array<[SeoLanguage, string]>;
  };
  const alternateLinks = getAlternateEntries().filter(([, href]) => href);

  const toJsonLdArray = (value: SeoJsonLd | SeoJsonLd[] | undefined): SeoJsonLd[] => {
    if (Array.isArray(value)) return value;
    if (value) return [value];
    return [];
  };

  const hasBreadcrumbs = Boolean(breadcrumbs?.length);
  const hasSiteSearch = Boolean(siteSearchUrlTemplate);

  const breadcrumbBlock = hasBreadcrumbs ? buildBreadcrumbJsonLd(breadcrumbs!, currentUrl) : null;
  const siteSearchBlock = hasSiteSearch ? buildWebSiteSearchJsonLd(siteSearchUrlTemplate!) : null;

  const jsonLdBlocks = [breadcrumbBlock, siteSearchBlock, ...toJsonLdArray(jsonLd)].filter(Boolean);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="keywords" content={keywordsContent} />
      <meta name="language" content={seoLanguage} />
      <link rel="canonical" href={currentUrl} />

      {alternateLinks.map(([lang, href]) => (
        <link key={`alt-${lang}`} rel="alternate" hrefLang={lang} href={toAbsoluteUrl(href)} />
      ))}
      {alternates?.mg ? <link rel="alternate" hrefLang="x-default" href={toAbsoluteUrl(alternates.mg)} /> : null}

      <meta
        name="robots"
        content={
          noIndex === false
            ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
            : 'noindex, nofollow'
        }
      />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={absoluteImageUrl} />

      {jsonLdBlocks.map(block => (
        <script key={JSON.stringify(block)} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
