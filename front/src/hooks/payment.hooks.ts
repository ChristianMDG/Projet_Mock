import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/context/AuthContext';
import { useUpsertVoyageur } from '@/hooks/voyageur.hooks';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import { usePaymentStore } from '@/stores/payment.store';
import { saveGuestReservationData } from '@/utils/guestReservation.utils';
import {
  MobileMoneyOperatorEnum,
  PaymentStatusEnum,
  PaymentTransactionStatusEnum,
  ReservationStatusEnum,
} from '@/models/enums';
import { voyageKeys } from '@/hooks/voyage.hooks';
import { reservationKeys, useCreateReservation } from '@/hooks/reservation.hooks';
import { SEAT_ENTITY_KEYS } from '@/hooks/seat.hooks';
import { ROUTES } from '@/constants/routes';
import { UserFormData } from '@/components/forms';
import { Reservation, Voyage } from '@/types';
import { Seat } from '@/models/Seat';
import { attachVoyageurToReservation, updateReservation } from '@/api/reservation.api';
import {
  initiatePaymentAuto,
  getMVolaPaymentStatus,
  checkMVolaPaymentStatus,
  checkOrangeMoneyPaymentStatus,
  checkAirtelPaymentStatus,
  calculateMobileMoneyFee,
} from '@/api/payment.api';
import { InitiatePaymentRequest, PayableType } from '@/models/Payment';
import { PaymentTransaction } from '@/models/PaymentTransaction';
import Labels from '@/labelKeys.json';
import dayjs from '@/utils/dayjs';
import { Facturation } from '@/models/Facturation';

// Export WebSocket hook
export { usePaymentWebSocket } from './payment-websocket.hook';

// Types for payment flow
export interface PaymentProcessingData {
  payableId: number;
  payableType: PayableType;
  phoneNumber?: string;
  paymentMethodId: string;
  mobileMoneyOperator: string;
  amount: number;
  otp?: string;
}

export interface ReservationCreateParams {
  voyage: Voyage;
  selectedSeats: Seat[];
  userForm?: UserFormData;
  notes?: string;
  autoProcess?: boolean;
  password?: string;
  redirectToLogin?: boolean;
  hasExistingAccount?: boolean;
}

// Payment processing mutation
export const useProcessPayment = () => {
  const { setTransactionReference, setPaymentStatus, setShowPaymentStatus } = usePaymentStore();

  return useMutation<PaymentTransaction, Error, PaymentProcessingData>({
    mutationFn: async paymentData => {
      const request: InitiatePaymentRequest = {
        payableId: paymentData.payableId,
        payableType: paymentData.payableType,
        amount: paymentData.amount,
        ...(paymentData.phoneNumber && { phoneNumber: paymentData.phoneNumber }),
        operatorName: paymentData.mobileMoneyOperator,
      };

      return await initiatePaymentAuto(request);
    },
    onSuccess: transaction => {
      setTransactionReference(transaction.transactionReference);
      setPaymentStatus(transaction.status);
      setShowPaymentStatus(true);
    },
    onError: error => {
      console.error('Payment initiation failed:', error);
      setTransactionReference(null);
      setPaymentStatus(null);
    },
  });
};

// Types for reservation + payment flow
export interface ReservationPaymentParams {
  voyage: Voyage;
  reservationTotalAmount: number;
  totalAmount: number;
  phoneNumber: string;
  paymentMethodId: string;
  mobileMoneyOperator: string;
  seatPositions: string[];
  isPartial?: boolean;
  advanceAmount?: number;
  commission?: number;
}

// Hook that encapsulates: create reservation → initiate payment
export const useReservationPayment = () => {
  const createReservationMutation = useCreateReservation();
  const processPaymentMutation = useProcessPayment();
  const { setReservationId, reservationId: existingReservationId } = usePaymentStore();
  const { t } = useTranslation();

  return useMutation<void, Error, ReservationPaymentParams>({
    mutationFn: async ({
      voyage,
      reservationTotalAmount,
      totalAmount,
      phoneNumber,
      paymentMethodId,
      mobileMoneyOperator,
      seatPositions,
      isPartial,
      advanceAmount,
      commission,
    }) => {
      let reservationId = existingReservationId;

      if (!reservationId) {
        // Step 1: Create reservation without seats — seats are attached after successful payment only
        const reservation = await createReservationMutation.mutateAsync({
          voyage: { id: voyage.id } as Voyage,
          totalAmount: reservationTotalAmount,
          seatCount: seatPositions.length,
          status: ReservationStatusEnum.PENDING_PAYMENT,
          bookingDate: dayjs().tz('Indian/Antananarivo').toISOString(),
          notes: t(Labels.payment_notes_template, {
            operator: mobileMoneyOperator,
            phone: phoneNumber ?? t(Labels.payment_web_payment),
            seats: seatPositions.join(', '),
          }),
          ...(isPartial && {
            facturation: {
              advanceAmount,
              commission,
              amount: reservationTotalAmount,
              totalAmount: reservationTotalAmount,
              remainingAmount: reservationTotalAmount,
              paymentStatus: PaymentStatusEnum.PENDING,
            } as Facturation,
          }),
        });
        if (!reservation?.id) throw new Error(t(Labels.error_reservation_failed));
        reservationId = reservation.id;
        setReservationId(reservationId);
      }

      // Step 2: Initiate payment (store updates handled in useProcessPayment)
      const paymentTransaction = await processPaymentMutation.mutateAsync({
        phoneNumber,
        paymentMethodId,
        mobileMoneyOperator,
        payableId: reservationId,
        payableType: PayableType.RESERVATION,
        amount: totalAmount,
      });

      // Step 3: Handle Orange Money redirect
      if (mobileMoneyOperator === MobileMoneyOperatorEnum.ORANGE) {
        if (paymentTransaction.paymentUrl) {
          window.location.href = paymentTransaction.paymentUrl;
        } else {
          throw new Error('Payment URL not received from Orange Money');
        }
      }
    },
  });
};

// Hook to poll payment status
export const usePaymentStatus = (transactionReference: string | null, enabled: boolean = true) => {
  return useQuery<PaymentTransaction, Error>({
    queryKey: ['paymentStatus', transactionReference],
    queryFn: () => {
      if (!transactionReference) {
        throw new Error('Transaction reference is required');
      }
      return getMVolaPaymentStatus(transactionReference);
    },
    enabled: enabled && !!transactionReference,
    refetchInterval: query => {
      const data = query.state.data;
      if (data && isTerminalStatus(data.status)) {
        return false;
      }
      return 3000;
    },
    retry: failureCount => {
      // Stop retrying after 5 attempts
      if (failureCount >= 5) return false;
      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      return true;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Helper function to check if status is terminal
const isTerminalStatus = (status: PaymentTransactionStatusEnum): boolean => {
  return [
    PaymentTransactionStatusEnum.COMPLETED,
    PaymentTransactionStatusEnum.FAILED,
    PaymentTransactionStatusEnum.TIMEOUT,
    PaymentTransactionStatusEnum.CANCELLED,
  ].includes(status);
};

// OTP verification mutation
export const useVerifyOTP = () => {
  return useMutation<{ verified: boolean }, Error, { otp: string; transactionId?: string }>({
    mutationFn: async ({ otp, transactionId: _transactionId }) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (otp.length === 6) {
        return { verified: true };
      }

      throw new Error(Labels.payment_otp_invalid);
    },
  });
};

// Hook for manual payment status check
const paymentStatusCheckers: Record<MobileMoneyOperatorEnum, (ref: string) => Promise<PaymentTransaction>> = {
  [MobileMoneyOperatorEnum.ORANGE]: checkOrangeMoneyPaymentStatus,
  [MobileMoneyOperatorEnum.AIRTEL]: checkAirtelPaymentStatus,
  [MobileMoneyOperatorEnum.MVOLA]: checkMVolaPaymentStatus,
};

export const useCheckPaymentStatus = () => {
  const { setPaymentStatus } = usePaymentStore();

  return useMutation<PaymentTransaction, Error, { reference: string; operator: MobileMoneyOperatorEnum }>({
    mutationFn: ({ reference, operator }) => paymentStatusCheckers[operator](reference),
    onSuccess: transaction => {
      setPaymentStatus(transaction.status);
    },
  });
};

// Post-payment voyageur attachment
export const useCreatePostPaymentReservation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: upsertVoyageur } = useUpsertVoyageur();
  const { clearSelectedSeats } = useSeatSelectionStore();
  const { i18n } = useTranslation();
  const { reservationId } = usePaymentStore();

  const buildFinalUserForm = (autoProcess: boolean, userForm?: UserFormData): UserFormData | undefined => {
    if (autoProcess && user) {
      return {
        id: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
        idNumber: user.idNumber ?? '',
      };
    }
    return userForm;
  };

  return useMutation<Reservation, Error, ReservationCreateParams>({
    mutationFn: async ({
      voyage: _voyage,
      selectedSeats,
      userForm,
      notes: _notes,
      autoProcess = false,
      hasExistingAccount = false,
    }) => {
      const finalUserForm = buildFinalUserForm(autoProcess, userForm);

      if (finalUserForm && reservationId) {
        // Existing voyageur: attach by id only — do NOT update their data
        let voyageurId: number;
        if (hasExistingAccount && finalUserForm.id) {
          voyageurId = finalUserForm.id;
        } else {
          const upserted = await upsertVoyageur(finalUserForm);
          voyageurId = upserted?.id ?? 0;
        }

        // Attach voyageur, then add seats (created here only on payment success)
        const reservation = await attachVoyageurToReservation(reservationId, voyageurId);
        if (selectedSeats?.length) {
          return updateReservation(reservationId, { ...reservation, seats: selectedSeats });
        }
        return reservation;
      }

      throw new Error(finalUserForm ? Labels.error_reservation_failed : Labels.error_required_fields);
    },
    onSuccess: async (reservation, { voyage, userForm, redirectToLogin, hasExistingAccount }) => {
      if (voyage.id) {
        clearSelectedSeats(voyage.id);

        await queryClient.invalidateQueries({ queryKey: voyageKeys.detail(voyage.id) });
        await queryClient.invalidateQueries({ queryKey: reservationKeys.byVoyage(voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.byVoyage(voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.available(voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.reserved(voyage.id) });

        // Save guest reservation data to localStorage
        const phoneNumber = user?.phone ?? userForm!.phone;
        const idNumber = user?.idNumber ?? userForm!.idNumber;
        if (Boolean(phoneNumber && idNumber)) {
          saveGuestReservationData({
            phoneNumber: phoneNumber,
            idNumber: idNumber,
          });
        }

        if (user) {
          navigate(ROUTES.accountDetail[i18n.language]);
        } else if (redirectToLogin && hasExistingAccount && userForm?.phone) {
          navigate(ROUTES.login[i18n.language], {
            state: {
              from: ROUTES.home[i18n.language],
              mode: 'login',
              prefillPhone: userForm.phone,
              reservationSuccess: true,
            },
          });
        } else {
          navigate(ROUTES.reservationConfirmation[i18n.language], {
            state: { reservation },
          });
        }
      }
    },
    onError: () => {
      alert(Labels.error_reservation_failed);
    },
  });
};

export function useMobileMoneyFee(operatorName: string, amount: number) {
  return useQuery({
    queryKey: ['mobile-money-fee', operatorName, amount],
    queryFn: () => calculateMobileMoneyFee(operatorName, amount),
    enabled: Boolean(operatorName) && amount > 0,
    staleTime: 50 * 60 * 1000, // 50 minutes cache
  });
}
