import { useMutation, useQuery, useQueryClient, UseQueryResult, skipToken } from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getCategoryTree,
  updateCategory,
} from '@/api/category.api';
import type { Category } from '@/types/category.types';

const CATEGORIES_KEY = ['categories'] as const;
const CATEGORY_TREE_KEY = ['categories', 'tree'] as const;

export function useCategories(): UseQueryResult<Category[], Error> {
  return useQuery({ queryKey: CATEGORIES_KEY, queryFn: getCategories, staleTime: 5 * 60 * 1000 });
}

export function useCategoryTree(): UseQueryResult<Category[], Error> {
  return useQuery({ queryKey: CATEGORY_TREE_KEY, queryFn: getCategoryTree, staleTime: 5 * 60 * 1000 });
}

export function useCategory(id?: number): UseQueryResult<Category, Error> {
  return useQuery({
    queryKey: ['category', id],
    queryFn: id === undefined ? skipToken : () => getCategory(id),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Category>) => createCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      await queryClient.invalidateQueries({ queryKey: CATEGORY_TREE_KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Category> }) => updateCategory(id, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      await queryClient.invalidateQueries({ queryKey: CATEGORY_TREE_KEY });
      await queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });
      await queryClient.invalidateQueries({ queryKey: CATEGORY_TREE_KEY });
    },
  });
}
