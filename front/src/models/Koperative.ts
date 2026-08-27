import { Base } from '@/models/Base';
import { UserOperator } from '@/models/UserOperator';
import { Guichet } from '@/models/Guichet';
import { Crafter } from '@/models/Crafter';
import { Ville } from '@/models/Ville';
import { KoperativeStatusEnum, KoperativeTypeEnum } from './enums';

export interface Koperative extends Base {
  name?: string;
  slug?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  registrationNumber?: string;
  taxId?: string;
  website?: string;
  logoUrl?: string;
  routes?: string[];
  status?: KoperativeStatusEnum;
  type?: KoperativeTypeEnum;
  proprietaire?: UserOperator;
  guichets?: Guichet[];
  crafters?: Crafter[];
  villes?: Ville[];
}
