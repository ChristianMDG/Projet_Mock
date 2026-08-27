import { useQuery } from '@tanstack/react-query';
import { getPaymentKoperativeByVoyage } from '@/api/payment-koperative.api';

export const paymentKoperativeKeys = {
  all: ['payments-koperative'] as const,
  byVoyage: (voyageId: number | null) => [...paymentKoperativeKeys.all, 'voyage', voyageId] as const,
};

/**
 * Fetch/Query cooperative payment by Voyage ID
 */
export const usePaymentKoperativeByVoyage = (voyageId: number | null) => {
  return useQuery({
    queryKey: paymentKoperativeKeys.byVoyage(voyageId),
    queryFn: () => getPaymentKoperativeByVoyage(voyageId!),
    enabled: Boolean(voyageId && voyageId > 0),
    staleTime: 1000 * 30, // 30 seconds
  });
};
