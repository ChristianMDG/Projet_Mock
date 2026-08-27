import { Ville } from '@/models/Ville';
import { Koperative } from '@/models/Koperative';
import { Voyage } from '@/models/Voyage';
import { Gare } from '@/models/Gare';
import { DepartureTimeGroupEnum } from '@/models/enums';

export interface KoperativeFilter {
  ville: Ville[];
  name: string;
  top?: number;
}

export interface GareFilter {
  ville: Ville[];
  name: string;
  isClosed?: boolean;
  koperativeName: string;
}

export interface VoyageFilter {
  koperativeId?: number;
  departureVilleId?: number;
  arrivalVilleId?: number;
  departureGareId?: number;
  arrivalGareId?: number;
  departureDate?: string;
  status?: string;
  statuses?: string[];
  language?: string;
  passengers?: number;
  departureTimeGroup?: DepartureTimeGroupEnum;
}

export interface VoyageWeeklyResult {
  resultId: number;
  date: string; // ISO date string
  minPrice: number | null;
  maxPrice: number | null;
  avgPrice: number | null;
  totalVoyages: number;
  totalAvailableSeats: number;
  hasVoyages: boolean;
  voyages?: Voyage[]; // optional list of voyages for that date
  koperatives: Koperative[];
  availableTimeGroups?: DepartureTimeGroupEnum[];
}

export interface KoperativeWeeklySummary {
  id: number;
  name: string;
  status?: string;
  minPrice: number;
  voyageCount: number;
  classes?: string[];
}

export interface VoyageWeeklyResponse {
  koperativeSummaries: KoperativeWeeklySummary[];
  weeklyResults: VoyageWeeklyResult[];
  weekStartDate: string;
  weekEndDate: string;
  currentDate?: string;
}

export interface VoyageMonthlyDayResult {
  date: string; // ISO date YYYY-MM-DD
  hasVoyages: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  totalVoyages: number;
  totalAvailableSeats: number;
}

export interface VoyageMonthlyResponse {
  days: VoyageMonthlyDayResult[];
  monthStart: string;
  monthEnd: string;
}

export interface MonthlyVoyageFilter {
  departureVilleId?: number;
  arrivalVilleId?: number;
  koperativeId?: number;
  month: string; // YYYY-MM
  language?: string;
  passengers?: number;
}

export interface ColisFilter {
  koperativeId?: number;
  status?: string;
  departureGareId?: number;
  arrivalGareId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface VoyageClasses {
  koperative?: Koperative;
  departureGare?: Gare;
  arrivalGare?: Gare;
  departureTime: string;
  estimatedArrivalTime?: string;
  voyages: Voyage[];
}
