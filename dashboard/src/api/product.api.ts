import api from './axios';
import type { Product, ProductPayload, ProductImage, ProductVariant } from '@/types/shop.types';

export const listProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>('/products');
  return data;
};

export const createProduct = async (payload: ProductPayload): Promise<Product> => {
  const { data } = await api.post<Product>('/products', payload);
  return data;
};

export const updateProduct = async (id: number, payload: ProductPayload): Promise<Product> => {
  const { data } = await api.put<Product>(`/products/${id}`, payload);
  return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};

export const uploadProductImage = async (productId: number, file: File): Promise<ProductImage> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<ProductImage>(`/products/${productId}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const setPrimaryImage = async (productId: number, imageId: number): Promise<void> => {
  await api.put(`/products/${productId}/images/${imageId}/primary`);
};

export interface ImportResultLine {
  line: number;
  error?: string;
  productId?: number;
}

export interface ImportResult {
  successCount: number;
  errorCount: number;
  errors: ImportResultLine[];
}

export const importProductsCsv = async (file: File): Promise<ImportResult> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<ImportResult>('/products/import', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// --- Variants ---
export interface VariantPayload {
  sku: string;
  priceOverride?: number;
  weight?: number;
  attributes: Record<string, string>;
  initialStock?: number;
}

export const createVariant = async (productId: number, payload: VariantPayload): Promise<ProductVariant> => {
  const { data } = await api.post<ProductVariant>(`/products/${productId}/variants`, payload);
  return data;
};

export const updateVariant = async (
  productId: number,
  variantId: number,
  payload: VariantPayload
): Promise<ProductVariant> => {
  const { data } = await api.put<ProductVariant>(`/products/${productId}/variants/${variantId}`, payload);
  return data;
};

export const deleteVariant = async (productId: number, variantId: number): Promise<void> => {
  await api.delete(`/products/${productId}/variants/${variantId}`);
};
