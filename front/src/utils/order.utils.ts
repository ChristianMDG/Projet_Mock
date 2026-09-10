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
  [OrderStatus.READY_IN_STORE]: 'info',
  [OrderStatus.DELIVERY_TO_STATION]: 'primary',
  [OrderStatus.DELIVERY_IN_PROGRESS]: 'primary',
  [OrderStatus.AVAILABLE_AT_COUNTER]: 'warning',
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
    case OrderStatus.READY_IN_STORE:
      return translate(Labels.order_status_ready_in_store);
    case OrderStatus.DELIVERY_TO_STATION:
      return translate(Labels.order_status_delivery_to_station);
    case OrderStatus.DELIVERY_IN_PROGRESS:
      return translate(Labels.order_status_delivery_in_progress);
    case OrderStatus.AVAILABLE_AT_COUNTER:
      return translate(Labels.order_status_available_at_counter);
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
