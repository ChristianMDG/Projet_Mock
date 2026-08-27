import api from './axios';
import type { InventoryItem, InventoryLog } from '@/types/shop.types';

export const listInventory = async (): Promise<InventoryItem[]> => {
  const { data } = await api.get<InventoryItem[]>('/inventory');
  return data;
};

export const listLowStock = async (): Promise<InventoryItem[]> => {
  const { data } = await api.get<InventoryItem[]>('/inventory/low-stock');
  return data;
};

export interface InventoryAdjustPayload {
  quantity: number;
  reason: string;
}

export const adjustInventory = async (id: number, payload: InventoryAdjustPayload): Promise<InventoryItem> => {
  const { data } = await api.put<InventoryItem>(`/inventory/${id}`, payload);
  return data;
};

export const getInventoryHistory = async (id: number): Promise<InventoryLog[]> => {
  const { data } = await api.get<InventoryLog[]>(`/inventory/${id}/history`);
  return data;
};
