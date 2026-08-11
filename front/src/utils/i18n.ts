import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import dayjs from '@/utils/dayjs';

import mgTranslations from '../locales/mg/translation.json';
import frTranslations from '../locales/fr/translation.json';
import enTranslations from '../locales/en/translation.json';

import { getLanguageFromPath } from '../constants/routes';

const resources: Record<string, { translation: typeof mgTranslations }> = {
  mg: { translation: mgTranslations },
  fr: { translation: frTranslations },
  en: { translation: enTranslations },
};

const initialLng = typeof window !== 'undefined' ? getLanguageFromPath(window.location.pathname) : 'mg';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: 'mg',
  supportedLngs: ['mg', 'fr', 'en'],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

dayjs.locale(initialLng);
i18n.on('languageChanged', (lng: string) => {
  dayjs.locale(lng);
});

export default i18n;
