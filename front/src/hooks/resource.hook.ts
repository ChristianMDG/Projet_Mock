import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { addResource, deleteResource, getResources, ResourceRow, updateResource } from '@/api/resource.api';

export const useResources = (): UseQueryResult<ResourceRow[], Error> => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: getResources,
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, resource }: { id: number; resource: Omit<ResourceRow, 'id'> }) => updateResource(id, resource),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

export const useAddResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resource: Omit<ResourceRow, 'id'>) => addResource(resource),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteResource(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};
