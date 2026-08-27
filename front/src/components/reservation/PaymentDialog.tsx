import React, { useMemo, useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Close from '@mui/icons-material/Close';
import Payment from '@mui/icons-material/Payment';
import { useSeatsByVoyageAndReservation } from '@/hooks/seat.hooks';
import { Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useReservationById } from '@/hooks/reservation.hooks';
import Labels from '@/labelKeys.json';
import { Reservation } from '@/models/Reservation';
import { PaymentMethodEnum, PaymentStatusEnum } from '@/models/enums';

interface PaymentFormValues {
  amount: number;
  paymentMethod: PaymentMethodEnum;
}

interface PaymentDialogProps {
  open: boolean;
  error?: string | null;
  isLoading?: boolean;
  reservation: Reservation;
  onClose: () => void;
  onPayment: (amount: number, paymentMethod?: PaymentMethodEnum) => Promise<void>;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  error,
  reservation,
  isLoading = false,
  onClose,
  onPayment,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = mounted ? isMobileQuery : false;

  // Fetch fresh reservation data from API
  const { data: currentReservation, isLoading: reservationLoading } = useReservationById(reservation.id!);
  const { data: seats = [], isLoading: seatsLoading } = useSeatsByVoyageAndReservation(
    reservation.voyage!.id,
    reservation.id!,
  );

  // Use fresh data if available, fallback to prop
  const activeReservation = currentReservation ?? reservation;
  // Extract payment information directly from backend remainingAmount
  const paymentData = useMemo(() => {
    const total = activeReservation?.totalAmount ?? 0;
    const remainingAmount = activeReservation?.facturation?.remainingAmount ?? total;
    const paidAmount = Math.max(0, total - remainingAmount);

    return {
      total,
      remaining: remainingAmount,
      paid: paidAmount,
      hasPayments: paidAmount > 0,
      isFullyPaid: remainingAmount <= 0,
    };
  }, [activeReservation]);

  // Isolated payment status logic
  const paymentStatus = useMemo(() => {
    const status = activeReservation?.facturation?.paymentStatus;

    if (paymentData.isFullyPaid && status === PaymentStatusEnum.PAID) {
      return {
        color: 'success' as const,
        label: t(Labels.status_paid),
        variant: 'filled' as const,
        showCompletionAlert: true,
      };
    }

    if (paymentData.hasPayments && status === PaymentStatusEnum.PARTIALLY_PAID) {
      return {
        color: 'warning' as const,
        label: t(Labels.paid_amount),
        variant: 'outlined' as const,
        showCompletionAlert: false,
      };
    }

    return {
      color: 'error' as const,
      label: t(Labels.ui_reservation_status),
      variant: 'outlined' as const,
      showCompletionAlert: false,
    };
  }, [activeReservation, paymentData, t]);

  // Determine if payment form should be shown
  const showPaymentForm = !paymentData.isFullyPaid && paymentData.remaining > 0;

  // Validation schema
  const validationSchema = useMemo(
    () =>
      Yup.object({
        amount: Yup.number()
          .required(t(Labels.field_required))
          .min(0.01, t(Labels.amount_must_be_positive))
          .max(paymentData.remaining, t(Labels.amount_exceeds_remaining))
          .test('has-remaining', t(Labels.amount_exceeds_remaining), () => paymentData.remaining > 0),
        paymentMethod: Yup.string()
          .oneOf(Object.values(PaymentMethodEnum), t(Labels.field_required))
          .required(t(Labels.field_required)),
      }),
    [t, paymentData.remaining],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? false : 'sm'}
      fullWidth={!isMobile}
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            ...(isMobile && {
              m: 0,
              maxHeight: '100vh',
              borderRadius: 0,
            }),
          },
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment />
            <Typography variant="h6">{t(Labels.payment_method_title)}</Typography>
          </Box>
          <Chip label={paymentStatus.label} size="small" color={paymentStatus.color} variant={paymentStatus.variant} />
        </Box>
      </DialogTitle>

      {/* Show error if provided */}
      {error && (
        <Box sx={{ mx: 3, mb: 2 }}>
          <Alert severity="error" onClose={() => {}}>
            {t(error)}
          </Alert>
        </Box>
      )}

      {/* Show payment completion info */}
      {paymentStatus.showCompletionAlert && (
        <Box sx={{ mx: 3, mb: 2 }}>
          <Alert severity="success" icon={<CheckCircle />}>
            {t(Labels.payment_completed_successfully)}
          </Alert>
        </Box>
      )}

      <Formik<PaymentFormValues>
        initialValues={{
          amount: paymentData.remaining,
          paymentMethod: PaymentMethodEnum.CASH,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values: PaymentFormValues) => {
          await onPayment(values.amount, values.paymentMethod);
          onClose();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isValid,
          isSubmitting,
        }: FormikProps<PaymentFormValues>) => (
          <Form>
            <DialogContent>
              {/* Reservation Information */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t(Labels.reservation_details)}
                </Typography>
                <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2 }}>
                  <Typography variant="h6" color="text.secondary">
                    {t(Labels.ui_userinfo_voyageur)}:{' '}
                    {`${reservation.voyageur?.firstName ?? ''} ${reservation.voyageur?.lastName ?? ''}`}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {t(Labels.booking_reference)}: {reservation.bookingReference}
                  </Typography>
                </Box>
              </Box>

              {/* Seats Information */}
              <Typography variant="subtitle2" gutterBottom>
                {t(Labels.reserved_seats)} ({seats.length ?? 0}):
              </Typography>

              <List
                dense
                sx={{ bgcolor: 'background.paper', borderRadius: 1, mb: 2, maxHeight: 200, overflow: 'auto' }}
              >
                {(reservationLoading || seatsLoading) && (
                  <ListItem>
                    <ListItemText primary={t(Labels.loading)} />
                  </ListItem>
                )}
                {seats.map((seat, index) => (
                  <ListItem key={seat.id ?? index} divider={index < seats.length - 1}>
                    <ListItemText
                      primary={`${t(Labels.seat_label)} ${seat.position}`}
                      secondary={`${seat.voyage?.pricePerSeat ?? 0} Ar`}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Payment Summary */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: paymentData.hasPayments ? '1fr 1fr' : '1fr',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.ui_total)}:
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {paymentData.total.toLocaleString()} Ar
                  </Typography>
                </Box>

                {paymentData.hasPayments && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t(Labels.paid_amount)}:
                    </Typography>
                    <Typography variant="h4" color="success">
                      {paymentData.paid.toLocaleString()} Ar
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {t(Labels.remaining_amount)}:
                </Typography>
                <Typography
                  variant="h4"
                  color={paymentData.remaining > 0 ? 'error' : 'success.main'}
                  sx={{
                    fontWeight: paymentData.remaining > 0 ? 'bold' : 'normal',
                  }}
                >
                  {paymentData.remaining.toLocaleString()} Ar
                </Typography>
              </Box>

              {/* Payment form or completion message */}
              {showPaymentForm ? (
                <>
                  {/* Payment Method Selection */}
                  <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel>{t(Labels.payment_method)}</InputLabel>
                    <Select
                      label={t(Labels.payment_method)}
                      name="paymentMethod"
                      value={values.paymentMethod}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.paymentMethod && Boolean(errors.paymentMethod)}
                    >
                      <MenuItem value={PaymentMethodEnum.CASH}>{t(Labels.payment_method_cash)}</MenuItem>
                      <MenuItem value={PaymentMethodEnum.MOBILE_MONEY}>
                        {t(Labels.payment_method_mobile_money)}
                      </MenuItem>
                      <MenuItem value={PaymentMethodEnum.BANK_TRANSFER}>
                        {t(Labels.payment_method_bank_transfer)}
                      </MenuItem>
                      <MenuItem value={PaymentMethodEnum.CREDIT_CARD}>{t(Labels.payment_method_credit_card)}</MenuItem>
                      <MenuItem value={PaymentMethodEnum.ONLINE_PAYMENT}>
                        {t(Labels.payment_method_online_payment)}
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {/* Payment Amount Input */}
                  <TextField
                    fullWidth
                    label={t(Labels.payment_amount)}
                    name="amount"
                    type="number"
                    placeholder="10000"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.amount && Boolean(errors.amount)}
                    helperText={touched.amount && errors.amount}
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        step: 1000,
                        max: paymentData.remaining,
                      },
                      input: {
                        endAdornment: <InputAdornment position="end">Ar</InputAdornment>,
                      },
                    }}
                    sx={{ mt: 2 }}
                  />
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h6" color="success" sx={{ mb: 1 }}>
                    {t(Labels.payment_completed_successfully)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.ui_reservation_status)}: {paymentStatus.label}
                  </Typography>
                </Box>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} variant="outlined" disabled={isLoading || isSubmitting} startIcon={<Close />}>
                {t(Labels.ui_cancel)}
              </Button>
              {showPaymentForm && (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!isValid || isLoading || isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Payment />}
                >
                  {isSubmitting ? t(Labels.processing) : t(Labels.button_confirm_payment)}
                </Button>
              )}
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
