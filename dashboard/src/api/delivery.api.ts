import api from './axios';
import type { DeliveryZone, DeliveryZonePayload } from '@/types/shop.types';

export const listDeliveryZones = async (): Promise<DeliveryZone[]> => {
  const { data } = await api.get<DeliveryZone[]>('/delivery/zones');
  return data;
};

export const createDeliveryZone = async (payload: DeliveryZonePayload): Promise<DeliveryZone> => {
  const { data } = await api.post<DeliveryZone>('/delivery/zones', payload);
  return data;
};

export const updateDeliveryZone = async (id: number, payload: DeliveryZonePayload): Promise<DeliveryZone> => {
  const { data } = await api.put<DeliveryZone>(`/delivery/zones/${id}`, payload);
  return data;
};

export const deleteDeliveryZone = async (id: number): Promise<void> => {
  await api.delete(`/delivery/zones/${id}`);
};
