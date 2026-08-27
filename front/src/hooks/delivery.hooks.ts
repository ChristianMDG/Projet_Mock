import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  calculateDelivery,
  calculateTombanaFee,
  createDeliveryZone,
  deleteDeliveryZone,
  listDeliveryZones,
  updateDeliveryZone,
} from '@/api/delivery.api';
import type {
  DeliveryZone,
  DeliveryCalculationRequest,
  DeliveryCalculationResponse,
  TombanaFanaterana,
} from '@/types/delivery.types';

const DELIVERY_ZONES_KEY = ['delivery-zones'] as const;

export function useDeliveryZones(): UseQueryResult<DeliveryZone[], Error> {
  return useQuery({ queryKey: DELIVERY_ZONES_KEY, queryFn: listDeliveryZones });
}

export function useCreateDeliveryZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<DeliveryZone>) => createDeliveryZone(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DELIVERY_ZONES_KEY });
    },
  });
}

export function useUpdateDeliveryZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<DeliveryZone> }) => updateDeliveryZone(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DELIVERY_ZONES_KEY });
    },
  });
}

export function useDeleteDeliveryZone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDeliveryZone(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DELIVERY_ZONES_KEY });
    },
  });
}

export function useCalculateDelivery() {
  return useMutation<DeliveryCalculationResponse, Error, DeliveryCalculationRequest>({
    mutationFn: request => calculateDelivery(request),
  });
}

const DEFAULT_DELIVERY_FEE = 5000;

/**
 * Fetches the distance-based delivery fee for a given destination ville.
 * Automatically re-fetches when villeId or weight changes.
 * Falls back to DEFAULT_DELIVERY_FEE (5 000 Ar) when the API is unavailable.
 */
export function useTombanaFee(villeId: number | undefined, weight: number): UseQueryResult<TombanaFanaterana, Error> {
  return useQuery<TombanaFanaterana, Error>({
    queryKey: ['tombana-fee', villeId, weight],
    queryFn: () => calculateTombanaFee(villeId!, weight),
    enabled: Boolean(villeId),
    placeholderData: { frais: DEFAULT_DELIVERY_FEE },
    staleTime: 5 * 60 * 1000, // 5 min — distance fees are stable
  });
}
