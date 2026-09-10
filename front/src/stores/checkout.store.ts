import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ville } from '@/models/Ville';
import type { CartItem } from '@/models/Shop';
import { MobileMoneyOperatorEnum } from '@/models/enums';

// 4-step checkout flow:
//   0 - Cart Review
//   1 - Delivery Info
//   2 - Payment
//   3 - Confirmation
const PHONE_REGEX = /^03[2-9]\d{7}$/;

interface CheckoutState {
  // Step navigation
  activeStep: number;

  // Delivery fields (Step 1)
  deliveryDestination: Ville | null;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;

  // Payment fields (Step 2)
  selectedPaymentMethod: string;
  paymentPhone: string;
  mobileMoneyTransactionRef: string | null;

  // Order confirmation tracking (Step 3)
  orderConfirmed: boolean;
  orderId: number | null;
  orderNumber: string | null;

  // Internal tracking fields
  paymentError: string | null;
  confirmedOrderNumber: string | null;
  showMobileMoneyStatus: boolean;
  mobileMoneyOperator: MobileMoneyOperatorEnum | null;
  paymentItems: CartItem[];
  paymentSubtotal: number;
  paymentDeliveryFee: number;
  paymentTotal: number;

  // Actions
  setActiveStep: (step: number) => void;
  setDeliveryDestination: (destination: Ville | null) => void;
  setRecipientName: (name: string) => void;
  setRecipientPhone: (phone: string) => void;
  setShippingAddress: (address: string) => void;
  setSelectedPaymentMethod: (method: string) => void;
  setPaymentPhone: (phone: string) => void;
  setOrderConfirmed: (confirmed: boolean) => void;
  setPaymentError: (error: string | null) => void;
  setConfirmedOrderNumber: (orderNumber: string | null) => void;
  setShowMobileMoneyStatus: (show: boolean) => void;
  setMobileMoneyTransactionRef: (ref: string | null) => void;
  setMobileMoneyOperator: (operator: MobileMoneyOperatorEnum | null) => void;
  setPaymentItems: (items: CartItem[]) => void;
  setPaymentSubtotal: (subtotal: number) => void;
  setPaymentDeliveryFee: (deliveryFee: number) => void;
  setPaymentTotal: (total: number) => void;
  setOrderId: (id: number | null) => void;
  setOrderNumber: (orderNumber: string | null) => void;

  // Step validation: returns true when all required fields for the given step are complete
  canAdvanceToStep: (step: number) => boolean;

  resetCheckout: () => void;
}

const initialState = {
  activeStep: 0,
  deliveryDestination: null,
  recipientName: '',
  recipientPhone: '',
  shippingAddress: '',
  selectedPaymentMethod: '',
  paymentPhone: '',
  mobileMoneyTransactionRef: null,
  orderConfirmed: false,
  orderId: null,
  orderNumber: null,
  paymentError: null,
  confirmedOrderNumber: null,
  showMobileMoneyStatus: false,
  mobileMoneyOperator: null,
  paymentItems: [],
  paymentSubtotal: 0,
  paymentDeliveryFee: 0,
  paymentTotal: 0,
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setActiveStep: step => set({ activeStep: step }),
      setDeliveryDestination: destination => set({ deliveryDestination: destination }),
      setRecipientName: name => set({ recipientName: name }),
      setRecipientPhone: phone => set({ recipientPhone: phone }),
      setShippingAddress: address => set({ shippingAddress: address }),
      setSelectedPaymentMethod: method => set({ selectedPaymentMethod: method }),
      setPaymentPhone: phone => set({ paymentPhone: phone }),
      setOrderConfirmed: confirmed => set({ orderConfirmed: confirmed }),
      setPaymentError: error => set({ paymentError: error }),
      setConfirmedOrderNumber: orderNumber => set({ confirmedOrderNumber: orderNumber, orderNumber: orderNumber }),
      setShowMobileMoneyStatus: show => set({ showMobileMoneyStatus: show }),
      setMobileMoneyTransactionRef: ref => set({ mobileMoneyTransactionRef: ref }),
      setMobileMoneyOperator: operator => set({ mobileMoneyOperator: operator }),
      setPaymentItems: items => set({ paymentItems: items }),
      setPaymentSubtotal: subtotal => set({ paymentSubtotal: subtotal }),
      setPaymentDeliveryFee: deliveryFee => set({ paymentDeliveryFee: deliveryFee }),
      setPaymentTotal: total => set({ paymentTotal: total }),
      setOrderId: id => set({ orderId: id }),
      setOrderNumber: orderNumber => set({ orderNumber: orderNumber, confirmedOrderNumber: orderNumber }),

      canAdvanceToStep: (step: number) => {
        const state = get();

        // Step 0 (Cart Review) → Step 1 (Delivery Info): no fields required on step 0
        const canAdvanceToDelivery = step === 1;

        // Step 1 (Delivery Info) → Step 2 (Payment): destination + recipient info required
        const hasDeliveryDestination = state.deliveryDestination !== null;
        const hasRecipientName = state.recipientName.trim().length > 0;
        const hasRecipientPhone = state.recipientPhone.trim().length > 0;
        const hasShippingAddress = state.shippingAddress.trim().length > 0;
        const canAdvanceToPayment =
          step === 2 && hasDeliveryDestination && hasRecipientName && hasRecipientPhone && hasShippingAddress;

        // Step 2 (Payment) → Step 3 (Confirmation): payment method + valid phone required
        const hasPaymentMethod = state.selectedPaymentMethod.trim().length > 0;
        const hasValidPaymentPhone = PHONE_REGEX.test(state.paymentPhone);
        const canAdvanceToConfirmation = step === 3 && hasPaymentMethod && hasValidPaymentPhone;

        return canAdvanceToDelivery || canAdvanceToPayment || canAdvanceToConfirmation;
      },

      resetCheckout: () => set(initialState),
    }),
    {
      name: 'txbr-checkout-storage',
      skipHydration: true,
    },
  ),
);
