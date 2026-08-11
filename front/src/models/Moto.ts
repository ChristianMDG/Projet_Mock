import { Base } from './Base';
import { Chauffeur } from './Chauffeur';
import { Cloudinary } from './Cloudinary';

export interface Moto extends Base {
  registrationNumber: string;
  model?: string;
  yearManufactured?: number;
  chauffeur?: Chauffeur;
  isActive: boolean;
  lastMaintenance?: string;
  photo?: Cloudinary;
}

// Define Chauffeur and Cloudinary separately.
