import { useQuery } from '@tanstack/react-query';
import {
  getGuichetsByKoperative,
  getGuichetsByGare,
  getGuichetByGareAndKoperative,
  getOperateursByKoperative,
} from '@/api/guichet.api';

export const guichetKeys = {
  all: ['guichets'] as const,
  byKoperative: (koperativeId: number) => [...guichetKeys.all, 'koperative', koperativeId] as const,
  byGare: (gareId: number) => [...guichetKeys.all, 'gare', gareId] as const,
  byGareKoperative: (gareId: number, koperativeId: number) =>
    [...guichetKeys.all, 'gare', gareId, 'koperative', koperativeId] as const,
  operateurs: (koperativeId: number) => [...guichetKeys.all, 'operateurs', koperativeId] as const,
};

export const useGuichetsByKoperative = (koperativeId: number | null) => {
  const safeId = koperativeId ?? 0;
  return useQuery({
    queryKey: guichetKeys.byKoperative(safeId),
    queryFn: () => getGuichetsByKoperative(safeId),
    enabled: safeId > 0,
    staleTime: 1000 * 60,
  });
};

export const useGuichetsByGare = (gareId: number | null) => {
  const safeId = gareId ?? 0;
  return useQuery({
    queryKey: guichetKeys.byGare(safeId),
    queryFn: () => getGuichetsByGare(safeId),
    enabled: safeId > 0,
  });
};

export const useGuichetByGareAndKoperative = (gareId: number | null, koperativeId: number | null) => {
  const safeGare = gareId ?? 0;
  const safeKop = koperativeId ?? 0;
  return useQuery({
    queryKey: guichetKeys.byGareKoperative(safeGare, safeKop),
    queryFn: () => getGuichetByGareAndKoperative(safeGare, safeKop),
    enabled: safeGare > 0 && safeKop > 0,
  });
};

export const useOperateursByKoperative = (koperativeId: number | null) => {
  const safeId = koperativeId ?? 0;
  return useQuery({
    queryKey: guichetKeys.operateurs(safeId),
    queryFn: () => getOperateursByKoperative(safeId),
    enabled: safeId > 0,
  });
};
