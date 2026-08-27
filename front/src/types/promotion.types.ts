import type { Base } from '@/models/Base';
import { DiscountType } from './shop-enums.types';

export interface Promotion extends Base {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number | string;
  buyQuantity?: number;
  getQuantity?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount?: number;
  isActive?: boolean;
  productIds?: number[];
  categoryIds?: number[];
}

export interface ValidatePromotionRequest {
  code: string;
  cartId?: number;
  sessionToken?: string;
}

export interface PromotionValidationResponse {
  eligible: boolean;
  code: string;
  errorCode?: string;
  discountAmount?: number | string;
  newSubtotal?: number | string;
}
