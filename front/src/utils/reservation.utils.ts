import dayjs from '@/utils/dayjs';
import type { ChipProps } from '@mui/material';
import { PaymentStatusEnum, ReservationStatusEnum } from '@/models/enums';

/**
 * Status color mappings for reservation chips
 */
export const STATUS_COLORS: Partial<Record<ReservationStatusEnum, ChipProps['color']>> = {
  [ReservationStatusEnum.CONFIRMED]: 'success',
  [ReservationStatusEnum.PENDING_PAYMENT]: 'warning',
  [ReservationStatusEnum.CANCELLED_BY_OPERATOR]: 'error',
  [ReservationStatusEnum.CANCELLED_BY_USER]: 'error',
  [ReservationStatusEnum.COMPLETED]: 'primary',
  [ReservationStatusEnum.NO_SHOW]: 'secondary',
};

export const PAYMENT_STATUS_COLORS: Partial<Record<PaymentStatusEnum, ChipProps['color']>> = {
  [PaymentStatusEnum.PAID]: 'success',
  [PaymentStatusEnum.PENDING]: 'warning',
  [PaymentStatusEnum.PARTIALLY_PAID]: 'info',
  [PaymentStatusEnum.FAILED]: 'error',
  [PaymentStatusEnum.REFUNDED]: 'info',
};

/**
 * Helper functions for status chip colors
 */
export const getStatusChipColor = (status?: ReservationStatusEnum): ChipProps['color'] =>
  status ? (STATUS_COLORS[status] ?? 'default') : 'default';

export const getPaymentChipColor = (status?: PaymentStatusEnum): ChipProps['color'] =>
  status ? (PAYMENT_STATUS_COLORS[status] ?? 'default') : 'default';

/**
 * Generates a unique booking reference
 * Format: REF-YYYYMMDD-HHMMSS-XXXX
 */
export const generateBookingReference = (): string => {
  const now = dayjs();
  const dateStr = now.format('YYYYMMDD');
  const timeStr = now.format('HHmmss');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `TXB-${dateStr}-${timeStr}-${randomStr}`;
};

/**
 * Formats a date for backend consumption
 */
export const formatBookingDate = (date?: dayjs.Dayjs): string => {
  return (date ?? dayjs().tz('Indian/Antananarivo')).toISOString();
};
