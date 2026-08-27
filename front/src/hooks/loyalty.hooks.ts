import { useQuery } from '@tanstack/react-query';
import { getLoyaltyView, LoyaltyView } from '@/api/loyalty.api';

export const useLoyaltyView = (voyageurId?: number) => {
  return useQuery<LoyaltyView>({
    queryKey: ['loyalty', voyageurId],
    queryFn: () => getLoyaltyView(voyageurId as number),
    enabled: Boolean(voyageurId),
  });
};
