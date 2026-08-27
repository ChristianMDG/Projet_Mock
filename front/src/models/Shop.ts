import type { StrapiMedia } from '@/types/cms.types';
import type { Voyage } from '@/models/Voyage';

/**
 * Top-level catalog category (CMS: api::category.category).
 * Holds a collection of `ProductCategory` (subcategories).
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  displayOrder?: number;
  image?: StrapiMedia;
  subcategories?: ProductCategory[];
}

/**
 * Subcategory (CMS: api::product-category.product-category).
 * Always belongs to a top-level `Category` via `category` (parent).
 * Products reference this entity, not the top-level one.
 */
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder?: number;
  isActive?: boolean;
  image?: StrapiMedia;
  category?: Category;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Seller {
  id: number;
  name: string;
  location: string;
  rating: number;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: StrapiMedia[];
  category: ProductCategory;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  weight?: number;
  dimensions?: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller?: boolean;
  specifications?: ProductSpecification[];
  seller?: Seller;
  relatedProductIds?: number[];
  sku?: string;
  origin?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface DeliveryVoyage {
  voyage?: Voyage;
  estimatedDeliveryDate?: string;
  deliveryFee: number;
}

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface ShopOrder {
  id: number;
  orderReference: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  grandTotal: number;
  status: OrderStatusEnum;
  deliveryVoyage?: DeliveryVoyage;
  shippingAddress: string;
  recipientName: string;
  recipientPhone: string;
  createdAt: string;
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'best-seller';
