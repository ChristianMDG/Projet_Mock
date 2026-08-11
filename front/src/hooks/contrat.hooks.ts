import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { createContrat, deleteContrat, getContrat, getContrats, updateContrat } from '@/api/contrat.api';
import { Contrat } from '@/models/Contrat';

export function useContrats(): UseQueryResult<Contrat[], Error> {
  return useQuery({
    queryKey: ['contrats'],
    queryFn: getContrats,
  });
}

export function useContrat(id: number): UseQueryResult<Contrat, Error> {
  return useQuery({
    queryKey: ['contrat', id],
    queryFn: () => getContrat(id),
    enabled: !!id,
  });
}

export function useCreateContrat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contrat: Partial<Contrat>) => createContrat(contrat),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contrats'] });
    },
  });
}

export function useUpdateContrat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, contrat }: { id: number; contrat: Partial<Contrat> }) => updateContrat(id, contrat),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contrats'] });
    },
  });
}

export function useDeleteContrat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteContrat(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['contrats'] });
    },
  });
}
