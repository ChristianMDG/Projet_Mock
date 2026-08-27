import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { exportOrders, getOrder, listOrders, updateOrderStatus, type OrderFilters } from '@/api/order.api';
import type { OrderStatusEnum } from '@/types/shop.types';

export const orderKeys = {
  all: ['shop', 'orders'] as const,
  list: (f: OrderFilters) => [...orderKeys.all, 'list', f] as const,
  detail: (id: number) => [...orderKeys.all, 'detail', id] as const,
};

export const useOrders = (filters: OrderFilters = {}) =>
  useQuery({ queryKey: orderKeys.list(filters), queryFn: () => listOrders(filters), staleTime: 15_000 });

export const useOrder = (id: number | null) =>
  useQuery({
    queryKey: orderKeys.detail(id ?? 0),
    queryFn: () => getOrder(id as number),
    enabled: Boolean(id && id > 0),
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: number; status: OrderStatusEnum; reason?: string }) =>
      updateOrderStatus(id, status, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: orderKeys.all }),
  });
};

export const useExportOrders = () => useMutation({ mutationFn: (format: 'csv' | 'pdf') => exportOrders(format) });
