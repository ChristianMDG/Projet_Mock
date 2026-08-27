export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum DeliveryMethod {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  PICKUP = 'PICKUP',
}

export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
}

export enum CartStatus {
  ACTIVE = 'ACTIVE',
  CONVERTED = 'CONVERTED',
  ABANDONED = 'ABANDONED',
}
