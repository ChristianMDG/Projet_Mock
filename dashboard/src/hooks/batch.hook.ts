import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBatchStatus, pauseBatch, playBatch, runBatchNow } from '../api/batch.api';
import { useNotifications } from '@toolpad/core/useNotifications';

export const useBatchStatus = () => {
  return useQuery({
    queryKey: ['batchStatus'],
    queryFn: getBatchStatus,
  });
};

export const usePauseBatch = () => {
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  return useMutation({
    mutationFn: pauseBatch,
    onSuccess: (data) => {
      queryClient.setQueryData(['batchStatus'], { enabled: data.enabled });
      notifications.show(data.message, { severity: 'success', autoHideDuration: 3000 });
    },
    onError: () =>
      notifications.show('Erreur lors de la mise en pause du batch', { severity: 'error', autoHideDuration: 3000 }),
  });
};

export const usePlayBatch = () => {
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  return useMutation({
    mutationFn: playBatch,
    onSuccess: (data) => {
      queryClient.setQueryData(['batchStatus'], { enabled: data.enabled });
      notifications.show(data.message, { severity: 'success', autoHideDuration: 3000 });
    },
    onError: () =>
      notifications.show('Erreur lors de la reprise du batch', { severity: 'error', autoHideDuration: 3000 }),
  });
};

export const useRunBatchNow = () => {
  const notifications = useNotifications();
  return useMutation({
    mutationFn: runBatchNow,
    onSuccess: (data) => notifications.show(data.message, { severity: 'success', autoHideDuration: 3000 }),
    onError: () =>
      notifications.show("Erreur lors de l'exécution manuelle", { severity: 'error', autoHideDuration: 3000 }),
  });
};
