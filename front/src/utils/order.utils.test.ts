import { describe, it, expect } from 'vitest';
import { OrderStatus } from '@/types/shop-enums.types';
import { getStatusChipColor, getStatusLabel } from './order.utils';

describe('order.utils', () => {
  it('should return correct chip colors for all operational statuses', () => {
    expect(getStatusChipColor(OrderStatus.PENDING)).toBe('warning');
    expect(getStatusChipColor(OrderStatus.CONFIRMED)).toBe('info');
    expect(getStatusChipColor(OrderStatus.READY_IN_STORE)).toBe('info');
    expect(getStatusChipColor(OrderStatus.DELIVERY_TO_STATION)).toBe('primary');
    expect(getStatusChipColor(OrderStatus.DELIVERY_IN_PROGRESS)).toBe('primary');
    expect(getStatusChipColor(OrderStatus.AVAILABLE_AT_COUNTER)).toBe('warning');
    expect(getStatusChipColor(OrderStatus.DELIVERED)).toBe('success');
    expect(getStatusChipColor(OrderStatus.CANCELLED)).toBe('error');
    expect(getStatusChipColor(undefined)).toBe('default');
  });

  it('should return correct translation keys for order status labels', () => {
    const mockT = (key: string) => key;

    expect(getStatusLabel(OrderStatus.READY_IN_STORE, mockT)).toBe('order_status_ready_in_store');
    expect(getStatusLabel(OrderStatus.DELIVERY_TO_STATION, mockT)).toBe('order_status_delivery_to_station');
    expect(getStatusLabel(OrderStatus.DELIVERY_IN_PROGRESS, mockT)).toBe('order_status_delivery_in_progress');
    expect(getStatusLabel(OrderStatus.AVAILABLE_AT_COUNTER, mockT)).toBe('order_status_available_at_counter');
    expect(getStatusLabel(OrderStatus.DELIVERED, mockT)).toBe('order_status_delivered');
    expect(getStatusLabel(undefined, mockT)).toBe('');
  });

  it('should validate 6-digit pickup codes accurately', () => {
    const isValidCode = (code: string) => /^\d{6}$/.test(code.trim());

    expect(isValidCode('123456')).toBe(true);
    expect(isValidCode('000000')).toBe(true);
    expect(isValidCode('987654')).toBe(true);

    expect(isValidCode('12345')).toBe(false);
    expect(isValidCode('1234567')).toBe(false);
    expect(isValidCode('abc123')).toBe(false);
    expect(isValidCode('')).toBe(false);
  });
});
