import dayjs from './dayjsConfig';

const DATE_FORMAT = 'DD/MM/YYYY';
const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

const toDayjs = (iso?: string | null) => {
  if (!iso) return null;
  const d = dayjs(iso);
  return d.isValid() ? d : null;
};

export const formatCurrency = (amount?: number | null) => `${(amount ?? 0).toLocaleString('fr-FR')} Ar`;

export const formatDate = (iso?: string | null) => {
  const d = toDayjs(iso);
  return d ? d.format(DATE_FORMAT) : '-';
};

export const formatDateTime = (iso?: string | null) => {
  const d = toDayjs(iso);
  return d ? d.format(DATETIME_FORMAT) : '-';
};

export const formatRelative = (iso?: string | null) => {
  const d = toDayjs(iso);
  return d ? d.fromNow() : '-';
};

export const formatDateCustom = (iso?: string | null, pattern = DATE_FORMAT) => {
  const d = toDayjs(iso);
  return d ? d.format(pattern) : '-';
};

export const toIsoDate = (date: Date): string => dayjs(date).format('YYYY-MM-DD');
