import { Base } from './Base';
import { PaymentTransactionStatusEnum } from './enums';

export interface PaymentTransaction extends Base {
  facturationId: number;
  transactionReference: string;
  operatorName: string;
  amount: number;
  status: PaymentTransactionStatusEnum;
  phoneNumber?: string;
  serverCorrelationId?: string;
  operatorResponse?: string;
  failureReason?: string;
  initiatedAt?: string;
  completedAt?: string;
  otpAttempts?: number;
  paymentUrl?: string;
}
