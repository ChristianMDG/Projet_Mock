import type { Base } from '@/models/Base';

export interface ProductImage extends Base {
  productId?: number;
  url: string;
  altText?: string;
  displayOrder?: number;
  isPrimary?: boolean;
}

export interface ProductVariant extends Base {
  productId?: number;
  sku?: string;
  attributes?: Record<string, unknown>;
  priceOverride?: number | string;
  stock?: number;
}

export interface ProductRoute extends Base {
  productId?: number;
  routeId?: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface ProductSearchParams {
  q?: string;
  categoryId?: number;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
  tags?: string[];
  sort?: string;
  page?: number;
  size?: number;
}

export interface BulkImportError {
  rowNumber: number;
  errorCode: string;
  field?: string;
  message?: string;
}

export interface BulkImportResult {
  totalRows: number;
  successCount: number;
  failureCount: number;
  errors: BulkImportError[];
  createdSkus: string[];
  updatedSkus: string[];
  dryRun: boolean;
}
