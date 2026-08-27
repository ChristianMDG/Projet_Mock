import { useMutation, useQuery, useQueryClient, UseQueryResult, skipToken } from '@tanstack/react-query';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductsByVoyageRoute,
  importProducts,
  linkProductRoute,
  listProductRoutes,
  listProducts,
  searchProducts,
  unlinkProductRoute,
  updateProduct,
} from '@/api/product.api';
import type { Page, PageRequest } from '@/types/page.types';
import type { Product } from '@/models/Shop';
import type { ProductRoute, BulkImportResult, ProductSearchParams } from '@/types/shop-admin.types';

const PRODUCTS_KEY = ['products'] as const;

export function useProducts(page?: PageRequest): UseQueryResult<Page<Product>, Error> {
  return useQuery({
    queryKey: ['products', 'list', page],
    queryFn: () => listProducts(page),
  });
}

export function useSearchProducts(params: ProductSearchParams, enabled = true): UseQueryResult<Page<Product>, Error> {
  return useQuery({
    queryKey: ['products', 'search', params],
    queryFn: () => searchProducts(params),
    enabled,
  });
}

export function useProduct(id?: number): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: ['product', id],
    queryFn: id === undefined ? skipToken : () => getProduct(id),
  });
}

export function useProductsByVoyageRoute(routeSlug?: string): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products', 'by-voyage-route', routeSlug],
    queryFn: routeSlug === undefined ? skipToken : () => getProductsByVoyageRoute(routeSlug),
  });
}

const invalidateProductCollections = (queryClient: ReturnType<typeof useQueryClient>) => {
  return queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
};

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Product>) => createProduct(payload),
    onSuccess: () => invalidateProductCollections(queryClient),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Product> }) => updateProduct(id, payload),
    onSuccess: async (_data, variables) => {
      await invalidateProductCollections(queryClient);
      await queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => invalidateProductCollections(queryClient),
  });
}

export function useImportProducts() {
  const queryClient = useQueryClient();
  return useMutation<BulkImportResult, Error, { file: File; dryRun?: boolean }>({
    mutationFn: ({ file, dryRun }) => importProducts(file, dryRun),
    onSuccess: () => invalidateProductCollections(queryClient),
  });
}

export function useProductRoutes(productId?: number): UseQueryResult<ProductRoute[], Error> {
  return useQuery({
    queryKey: ['product-routes', productId],
    queryFn: productId === undefined ? skipToken : () => listProductRoutes(productId),
  });
}

export function useLinkProductRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, payload }: { productId: number; payload: Partial<ProductRoute> }) =>
      linkProductRoute(productId, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['product-routes', variables.productId] });
    },
  });
}

export function useUnlinkProductRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, routeId }: { productId: number; routeId: number }) =>
      unlinkProductRoute(productId, routeId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['product-routes', variables.productId] });
    },
  });
}
