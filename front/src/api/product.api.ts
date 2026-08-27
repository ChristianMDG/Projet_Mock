import axios from './axios';
import type { Page, PageRequest } from '@/types/page.types';
import type { Product } from '@/models/Shop';
import type { ProductRoute, BulkImportResult, ProductSearchParams } from '@/types/shop-admin.types';

const API_URL = '/products';

const buildPageParams = (req?: PageRequest): Record<string, unknown> => {
  if (!req) return {};
  const params: Record<string, unknown> = {};
  if (typeof req.page === 'number') params.page = req.page;
  if (typeof req.size === 'number') params.size = req.size;
  if (req.sort) params.sort = req.sort;
  return params;
};

export const listProducts = async (page?: PageRequest): Promise<Page<Product>> => {
  const { data } = await axios.get<Page<Product>>(API_URL, { params: buildPageParams(page) });
  return data;
};

export const searchProducts = async (params: ProductSearchParams): Promise<Page<Product>> => {
  const { data } = await axios.get<Page<Product>>(`${API_URL}/search`, { params });
  return data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const { data } = await axios.get<Product>(`${API_URL}/${id}`);
  return data;
};

export const getProductsByVoyageRoute = async (routeSlug: string): Promise<Product[]> => {
  const { data } = await axios.get<Product[]>(`${API_URL}/by-voyage-route`, {
    params: { route: routeSlug },
  });
  return data;
};

export const createProduct = async (payload: Partial<Product>): Promise<Product> => {
  const { data } = await axios.post<Product>(API_URL, payload);
  return data;
};

export const updateProduct = async (id: number, payload: Partial<Product>): Promise<Product> => {
  const { data } = await axios.put<Product>(`${API_URL}/${id}`, payload);
  return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

export const importProducts = async (file: File, dryRun = false): Promise<BulkImportResult> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await axios.post<BulkImportResult>(`${API_URL}/import`, form, {
    params: { dryRun },
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const listProductRoutes = async (productId: number): Promise<ProductRoute[]> => {
  const { data } = await axios.get<ProductRoute[]>(`${API_URL}/${productId}/routes`);
  return data;
};

export const linkProductRoute = async (productId: number, payload: Partial<ProductRoute>): Promise<ProductRoute> => {
  const { data } = await axios.post<ProductRoute>(`${API_URL}/${productId}/routes`, payload);
  return data;
};

export const unlinkProductRoute = async (productId: number, routeId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${productId}/routes/${routeId}`);
};
