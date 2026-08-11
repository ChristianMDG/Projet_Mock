import { Base } from './Base';
import { Gare } from './Gare';
import { RouteStop } from './RouteStop';
import { Voyage } from './Voyage';

export interface Route extends Base {
  name: string;
  departureGare?: Gare;
  arrivalGare?: Gare;
  estimatedDurationHours?: number;
  distanceKm?: number;
  fraisTaxibrousse?: number;
  fraisKoperative?: number;
  description?: string;
  isActive: boolean;
  routeStops?: RouteStop[];
  voyages?: Voyage[];
}
