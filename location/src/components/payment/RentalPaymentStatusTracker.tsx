import { usePaymentStatusPolling } from '../../hooks/payment.hooks';
import { Box, Typography, CircularProgress, Button, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useRentalCheckoutStore } from '../../stores/rental-checkout.store';
import { CheckoutStep } from '../../types/rental.types';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export default function RentalPaymentStatusTracker() {
  const { t } = useTranslation();
  const { transactionReference, operatorName, setStep, reset } = useRentalCheckoutStore();

  const { data, isLoading, isError } = usePaymentStatusPolling(
    operatorName ?? undefined,
    transactionReference ?? undefined,
  );

  useEffect(() => {
    if (data?.status === 'COMPLETED') {
      setStep(CheckoutStep.CONFIRMATION);
    }
  }, [data?.status, setStep]);

  const hasTransactionReference = Boolean(transactionReference);

  if (hasTransactionReference) {
    const getStatusMessage = () => {
      if (isLoading) return t(Labels.enum_payment_status_init);
      if (isError) return t(Labels.enum_payment_status_error);
      if (data?.status === 'PENDING') return t(Labels.enum_payment_status_pending);
      if (data?.status === 'FAILED') return t(Labels.enum_payment_status_failed);
      if (data?.status === 'TIMEOUT') return t(Labels.enum_payment_status_timeout);
      if (data?.status === 'CANCELLED') return t(Labels.enum_payment_status_cancelled);
      return t(Labels.enum_payment_status_verifying);
    };

    const isTerminalFailed = data?.status === 'FAILED' || data?.status === 'TIMEOUT' || data?.status === 'CANCELLED';
    const hasErrorOrFailed = Boolean(isTerminalFailed || isError);
    const showProgress = !hasErrorOrFailed;

    return (
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          {t(Labels.rental_checkout_validation_title)}
        </Typography>

        {showProgress && (
          <Box sx={{ mb: 4 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 4 }}>
          {getStatusMessage()}
        </Typography>

        {hasErrorOrFailed && (
          <Button variant="outlined" onClick={() => setStep(CheckoutStep.PAYMENT)} sx={{ mt: 2 }}>
            {t(Labels.rental_checkout_retry)}
          </Button>
        )}

        {showProgress && (
          <Button color="error" onClick={() => reset()} sx={{ mt: 4 }}>
            {t(Labels.rental_checkout_cancel)}
          </Button>
        )}
      </Paper>
    );
  }

  return null;
}
