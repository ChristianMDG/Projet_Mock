import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProductCategory,
  deleteProductCategory,
  getProductCategory,
  listProductCategories,
  listProductCategoriesByCategory,
  reorderProductCategories,
  updateProductCategory,
} from '@/api/productCategory.api';
import type { ProductCategoryPayload, ProductCategoryReorderItem } from '@/types/shop.types';

export const productCategoryKeys = {
  all: ['shop', 'product-categories'] as const,
  list: () => [...productCategoryKeys.all, 'list'] as const,
  byCategory: (categoryId: number) => [...productCategoryKeys.all, 'by-category', categoryId] as const,
  detail: (id: number) => [...productCategoryKeys.all, 'detail', id] as const,
};

export const useProductCategories = () =>
  useQuery({ queryKey: productCategoryKeys.list(), queryFn: listProductCategories });

export const useProductCategoriesByCategory = (categoryId: number | undefined) =>
  useQuery({
    queryKey: productCategoryKeys.byCategory(categoryId ?? 0),
    queryFn: () => listProductCategoriesByCategory(categoryId as number),
    enabled: Boolean(categoryId),
  });

export const useProductCategory = (id: number | undefined) =>
  useQuery({
    queryKey: productCategoryKeys.detail(id ?? 0),
    queryFn: () => getProductCategory(id as number),
    enabled: Boolean(id),
  });

export const useCreateProductCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductCategoryPayload) => createProductCategory(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productCategoryKeys.all }),
  });
};

export const useUpdateProductCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductCategoryPayload }) =>
      updateProductCategory(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productCategoryKeys.all }),
  });
};

export const useDeleteProductCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProductCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productCategoryKeys.all }),
  });
};

export const useReorderProductCategories = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: ProductCategoryReorderItem[]) => reorderProductCategories(items),
    onSuccess: () => qc.invalidateQueries({ queryKey: productCategoryKeys.all }),
  });
};
