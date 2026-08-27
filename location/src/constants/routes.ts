/**
 * Localized Routes System for Rental Project
 * SEO-friendly URLs: mg (Malagasy) has no prefix (default), fr/en have /{lang}/path
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
  // Home & Auth (Required for auth redirects and headers)
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
  accountDetail: {
    mg: '/kaontiko',
    fr: '/fr/mon-compte',
    en: '/en/my-account',
  },

  // Rental specific routes
  rentalHome: {
    mg: '/location',
    fr: '/fr/location',
    en: '/en/location',
  },
  rentalHomeStandalone: {
    mg: '/',
    fr: '/fr',
    en: '/en',
  },
  rentalSearchResults: {
    mg: '/location/recherche',
    fr: '/fr/location/recherche',
    en: '/en/location/search',
  },
  rentalSearchResultsStandalone: {
    mg: '/recherche',
    fr: '/fr/recherche',
    en: '/en/search',
  },
  rentalVehicleDetail: {
    mg: '/location/vehicule/:id',
    fr: '/fr/location/vehicule/:id',
    en: '/en/location/vehicle/:id',
  },
  rentalVehicleDetailStandalone: {
    mg: '/vehicule/:id',
    fr: '/fr/vehicule/:id',
    en: '/en/vehicle/:id',
  },
  rentalUtilitaires: {
    mg: '/location/utilitaires',
    fr: '/fr/location/utilitaires',
    en: '/en/location/utilities',
  },
  rentalUtilitairesStandalone: {
    mg: '/utilitaires',
    fr: '/fr/utilitaires',
    en: '/en/utilities',
  },
  rentalUtilitaireDetail: {
    mg: '/location/utilitaires/:id',
    fr: '/fr/location/utilitaires/:id',
    en: '/en/location/utilities/:id',
  },
  rentalUtilitaireDetailStandalone: {
    mg: '/utilitaires/:id',
    fr: '/fr/utilitaires/:id',
    en: '/en/utilities/:id',
  },
  rentalVoitures: {
    mg: '/location/voitures',
    fr: '/fr/location/voitures',
    en: '/en/location/cars',
  },
  rentalVoituresStandalone: {
    mg: '/voitures',
    fr: '/fr/voitures',
    en: '/en/cars',
  },
  rentalAgences: {
    mg: '/location/agences',
    fr: '/fr/location/agences',
    en: '/en/location/agencies',
  },
  rentalAgencesStandalone: {
    mg: '/agences',
    fr: '/fr/agences',
    en: '/en/agencies',
  },
  rentalCheckout: {
    mg: '/location/reservation/:id',
    fr: '/fr/location/reservation/:id',
    en: '/en/location/booking/:id',
  },
  rentalCheckoutStandalone: {
    mg: '/reservation/:id',
    fr: '/fr/reservation/:id',
    en: '/en/booking/:id',
  },
  rentalGuide: {
    mg: '/location/guide',
    fr: '/fr/location/guide',
    en: '/en/location/guide',
  },
  rentalGuideStandalone: {
    mg: '/guide',
    fr: '/fr/guide',
    en: '/en/guide',
  },
  rentalTerms: {
    mg: '/location/conditions',
    fr: '/fr/location/conditions',
    en: '/en/location/terms',
  },
  rentalTermsStandalone: {
    mg: '/conditions',
    fr: '/fr/conditions',
    en: '/en/terms',
  },
  rentalContact: {
    mg: '/location/contact',
    fr: '/fr/location/contact',
    en: '/en/location/contact',
  },
  rentalContactStandalone: {
    mg: '/contact',
    fr: '/fr/contact',
    en: '/en/contact',
  },
  rentalAbout: {
    mg: '/location/a-propos',
    fr: '/fr/location/a-propos',
    en: '/en/location/about',
  },
  rentalAboutStandalone: {
    mg: '/a-propos',
    fr: '/fr/a-propos',
    en: '/en/about',
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
  rentalVehicleDetail: (id: string | number, language = 'mg') =>
    ROUTES.rentalVehicleDetail[language].replace(':id', String(id)),
  rentalVehicleDetailStandalone: (id: string | number, language = 'mg') =>
    ROUTES.rentalVehicleDetailStandalone[language].replace(':id', String(id)),
  rentalCheckout: (id: string | number, language = 'mg') => ROUTES.rentalCheckout[language].replace(':id', String(id)),
  rentalCheckoutStandalone: (id: string | number, language = 'mg') =>
    ROUTES.rentalCheckoutStandalone[language].replace(':id', String(id)),
};
