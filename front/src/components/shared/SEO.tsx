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
  imageWidth?: number | string;
  imageHeight?: number | string;
  imageAlt?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  productPrice?: number | string;
  productCurrency?: string;
  productAvailability?: 'instock' | 'oos' | 'pending' | string;
  noIndex?: boolean;

  canonicalQueryParams?: CanonicalQueryParams;
  alternates?: Partial<Record<SeoLanguage, string>>;

  breadcrumbs?: BreadcrumbItem[];
  siteSearchUrlTemplate?: string;
  jsonLd?: SeoJsonLd | SeoJsonLd[];
}

const BASE_URL = (
  import.meta.env.VITE_DOMAIN_MAIN ? `https://${import.meta.env.VITE_DOMAIN_MAIN}` : 'https://taxibrousse.mg'
).replace(/\/+$/, '');

const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION =
  'Taxibrousse.mg - La plateforme de réservation de taxi-brousse en ligne à Madagascar. Réservez vos billets facilement et en toute sécurité.';

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

function toAbsoluteUrl(value?: string | null): string {
  if (value) {
    if (/^https?:\/\//i.test(value)) {
      return value;
    }
    const cleanValue = value.startsWith('/') ? value : `/${value}`;
    return `${BASE_URL}${cleanValue}`;
  }
  return BASE_URL;
}

function normalizeCanonicalUrl(input: string, canonicalQueryParams: CanonicalQueryParams): string {
  const absoluteInput = toAbsoluteUrl(input);
  try {
    const url = new URL(absoluteInput);

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
  } catch {
    return absoluteInput;
  }
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

function buildProductJsonLd(
  name: string,
  desc: string | undefined,
  imageUrl: string,
  price: number | string | undefined,
  currency: string | undefined,
  availability: string | undefined,
  url: string,
): SeoJsonLd {
  const isOutOfStock = availability === 'oos';
  const schemaAvailability = isOutOfStock ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: desc,
    image: [imageUrl],
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency ?? 'MGA',
      availability: schemaAvailability,
      url,
    },
  };
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  extraKeywords,
  image = DEFAULT_IMAGE,
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt,
  url,
  type = 'website',
  productPrice,
  productCurrency = 'MGA',
  productAvailability,
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
  const fallbackUrl = `${BASE_URL}${location.pathname}${location.search}`;
  const rawUrl = url ? toAbsoluteUrl(url) : fallbackUrl;
  const currentUrl = normalizeCanonicalUrl(rawUrl, canonicalQueryParams);

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
    if (alternates) {
      return Object.entries(alternates) as Array<[SeoLanguage, string]>;
    }
    return [];
  };
  const alternateLinks = getAlternateEntries().filter(([, href]) => href);

  const toJsonLdArray = (value: SeoJsonLd | SeoJsonLd[] | undefined): SeoJsonLd[] => {
    if (Array.isArray(value)) return value;
    if (value) return [value];
    return [];
  };

  const hasBreadcrumbs = Boolean(breadcrumbs?.length);
  const hasSiteSearch = Boolean(siteSearchUrlTemplate);
  const isProduct = type === 'product';
  const hasProductPrice = productPrice !== undefined && productPrice !== null && productPrice !== '';
  const hasProductCurrency = Boolean(productCurrency);
  const hasProductAvailability = Boolean(productAvailability);
  const hasDescription = Boolean(description);
  const hasImageAlt = Boolean(imageAlt);

  const breadcrumbBlock = hasBreadcrumbs ? buildBreadcrumbJsonLd(breadcrumbs!, currentUrl) : null;
  const siteSearchBlock = hasSiteSearch ? buildWebSiteSearchJsonLd(siteSearchUrlTemplate!) : null;
  const productBlock =
    isProduct && hasProductPrice
      ? buildProductJsonLd(
          fullTitle,
          description,
          absoluteImageUrl,
          productPrice,
          productCurrency,
          productAvailability,
          currentUrl,
        )
      : null;

  const jsonLdBlocks = [breadcrumbBlock, siteSearchBlock, productBlock, ...toJsonLdArray(jsonLd)].filter(Boolean);
  const allowRobotsIndex = noIndex === false;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {hasDescription && <meta name="description" content={description} />}
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
          allowRobotsIndex
            ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
            : 'noindex, nofollow'
        }
      />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      {hasDescription && <meta property="og:description" content={description} />}
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:secure_url" content={absoluteImageUrl} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      {hasImageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />

      {isProduct && hasProductPrice && <meta property="product:price:amount" content={String(productPrice)} />}
      {isProduct && hasProductCurrency && <meta property="product:price:currency" content={productCurrency} />}
      {isProduct && hasProductAvailability && <meta property="product:availability" content={productAvailability} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      {hasDescription && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={absoluteImageUrl} />
      {hasImageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {jsonLdBlocks.map(block => (
        <script key={JSON.stringify(block)} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
