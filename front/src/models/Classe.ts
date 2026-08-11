import { Base } from '@/models/Base';
import { Cloudinary } from '@/models/Cloudinary';
import { Reservation } from '@/models/Reservation';

export interface Classe extends Base {
  name: string;
  description?: string;
  icon?: Cloudinary;
  reservations?: Reservation[];
  koperativeId?: number;
}
