import { Base } from '@/models/Base';
import { UserOperator } from '@/models/UserOperator';
import { Guichet } from '@/models/Guichet';
import { Crafter } from '@/models/Crafter';
import { Ville } from '@/models/Ville';
import { KoperativeStatusEnum } from './enums';

export interface Koperative extends Base {
  name?: string;
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
  proprietaire?: UserOperator;
  guichets?: Guichet[];
  crafters?: Crafter[];
  villes?: Ville[];
}
