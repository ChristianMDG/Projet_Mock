import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { addCartItem, getCart, mergeCart, removeCartItem, updateCartItem } from '@/api/cart.api';
import type { AddCartItemRequest, Cart, UpdateCartItemRequest } from '@/types/cart.types';

const CART_KEY = ['cart'] as const;

export function useCart(): UseQueryResult<Cart, Error> {
  return useQuery({ queryKey: CART_KEY, queryFn: getCart });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddCartItemRequest) => addCartItem(request),
    onSuccess: data => {
      queryClient.setQueryData(CART_KEY, data);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, request }: { itemId: number; request: UpdateCartItemRequest }) =>
      updateCartItem(itemId, request),
    onSuccess: data => {
      queryClient.setQueryData(CART_KEY, data);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => removeCartItem(itemId),
    onSuccess: data => {
      queryClient.setQueryData(CART_KEY, data);
    },
  });
}

export function useMergeCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => mergeCart(),
    onSuccess: data => {
      queryClient.setQueryData(CART_KEY, data);
    },
  });
}
