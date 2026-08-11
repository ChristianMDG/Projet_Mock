import { paletteTokens } from '@/themes/appTheme';

export const resStatusColors: Record<string, string> = {
  CONFIRMED: paletteTokens.success,
  COMPLETED: paletteTokens.successDark,
  PENDING_PAYMENT: paletteTokens.warning,
  CANCELLED_BY_USER: paletteTokens.error,
  CANCELLED_BY_OPERATOR: paletteTokens.error,
  NO_SHOW: paletteTokens.grey,
};

export const voyStatusColors: Record<string, string> = {
  SCHEDULED: paletteTokens.infoDark,
  ONGOING: paletteTokens.warning,
  COMPLETED: paletteTokens.success,
  CANCELLED: paletteTokens.error,
  DELAYED: paletteTokens.warning,
};

export const payStatusColors: Record<string, string> = {
  PAID: paletteTokens.success,
  PARTIALLY_PAID: paletteTokens.info,
  PENDING: paletteTokens.warning,
  FAILED: paletteTokens.error,
};

export function getStatusColor(status: string): string {
  return resStatusColors[status] ?? voyStatusColors[status] ?? paletteTokens.grey;
}

/** Chip color for reservation statuses */
export function getReservationChipColor(status: string): 'success' | 'warning' | 'error' | 'default' {
  const successStatuses = ['CONFIRMED', 'COMPLETED'];
  if (successStatuses.includes(status)) return 'success';
  if (status === 'PENDING_PAYMENT') return 'warning';
  if (status.includes('CANCELLED') || status === 'NO_SHOW') return 'error';
  return 'default';
}

/** Chip color for payment statuses */
export function getPaymentChipColor(status: string): 'success' | 'info' | 'warning' | 'error' | 'default' {
  const map: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
    PAID: 'success',
    PARTIALLY_PAID: 'info',
    PENDING: 'warning',
    FAILED: 'error',
  };
  return map[status] ?? 'default';
}

/** Cell style color for voyage statuses */
export function getVoyageStatusCellColor(status: string): string | undefined {
  return voyStatusColors[status];
}

/** Chip color for Koperative statuses */
export function getKoperativeChipColor(status?: string): 'success' | 'warning' | 'error' | 'default' {
  if (status === 'ACTIVE') return 'success';
  if (status === 'INACTIVE') return 'error';
  if (status === 'SUSPENDED' || status === 'PENDING') return 'warning';
  return 'default';
}
