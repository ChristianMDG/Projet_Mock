import { Base } from './Base';
import { Fokotany } from './Fokotany';
import { VilleDetail } from './VilleDetail';

export interface Ville extends Base {
  name?: string;
  region?: string;
  province?: string;
  code?: string;
  isActive?: boolean;
  rn?: string;
  keywords?: string;
  fokotanies?: Fokotany[];
  frequence?: number;
  detailId?: number;
  detail?: VilleDetail;
}
