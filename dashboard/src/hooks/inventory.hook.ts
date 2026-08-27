import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adjustInventory,
  getInventoryHistory,
  listInventory,
  listLowStock,
  type InventoryAdjustPayload,
} from '@/api/inventory.api';

export const inventoryKeys = {
  all: ['shop', 'inventory'] as const,
  list: () => [...inventoryKeys.all, 'list'] as const,
  lowStock: () => [...inventoryKeys.all, 'low-stock'] as const,
  history: (id: number) => [...inventoryKeys.all, 'history', id] as const,
};

export const useInventory = (lowStockOnly = false) =>
  useQuery({
    queryKey: lowStockOnly ? inventoryKeys.lowStock() : inventoryKeys.list(),
    queryFn: () => (lowStockOnly ? listLowStock() : listInventory()),
    staleTime: 15_000,
  });

export const useInventoryHistory = (id: number | null) =>
  useQuery({
    queryKey: inventoryKeys.history(id ?? 0),
    queryFn: () => getInventoryHistory(id as number),
    enabled: Boolean(id && id > 0),
  });

export const useAdjustInventory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: InventoryAdjustPayload }) => adjustInventory(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: inventoryKeys.all }),
  });
};
