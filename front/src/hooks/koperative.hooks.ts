import { Koperative } from '@/models/Koperative';
import { Ville } from '@/models/Ville';
import { Crafter } from '@/models/Crafter';
import { Guichet } from '@/models/Guichet';
import { Chauffeur } from '@/models/Chauffeur';
import { KoperativeFilter } from '@/types/type.util';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  countKoperatives,
  createKoperative,
  deleteKoperative,
  getKoperative,
  getKoperativeBySlug,
  getKoperativeChauffeurs,
  getKoperativeCrafters,
  getKoperativeGuichets,
  getKoperatives,
  getKoperativesByVoyageurId,
  getKoperativeVilles,
  updateKoperative,
  updateKoperativeChauffeurs,
  updateKoperativeVilles,
} from '@/api/koperative.api';

export function useCreateKoperative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (koperative: Partial<Koperative>) => createKoperative(koperative),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['koperatives'] });
    },
  });
}

export function useKoperatives(filter?: Partial<KoperativeFilter>): UseQueryResult<Koperative[], Error> {
  return useQuery<Koperative[], Error>({
    queryKey: ['koperatives', filter],
    queryFn: () => getKoperatives(filter),
  });
}

export function useKoperativesCount(): UseQueryResult<number, Error> {
  return useQuery<number, Error>({
    queryKey: ['koperatives', 'count'],
    queryFn: () => countKoperatives(),
  });
}

export function useTopKoperatives(filter?: Partial<KoperativeFilter>): UseQueryResult<Koperative[], Error> {
  return useQuery<Koperative[], Error>({
    queryKey: ['topKoperatives', filter],
    queryFn: () => {
      const hasFilter = (filter?.ville?.length ?? 0) > 0 || Boolean(filter?.name);
      return getKoperatives(hasFilter ? filter : { top: 4 });
    },
  });
}

export function useKoperative(koperativeId: number): UseQueryResult<Koperative, Error> {
  return useQuery<Koperative, Error>({
    queryKey: ['koperative', koperativeId],
    queryFn: () => getKoperative(koperativeId),
    enabled: Boolean(koperativeId),
  });
}

export function useKoperativeBySlug(slug?: string): UseQueryResult<Koperative, Error> {
  return useQuery<Koperative, Error>({
    queryKey: ['koperative', 'slug', slug],
    queryFn: () => getKoperativeBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });
}

export function useKoperativeVilles(koperativeId: number): UseQueryResult<Ville[], Error> {
  return useQuery<Ville[], Error>({
    queryKey: ['koperative', koperativeId, 'villes'],
    queryFn: () => getKoperativeVilles(koperativeId),
    enabled: Boolean(koperativeId),
  });
}

export function useKoperativeCrafters(koperativeId: number): UseQueryResult<Crafter[], Error> {
  return useQuery<Crafter[], Error>({
    queryKey: ['koperative', koperativeId, 'crafters'],
    queryFn: () => getKoperativeCrafters(koperativeId),
    enabled: Boolean(koperativeId),
  });
}

export function useKoperativeGuichets(koperativeId: number): UseQueryResult<Guichet[], Error> {
  return useQuery<Guichet[], Error>({
    queryKey: ['koperative', koperativeId, 'guichets'],
    queryFn: () => getKoperativeGuichets(koperativeId),
    enabled: Boolean(koperativeId),
  });
}

export function useKoperativeChauffeurs(koperativeId: number): UseQueryResult<Chauffeur[], Error> {
  return useQuery<Chauffeur[], Error>({
    queryKey: ['koperative', koperativeId, 'chauffeurs'],
    queryFn: () => getKoperativeChauffeurs(koperativeId),
    enabled: Boolean(koperativeId),
  });
}

export function useUpdateKoperative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, koperative }: { id: number; koperative: Partial<Koperative> }) =>
      updateKoperative(id, koperative),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['koperatives'] });
    },
  });
}

export function useUpdateKoperativeVilles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, villes }: { id: number; villes: Ville[] }) => updateKoperativeVilles(id, villes),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ['koperative', id, 'villes'] });
      await queryClient.invalidateQueries({ queryKey: ['koperative', id] });
      await queryClient.invalidateQueries({ queryKey: ['koperatives'] });
      await queryClient.invalidateQueries({ queryKey: ['voyages', 'filtered'] });
      await queryClient.invalidateQueries({ queryKey: ['voyages'] });
    },
    onError: (error: Error) => {
      console.error('Error updating koperative villes:', error);
    },
  });
}

export function useUpdateKoperativeChauffeurs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, chauffeurs }: { id: number; chauffeurs: Chauffeur[] }) =>
      updateKoperativeChauffeurs(id, chauffeurs),
    onSuccess: async (_, { id }) => {
      await queryClient.invalidateQueries({ queryKey: ['koperative', id, 'chauffeurs'] });
      await queryClient.invalidateQueries({ queryKey: ['koperative', id] });
      await queryClient.invalidateQueries({ queryKey: ['koperatives'] });
    },
    onError: (error: Error) => {
      console.error('Error updating koperative chauffeurs:', error);
    },
  });
}

export function useDeleteKoperative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteKoperative(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['koperatives'] });
    },
  });
}

// hooks for getting user favorites koperatives
export const useKoperativesByVoyageurId = (voyageurId: number) => {
  return useQuery<Koperative[]>({
    queryKey: ['koperatives', voyageurId],
    queryFn: () => getKoperativesByVoyageurId(voyageurId),
    enabled: !!voyageurId,
  });
};
