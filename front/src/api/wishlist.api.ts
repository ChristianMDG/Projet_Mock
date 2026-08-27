import axios from './axios';
import type { AddWishlistItemRequest, Wishlist } from '@/types/wishlist.types';

const API_URL = '/wishlist';

export const getWishlist = async (): Promise<Wishlist> => {
  const { data } = await axios.get<Wishlist>(API_URL);
  return data;
};

export const addWishlistItem = async (request: AddWishlistItemRequest): Promise<Wishlist> => {
  const { data } = await axios.post<Wishlist>(`${API_URL}/items`, request);
  return data;
};

export const removeWishlistItem = async (itemId: number): Promise<Wishlist> => {
  const { data } = await axios.delete<Wishlist>(`${API_URL}/items/${itemId}`);
  return data;
};
