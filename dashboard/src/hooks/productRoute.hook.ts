import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addProductRoute, getProductRoutes, removeProductRoute } from '@/api/productRoute.api';
import type { ProductRoute, ProductRoutePayload } from '@/types/shop.types';

export const productRouteKeys = {
  all: ['shop', 'products'] as const,
  list: (productId: number) => ['shop', 'products', productId, 'routes'] as const,
};

export const useProductRoutes = (productId: number | null) =>
  useQuery<ProductRoute[]>({
    queryKey: productRouteKeys.list(productId ?? 0),
    queryFn: () => getProductRoutes(productId ?? 0),
    enabled: Boolean(productId && productId > 0),
    staleTime: 30_000,
  });

export const useAddProductRoute = (productId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductRoutePayload) => addProductRoute(productId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productRouteKeys.list(productId) });
    },
  });
};

export const useRemoveProductRoute = (productId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (routeId: number) => removeProductRoute(productId, routeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productRouteKeys.list(productId) });
    },
  });
};
