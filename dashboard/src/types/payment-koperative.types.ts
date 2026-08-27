import type { PaymentStatusEnum } from './reservation.types';
import type { Voyage } from './voyage.types';

export interface PaymentKoperative {
  id: number;
  voyage?: Voyage;
  status: PaymentStatusEnum;
  amount: number;
  remainingAmount: number;
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}
