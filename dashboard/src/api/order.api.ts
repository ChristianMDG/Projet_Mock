import api from './axios';
import type { Order, OrderStatusEnum } from '@/types/shop.types';

export interface OrderFilters {
  status?: OrderStatusEnum | '';
  dateFrom?: string;
  dateTo?: string;
  customerId?: number | '';
  search?: string;
}

export interface PageResponse<T> {
  content: T[];
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export const listOrders = async (filters: OrderFilters = {}): Promise<Order[]> => {
  const params: Record<string, string | number> = {};
  if (filters.status) params.status = filters.status;
  if (filters.dateFrom) {
    params.dateFrom = filters.dateFrom.includes('T') ? filters.dateFrom : `${filters.dateFrom}T00:00:00`;
  }
  if (filters.dateTo) {
    params.dateTo = filters.dateTo.includes('T') ? filters.dateTo : `${filters.dateTo}T23:59:59`;
  }
  if (filters.customerId) params.customerId = filters.customerId;
  if (filters.search) params.q = filters.search;
  params.size = 1000;

  const { data } = await api.get<PageResponse<Order> | Order[]>('/orders', { params });
  if (Array.isArray(data)) {
    return data;
  }
  return data?.content || [];
};

export const getOrder = async (id: number): Promise<Order> => {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
};

export const updateOrderStatus = async (id: number, status: OrderStatusEnum, reason?: string): Promise<Order> => {
  const { data } = await api.put<Order>(`/orders/${id}/status`, { status, reason });
  return data;
};

export const exportOrders = async (format: 'csv' | 'pdf'): Promise<Blob> => {
  const response = await api.get('/orders/export', {
    params: { format },
    responseType: 'blob',
  });
  return response.data as Blob;
};
