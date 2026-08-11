import { VoyageStatusEnum } from '@/models/enums';

export interface VoyageFilter {
  koperativeId?: number;
  departureVilleId?: number;
  arrivalVilleId?: number;
  departureDate?: string;
  status?: VoyageStatusEnum;
  language?: string;
  passengers?: number;
}
