import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  addProductImage,
  deleteProductImage,
  listProductImages,
  setProductImagePrimary,
} from '@/api/product-image.api';
import type { ProductImage } from '@/types/shop-admin.types';

export function useProductImages(productId?: number): UseQueryResult<ProductImage[], Error> {
  return useQuery({
    queryKey: ['product-images', productId],
    queryFn: () => listProductImages(productId as number),
    enabled: Boolean(productId),
  });
}

export function useAddProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, payload }: { productId: number; payload: Partial<ProductImage> }) =>
      addProductImage(productId, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['product-images', variables.productId] });
      await queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
}

export function useSetProductImagePrimary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: number; imageId: number }) =>
      setProductImagePrimary(productId, imageId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['product-images', variables.productId] });
      await queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: number; imageId: number }) =>
      deleteProductImage(productId, imageId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['product-images', variables.productId] });
      await queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
}
