import type { Base } from '@/models/Base';
import { CartStatus } from './shop-enums.types';

export interface CartItem extends Base {
  cartId?: number;
  productId?: number;
  productName?: string;
  productSku?: string;
  productImageUrl?: string;
  variantId?: number;
  quantity: number;
  priceSnapshot?: number | string;
  unitPrice?: number | string;
  lineTotal?: number | string;
}

export interface Cart extends Base {
  userAccountId?: number;
  sessionToken?: string;
  status?: CartStatus;
  items?: CartItem[];
  subtotal?: number | string;
  itemCount?: number;
}

export interface AddCartItemRequest {
  productId: number;
  variantId?: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
