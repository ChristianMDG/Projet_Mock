import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Optimized for slow 4G connections
        staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes (reduced from 50)
        gcTime: 1000 * 60 * 30, // Cache for 30 minutes (reduced from 60 to free memory faster)
        retry: 2, // Retry failed requests 2 times (increased from 1 for flaky connections)
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff, max 10s
        refetchOnWindowFocus: false, // Don't refetch on window focus (save bandwidth)
        refetchOnReconnect: true, // Refetch when connection is restored
        refetchOnMount: false, // Don't refetch if data is fresh
        networkMode: 'online', // Only fetch when online
      },
      mutations: {
        retry: 1, // Retry mutations once on slow connections
        networkMode: 'online',
      },
    },
  });

export const queryClient = createQueryClient();
