import { Base } from '@/models/Base';
import { Koperative } from '@/models/Koperative';
import { Chauffeur } from '@/models/Chauffeur';
import { Cloudinary } from '@/models/Cloudinary';
import { CrafterConfig } from '@/types/type.props';

export interface Crafter extends Base {
  registrationNumber: string;
  model?: string;
  kilometrage?: number;
  seatCapacity: number;
  koperative?: Koperative;
  chauffeur?: Chauffeur;
  isActive: boolean;
  configName?: string;
  seatConfig?: CrafterConfig | null;
  dateVisite?: string;
  photo?: Cloudinary;
}
