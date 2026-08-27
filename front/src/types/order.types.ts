import type { Base } from '@/models/Base';
import type { Ville } from '@/models/Ville';
import { OrderStatus, PaymentMethod, DeliveryMethod } from './shop-enums.types';
import { PaymentTransactionStatusEnum } from '@/models/enums';

export interface OrderItem extends Base {
  orderId?: number;
  productId?: number;
  variantId?: number;
  productName: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order extends Base {
  orderNumber: string;
  userAccountId?: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  billingAddress?: string;
  deliveryAddress: string;
  ville?: Ville;
  villeId?: number;
  fokotanyId?: number;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  status: OrderStatus;
  previousStatus?: OrderStatus;
  statusChangedAt?: string;
  statusChangeReason?: string;
  subtotal: number;
  shipping: number;
  tax?: number;
  total: number;
  currency?: string;
  trackingNumber?: string;
  carrier?: string;
  shippingWeight?: number;
  promotionCode?: string;
  discountAmount?: number;
  items: OrderItem[];
  /** Transient field set by the backend after `initiateOrderPayment`/`buyNow` when an
   *  external redirect (PayPal, Stripe, etc.) is required. Null for on-site flows. */
  paymentUrl?: string | null;
  /** Transient field carrying the gateway transaction reference, when available. */
  transactionReference?: string | null;
}

/** Request body for `POST /api/orders/buy-now`. */
export interface BuyNowRequest {
  productId: number;
  variantId?: number;
  quantity: number;
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
  deliveryAddress?: string;
  villeId?: number;
  customerName?: string;
  customerPhone?: string;
  deliveryMethod?: DeliveryMethod;
}

export interface OrderSearchParams {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  customerId?: number;
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  reason?: string;
}
export interface OrderExportParams {
  format?: 'csv' | 'xlsx';
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
}

/** Request body for POST /api/orders */
export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  villeId: number;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  items: CreateOrderItemRequest[];
  subtotal: number;
  total: number;
}

export interface CreateOrderItemRequest {
  productId: number;
  variantId?: number;
  productName: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/** Response from POST /api/orders/{id}/payment/initiate */
export interface PaymentInitiationResponse {
  transactionReference: string;
  /** Present for external gateway redirects (Orange Money CB, etc.). Null for mobile-money flows. */
  paymentUrl?: string | null;
  status: PaymentTransactionStatusEnum;
  operatorName: string;
}
