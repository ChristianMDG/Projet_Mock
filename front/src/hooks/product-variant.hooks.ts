import { useMutation, useQuery, useQueryClient, UseQueryResult, skipToken } from '@tanstack/react-query';
import {
  createProductVariant,
  deleteProductVariant,
  listProductVariants,
  updateProductVariant,
} from '@/api/product-variant.api';
import type { ProductVariant } from '@/types/shop-admin.types';

export function useProductVariants(productId?: number): UseQueryResult<ProductVariant[], Error> {
  return useQuery({
    queryKey: ['product-variants', productId],
    queryFn: productId === undefined ? skipToken : () => listProductVariants(productId),
  });
}

export function useCreateProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, payload }: { productId: number; payload: Partial<ProductVariant> }) =>
      createProductVariant(productId, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['product-variants', variables.productId] });
      await queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
}

export function useUpdateProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      payload,
    }: {
      productId: number;
      variantId: number;
      payload: Partial<ProductVariant>;
    }) => updateProductVariant(productId, variantId, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['product-variants', variables.productId] });
      await queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
}

export function useDeleteProductVariant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId }: { productId: number; variantId: number }) =>
      deleteProductVariant(productId, variantId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['product-variants', variables.productId] });
      await queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
    },
  });
}
