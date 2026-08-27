import type { UserOperator } from '@/models';

export type { UserOperator };

// Server-side filter params sent as query params
export interface OperateurFilters {
  search?: string;
  isActive?: boolean | undefined;
  koperativeId?: number | undefined;
  gareId?: number | undefined;
}
