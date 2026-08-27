import { useMutation, useQuery, useQueryClient, UseQueryResult, skipToken } from '@tanstack/react-query';
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategories,
  getProductCategoriesByCategory,
  getProductCategory,
  reorderProductCategories,
  updateProductCategory,
} from '@/api/product-category.api';
import type { ProductCategory, CategoryReorderRequest } from '@/types/category.types';

const PRODUCT_CATEGORIES_KEY = ['product-categories'] as const;

export function useProductCategories(): UseQueryResult<ProductCategory[], Error> {
  return useQuery({
    queryKey: PRODUCT_CATEGORIES_KEY,
    queryFn: getProductCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductCategoriesByCategory(categoryId?: number): UseQueryResult<ProductCategory[], Error> {
  return useQuery({
    queryKey: ['product-categories', 'by-category', categoryId],
    queryFn: categoryId === undefined ? skipToken : () => getProductCategoriesByCategory(categoryId),
  });
}

export function useProductCategory(id?: number): UseQueryResult<ProductCategory, Error> {
  return useQuery({
    queryKey: ['product-category', id],
    queryFn: id === undefined ? skipToken : () => getProductCategory(id),
  });
}

export function useCreateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ProductCategory>) => createProductCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCT_CATEGORIES_KEY });
    },
  });
}

export function useUpdateProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductCategory> }) =>
      updateProductCategory(id, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: PRODUCT_CATEGORIES_KEY });
      await queryClient.invalidateQueries({ queryKey: ['product-category', variables.id] });
    },
  });
}

export function useReorderProductCategories() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CategoryReorderRequest) => reorderProductCategories(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCT_CATEGORIES_KEY });
    },
  });
}

export function useDeleteProductCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProductCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PRODUCT_CATEGORIES_KEY });
    },
  });
}
