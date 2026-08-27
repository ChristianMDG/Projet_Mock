import type { Base } from '@/models/Base';

export interface WishlistItem extends Base {
  wishlistId?: number;
  productId?: number;
  productName?: string;
  productSku?: string;
  productPrice?: number | string;
  productStock?: number;
  addedAt?: string;
}

export interface Wishlist extends Base {
  userAccountId?: number;
  items?: WishlistItem[];
}

export interface AddWishlistItemRequest {
  productId: number;
}
