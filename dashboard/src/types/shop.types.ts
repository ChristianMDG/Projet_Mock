// ---------- Product ----------
export interface ProductImage {
  id: number;
  url: string;
  primary: boolean;
  order?: number;
}

export interface ProductVariantAttributes {
  size?: string;
  color?: string;
  material?: string;
  [key: string]: string | undefined;
}

export interface ProductVariant {
  id: number;
  sku: string;
  priceOverride?: number;
  weight?: number;
  attributes: ProductVariantAttributes;
  stock?: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  sku?: string;
  weight?: number;
  isActive: boolean;
  categoryId?: number;
  categoryName?: string;
  tags?: string[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPayload {
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  sku?: string;
  weight?: number;
  isActive: boolean;
  categoryId?: number;
  tags?: string[];
}

// ---------- Product <-> Route link ----------
export interface ProductRouteSummary {
  id: number;
  name: string;
}

export interface ProductRoute {
  id: number;
  productId: number;
  routeId: number;
  displayOrder: number;
  isActive: boolean;
  route: ProductRouteSummary;
}

export interface ProductRoutePayload {
  routeId: number;
  displayOrder?: number;
  isActive?: boolean;
}

// ---------- Category (top-level) ----------
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
  subcategories?: ProductCategory[];
}

export interface CategoryPayload {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
}

// ---------- ProductCategory (subcategory) ----------
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
  parentId?: number | null;
  category?: Category;
}

export interface ProductCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
  parentId: number;
}

export interface ProductCategoryReorderItem {
  id: number;
  displayOrder?: number;
  parentId?: number;
}

// ---------- Order ----------
export enum OrderStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  READY_IN_STORE = 'READY_IN_STORE',
  DELIVERY_TO_STATION = 'DELIVERY_TO_STATION',
  DELIVERY_IN_PROGRESS = 'DELIVERY_IN_PROGRESS',
  AVAILABLE_AT_COUNTER = 'AVAILABLE_AT_COUNTER',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export const OrderStatusLabels: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.PENDING]: 'shop_order_status_pending',
  [OrderStatusEnum.CONFIRMED]: 'shop_order_status_confirmed',
  [OrderStatusEnum.READY_IN_STORE]: 'shop_order_status_ready_in_store',
  [OrderStatusEnum.DELIVERY_TO_STATION]: 'shop_order_status_delivery_to_station',
  [OrderStatusEnum.DELIVERY_IN_PROGRESS]: 'shop_order_status_delivery_in_progress',
  [OrderStatusEnum.AVAILABLE_AT_COUNTER]: 'shop_order_status_available_at_counter',
  [OrderStatusEnum.PROCESSING]: 'shop_order_status_processing',
  [OrderStatusEnum.SHIPPED]: 'shop_order_status_shipped',
  [OrderStatusEnum.DELIVERED]: 'shop_order_status_delivered',
  [OrderStatusEnum.CANCELLED]: 'shop_order_status_cancelled',
  [OrderStatusEnum.PAYMENT_FAILED]: 'shop_order_status_payment_failed',
};

type ChipColor = 'default' | 'info' | 'primary' | 'success' | 'error' | 'warning';

export const OrderStatusChipColors: Record<OrderStatusEnum, ChipColor> = {
  [OrderStatusEnum.PENDING]: 'warning',
  [OrderStatusEnum.CONFIRMED]: 'info',
  [OrderStatusEnum.READY_IN_STORE]: 'info',
  [OrderStatusEnum.DELIVERY_TO_STATION]: 'primary',
  [OrderStatusEnum.DELIVERY_IN_PROGRESS]: 'primary',
  [OrderStatusEnum.AVAILABLE_AT_COUNTER]: 'warning',
  [OrderStatusEnum.PROCESSING]: 'info',
  [OrderStatusEnum.SHIPPED]: 'primary',
  [OrderStatusEnum.DELIVERED]: 'success',
  [OrderStatusEnum.CANCELLED]: 'error',
  [OrderStatusEnum.PAYMENT_FAILED]: 'error',
};

export interface OrderItem {
  id: number;
  productId?: number;
  productName: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderAddress {
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  ville?: string;
  fokotany?: string;
  notes?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  pickupCode?: string;
  status: OrderStatusEnum;
  allowedNextStatuses?: OrderStatusEnum[];
  subtotal: number;
  deliveryFee?: number;
  discount?: number;
  total: number;
  items: OrderItem[];
  deliveryAddress?: OrderAddress;
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
  timeline?: { status: OrderStatusEnum; at: string; reason?: string }[];
}

// ---------- Inventory ----------
export enum InventoryStatusEnum {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export const InventoryStatusLabels: Record<InventoryStatusEnum, string> = {
  [InventoryStatusEnum.IN_STOCK]: 'shop_inventory_status_in_stock',
  [InventoryStatusEnum.LOW_STOCK]: 'shop_inventory_status_low_stock',
  [InventoryStatusEnum.OUT_OF_STOCK]: 'shop_inventory_status_out_of_stock',
};

export const InventoryStatusChipColors: Record<InventoryStatusEnum, 'success' | 'warning' | 'error'> = {
  [InventoryStatusEnum.IN_STOCK]: 'success',
  [InventoryStatusEnum.LOW_STOCK]: 'warning',
  [InventoryStatusEnum.OUT_OF_STOCK]: 'error',
};

export interface InventoryLog {
  id: number;
  delta: number;
  quantityAfter: number;
  reason?: string;
  createdAt: string;
  createdBy?: string;
}

export interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  variantId?: number;
  variantLabel?: string;
  quantity: number;
  threshold?: number;
  status: InventoryStatusEnum;
  updatedAt?: string;
  logs?: InventoryLog[];
}

// ---------- Promotion ----------
export enum DiscountTypeEnum {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
}

export const DiscountTypeLabels: Record<DiscountTypeEnum, string> = {
  [DiscountTypeEnum.PERCENTAGE]: 'shop_discount_type_percentage',
  [DiscountTypeEnum.FIXED]: 'shop_discount_type_fixed',
  [DiscountTypeEnum.BUY_X_GET_Y]: 'shop_discount_type_buyx',
};

export type PromotionStatus = 'scheduled' | 'active' | 'expired';

export const PromotionStatusLabels: Record<PromotionStatus, string> = {
  scheduled: 'shop_promotion_status_scheduled',
  active: 'shop_promotion_status_active',
  expired: 'shop_promotion_status_expired',
};

export const PromotionStatusChipColors: Record<PromotionStatus, 'info' | 'success' | 'default'> = {
  scheduled: 'info',
  active: 'success',
  expired: 'default',
};

export interface Promotion {
  id: number;
  name: string;
  code?: string;
  discountType: DiscountTypeEnum;
  discountValue: number;
  buyQuantity?: number;
  getQuantity?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount?: number;
  productIds?: number[];
  isActive: boolean;
  status?: PromotionStatus;
}

export interface PromotionPayload {
  name: string;
  code?: string;
  discountType: DiscountTypeEnum;
  discountValue: number;
  buyQuantity?: number;
  getQuantity?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  productIds?: number[];
  isActive: boolean;
}

// ---------- Delivery ----------
export enum DeliveryMethodEnum {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  PICKUP = 'PICKUP',
}

export const DeliveryMethodLabels: Record<DeliveryMethodEnum, string> = {
  [DeliveryMethodEnum.STANDARD]: 'shop_delivery_method_standard',
  [DeliveryMethodEnum.EXPRESS]: 'shop_delivery_method_express',
  [DeliveryMethodEnum.PICKUP]: 'shop_delivery_method_pickup',
};

export interface DeliveryRate {
  method: DeliveryMethodEnum;
  baseFee: number;
  perKgFee: number;
}

export interface DeliveryZone {
  id: number;
  name: string;
  villes?: string[];
  fokotanys?: string[];
  rates: DeliveryRate[];
  isActive: boolean;
}

export interface DeliveryZonePayload {
  name: string;
  villes?: string[];
  fokotanys?: string[];
  rates: DeliveryRate[];
  isActive: boolean;
}

// ---------- Analytics ----------
export type AnalyticsGranularity = 'day' | 'week' | 'month';

export interface RevenuePoint {
  period: string;
  revenue: number;
  orders?: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface OrderStatusDistribution {
  status: OrderStatusEnum;
  count: number;
}

export interface CustomerPattern {
  period: string;
  newCustomers: number;
  returningCustomers: number;
}
