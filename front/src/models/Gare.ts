import { Base } from '@/models/Base';
import { Ville } from '@/models/Ville';
import { Cloudinary } from '@/models/Cloudinary';
import { Guichet } from '@/models/Guichet';

export interface Gare extends Base {
  name: string;
  address?: string;
  ville: Ville;
  description?: string;
  photo?: Cloudinary;
  isClosed: boolean;
  guichets?: Guichet[];
  photos?: Cloudinary[];
  frequence?: number;
}
