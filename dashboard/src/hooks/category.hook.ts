import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategoryTree,
  listCategories,
  updateCategory,
} from '@/api/category.api';
import type { CategoryPayload } from '@/types/shop.types';
import { productCategoryKeys } from './productCategory.hook';

export const categoryKeys = {
  all: ['shop', 'top-categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  detail: (id: number) => [...categoryKeys.all, 'detail', id] as const,
};

export const useCategories = () => useQuery({ queryKey: categoryKeys.list(), queryFn: listCategories });

export const useCategoryTree = () => useQuery({ queryKey: categoryKeys.tree(), queryFn: getCategoryTree });

export const useCategory = (id: number | undefined) =>
  useQuery({
    queryKey: categoryKeys.detail(id ?? 0),
    queryFn: () => getCategoryById(id as number),
    enabled: Boolean(id),
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      qc.invalidateQueries({ queryKey: productCategoryKeys.all });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CategoryPayload }) => updateCategory(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      qc.invalidateQueries({ queryKey: productCategoryKeys.all });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      qc.invalidateQueries({ queryKey: productCategoryKeys.all });
    },
  });
};
