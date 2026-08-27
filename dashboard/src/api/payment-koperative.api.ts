import api from './axios';
import type { PaymentKoperative } from '@/types/payment-koperative.types';

const BASE = '/payments-koperative';

/**
 * Get or create cooperative payment by Voyage ID
 */
export const getPaymentKoperativeByVoyage = async (voyageId: number): Promise<PaymentKoperative> => {
  const { data } = await api.get<PaymentKoperative>(`${BASE}/voyage/${voyageId}`);
  return data;
};
