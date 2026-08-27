import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';
import i18n from './i18n';

dayjs.extend(relativeTime);

// Malagasy locale is not bundled in dayjs, fall back to French for date formatting.
const applyLocale = (lng?: string) => {
  const lang = lng ?? i18n.language;
  const supported = lang === 'fr' || lang === 'mg' ? 'fr' : lang;
  dayjs.locale(supported);
};

applyLocale();
i18n.on('languageChanged', applyLocale);

export default dayjs;
