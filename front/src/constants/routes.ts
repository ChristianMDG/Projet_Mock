/**
 * Localized Routes System
 * SEO-friendly URLs: mg (Malagasy) has no prefix (default), fr/en have /{lang}/path
 * Supports mg (Malagasy - default, no prefix), fr (French), en (English)
 *
 * USAGE:
 * - Access route: ROUTES.aboutUs.fr → '/fr/page/a-propos'
 * - Access route: ROUTES.aboutUs[lang] → works with string
 * - Dynamic routes: generateRoute.koperativeDetail('123', 'fr')
 */

export const DEFAULT_LANGUAGE = 'mg';

/** Route paths indexed by language code */
export interface LocalizedPath {
  mg: string;
  fr: string;
  en: string;
  [key: string]: string;
}

export const ROUTES: Record<string, LocalizedPath> = {
  // Home & Auth
  home: {
    mg: '/',
    fr: '/fr',
    en: '/en',
  },
  login: {
    mg: '/hiditra',
    fr: '/fr/connexion',
    en: '/en/login',
  },
  resetPassword: {
    mg: '/hamerina-tenimiafina',
    fr: '/fr/reinitialiser-mot-de-passe',
    en: '/en/reset-password',
  },

  // Information Pages
  aboutUs: {
    mg: '/pejy/momba-anay',
    fr: '/fr/page/a-propos',
    en: '/en/page/about-us',
  },
  services: {
    mg: '/pejy/ny-tolotra',
    fr: '/fr/page/nos-services',
    en: '/en/page/our-services',
  },
  legalInformation: {
    mg: '/pejy/fomba-ara-dalana',
    fr: '/fr/page/informations-legales',
    en: '/en/page/legal-information',
  },
  bookingRates: {
    mg: '/pejy/vidin-ny-famandrihana',
    fr: '/fr/page/tarifs-reservation',
    en: '/en/page/booking-rates',
  },
  destinations: {
    mg: '/pejy/toerana-kendrena',
    fr: '/fr/page/destinations',
    en: '/en/page/destinations',
  },
  safetyInsurance: {
    mg: '/pejy/fiarovana-antoka',
    fr: '/fr/page/securite-assurance',
    en: '/en/page/safety-insurance',
  },
  promotions: {
    mg: '/pejy/promotions',
    fr: '/fr/page/promotions',
    en: '/en/page/promotions',
  },
  pageInformations: {
    mg: '/pejy-fampahalalana',
    fr: '/fr/informations-pages',
    en: '/en/page-informations',
  },

  // Dynamic Pages (CMS-driven)
  dynamicPage: {
    mg: '/pejy/:slug',
    fr: '/fr/page/:slug',
    en: '/en/page/:slug',
  },

  // Search & Results
  searchResults: {
    mg: '/fikarohana',
    fr: '/fr/recherche',
    en: '/en/search',
  },

  // Koperatives (Cooperatives)
  koperativesList: {
    mg: '/koperativa',
    fr: '/fr/cooperatives',
    en: '/en/cooperatives',
  },
  koperativeDetail: {
    mg: '/koperativa/:slug',
    fr: '/fr/cooperatives/:slug',
    en: '/en/cooperatives/:slug',
  },
  koperativeCreate: {
    mg: '/koperativa/vaovao',
    fr: '/fr/cooperatives/nouveau',
    en: '/en/cooperatives/new',
  },
  koperativeEdit: {
    mg: '/koperativa/:id/hanova',
    fr: '/fr/cooperatives/:id/modifier',
    en: '/en/cooperatives/:id/edit',
  },
  koperativeVoyageScheduler: {
    mg: '/koperativa/:koperativeId/fandaharana-dia',
    fr: '/fr/cooperatives/:koperativeId/planificateur-voyages',
    en: '/en/cooperatives/:koperativeId/voyage-scheduler',
  },
  cooperativeInfo: {
    mg: '/koperativa-fampahalalana/:slug',
    fr: '/fr/cooperative-info/:slug',
    en: '/en/cooperative-info/:slug',
  },

  // Gares (Stations)
  garesList: {
    mg: '/gara',
    fr: '/fr/gares',
    en: '/en/stations',
  },
  gareDetail: {
    mg: '/gara/:id',
    fr: '/fr/gares/:id',
    en: '/en/stations/:id',
  },
  gareCreate: {
    mg: '/gara/vaovao',
    fr: '/fr/gares/nouveau',
    en: '/en/stations/new',
  },
  gareEdit: {
    mg: '/gara/:id/hanova',
    fr: '/fr/gares/:id/modifier',
    en: '/en/stations/:id/edit',
  },

  // Voyages (Trips)
  voyagesList: {
    mg: '/dia',
    fr: '/fr/voyages',
    en: '/en/trips',
  },
  voyageScheduler: {
    mg: '/dia/fandaharana',
    fr: '/fr/voyages/planificateur',
    en: '/en/trips/scheduler',
  },

  // Reservations
  reservationsList: {
    mg: '/famandrihana',
    fr: '/fr/reservations',
    en: '/en/reservations',
  },
  reservationsByVoyage: {
    mg: '/famandrihana/dia/:voyageId',
    fr: '/fr/reservations/voyage/:voyageId',
    en: '/en/reservations/trip/:voyageId',
  },

  // Payment
  payment: {
    mg: '/fandoavana',
    fr: '/fr/paiement',
    en: '/en/payment',
  },
  paymentVoyage: {
    mg: '/fandoavana/dia/:voyageId',
    fr: '/fr/paiement/voyage/:voyageId',
    en: '/en/payment/trip/:voyageId',
  },
  paymentSuccess: {
    mg: '/fandoavana/fahombiazana/:voyageId',
    fr: '/fr/paiement/succes/:voyageId',
    en: '/en/payment/success/:voyageId',
  },
  reservationConfirmation: {
    mg: '/famandrihana/fikasana',
    fr: '/fr/reservations/confirmation',
    en: '/en/reservations/confirmation',
  },

  // Account
  accountDetail: {
    mg: '/kaontiko',
    fr: '/fr/mon-compte',
    en: '/en/my-account',
  },

  // Operators
  operators: {
    mg: '/mpandraharaha',
    fr: '/fr/operateurs',
    en: '/en/operators',
  },
  operatorBooking: {
    mg: '/mpandraharaha/famandrihana',
    fr: '/fr/operateurs/reservation',
    en: '/en/operators/booking',
  },

  // Shop (E-commerce)
  shop: {
    mg: '/tsena',
    fr: '/fr/boutique',
    en: '/en/shop',
  },
  shopCategory: {
    mg: '/tsena/sokajy/:slug',
    fr: '/fr/boutique/categorie/:slug',
    en: '/en/shop/category/:slug',
  },
  shopProduct: {
    mg: '/tsena/:slug',
    fr: '/fr/boutique/:slug',
    en: '/en/shop/:slug',
  },
  shopCheckout: {
    mg: '/tsena/kaomandy',
    fr: '/fr/boutique/commande',
    en: '/en/shop/checkout',
  },
  shopPaymentSuccess: {
    mg: '/tsena/fandoavana/fahombiazana',
    fr: '/fr/boutique/paiement/succes',
    en: '/en/shop/payment/success',
  },
  shopPaymentCancel: {
    mg: '/tsena/fandoavana/nofoanana',
    fr: '/fr/boutique/paiement/annule',
    en: '/en/shop/payment/cancel',
  },
};

/** Helper to detect language from URL path */
export const getLanguageFromPath = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0]?.toLowerCase();
  if (['fr', 'en'].includes(firstSegment)) {
    return firstSegment;
  }
  return DEFAULT_LANGUAGE; // mg is default when no prefix
};

/** Sync i18n language based on URL path */
export const syncLanguageFromPath = async (
  pathname: string,
  i18nInstance: { language: string; changeLanguage: (lang: string) => Promise<unknown> },
): Promise<string> => {
  const urlLang = getLanguageFromPath(pathname);
  if (urlLang !== i18nInstance.language) {
    await i18nInstance.changeLanguage(urlLang);
  }
  return urlLang;
};

export type LocalizedRouteKey = keyof typeof ROUTES;

/**
 * Helper functions for dynamic route generation with localization
 */
export const generateRoute = {
  koperativeDetail: (slug: string | number, language = 'mg') => {
    const route = ROUTES.koperativeDetail[language];
    return route.replace(':slug', String(slug));
  },

  koperativeEdit: (id: string | number, language = 'mg') => ROUTES.koperativeEdit[language].replace(':id', String(id)),

  gareDetail: (id: string | number, language = 'mg') => ROUTES.gareDetail[language].replace(':id', String(id)),

  gareEdit: (id: string | number, language = 'mg') => ROUTES.gareEdit[language].replace(':id', String(id)),

  voyageScheduler: (koperativeId: string | number, language = 'mg') =>
    ROUTES.koperativeVoyageScheduler[language].replace(':koperativeId', String(koperativeId)),

  reservationsByVoyage: (voyageId: string | number, language = 'mg') =>
    ROUTES.reservationsByVoyage[language].replace(':voyageId', String(voyageId)),

  cooperativeInfo: (slug: string | number, language = 'mg') => {
    const route = ROUTES.cooperativeInfo[language];
    return route.replace(':slug', String(slug));
  },

  dynamicPage: (slug: string, language = 'mg') => ROUTES.dynamicPage[language].replace(':slug', slug),

  paymentVoyage: (voyageId: string | number, language = 'mg') =>
    ROUTES.paymentVoyage[language].replace(':voyageId', String(voyageId)),

  paymentSuccess: (voyageId: string | number, language = 'mg') =>
    ROUTES.paymentSuccess[language].replace(':voyageId', String(voyageId)),

  shopCategory: (slug: string, language = 'mg') => ROUTES.shopCategory[language].replace(':slug', slug),

  shopProduct: (slug: string, language = 'mg') => ROUTES.shopProduct[language].replace(':slug', slug),
};

/**
 * @deprecated Use generateRoute instead - kept for backward compatibility
 */
export const RouteHelpers = {
  paymentForVoyage: (voyageId: number | string, language = 'mg') => generateRoute.paymentVoyage(voyageId, language),
  paymentSuccessForVoyage: (voyageId: number | string, language = 'mg') =>
    generateRoute.paymentSuccess(voyageId, language),
  koperativeDetail: (id: number | string, language = 'mg') => generateRoute.koperativeDetail(id, language),
  gareDetail: (id: number | string, language = 'mg') => generateRoute.gareDetail(id, language),
};
