import type { ChipProps } from '@mui/material';
import { OrderStatus } from '@/types/shop-enums.types';
import Labels from '@/labelKeys.json';
import type { TFunction } from 'i18next';

/**
 * Status color mappings for order chips
 */
export const ORDER_STATUS_COLORS: Partial<Record<OrderStatus, ChipProps['color']>> = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.CONFIRMED]: 'info',
  [OrderStatus.PROCESSING]: 'info',
  [OrderStatus.SHIPPED]: 'primary',
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.CANCELLED]: 'error',
  [OrderStatus.PAYMENT_FAILED]: 'error',
};

/**
 * Helper function for order status chip colors
 */
export const getStatusChipColor = (status?: OrderStatus | string): ChipProps['color'] => {
  if (status && status in ORDER_STATUS_COLORS) {
    return ORDER_STATUS_COLORS[status as OrderStatus] ?? 'default';
  }
  return 'default';
};

/**
 * Helper function for localized order status label
 */
export const getStatusLabel = (status?: OrderStatus | string, t?: TFunction | ((key: string) => string)): string => {
  if (!status) {
    return '';
  }

  const translate = t ?? ((key: string) => key);

  switch (status) {
    case OrderStatus.PENDING:
      return translate(Labels.order_status_pending);
    case OrderStatus.CONFIRMED:
      return translate(Labels.order_status_confirmed);
    case OrderStatus.PROCESSING:
      return translate(Labels.order_status_processing);
    case OrderStatus.SHIPPED:
      return translate(Labels.order_status_shipped);
    case OrderStatus.DELIVERED:
      return translate(Labels.order_status_delivered);
    case OrderStatus.CANCELLED:
      return translate(Labels.order_status_cancelled);
    case OrderStatus.PAYMENT_FAILED:
      return translate(Labels.order_status_payment_failed);
    default:
      return String(status);
  }
};
