import dayjs, { DATE_FORMATS } from '@/utils/dayjs';

/**
 * Formats currency amount for display
 */
export const formatCurrency = (amount: number, language: string): string => {
  const locale = language === 'en' ? 'en-US' : 'fr-FR';
  return `${new Intl.NumberFormat(locale, { minimumFractionDigits: 0 }).format(amount)} Ar`;
};

/**
 * Formats date for display (without time)
 */
export const formatDate = (value: string, language: string): string =>
  dayjs(value).locale(language).format(DATE_FORMATS.DATE_FULL);

/**
 * Formats datetime for display
 */
export const formatDateTime = (value: string, language: string): string =>
  dayjs(value).locale(language).format(DATE_FORMATS.DATETIME_FULL);
