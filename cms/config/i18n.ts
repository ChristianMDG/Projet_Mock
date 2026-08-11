/**
 * Internationalization (i18n) Configuration
 * 
 * This file documents the i18n setup for the Taxibrousse CMS
 * Supporting French (fr) and English (en) locales
 */

export interface I18nConfig {
  enabled: boolean;
  config: {
    defaultLocale: string;
    locales: string[];
  };
}

/**
 * Supported locales for the Taxibrousse application
 */
export const SUPPORTED_LOCALES = {
  en: {
    code: 'en',
    name: 'English',
    isDefault: true,
  },
  fr: {
    code: 'fr', 
    name: 'Français',
    isDefault: false,
  },
} as const;

/**
 * I18n plugin configuration
 */
export const i18nConfig: I18nConfig = {
  enabled: true,
  config: {
    defaultLocale: 'fr',
    locales: ['en', 'fr', 'mg'],
  },
};

/**
 * Locale validation helper
 */
export const isValidLocale = (locale: string): locale is keyof typeof SUPPORTED_LOCALES => {
  return Object.keys(SUPPORTED_LOCALES).includes(locale);
};

/**
 * Get locale configuration
 */
export const getLocaleConfig = (locale: string) => {
  if (!isValidLocale(locale)) {
    return SUPPORTED_LOCALES.fr;
  }
  return SUPPORTED_LOCALES[locale];
};
