import { Base } from '@/models/Base';
import { Crafter } from '@/models/Crafter';
import { Reservation } from '@/models/Reservation';

export interface Colis extends Base {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  description?: string;
  type?: string;
  content?: string;
  estimatedValue?: number;
  weight?: number;
  price?: number;
  crafter?: Crafter;
  reservation?: Reservation;
  status?: string;
  voyageId?: number;
}
