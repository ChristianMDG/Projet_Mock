import type { Base } from '@/models/Base';
import { DeliveryMethod } from './shop-enums.types';

export interface DeliveryRate extends Base {
  zoneId?: number;
  method: DeliveryMethod;
  baseFee: number | string;
  perKgFee?: number | string;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
}

export interface DeliveryZone extends Base {
  name: string;
  isActive?: boolean;
  villeIds?: number[];
  fokotanyIds?: number[];
  rates?: DeliveryRate[];
}

export interface DeliveryCalculationRequest {
  villeId?: number;
  fokotanyId?: number;
  weight: number;
  method: DeliveryMethod;
}

export interface DeliveryCalculationResponse {
  zoneId?: number;
  zoneName?: string;
  method: DeliveryMethod;
  baseFee: number | string;
  perKgFee?: number | string;
  totalFee: number | string;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
}

export interface TombanaFanaterana {
  id?: number;
  villeId?: number;
  villeName?: string;
  deliveryMethod?: string;
  minWeight?: number;
  maxWeight?: number;
  /** Delivery fee in Ariary, computed from route distance */
  frais: number;
}
