import { Base } from './Base';
import { UserOperator } from './UserOperator';
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
}
