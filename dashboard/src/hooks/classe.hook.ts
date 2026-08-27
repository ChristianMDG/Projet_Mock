import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getClasses,
  getClassesByKoperative,
  createClasse,
  updateClasse,
  deleteClasse,
  type CreateClassePayload,
  type UpdateClassePayload,
} from '@/api/classe.api';

export const classeKeys = {
  all: ['classes'] as const,
  list: () => [...classeKeys.all, 'list'] as const,
  byKoperative: (koperativeId: number) => [...classeKeys.all, 'koperative', koperativeId] as const,
};

export const useClasses = () => {
  return useQuery({
    queryKey: classeKeys.list(),
    queryFn: getClasses,
    staleTime: 1000 * 60 * 10,
  });
};

export const useClassesByKoperative = (koperativeId?: number) => {
  return useQuery({
    queryKey: classeKeys.byKoperative(koperativeId ?? 0),
    queryFn: () => {
      if (!koperativeId) throw new Error('koperativeId is required');
      return getClassesByKoperative(koperativeId);
    },
    enabled: Boolean(koperativeId),
  });
};

export const useCreateClasse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClassePayload) => createClasse(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classeKeys.all });
    },
  });
};

export const useUpdateClasse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateClassePayload }) => updateClasse(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classeKeys.all });
    },
  });
};

export const useDeleteClasse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteClasse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classeKeys.all });
    },
  });
};
