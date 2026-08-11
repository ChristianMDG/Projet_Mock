import { Voyage } from '@/types';
import axios from './axios';

const SCHEDULER_API_URL = '/voyages/scheduler';

export interface SchedulerStats {
  koperativeId?: number;
  totalTemplates: number;
  activeTemplates: number;
  totalInstances: number;
  upcomingInstances: number;
  cancelledInstances: number;
  oldestTemplate?: string;
  newestTemplate?: string;
  instancesByRecurrenceType: Record<string, number>;
  instancesByStatus: Record<string, number>;
  resourceConflicts: number;
  averageInstancesPerTemplate: number;
}

export interface ResourceConflict {
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
}

export interface ResourceConflictResponse {
  conflicts: ResourceConflict[];
  totalConflicts: number;
  resolvedConflicts: number;
}

export interface SchedulerMonitoringResponse {
  activeJobs: number;
  queuedJobs: number;
  failedJobs: number;
  lastProcessedAt: string;
  nextProcessAt: string;
  systemStatus: 'healthy' | 'warning' | 'error';
}

export const processActiveTemplates = async () => {
  const { data } = await axios.post<number>(`${SCHEDULER_API_URL}/process-templates`);
  return data;
};

export const batchGenerateInstances = async (templateIds: number[], maxInstancesPerTemplate = 50) => {
  const { data } = await axios.post<number>(
    `${SCHEDULER_API_URL}/batch-generate?maxInstancesPerTemplate=${maxInstancesPerTemplate}`,
    templateIds,
  );
  return data;
};

export const getInstancesByTemplate = async (templateId: number) => {
  const { data } = await axios.get<Voyage[]>(`${SCHEDULER_API_URL}/template/${templateId}/instances`);
  return data;
};

export const updateTemplateAndRegenerate = async (templateId: number, updatedTemplate: Partial<Voyage>) => {
  const { data } = await axios.put<Voyage[]>(
    `${SCHEDULER_API_URL}/template/${templateId}/update-and-regenerate`,
    updatedTemplate,
  );
  return data;
};

export const cancelFutureInstances = async (templateId: number, fromDate: string) => {
  const { data } = await axios.post<number>(
    `${SCHEDULER_API_URL}/template/${templateId}/cancel-future?fromDate=${fromDate}`,
  );
  return data;
};

export const getSchedulerStats = async (koperativeId?: number) => {
  const { data } = await axios.get<SchedulerStats>(`${SCHEDULER_API_URL}/stats`, {
    params: koperativeId ? { koperativeId } : {},
  });
  return data;
};
