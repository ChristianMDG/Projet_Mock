import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { getCurrentUser, getOperatorsByKoperative, getUsers, updateUserAccount } from '@/api/user.api';
import { useAuthStore } from '@/stores/auth.store';
import type { UserOperator } from '@/models/UserOperator';

export function useUsers(search?: string) {
  return useQuery<UserOperator[], Error>({
    queryKey: ['users', search],
    queryFn: () => getUsers(search),
  });
}

export function useOperatorsByKoperative(koperativeId: number | undefined) {
  return useQuery<UserOperator[], Error>({
    queryKey: ['operators', koperativeId],
    queryFn: () => getOperatorsByKoperative(koperativeId as number),
    enabled: !!koperativeId, // Only run the query if koperativeId exists
  });
}

/**
 * Hook to get and refresh the connected user data
 * Will only fetch from API if editKoperative is false
 */
export function useUserConnected({ editKoperative = false }: { editKoperative?: boolean } = {}) {
  const { setUser, user, isAuthenticated } = useAuthStore();
  const query = useQuery<UserOperator, Error>({
    queryKey: ['currentUser', user?.id],
    queryFn: getCurrentUser,
    enabled: !editKoperative && isAuthenticated,
    initialData: user as UserOperator | undefined,
  });
  React.useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);
  return query;
}

/**
 * Hook to update user account information
 */
export function useUpdateUserAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, accountData }: { id: number; accountData: Partial<UserOperator> }) =>
      updateUserAccount(id, accountData),
    onSuccess: async (response, variables) => {
      // Invalidate and refetch current user data
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      await queryClient.invalidateQueries({ queryKey: ['operators'] });
      if (variables.accountData.koperative?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['koperative', variables.accountData.koperative.id, 'guichets'],
        });
      }
      return response; // Return the success message
    },
  });
}
