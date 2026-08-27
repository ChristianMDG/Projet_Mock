import axios from './axios';
import type {
  DeliveryZone,
  DeliveryCalculationRequest,
  DeliveryCalculationResponse,
  TombanaFanaterana,
} from '@/types/delivery.types';

const API_URL = '/delivery';
const TOMBANA_URL = '/tombana-fanaterana';

export const listDeliveryZones = async (): Promise<DeliveryZone[]> => {
  const { data } = await axios.get<DeliveryZone[]>(`${API_URL}/zones`);
  return data;
};

export const createDeliveryZone = async (payload: Partial<DeliveryZone>): Promise<DeliveryZone> => {
  const { data } = await axios.post<DeliveryZone>(`${API_URL}/zones`, payload);
  return data;
};

export const updateDeliveryZone = async (id: number, payload: Partial<DeliveryZone>): Promise<DeliveryZone> => {
  const { data } = await axios.put<DeliveryZone>(`${API_URL}/zones/${id}`, payload);
  return data;
};

export const deleteDeliveryZone = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/zones/${id}`);
};

export const calculateDelivery = async (request: DeliveryCalculationRequest): Promise<DeliveryCalculationResponse> => {
  const { data } = await axios.post<DeliveryCalculationResponse>(`${API_URL}/calculate`, request);
  return data;
};

export const calculateTombanaFee = async (
  villeId: number,
  weight: number,
  method = 'STANDARD',
): Promise<TombanaFanaterana> => {
  const { data } = await axios.get<TombanaFanaterana>(`${TOMBANA_URL}/calculate`, {
    params: { villeId, method, weight },
  });
  return data;
};
