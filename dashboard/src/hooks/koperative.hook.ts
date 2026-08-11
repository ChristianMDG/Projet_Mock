import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getKoperatives,
  getKoperativeById,
  getKoperativeCrafters,
  getKoperativeGuichets,
  getKoperativeChauffeurs,
  createKoperative,
  assignGareToKoperative,
} from '@/api/koperative.api';
import type { CreateKoperativePayload, AssignGarePayload } from '@/types/koperative.types';

export const koperativeKeys = {
  all: ['koperatives'] as const,
  list: () => [...koperativeKeys.all, 'list'] as const,
  detail: (id: number) => [...koperativeKeys.all, 'detail', id] as const,
  crafters: (id: number) => [...koperativeKeys.all, 'crafters', id] as const,
  guichets: (id: number) => [...koperativeKeys.all, 'guichets', id] as const,
  chauffeurs: (id: number) => [...koperativeKeys.all, 'chauffeurs', id] as const,
};

export const useKoperatives = () => {
  return useQuery({
    queryKey: koperativeKeys.list(),
    queryFn: getKoperatives,
    staleTime: 1000 * 60 * 5,
  });
};

export const useKoperativeDetail = (id: number) => {
  return useQuery({
    queryKey: koperativeKeys.detail(id),
    queryFn: () => getKoperativeById(id),
    enabled: id > 0,
  });
};

export const useKoperativeCrafters = (id: number) => {
  return useQuery({
    queryKey: koperativeKeys.crafters(id),
    queryFn: () => getKoperativeCrafters(id),
    enabled: id > 0,
  });
};

export const useKoperativeGuichets = (id: number) => {
  return useQuery({
    queryKey: koperativeKeys.guichets(id),
    queryFn: () => getKoperativeGuichets(id),
    enabled: id > 0,
  });
};

export const useKoperativeChauffeurs = (id: number) => {
  return useQuery({
    queryKey: koperativeKeys.chauffeurs(id),
    queryFn: () => getKoperativeChauffeurs(id),
    enabled: id > 0,
  });
};

export const useCreateKoperative = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateKoperativePayload) => createKoperative(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: koperativeKeys.list() });
    },
  });
};

export const useAssignGare = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignGarePayload) => assignGareToKoperative(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: koperativeKeys.guichets(variables.koperativeId) });
    },
  });
};
