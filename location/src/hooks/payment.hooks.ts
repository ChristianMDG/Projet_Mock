import { useQuery } from '@tanstack/react-query';

import { checkPaymentStatus } from '../api/payment.api';

export const usePaymentStatusPolling = (operatorName: string | undefined, transactionReference: string | undefined) => {
  return useQuery({
    queryKey: ['paymentStatus', operatorName, transactionReference],
    queryFn: () => checkPaymentStatus(operatorName!, transactionReference!),
    enabled: !!operatorName && !!transactionReference,
    refetchInterval: query => {
      const status = query.state?.data?.status;
      if (status && ['COMPLETED', 'FAILED', 'TIMEOUT', 'CANCELLED'].includes(status)) {
        return false; // Stop polling
      }
      return 3000;
    },
    retry: false,
  });
};
