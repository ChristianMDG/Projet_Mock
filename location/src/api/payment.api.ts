import axiosInstance from './axios';

export interface PaymentTransaction {
  id: number;
  transactionReference: string;
  status: string; // PENDING, COMPLETED, FAILED, TIMEOUT, CANCELLED
  paymentMethod: string;
  amount: number;
}

export const checkPaymentStatus = async (
  operatorName: string,
  transactionReference: string,
): Promise<PaymentTransaction> => {
  const operatorPath =
    operatorName.toLowerCase() === 'orange'
      ? 'orangemoney'
      : operatorName.toLowerCase() === 'airtel'
        ? 'airtelmoney'
        : operatorName.toLowerCase();

  const { data } = await axiosInstance.post<PaymentTransaction>(
    `/api/payments/${operatorPath}/check/${transactionReference}`,
  );
  return data;
};
