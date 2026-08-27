import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDeliveryZone, deleteDeliveryZone, listDeliveryZones, updateDeliveryZone } from '@/api/delivery.api';
import type { DeliveryZonePayload } from '@/types/shop.types';

export const deliveryKeys = {
  all: ['shop', 'delivery'] as const,
  zones: () => [...deliveryKeys.all, 'zones'] as const,
};

export const useDeliveryZones = () => useQuery({ queryKey: deliveryKeys.zones(), queryFn: listDeliveryZones });

export const useCreateDeliveryZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeliveryZonePayload) => createDeliveryZone(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
};

export const useUpdateDeliveryZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DeliveryZonePayload }) => updateDeliveryZone(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
};

export const useDeleteDeliveryZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDeliveryZone(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: deliveryKeys.all }),
  });
};
