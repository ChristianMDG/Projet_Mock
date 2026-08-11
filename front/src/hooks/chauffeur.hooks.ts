import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  createChauffeur,
  deleteChauffeur,
  getChauffeurs,
  getChauffeursByKoperative,
  updateChauffeur,
} from '@/api/chauffeur.api';
import { Chauffeur } from '@/models/Chauffeur';

export const useChauffeurs = (): UseQueryResult<Chauffeur[], Error> => {
  return useQuery({
    queryKey: ['chauffeurs'],
    queryFn: getChauffeurs,
  });
};

export const useChauffeursByKoperative = (koperativeId: number): UseQueryResult<Chauffeur[], Error> => {
  return useQuery({
    queryKey: ['chauffeurs', 'koperative', koperativeId],
    queryFn: () => getChauffeursByKoperative(koperativeId),
    enabled: !!koperativeId,
  });
};

export const useGetAvailableChauffeurs = (): UseQueryResult<Chauffeur[], Error> => {
  return useQuery({
    queryKey: ['chauffeurs', 'available'],
    queryFn: () => getChauffeurs().then(chauffeurs => chauffeurs.filter(c => c.isAvailable)),
  });
};

export const useCreateChauffeur = (koperativeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chauffeur: Partial<Chauffeur>) => createChauffeur(chauffeur),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['chauffeurs'] });
      await queryClient.invalidateQueries({ queryKey: ['chauffeurs', 'koperative', koperativeId] });
      await queryClient.invalidateQueries({ queryKey: ['koperatives', koperativeId] });
    },
  });
};

export const useUpdateChauffeur = (koperativeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, chauffeur }: { id: number; chauffeur: Partial<Chauffeur> }) => updateChauffeur(id, chauffeur),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['chauffeurs'] });
      await queryClient.invalidateQueries({ queryKey: ['chauffeurs', 'koperative', koperativeId] });
      await queryClient.invalidateQueries({ queryKey: ['koperatives', koperativeId] });
    },
  });
};

export const useDeleteChauffeur = (koperativeId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chauffeurId: number) => deleteChauffeur(chauffeurId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['chauffeurs'] });
      await queryClient.invalidateQueries({ queryKey: ['chauffeurs', 'koperative', koperativeId] });
      await queryClient.invalidateQueries({ queryKey: ['koperatives', koperativeId] });
      await queryClient.invalidateQueries({ queryKey: ['contrats'] });
    },
  });
};
