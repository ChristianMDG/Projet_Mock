import { useEffect, useRef, useState } from 'react';
import { PaymentNotification, paymentWebSocketService } from '@/services/payment-websocket.service';
import { PaymentTransactionStatusEnum } from '@/models/enums';

interface UsePaymentWebSocketOptions {
  transactionReference: string | null;
  onNotification?: (notification: PaymentNotification) => void;
  onSuccess?: (notification: PaymentNotification) => void;
  onFailure?: (notification: PaymentNotification) => void;
  onTimeout?: (notification: PaymentNotification) => void;
  enabled?: boolean;
}

export const usePaymentWebSocket = ({
  transactionReference,
  onNotification,
  onSuccess,
  onFailure,
  onTimeout,
  enabled = true,
}: UsePaymentWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastNotification, setLastNotification] = useState<PaymentNotification | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Keep callback refs up-to-date on every render so the connection effect
  // never needs to re-run (and re-subscribe) just because a parent re-renders.
  const onNotificationRef = useRef(onNotification);
  const onSuccessRef = useRef(onSuccess);
  const onFailureRef = useRef(onFailure);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onNotificationRef.current = onNotification;
    onSuccessRef.current = onSuccess;
    onFailureRef.current = onFailure;
    onTimeoutRef.current = onTimeout;
  });

  useEffect(() => {
    if (enabled && transactionReference) {
      let isMounted = true;

      const connectAndSubscribe = async () => {
        try {
          await paymentWebSocketService.connect();

          if (isMounted) {
            setIsConnected(true);

            unsubscribeRef.current = paymentWebSocketService.subscribeToPaymentUpdates(
              transactionReference,
              (notification: PaymentNotification) => {
                if (isMounted) {
                  setLastNotification(notification);
                  onNotificationRef.current?.(notification);

                  switch (notification.status) {
                    case PaymentTransactionStatusEnum.COMPLETED:
                      onSuccessRef.current?.(notification);
                      break;
                    case PaymentTransactionStatusEnum.FAILED:
                    case PaymentTransactionStatusEnum.CANCELLED:
                      onFailureRef.current?.(notification);
                      break;
                    case PaymentTransactionStatusEnum.TIMEOUT:
                      onTimeoutRef.current?.(notification);
                      break;
                  }
                }
              },
            );
          }
        } catch (error) {
          console.error('[Payment WS Hook] Connection error:', error);
          setIsConnected(false);
        }
      };

      void connectAndSubscribe();

      return () => {
        isMounted = false;
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    }
  }, [transactionReference, enabled]);

  return {
    isConnected,
    lastNotification,
  };
};
