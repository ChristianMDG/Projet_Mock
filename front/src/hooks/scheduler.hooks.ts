import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  batchGenerateInstances,
  cancelFutureInstances,
  getInstancesByTemplate,
  getSchedulerStats,
  processActiveTemplates,
  SchedulerStats,
  updateTemplateAndRegenerate,
} from '@/api/scheduler.api';
import { Voyage } from '@/types';

// Process all active templates
export function useProcessActiveTemplates() {
  const queryClient = useQueryClient();
  return useMutation<number, Error>({
    mutationFn: processActiveTemplates,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['voyages'] });
      await queryClient.invalidateQueries({ queryKey: ['scheduler'] });
    },
  });
}

// Batch generate instances for templates
export function useBatchGenerateInstances() {
  const queryClient = useQueryClient();
  return useMutation<number, Error, { templateIds: number[]; maxInstancesPerTemplate?: number }>({
    mutationFn: ({ templateIds, maxInstancesPerTemplate }) =>
      batchGenerateInstances(templateIds, maxInstancesPerTemplate),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['voyages'] });
      await queryClient.invalidateQueries({ queryKey: ['scheduler'] });
    },
  });
}

// Get instances by template
export function useInstancesByTemplate(templateId: number) {
  return useQuery<Voyage[], Error>({
    queryKey: ['scheduler', 'template', templateId, 'instances'],
    queryFn: () => getInstancesByTemplate(templateId),
    enabled: !!templateId,
  });
}

// Update template and regenerate
export function useUpdateTemplateAndRegenerate() {
  const queryClient = useQueryClient();
  return useMutation<Voyage[], Error, { templateId: number; updatedTemplate: Partial<Voyage> }>({
    mutationFn: ({ templateId, updatedTemplate }) => updateTemplateAndRegenerate(templateId, updatedTemplate),
    onSuccess: async (_, { templateId }) => {
      await queryClient.invalidateQueries({ queryKey: ['voyages'] });
      await queryClient.invalidateQueries({ queryKey: ['scheduler'] });
      await queryClient.invalidateQueries({ queryKey: ['scheduler', 'template', templateId] });
    },
  });
}

// Cancel future instances
export function useCancelFutureInstances() {
  const queryClient = useQueryClient();
  return useMutation<number, Error, { templateId: number; fromDate: string }>({
    mutationFn: ({ templateId, fromDate }) => cancelFutureInstances(templateId, fromDate),
    onSuccess: async (_, { templateId }) => {
      await queryClient.invalidateQueries({ queryKey: ['voyages'] });
      await queryClient.invalidateQueries({ queryKey: ['scheduler', 'template', templateId] });
    },
  });
}

// Get scheduler statistics
export function useSchedulerStats(koperativeId?: number) {
  return useQuery<SchedulerStats, Error>({
    queryKey: ['scheduler', 'stats', koperativeId],
    queryFn: () => getSchedulerStats(koperativeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ENHANCED HOOKS FOR COMPREHENSIVE SCHEDULER MANAGEMENT

// Get all voyage templates for a koperative
export function useVoyageTemplates(koperativeId?: number) {
  return useQuery<Voyage[], Error>({
    queryKey: ['scheduler', 'templates', koperativeId],
    queryFn: async () => {
      // This would call a backend endpoint that filters voyages with isTemplate=true
      // For now, we'll simulate it with the existing voyage API
      const response = await fetch(`/api/voyages/templates${koperativeId ? `?koperativeId=${koperativeId}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      return response.json();
    },
    enabled: !!koperativeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get instances for multiple templates
export function useMultipleTemplateInstances(templateIds: number[]) {
  return useQuery<Record<number, Voyage[]>, Error>({
    queryKey: ['scheduler', 'templates', 'instances', templateIds],
    queryFn: async () => {
      const results: Record<number, Voyage[]> = {};

      // Batch fetch instances for all template IDs
      await Promise.all(
        templateIds.map(async templateId => {
          try {
            results[templateId] = await getInstancesByTemplate(templateId);
          } catch {
            results[templateId] = [];
          }
        }),
      );

      return results;
    },
    enabled: templateIds.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Enhanced template management with bulk operations
export function useBulkTemplateOperations() {
  const queryClient = useQueryClient();

  return useMutation<
    { processed: number; errors: string[] },
    Error,
    {
      operation: 'activate' | 'deactivate' | 'delete' | 'process';
      templateIds: number[];
      options?: Record<string, unknown>;
    }
  >({
    mutationFn: async ({ operation, templateIds, options }) => {
      const results = {
        processed: 0,
        errors: [] as string[],
      };

      for (const templateId of templateIds) {
        try {
          switch (operation) {
            case 'activate':
              // Implement activate template logic
              await fetch(`/api/voyages/templates/${templateId}/activate`, { method: 'POST' });
              break;
            case 'deactivate':
              // Implement deactivate template logic
              await fetch(`/api/voyages/templates/${templateId}/deactivate`, { method: 'POST' });
              break;
            case 'delete':
              // Implement delete template logic
              await fetch(`/api/voyages/templates/${templateId}`, { method: 'DELETE' });
              break;
            case 'process':
              // Process template to generate instances
              await fetch(`/api/voyages/templates/${templateId}/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(options ?? {}),
              });
              break;
          }
          results.processed++;
        } catch (error) {
          results.errors.push(`Template ${templateId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return results;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['scheduler'] });
      await queryClient.invalidateQueries({ queryKey: ['voyages'] });
    },
  });
}

// Real-time scheduler monitoring
export function useSchedulerMonitoring(koperativeId?: number, enabled = true) {
  return useQuery<
    {
      activeJobs: number;
      queuedJobs: number;
      failedJobs: number;
      lastProcessedAt: string;
      nextProcessAt: string;
      systemStatus: 'healthy' | 'warning' | 'error';
    },
    Error
  >({
    queryKey: ['scheduler', 'monitoring', koperativeId],
    queryFn: async () => {
      const response = await fetch(`/api/scheduler/monitoring${koperativeId ? `?koperativeId=${koperativeId}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch monitoring data');
      }
      return response.json();
    },
    enabled: enabled && !!koperativeId,
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
    staleTime: 15 * 1000, // 15 seconds
  });
}

// Template performance analytics
export function useTemplatePerformance(templateId: number) {
  return useQuery<
    {
      templateId: number;
      totalInstances: number;
      successRate: number;
      averageBookingRate: number;
      revenueGenerated: number;
      lastMonth: {
        instancesCreated: number;
        cancelledInstances: number;
        completedTrips: number;
      };
      issues: {
        resourceConflicts: number;
        schedulingFailures: number;
        lowBookingRate: boolean;
      };
    },
    Error
  >({
    queryKey: ['scheduler', 'template', templateId, 'performance'],
    queryFn: async () => {
      const response = await fetch(`/api/scheduler/templates/${templateId}/performance`);
      if (!response.ok) {
        throw new Error('Failed to fetch template performance');
      }
      return response.json();
    },
    enabled: !!templateId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Resource conflict detection
export function useResourceConflictDetection(koperativeId?: number) {
  return useQuery<
    {
      conflicts: Array<{
        conflictId: string;
        type: 'crafter' | 'chauffeur' | 'gare';
        resourceId: number;
        resourceName: string;
        conflictingVoyages: Array<{
          voyageId: number;
          templateId?: number;
          departureTime: string;
          arrivalTime: string;
          route: string;
        }>;
        severity: 'low' | 'medium' | 'high';
        suggestion: string;
      }>;
      totalConflicts: number;
      resolvedConflicts: number;
    },
    Error
  >({
    queryKey: ['scheduler', 'conflicts', koperativeId],
    queryFn: async () => {
      const response = await fetch(`/api/scheduler/conflicts${koperativeId ? `?koperativeId=${koperativeId}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conflicts');
      }
      return response.json();
    },
    enabled: !!koperativeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Optimized template suggestions
export function useTemplateSuggestions(koperativeId?: number) {
  return useQuery<
    {
      suggestions: Array<{
        type: 'new_route' | 'frequency_adjustment' | 'timing_optimization' | 'resource_optimization';
        title: string;
        description: string;
        potentialImpact: {
          revenueIncrease?: number;
          efficiencyGain?: number;
          customerSatisfaction?: number;
        };
        actionRequired: string;
        templateData?: Partial<Voyage>;
      }>;
    },
    Error
  >({
    queryKey: ['scheduler', 'suggestions', koperativeId],
    queryFn: async () => {
      const response = await fetch(`/api/scheduler/suggestions${koperativeId ? `?koperativeId=${koperativeId}` : ''}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      return response.json();
    },
    enabled: !!koperativeId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
