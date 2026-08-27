import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { addWishlistItem, getWishlist, removeWishlistItem } from '@/api/wishlist.api';
import type { AddWishlistItemRequest, Wishlist } from '@/types/wishlist.types';

const WISHLIST_KEY = ['wishlist'] as const;

export function useWishlist(enabled = true): UseQueryResult<Wishlist, Error> {
  return useQuery({ queryKey: WISHLIST_KEY, queryFn: getWishlist, enabled });
}

export function useAddWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddWishlistItemRequest) => addWishlistItem(request),
    onSuccess: data => {
      queryClient.setQueryData(WISHLIST_KEY, data);
    },
  });
}

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => removeWishlistItem(itemId),
    onSuccess: data => {
      queryClient.setQueryData(WISHLIST_KEY, data);
    },
  });
}
