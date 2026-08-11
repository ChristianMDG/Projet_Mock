export enum VoyageStatusEnum {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED',
}

export const VoyageStatusLabels: Record<VoyageStatusEnum, string> = {
  [VoyageStatusEnum.SCHEDULED]: 'enum_voyage_status_scheduled',
  [VoyageStatusEnum.IN_PROGRESS]: 'enum_voyage_status_ongoing',
  [VoyageStatusEnum.COMPLETED]: 'enum_voyage_status_completed',
  [VoyageStatusEnum.CANCELLED]: 'enum_voyage_status_cancelled',
  [VoyageStatusEnum.DELAYED]: 'enum_voyage_status_delayed',
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
  matricule?: string;
  capacity?: number;
}

export interface Chauffeur {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface VoyageKoperative {
  id: number;
  name: string;
  logoUrl?: string;
  status?: string;
}

export interface VoyageRoute {
  id: number;
  departureGare?: Gare;
  arrivalGare?: Gare;
  distance?: number;
}

export interface Voyage {
  id: number;
  koperative?: VoyageKoperative;
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
  status?: VoyageStatusEnum;
  description?: string;
  recurrenceType?: string;
  isTemplate?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
