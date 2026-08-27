import axios from './axios';
import { cartSenderHeaders } from '@/utils/cartSession';
import type { Page } from '@/types/page.types';
import type {
  Order,
  BuyNowRequest,
  CreateOrderRequest,
  OrderExportParams,
  OrderSearchParams,
  PaymentInitiationResponse,
  UpdateOrderStatusRequest,
} from '@/types/order.types';
import type { PaymentMethod } from '@/types/shop-enums.types';

const API_URL = '/orders';

export const createOrder = async (payload: CreateOrderRequest): Promise<Order> => {
  const { data } = await axios.post<Order>(API_URL, payload, {
    headers: cartSenderHeaders(),
  });
  return data;
};

export const listOrders = async (params?: OrderSearchParams): Promise<Page<Order>> => {
  const { data } = await axios.get<Page<Order>>(API_URL, { params });
  return data;
};

export const exportOrders = async (params?: OrderExportParams): Promise<Blob> => {
  const { data } = await axios.get<Blob>(`${API_URL}/export`, {
    params,
    responseType: 'blob',
  });
  return data;
};

export const getOrder = async (id: number): Promise<Order> => {
  const { data } = await axios.get<Order>(`${API_URL}/${id}`);
  return data;
};

export const updateOrderStatus = async (id: number, request: UpdateOrderStatusRequest): Promise<Order> => {
  const { data } = await axios.put<Order>(`${API_URL}/${id}/status`, request);
  return data;
};

export interface OrderPaymentRequest {
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
}

/**
 * Initiate the payment flow for an existing order. The backend always expects a JSON body with at
 * least `paymentMethod`. The response may carry `paymentUrl` for external gateway redirects
 * (PayPal / Stripe / Card CB). For mobile money flows, use `transactionReference` to poll status.
 */
export const initiateOrderPayment = async (
  id: number,
  request: OrderPaymentRequest,
): Promise<PaymentInitiationResponse> => {
  const { data } = await axios.post<PaymentInitiationResponse>(`${API_URL}/${id}/payment/initiate`, request);
  return data;
};

/**
 * Buy with one click: creates an order from a single product line and immediately initiates the
 * payment flow. Authentication is required on the backend.
 */
export const buyNow = async (request: BuyNowRequest): Promise<Order> => {
  const { data } = await axios.post<Order>(`${API_URL}/buy-now`, request, {
    headers: cartSenderHeaders(),
  });
  return data;
};

export const confirmOrderPayment = async (id: number): Promise<Order> => {
  const { data } = await axios.post<Order>(`${API_URL}/${id}/payment/confirm`);
  return data;
};

export const failOrderPayment = async (id: number, reason?: string): Promise<Order> => {
  const { data } = await axios.post<Order>(`${API_URL}/${id}/payment/fail`, null, {
    params: reason ? { reason } : undefined,
  });
  return data;
};
