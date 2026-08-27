import axios from './axios';
import { AxiosError } from 'axios';
import { InitiatePaymentRequest, PaymentRequest, PaymentResponse } from '@/models/Payment';
import { PaymentTransaction } from '@/models/PaymentTransaction';
import { MobileMoneyOperatorEnum } from '@/models/enums';
import { TarifMobileMoney } from '@/models/TarifMobileMoney';

const API_URL = '/payments';
const RESERVATION_API_URL = '/reservations';

export interface PaymentOperator {
  name: string;
  code: string;
  prefixes: string[];
  configured: boolean;
}

/**
 * Initiate MVola payment
 */
export const initiateMVolaPayment = async (request: InitiatePaymentRequest): Promise<PaymentTransaction> => {
  try {
    const { data } = await axios.post<PaymentTransaction>(`${API_URL}/mvola/initiate`, {
      payableId: request.payableId,
      payableType: request.payableType,
      amount: request.amount,
      phoneNumber: request.phoneNumber,
      paymentMethod: request.operatorName,
      operatorName: request.operatorName,
    });
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'MVola payment initiation failed');
  }
};

/**
 * Get payment status by transaction reference
 */
export const getMVolaPaymentStatus = async (transactionReference: string): Promise<PaymentTransaction> => {
  try {
    const { data } = await axios.get<PaymentTransaction>(`${API_URL}/mvola/status/${transactionReference}`);
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Failed to get payment status');
  }
};

/**
 * Check and update payment status from MVola
 */
export const checkMVolaPaymentStatus = async (transactionReference: string): Promise<PaymentTransaction> => {
  try {
    const { data } = await axios.post<PaymentTransaction>(`${API_URL}/mvola/check/${transactionReference}`);
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Failed to check payment status');
  }
};

/**
 * Initiate Orange Money payment
 */
export const initiateOrangePayment = async (request: InitiatePaymentRequest): Promise<PaymentTransaction> => {
  try {
    const { data } = await axios.post<PaymentTransaction>(`${API_URL}/orangemoney/initiate`, {
      payableId: request.payableId,
      payableType: request.payableType,
      amount: request.amount,
      paymentMethod: request.operatorName,
      operatorName: request.operatorName,
      returnUrl: window.location.pathname,
    });
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Orange Money payment initiation failed');
  }
};

/**
 * Initiate Airtel Money payment
 */
export const initiateAirtelPayment = async (request: InitiatePaymentRequest): Promise<PaymentTransaction> => {
  try {
    const { data } = await axios.post<PaymentTransaction>(`${API_URL}/airtelmoney/initiate`, {
      payableId: request.payableId,
      payableType: request.payableType,
      amount: request.amount,
      phoneNumber: request.phoneNumber,
      paymentMethod: request.operatorName,
      operatorName: request.operatorName,
    });
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Airtel Money payment initiation failed');
  }
};

/**
 * Check and update payment status from Airtel Money
 */
export const checkAirtelPaymentStatus = async (transactionReference: string): Promise<PaymentTransaction> => {
  try {
    const { data } = await axios.post<PaymentTransaction>(`${API_URL}/airtelmoney/check/${transactionReference}`);
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Failed to check payment status');
  }
};

/**
 * Initiate payment based on operator name
 */
export const initiatePaymentAuto = async (request: InitiatePaymentRequest): Promise<PaymentTransaction> => {
  try {
    const operator = request.operatorName.toUpperCase();

    switch (operator) {
      case MobileMoneyOperatorEnum.MVOLA:
        return await initiateMVolaPayment(request);
      case MobileMoneyOperatorEnum.ORANGE:
        return await initiateOrangePayment(request);
      case MobileMoneyOperatorEnum.AIRTEL:
        return await initiateAirtelPayment(request);
      default:
        throw new Error(`Unsupported payment operator: ${request.operatorName}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Payment initiation failed');
  }
};

export const processReservationPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const { data } = await axios.post<PaymentResponse>(`${RESERVATION_API_URL}/${request.payableId}/payment`, request);
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Payment processing failed');
  }
};

export const getTransactionStatus = async (reference: string): Promise<PaymentTransaction> => {
  const { data } = await axios.get<PaymentTransaction>(`${API_URL}/transactions/${reference}`);
  return data;
};

export const getOrangeMoneyTransactionStatus = async (payToken: string) => {
  const { data } = await axios.get(`${API_URL}/orangemoney/status/${payToken}`);
  return data;
};

/**
 * Check and update payment status from Orange Money
 */
export const checkOrangeMoneyPaymentStatus = async (transactionReference: string): Promise<PaymentTransaction> => {
  try {
    const { data } = await axios.post<PaymentTransaction>(`${API_URL}/orangemoney/check/${transactionReference}`);
    return data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message ?? 'Failed to check Orange Money payment status');
  }
};

export const getSupportedOperators = async (): Promise<{ operators: PaymentOperator[] }> => {
  const { data } = await axios.get<{ operators: PaymentOperator[] }>(`${API_URL}/operators`);
  return data;
};

export const calculateMobileMoneyFee = async (operatorName: string, amount: number): Promise<TarifMobileMoney> => {
  try {
    const { data } = await axios.get<TarifMobileMoney>(`/tarif-mobile-money/calculate`, {
      params: { operatorName, amount },
    });
    return data;
  } catch (error) {
    console.error('Error calculating mobile money fee:', error);
    return {
      minAmount: 0,
      maxAmount: 0,
      fraisRetrait: 0,
      fraisTransfert: 0,
      operatorName,
    };
  }
};

export default {
  initiateMVolaPayment,
  initiateOrangePayment,
  initiateAirtelPayment,
  checkAirtelPaymentStatus,
  getMVolaPaymentStatus,
  checkMVolaPaymentStatus,
  initiatePaymentAuto,
  processReservationPayment,
  getTransactionStatus,
  getOrangeMoneyTransactionStatus,
  checkOrangeMoneyPaymentStatus,
  getSupportedOperators,
  calculateMobileMoneyFee,
};
