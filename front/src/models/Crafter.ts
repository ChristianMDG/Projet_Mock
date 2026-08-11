import { Base } from '@/models/Base';
import { Koperative } from '@/models/Koperative';
import { Chauffeur } from '@/models/Chauffeur';
import { Cloudinary } from '@/models/Cloudinary';

export interface Crafter extends Base {
  registrationNumber: string;
  model?: string;
  kilometrage?: number;
  seatCapacity: number;
  koperative?: Koperative;
  chauffeur?: Chauffeur;
  isActive: boolean;
  configName?: string;
  seatConfig?: string;
  dateVisite?: string;
  photo?: Cloudinary;
}
