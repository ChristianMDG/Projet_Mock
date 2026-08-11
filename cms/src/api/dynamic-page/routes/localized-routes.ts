/**
 * Localized routes configuration for dynamic pages
 * 
 * This file defines the URL patterns for each supported language.
 * The CMS uses these patterns to generate proper slugs and URLs.
 * 
 * Supported languages:
 * - en: English (default)
 * - fr: French
 * - mg: Malagasy
 */

export const LOCALIZED_PREFIXES = {
  en: '/page',
  fr: '/page',
  mg: '/pejy',
} as const;

export type SupportedLocale = keyof typeof LOCALIZED_PREFIXES;

/**
 * Static page slugs mapped by locale
 * These are the predefined CMS pages with their localized slugs
 */
export const STATIC_PAGE_SLUGS = {
  ABOUT_US: {
    en: 'about-us',
    fr: 'a-propos',
    mg: 'momba-anay',
  },
  SERVICES: {
    en: 'our-services',
    fr: 'nos-services',
    mg: 'ny-tolotra',
  },
  LEGAL_INFORMATION: {
    en: 'legal-information',
    fr: 'informations-legales',
    mg: 'fomba-ara-dalana',
  },
  BOOKING_RATES: {
    en: 'booking-rates',
    fr: 'tarifs-reservation',
    mg: 'vidin-ny-famandrihana',
  },
  DESTINATIONS: {
    en: 'destinations',
    fr: 'destinations',
    mg: 'toerana-kendrena',
  },
  SAFETY_INSURANCE: {
    en: 'safety-insurance',
    fr: 'securite-assurance',
    mg: 'fiarovana-antoka',
  },
  PROMOTIONS: {
    en: 'promotions',
    fr: 'promotions',
    mg: 'promotions',
  },
} as const;

/**
 * Generate full URL path for a page
 */
export const generatePageUrl = (slug: string, locale: SupportedLocale): string => {
  return `${LOCALIZED_PREFIXES[locale]}/${slug}`;
};

/**
 * Get all static page URLs for a given locale
 */
export const getStaticPageUrls = (locale: SupportedLocale): string[] => {
  return Object.values(STATIC_PAGE_SLUGS).map(
    (slugs) => generatePageUrl(slugs[locale], locale)
  );
};

/**
 * Route patterns for Spring Boot FrontController
 * These patterns should match the @GetMapping annotations
 */
export const SPRING_ROUTE_PATTERNS = {
  DYNAMIC_PAGE_EN_FR: '/page/{slug}',
  DYNAMIC_PAGE_MG: '/pejy/{slug}',
} as const;

export default {
  LOCALIZED_PREFIXES,
  STATIC_PAGE_SLUGS,
  SPRING_ROUTE_PATTERNS,
  generatePageUrl,
  getStaticPageUrls,
};
