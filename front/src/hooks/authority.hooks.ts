import { useMutation, useQuery, useQueryClient, UseQueryResult, skipToken } from '@tanstack/react-query';
import { createAuthority, deleteAuthority, getAuthorities, getAuthority, updateAuthority } from '@/api/authority.api';
import { Authority } from '@/models/Authority';

const AUTHORITIES_KEY = ['authorities'] as const;

export function useAuthorities(): UseQueryResult<Authority[], Error> {
  return useQuery({
    queryKey: AUTHORITIES_KEY,
    queryFn: getAuthorities,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAuthority(id?: number): UseQueryResult<Authority, Error> {
  return useQuery({
    queryKey: ['authority', id],
    queryFn: id === undefined ? skipToken : () => getAuthority(id),
  });
}

export function useCreateAuthority() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (authority: Partial<Authority>) => createAuthority(authority),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTHORITIES_KEY });
    },
  });
}

export function useUpdateAuthority() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, authority }: { id: number; authority: Partial<Authority> }) => updateAuthority(id, authority),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: AUTHORITIES_KEY });
      await queryClient.invalidateQueries({ queryKey: ['authority', variables.id] });
    },
  });
}

export function useDeleteAuthority() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAuthority(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTHORITIES_KEY });
    },
  });
}
