import { Base } from '@/models/Base';
import { Ville } from '@/models/Ville';
import { Cloudinary } from '@/models/Cloudinary';

export interface Hotel extends Base {
  name: string;
  ville: Ville;
  address?: string;
  phone?: string;
  email?: string;
  rating?: number;
  amenities?: string;
  photo?: Cloudinary;
  isActive: boolean;
}
