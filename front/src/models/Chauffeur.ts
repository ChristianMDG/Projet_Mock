import { Base } from '@/models/Base';
import { UserOperator } from '@/models/UserOperator';
import { Cloudinary } from '@/models/Cloudinary';
import { Crafter } from '@/models/Crafter';
import { Moto } from '@/models/Moto';
import { Contrat } from '@/models/Contrat';

export interface Chauffeur extends Base {
  user?: UserOperator;
  licenseNumber: string;
  licenseAuthority?: string;
  licenseExpiry?: string;
  experienceYears?: number;
  rating?: number;
  isAvailable: boolean;
  photo?: Cloudinary;
  craftersAssigned?: Crafter[];
  motos?: Moto[];
  contrats?: Contrat[];
  koperativeId?: number;
}
