import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  createVariant,
  deleteProduct,
  deleteVariant,
  importProductsCsv,
  listProducts,
  setPrimaryImage,
  updateProduct,
  updateVariant,
  uploadProductImage,
  type VariantPayload,
} from '@/api/product.api';
import type { ProductPayload } from '@/types/shop.types';

export const productKeys = {
  all: ['shop', 'products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
};

export const useProducts = () => useQuery({ queryKey: productKeys.lists(), queryFn: listProducts, staleTime: 30_000 });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductPayload }) => updateProduct(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
};

export const useUploadProductImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, file }: { productId: number; file: File }) => uploadProductImage(productId, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
};

export const useSetPrimaryImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: number; imageId: number }) => setPrimaryImage(productId, imageId),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
};

export const useImportProductsCsv = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => importProductsCsv(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
};

export const useCreateVariant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, payload }: { productId: number; payload: VariantPayload }) =>
      createVariant(productId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
};

export const useUpdateVariant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      payload,
    }: {
      productId: number;
      variantId: number;
      payload: VariantPayload;
    }) => updateVariant(productId, variantId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
};

export const useDeleteVariant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, variantId }: { productId: number; variantId: number }) =>
      deleteVariant(productId, variantId),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
};
