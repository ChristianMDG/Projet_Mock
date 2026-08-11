import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: 1,
      },
    },
  });

export const queryClient = createQueryClient();
