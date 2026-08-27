import { Base } from '@/models/Base';
import { Reservation } from '@/models/Reservation';
import { PaymentStatusEnum } from '@/models/enums';

export interface Facturation extends Base {
  reservation: Reservation;
  invoiceNumber: string;
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  remainingAmount?: number;
  paymentMethodIdentifier?: string;
  paymentReference?: string;
  paymentStatus: PaymentStatusEnum;
  paymentDate?: string;
  dueDate?: string;
  advanceAmount?: number;
  commission?: number;
}
