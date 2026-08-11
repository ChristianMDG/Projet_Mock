import { useCallback, useMemo, useState } from 'react';
import { useCreateVoyage, useDeleteVoyage, useUpdateVoyage, useVoyagesByKoperative } from './voyage.hooks';
import {
  useBulkTemplateOperations,
  useProcessActiveTemplates,
  useResourceConflictDetection,
  useSchedulerMonitoring,
  useSchedulerStats,
  useVoyageTemplates,
} from './scheduler.hooks';
import { Voyage } from '@/types';
import { ResourceConflictResponse, SchedulerMonitoringResponse, SchedulerStats } from '@/api/scheduler.api';
import dayjs from '@/utils/dayjs';

export interface UseSchedulerPortalOptions {
  koperativeId: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseSchedulerPortalReturn {
  voyages: Voyage[];
  templates: Voyage[];
  instances: Voyage[];
  schedulerStats: SchedulerStats | undefined;
  conflicts: ResourceConflictResponse | undefined;
  monitoring: SchedulerMonitoringResponse | undefined;

  isLoading: boolean;
  voyagesLoading: boolean;
  templatesLoading: boolean;
  statsLoading: boolean;

  error: string | null;
  voyagesError: Error | null;
  templatesError: Error | null;
  statsError: Error | null;

  activeTab: number;
  setActiveTab: (tab: number) => void;
  selectedVoyage: Voyage | null;
  setSelectedVoyage: (voyage: Voyage | null) => void;
  formDrawerOpen: boolean;
  setFormDrawerOpen: (open: boolean) => void;

  createVoyage: (voyage: Partial<Voyage>) => Promise<void>;
  updateVoyage: (id: number, voyage: Partial<Voyage>) => Promise<void>;
  deleteVoyage: (id: number) => Promise<void>;
  processAllTemplates: () => Promise<void>;
  bulkOperateTemplates: (operation: string, templateIds: number[], options?: Record<string, unknown>) => Promise<void>;

  activeTemplatesCount: number;
  upcomingInstancesCount: number;
  conflictsCount: number;
  systemHealthStatus: 'healthy' | 'warning' | 'error';

  refreshAll: () => void;
  clearErrors: () => void;
  getTemplateById: (id: number) => Voyage | undefined;
  getInstancesByTemplate: (templateId: number) => Voyage[];
}

export interface UseSchedulerPortalOptions {
  koperativeId: number;
  autoRefresh?: boolean;
}

export const useSchedulerPortal = ({
  koperativeId,
  autoRefresh = true,
}: UseSchedulerPortalOptions): UseSchedulerPortalReturn => {
  // UI State
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);
  const [formDrawerOpen, setFormDrawerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data queries
  const {
    data: voyages = [],
    isLoading: voyagesLoading,
    error: voyagesError,
    refetch: refetchVoyages,
  } = useVoyagesByKoperative(koperativeId);

  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: templatesError,
    refetch: refetchTemplates,
  } = useVoyageTemplates(koperativeId);

  const {
    data: schedulerStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useSchedulerStats(koperativeId);

  const { data: conflicts, refetch: refetchConflicts } = useResourceConflictDetection(koperativeId);

  const { data: monitoring } = useSchedulerMonitoring(koperativeId, autoRefresh);

  // Mutations
  const createVoyageMutation = useCreateVoyage();
  const updateVoyageMutation = useUpdateVoyage();
  const deleteVoyageMutation = useDeleteVoyage();
  const processTemplatesMutation = useProcessActiveTemplates();
  const bulkOperationsMutation = useBulkTemplateOperations();

  // Computed data
  const instances = useMemo(() => voyages.filter(voyage => !voyage.isTemplate), [voyages]);

  const isLoading = voyagesLoading || templatesLoading || statsLoading;

  const activeTemplatesCount = useMemo(
    () => templates.filter(t => t.status === 'SCHEDULED' && t.isTemplate).length,
    [templates],
  );

  const upcomingInstancesCount = useMemo(
    () => instances.filter(i => i.status === 'SCHEDULED' && dayjs(i.departureTime).isAfter(dayjs())).length,
    [instances],
  );

  const conflictsCount = conflicts?.totalConflicts ?? 0;

  const systemHealthStatus = useMemo(() => {
    if (monitoring?.systemStatus) return monitoring.systemStatus;
    if (conflictsCount > 10) return 'error';
    if (conflictsCount > 5 || schedulerStats?.activeTemplates === 0) return 'warning';
    return 'healthy';
  }, [monitoring, conflictsCount, schedulerStats]);

  // Operations
  const createVoyage = useCallback(
    async (voyage: Partial<Voyage>) => {
      try {
        await createVoyageMutation.mutateAsync(voyage);
        setFormDrawerOpen(false);
        setSelectedVoyage(null);
        setError(null);
      } catch (err) {
        setError(`Failed to create voyage: ${err instanceof Error ? err.message : 'Unknown error'}`);
        throw err;
      }
    },
    [createVoyageMutation],
  );

  const updateVoyage = useCallback(
    async (id: number, voyage: Partial<Voyage>) => {
      try {
        await updateVoyageMutation.mutateAsync({ id, voyage });
        setFormDrawerOpen(false);
        setSelectedVoyage(null);
        setError(null);
      } catch (err) {
        setError(`Failed to update voyage: ${err instanceof Error ? err.message : 'Unknown error'}`);
        throw err;
      }
    },
    [updateVoyageMutation],
  );

  const deleteVoyage = useCallback(
    async (id: number) => {
      try {
        await deleteVoyageMutation.mutateAsync(id);
        setError(null);
      } catch (err) {
        setError(`Failed to delete voyage: ${err instanceof Error ? err.message : 'Unknown error'}`);
        throw err;
      }
    },
    [deleteVoyageMutation],
  );

  const processAllTemplates = useCallback(async () => {
    try {
      await processTemplatesMutation.mutateAsync();
      setError(null);
    } catch (err) {
      setError(`Failed to process templates: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  }, [processTemplatesMutation]);

  const bulkOperateTemplates = useCallback(
    async (operation: string, templateIds: number[], options?: Record<string, unknown>) => {
      try {
        await bulkOperationsMutation.mutateAsync({
          operation: operation as 'activate' | 'deactivate' | 'delete' | 'process',
          templateIds,
          options,
        });
        setError(null);
      } catch (err) {
        setError(`Failed to perform bulk operation: ${err instanceof Error ? err.message : 'Unknown error'}`);
        throw err;
      }
    },
    [bulkOperationsMutation],
  );

  // Utilities
  const refreshAll = useCallback(() => {
    refetchVoyages();
    refetchTemplates();
    refetchStats();
    refetchConflicts();
  }, [refetchVoyages, refetchTemplates, refetchStats, refetchConflicts]);

  const clearErrors = useCallback(() => {
    setError(null);
  }, []);

  const getTemplateById = useCallback((id: number) => templates.find(t => t.id === id), [templates]);

  const getInstancesByTemplate = useCallback(
    (templateId: number) =>
      // In a real implementation, you would filter by a templateId property
      // For now, we'll return an empty array since the Voyage model doesn't have templateId
      instances.filter(i => i.id === templateId),
    [instances],
  );

  return {
    // Data
    voyages,
    templates,
    instances,
    schedulerStats,
    conflicts,
    monitoring,

    // Loading states
    isLoading,
    voyagesLoading,
    templatesLoading,
    statsLoading,

    // Error states
    error,
    voyagesError,
    templatesError,
    statsError,

    // UI state management
    activeTab,
    setActiveTab,
    selectedVoyage,
    setSelectedVoyage,
    formDrawerOpen,
    setFormDrawerOpen,

    // Operations
    createVoyage,
    updateVoyage,
    deleteVoyage,
    processAllTemplates,
    bulkOperateTemplates,

    // Computed properties
    activeTemplatesCount,
    upcomingInstancesCount,
    conflictsCount,
    systemHealthStatus,

    // Utilities
    refreshAll,
    clearErrors,
    getTemplateById,
    getInstancesByTemplate,
  };
};
