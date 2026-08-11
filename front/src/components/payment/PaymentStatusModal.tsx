import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon, HourglassEmpty, Refresh, Wifi, WifiOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PaymentTransactionStatusEnum } from '@/models/enums';
import { usePaymentStatus, usePaymentWebSocket } from '@/hooks/payment.hooks';
import { checkMVolaPaymentStatus } from '@/api/payment.api';
import Labels from '@/labelKeys.json';

interface PaymentStatusModalProps {
  open: boolean;
  transactionReference: string | null;
  onSuccess: () => void;
  onFailure: () => void;
  onTimeout: () => void;
}

const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  open,
  transactionReference,
  onSuccess,
  onFailure,
  onTimeout,
}) => {
  const { t } = useTranslation();
  const { data: paymentStatus, isLoading, error, refetch } = usePaymentStatus(transactionReference, open);
  const [checking, setChecking] = useState(false);

  // WebSocket integration for real-time updates
  const { isConnected: wsConnected, lastNotification } = usePaymentWebSocket({
    transactionReference,
    enabled: open && !!transactionReference,
    onSuccess: notification => {
      console.log('[Payment Modal] Payment completed via WebSocket:', notification);
      onSuccess();
    },
    onFailure: notification => {
      console.log('[Payment Modal] Payment failed via WebSocket:', notification);
      onFailure();
    },
    onTimeout: notification => {
      console.log('[Payment Modal] Payment timeout via WebSocket:', notification);
      onTimeout();
    },
  });

  useEffect(() => {
    if (paymentStatus) {
      switch (paymentStatus.status) {
        case PaymentTransactionStatusEnum.COMPLETED:
          onSuccess();
          break;
        case PaymentTransactionStatusEnum.FAILED:
        case PaymentTransactionStatusEnum.CANCELLED:
          onFailure();
          break;
        case PaymentTransactionStatusEnum.TIMEOUT:
          onTimeout();
          break;
      }
    }
  }, [paymentStatus, onSuccess, onFailure, onTimeout]);

  const handleManualCheck = async () => {
    if (!transactionReference) return;

    setChecking(true);
    try {
      await checkMVolaPaymentStatus(transactionReference);
      // Refetch pour obtenir le nouveau statut
      refetch();
    } catch (error) {
      console.error('Error checking payment status:', error);
    } finally {
      setChecking(false);
    }
  };

  const getStatusIcon = () => {
    if (!paymentStatus) return <CircularProgress size={60} />;

    switch (paymentStatus.status) {
      case PaymentTransactionStatusEnum.COMPLETED:
        return <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />;
      case PaymentTransactionStatusEnum.FAILED:
      case PaymentTransactionStatusEnum.CANCELLED:
        return <ErrorIcon sx={{ fontSize: 60, color: 'error.main' }} />;
      case PaymentTransactionStatusEnum.TIMEOUT:
        return <HourglassEmpty sx={{ fontSize: 60, color: 'warning.main' }} />;
      default:
        return <CircularProgress size={60} />;
    }
  };

  const getStatusMessage = () => {
    if (error) return 'Error checking payment status';
    if (!paymentStatus || isLoading) return 'Checking payment status...';

    switch (paymentStatus.status) {
      case PaymentTransactionStatusEnum.INITIATED:
      case PaymentTransactionStatusEnum.PENDING_OTP:
        return t(Labels.enum_payment_status_pending);
      case PaymentTransactionStatusEnum.PROCESSING:
        return 'Processing payment...';
      case PaymentTransactionStatusEnum.COMPLETED:
        return t(Labels.travel_status_completed);
      case PaymentTransactionStatusEnum.FAILED:
        return t(Labels.enum_payment_status_failed);
      case PaymentTransactionStatusEnum.TIMEOUT:
        return 'Payment timeout';
      case PaymentTransactionStatusEnum.CANCELLED:
        return t(Labels.status_cancelled);
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    if (!paymentStatus) return 'info';

    switch (paymentStatus.status) {
      case PaymentTransactionStatusEnum.COMPLETED:
        return 'success';
      case PaymentTransactionStatusEnum.FAILED:
      case PaymentTransactionStatusEnum.CANCELLED:
        return 'error';
      case PaymentTransactionStatusEnum.TIMEOUT:
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Stack
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">{t(Labels.payment_otp_title)}</Typography>
          <Chip
            icon={wsConnected ? <Wifi /> : <WifiOff />}
            label={wsConnected ? 'Connected' : 'Disconnected'}
            color={wsConnected ? 'success' : 'default'}
            size="small"
          />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack
          spacing={3}
          sx={{
            py: 3,
            alignItems: 'center',
          }}
        >
          <Box>{getStatusIcon()}</Box>

          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
            }}
          >
            {getStatusMessage()}
          </Typography>

          {transactionReference && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: 'center',
              }}
            >
              Transaction: {transactionReference}
            </Typography>
          )}

          {lastNotification && wsConnected && (
            <Alert severity="info" sx={{ width: '100%' }}>
              <Typography variant="body2">
                {lastNotification.failureReason ? t(lastNotification.failureReason) : lastNotification.message}
              </Typography>
            </Alert>
          )}

          {paymentStatus && (
            <Alert severity={getStatusColor()} sx={{ width: '100%' }}>
              {paymentStatus.status === PaymentTransactionStatusEnum.PENDING_OTP && (
                <Typography variant="body2">{t(Labels.payment_phone_notification)}</Typography>
              )}
              {paymentStatus.status === PaymentTransactionStatusEnum.PROCESSING && (
                <Typography variant="body2">Processing your payment...</Typography>
              )}
              {paymentStatus.failureReason && <Typography variant="body2">{t(paymentStatus.failureReason)}</Typography>}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              Error checking payment status
            </Alert>
          )}

          {paymentStatus && !isTerminalStatus(paymentStatus.status) && (
            <Button
              variant="outlined"
              startIcon={checking ? <CircularProgress size={20} /> : <Refresh />}
              onClick={handleManualCheck}
              disabled={checking}
              sx={{ mt: 2 }}
            >
              {checking ? 'Checking...' : 'Check Status'}
            </Button>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const isTerminalStatus = (status: PaymentTransactionStatusEnum): boolean => {
  return [
    PaymentTransactionStatusEnum.COMPLETED,
    PaymentTransactionStatusEnum.FAILED,
    PaymentTransactionStatusEnum.TIMEOUT,
    PaymentTransactionStatusEnum.CANCELLED,
  ].includes(status);
};

export default PaymentStatusModal;
