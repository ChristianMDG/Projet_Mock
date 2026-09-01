import { useMutation, useQuery, useQueryClient, UseQueryResult, skipToken } from '@tanstack/react-query';
import {
  buyNow,
  confirmOrderPayment,
  confirmOrderPickup,
  createOrder,
  exportOrders,
  failOrderPayment,
  getOrder,
  initiateOrderPayment,
  listOrders,
  updateOrderStatus,
  type OrderPaymentRequest,
} from '@/api/order.api';
import type { Page } from '@/types/page.types';
import type {
  Order,
  BuyNowRequest,
  CreateOrderRequest,
  OrderExportParams,
  OrderSearchParams,
  UpdateOrderStatusRequest,
} from '@/types/order.types';

const ORDERS_KEY = ['orders'];

export function useOrders(params?: OrderSearchParams): UseQueryResult<Page<Order>, Error> {
  return useQuery({
    queryKey: ['orders', 'list', params],
    queryFn: () => listOrders(params),
  });
}

export function useOrder(id?: number): UseQueryResult<Order, Error> {
  return useQuery({
    queryKey: ['order', id],
    queryFn: id === undefined ? skipToken : () => getOrder(id),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => createOrder(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateOrderStatusRequest }) => updateOrderStatus(id, request),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      await queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

export function useInitiateOrderPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: OrderPaymentRequest }) => initiateOrderPayment(id, request),
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
}

export function useBuyNow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: BuyNowRequest) => buyNow(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useConfirmOrderPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => confirmOrderPayment(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      await queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
}

export function useFailOrderPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => failOrderPayment(id, reason),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      await queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

export function useExportOrders() {
  return useMutation<Blob, Error, OrderExportParams | undefined>({
    mutationFn: params => exportOrders(params),
  });
}

export function useConfirmOrderPickup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, code }: { id: number; code: string }) => confirmOrderPickup(id, code),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      await queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}
