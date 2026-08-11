import { PaymentMethodEnum } from './enums';
import { Reservation } from './Reservation';

export interface PaymentRequest {
  reservationId: number;
  amount: number;
  paymentMethod?: PaymentMethodEnum;
  phoneNumber?: string;
  operatorName?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  transactionReference?: string;
  message: string;
  remainingAmount?: number;
  reservation?: Reservation;
}

// Request for initiating mobile money payment
export interface InitiatePaymentRequest {
  reservationId: number;
  amount: number;
  phoneNumber?: string;
  operatorName: string;
}

// Response from payment initiation
export interface InitiatePaymentResponse {
  success: boolean;
  transactionReference?: string;
  serverCorrelationId?: string;
  message: string;
  reservation?: Reservation;
  remainingAmount?: number;
}
