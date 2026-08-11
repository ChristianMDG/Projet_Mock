import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from '@/locales/fr.json';
import mg from '@/locales/mg.json';

const savedLang = localStorage.getItem('dashboard-lang') ?? 'fr';

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    mg: { translation: mg },
  },
  lng: savedLang,
  fallbackLng: 'fr',
  supportedLngs: ['fr', 'mg'],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
