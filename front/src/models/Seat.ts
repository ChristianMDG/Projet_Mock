import { Base } from './Base';
import { Voyage } from './Voyage';
import { Crafter } from './Crafter';
import { Reservation } from './Reservation';
import { SeatStatusEnum } from './enums';

export interface Seat extends Base {
  voyage?: Voyage;
  crafter?: Crafter;
  reservation?: Reservation;
  seatNum: string;
  seatStatus: SeatStatusEnum;
  position: string;
  notes?: string;
  mine?: boolean;
}
