import { PaymentMethodEnum } from './enums';
import { Reservation } from './Reservation';

export enum PayableType {
  RESERVATION = 'RESERVATION',
  ORDER = 'ORDER',
}

export interface PaymentRequest {
  payableId: number;
  payableType: PayableType;
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
  payableId: number;
  payableType: PayableType;
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
