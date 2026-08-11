import { Base } from '@/models/Base';
import { Ville } from '@/models/Ville';

export interface Fokotany extends Base {
  ville: Ville;
  commune: string;
  fokontany: string;
}
