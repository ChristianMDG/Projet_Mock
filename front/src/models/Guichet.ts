import { Base } from '@/models/Base';
import { Gare } from '@/models/Gare';
import { Koperative } from '@/models/Koperative';
import { UserOperator } from '@/models/UserOperator';
import { Cloudinary } from '@/models/Cloudinary';

export interface Guichet extends Base {
  name: string;
  gare?: Gare;
  koperative: Koperative;
  operateurs?: UserOperator[];
  phones?: string;
  smsPhone?: string;
  numeroMvola?: string;
  numeroAirtelMoney?: string;
  numeroOrangeMoney?: string;
  isActive: boolean;
  paymentAutomatique?: boolean;
  openingHours?: string;
  photo?: Cloudinary;
  destinations?: Gare[];
}
