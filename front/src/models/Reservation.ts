import { Base } from './Base';
import { Voyage } from './Voyage';
import { Voyageur } from './Voyageur';
import { Classe } from './Classe';
import { Seat } from './Seat';
import { ReservationStatusEnum } from './enums';
import { Facturation } from './Facturation';

export interface Reservation extends Base {
  voyage: Voyage;
  voyageur?: Voyageur;
  classe?: Classe;
  seats?: Seat[];
  bookingReference: string;
  status: ReservationStatusEnum;
  bookingDate: string;
  totalAmount: number;
  notes?: string;
  facturation?: Facturation;
}
