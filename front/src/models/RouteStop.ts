import { Base } from './Base';
import { Route } from './Route';
import { Ville } from './Ville';
import { Gare } from './Gare';

export interface RouteStop extends Base {
  route: Route;
  ville: Ville;
  gare?: Gare;
  stopOrder: number;
  estimatedArrival?: string;
  estimatedDeparture?: string;
  isMandatory: boolean;
}
