import axios from './axios';
import { cartSenderHeaders } from '@/utils/cartSession';
import type { AddCartItemRequest, Cart, UpdateCartItemRequest } from '@/types/cart.types';

const API_URL = '/cart';

export const getCart = async (): Promise<Cart> => {
  const { data } = await axios.get<Cart>(API_URL, { headers: cartSenderHeaders() });
  return data;
};

export const addCartItem = async (request: AddCartItemRequest): Promise<Cart> => {
  const { data } = await axios.post<Cart>(`${API_URL}/items`, request, {
    headers: cartSenderHeaders(),
  });
  return data;
};

export const updateCartItem = async (itemId: number, request: UpdateCartItemRequest): Promise<Cart> => {
  const { data } = await axios.put<Cart>(`${API_URL}/items/${itemId}`, request, {
    headers: cartSenderHeaders(),
  });
  return data;
};

export const removeCartItem = async (itemId: number): Promise<Cart> => {
  const { data } = await axios.delete<Cart>(`${API_URL}/items/${itemId}`, {
    headers: cartSenderHeaders(),
  });
  return data;
};

export const mergeCart = async (): Promise<Cart> => {
  const { data } = await axios.post<Cart>(`${API_URL}/merge`, null, {
    headers: cartSenderHeaders(),
  });
  return data;
};
