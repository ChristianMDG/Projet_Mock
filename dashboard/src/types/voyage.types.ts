export enum VoyageStatusEnum {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED',
  REPORTED = 'REPORTED',
  FULL = 'FULL',
}

export const VoyageStatusLabels: Record<string, string> = {
  SCHEDULED: 'enum_voyage_status_scheduled',
  CONFIRMED: 'enum_voyage_status_confirmed',
  ONGOING: 'enum_voyage_status_ongoing',
  COMPLETED: 'enum_voyage_status_completed',
  CANCELLED: 'enum_voyage_status_cancelled',
  DELAYED: 'enum_voyage_status_delayed',
  REPORTED: 'enum_voyage_status_reported',
  FULL: 'enum_voyage_status_full',
};

export enum SeatStatusEnum {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  BLOCKED = 'BLOCKED',
  DAMAGED = 'DAMAGED',
}

export const SeatStatusLabels: Record<string, string> = {
  AVAILABLE: 'enum_seat_status_available',
  RESERVED: 'enum_seat_status_reserved',
  BLOCKED: 'enum_seat_status_blocked',
  DAMAGED: 'enum_seat_status_damaged',
};

export interface Gare {
  id: number;
  name: string;
  ville?: Ville;
}

export interface Ville {
  id: number;
  name: string;
}

export interface Crafter {
  id: number;
  name?: string;
  registrationNumber?: string;
  model?: string;
  seatCapacity?: number;
  imageUrl?: string;
}

export interface Chauffeur {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  imageUrl?: string;
}

export interface VoyageKoperative {
  id: number;
  name: string;
  logoUrl?: string;
  status?: string;
  phone?: string;
}

export interface VoyageRoute {
  id: number;
  departureGare?: Gare;
  arrivalGare?: Gare;
  distance?: number;
}

export interface VoyageClasse {
  id: number;
  name?: string;
}

export interface Voyage {
  id: number;
  koperative?: VoyageKoperative;
  classe?: VoyageClasse;
  route?: VoyageRoute;
  departureGare?: Gare;
  arrivalGare?: Gare;
  crafter?: Crafter;
  chauffeur?: Chauffeur;
  departureTime?: string;
  estimatedArrivalTime?: string;
  actualArrivalTime?: string;
  availableSeats?: number;
  pricePerSeat?: number;
  status?: VoyageStatusEnum | string;
  description?: string;
  recurrenceType?: string;
  isTemplate?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SeatReservationLight {
  id: number;
  bookingReference?: string;
  status?: string;
  voyageur?: {
    id: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  facturation?: {
    paymentStatus?: string;
  };
}

export interface Seat {
  id: number;
  seatNum?: string;
  seatStatus?: SeatStatusEnum | string;
  position?: string;
  notes?: string;
  reservation?: SeatReservationLight;
}

export interface Operateur {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export interface Guichet {
  id: number;
  name?: string;
  phones?: string;
  smsPhone?: string;
  isActive?: boolean;
  paymentAutomatique?: boolean;
  openingHours?: string;
  gare?: Gare;
  koperative?: VoyageKoperative;
  operateurs?: Operateur[];
  destinations?: Gare[];
}

export interface VoyageDayGroup {
  koperative?: VoyageKoperative;
  departureGare?: Gare;
  arrivalGare?: Gare;
  departureTime?: string;
  estimatedArrivalTime?: string;
  voyages: Voyage[];
}

export type VoyageView = 'cards' | 'table';

export type VoyageQuickFilter = 'today' | 'tomorrow' | 'this_week' | 'has_seats' | 'almost_full' | null;

export interface VoyageFilters {
  statuses: string[];
  dateFrom?: string;
  dateTo?: string;
  koperativeId?: number;
  departureVilleId?: number;
  arrivalVilleId?: number;
  quickFilter?: VoyageQuickFilter;
  view: VoyageView;
  selectedDate?: string;
  selectedPassengerIds: number[];
}

export type VoyageDetailTab = 'overview' | 'seats' | 'passengers' | 'guichet' | 'next' | 'sms' | 'actions';
