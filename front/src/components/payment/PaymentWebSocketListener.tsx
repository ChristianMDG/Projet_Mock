import { useEffect } from 'react';
import { usePaymentWebSocket } from '@/hooks/payment.hooks';
import { usePaymentStore } from '@/stores/payment.store';
import { PaymentNotification } from '@/services/payment-websocket.service';

interface PaymentWebSocketListenerProps {
  onPaymentComplete?: (notification: PaymentNotification) => void;
  onPaymentFailed?: (notification: PaymentNotification) => void;
  onPaymentTimeout?: (notification: PaymentNotification) => void;
}

export const PaymentWebSocketListener: React.FC<PaymentWebSocketListenerProps> = ({
  onPaymentComplete,
  onPaymentFailed,
  onPaymentTimeout,
}) => {
  const { transactionReference, setPaymentStatus, setWsConnected } = usePaymentStore();

  const { isConnected, lastNotification } = usePaymentWebSocket({
    transactionReference,
    enabled: !!transactionReference,
    onNotification: notification => {
      console.log('[Payment Listener] Received notification:', notification);
      setPaymentStatus(notification.status);
    },
    onSuccess: notification => {
      console.log('[Payment Listener] Payment completed:', notification);
      onPaymentComplete?.(notification);
    },
    onFailure: notification => {
      console.log('[Payment Listener] Payment failed:', notification);
      onPaymentFailed?.(notification);
    },
    onTimeout: notification => {
      console.log('[Payment Listener] Payment timeout:', notification);
      onPaymentTimeout?.(notification);
    },
  });

  useEffect(() => {
    setWsConnected(isConnected);
  }, [isConnected, setWsConnected]);

  useEffect(() => {
    if (lastNotification) {
      console.log('[Payment Listener] Last notification updated:', lastNotification);
    }
  }, [lastNotification]);

  return null;
};
