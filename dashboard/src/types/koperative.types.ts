export enum KoperativeStatusEnum {
  ACTIVE = 'ACTIVE',
  CONFIRMED = 'CONFIRMED',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
}

export const KoperativeStatusLabels: Record<KoperativeStatusEnum, string> = {
  [KoperativeStatusEnum.ACTIVE]: 'enum_koperative_status_active',
  [KoperativeStatusEnum.CONFIRMED]: 'enum_koperative_status_confirmed',
  [KoperativeStatusEnum.INACTIVE]: 'enum_koperative_status_inactive',
  [KoperativeStatusEnum.SUSPENDED]: 'enum_koperative_status_suspended',
  [KoperativeStatusEnum.PENDING]: 'enum_koperative_status_pending',
};

export interface KoperativeVille {
  id: number;
  name: string;
}

export interface KoperativeGuichet {
  id: number;
  name?: string;
  gare?: { id: number; name: string };
}

export interface KoperativeCrafter {
  id: number;
  name?: string;
  matricule?: string;
  capacity?: number;
}

export interface KoperativeChauffeur {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface Koperative {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  logoUrl?: string;
  status?: KoperativeStatusEnum;
  villes?: KoperativeVille[];
  guichets?: KoperativeGuichet[];
  crafters?: KoperativeCrafter[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GuichetWithKoperative {
  id: number;
  name?: string;
  koperative?: Koperative;
}

export interface CreateKoperativePayload {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  registrationNumber?: string;
}

export interface AssignGarePayload {
  koperativeId: number;
  gareId: number;
}
