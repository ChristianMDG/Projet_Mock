import { UserOperator } from './UserOperator';
import { Reservation } from './Reservation';

export interface Voyageur extends UserOperator {
  reservations?: Reservation[];
}
