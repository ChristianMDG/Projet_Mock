import { Base } from './Base';
import { Cloudinary } from './Cloudinary';
import { Contrat } from './Contrat';

export interface Partenaire extends Base {
  name: string;
  type: string; // PartenaireTypeEnum
  contactPerson?: string;
  phone?: string;
  logo?: Cloudinary;
  email?: string;
  address?: string;
  isActive: boolean;
  contrats?: Contrat[];
}

// Define Contrat and Cloudinary separately.
