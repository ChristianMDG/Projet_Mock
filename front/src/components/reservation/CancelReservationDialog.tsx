import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { AccountBalance, AttachMoney, Cancel, EventSeat, Person } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { StyledIcon } from '@/components/ui';
import { Reservation } from '@/models/Reservation';
import { PaymentStatusEnum, PaymentStatusLabels, ReservationStatusLabels } from '@/models/enums';
import { convertPhoneToDisplay } from '@/utils/phoneUtils';
import ProtectedTx from '@/components/ProtectedTx';
import { useSeatsByVoyageAndReservation } from '@/hooks/seat.hooks';
import { useCancelReservationByOperator } from '@/hooks/reservation.hooks';
import Labels from '@/labelKeys.json';

interface CancelReservationDialogProps {
  open: boolean;
  onClose: () => void;
  reservation: Reservation;
}

const CancelReservationDialog: React.FC<CancelReservationDialogProps> = ({ open, onClose, reservation }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme => theme.breakpoints.down('md'), {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = mounted ? isMobileQuery : false;
  const { data: seats = [] } = useSeatsByVoyageAndReservation(reservation?.voyage?.id, reservation?.id);
  const cancelReservationMutation = useCancelReservationByOperator();

  const handleConfirmCancel = async () => {
    if (reservation.id) {
      try {
        await cancelReservationMutation.mutateAsync(reservation.id);
        onClose();
      } catch (error) {
        console.error('Failed to cancel reservation:', error);
      }
    }
  };

  const totalAmount = reservation.facturation?.totalAmount ?? 0;
  const remainingAmount = reservation.facturation?.remainingAmount ?? 0;
  const paidAmount = totalAmount - remainingAmount;

  const getPaymentStatusChipProps = (paymentStatus?: PaymentStatusEnum) => {
    switch (paymentStatus) {
      case PaymentStatusEnum.PAID:
        return { color: 'success' as const };
      case PaymentStatusEnum.PARTIALLY_PAID:
        return { color: 'primary' as const };
      default:
        return { color: 'error' as const };
    }
  };

  const getReservationStatusChipProps = (status?: string) => {
    if (status === 'CONFIRMED') return { color: 'success' as const };
    if (status?.includes('CANCELLED')) return { color: 'error' as const };
    return { color: 'secondary' as const };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Cancel color="error" />
          <Typography variant="h6">{t(Labels.confirm_cancel_reservation_title)}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Stack spacing={2}>
              {/* Passenger Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StyledIcon icon={Person} variant="secondary" sx={{ width: 40, height: 40, borderRadius: 2.5 }} />
                <Box>
                  <Typography variant="subtitle1">
                    {`${reservation.voyageur?.firstName ?? ''} ${reservation.voyageur?.lastName ?? ''}`.trim()}
                  </Typography>
                  <ProtectedTx>
                    {reservation.voyageur?.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {convertPhoneToDisplay(reservation.voyageur.phone)}
                      </Typography>
                    )}
                  </ProtectedTx>
                </Box>
              </Box>

              <Typography variant="h6" color="text.secondary">
                <strong>{t(Labels.booking_reference)}:</strong> {reservation.bookingReference}
              </Typography>

              {/* Status Chips */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {reservation.status && (
                  <Chip
                    label={t(ReservationStatusLabels[reservation.status as keyof typeof ReservationStatusLabels])}
                    size="small"
                    {...getReservationStatusChipProps(reservation.status)}
                  />
                )}
                {reservation.facturation?.paymentStatus && (
                  <Chip
                    label={t(PaymentStatusLabels[reservation.facturation.paymentStatus])}
                    size="small"
                    variant="outlined"
                    {...getPaymentStatusChipProps(reservation.facturation.paymentStatus)}
                  />
                )}
              </Box>

              {/* Financial Details */}
              {reservation.facturation && (
                <ProtectedTx>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoney
                        sx={{
                          fontSize: 'small',
                        }}
                      />
                      {t(Labels.ui_facturation_payment)}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Stack spacing={1.5}>
                      {/* Total Amount */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {t(Labels.ui_facturation_totalamount)}:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 'medium',
                          }}
                        >
                          {totalAmount.toLocaleString()} Ar
                        </Typography>
                      </Box>

                      {/* Paid Amount */}
                      {paidAmount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="body2"
                            color="success.main"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            <AccountBalance
                              sx={{
                                fontSize: 'small',
                              }}
                            />
                            {t(Labels.paid_amount)}:
                          </Typography>
                          <Typography
                            variant="body1"
                            color="success.main"
                            sx={{
                              fontWeight: 'medium',
                            }}
                          >
                            {paidAmount.toLocaleString()} Ar
                          </Typography>
                        </Box>
                      )}

                      {/* Remaining Amount */}
                      {remainingAmount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="warning.main">
                            {t(Labels.remaining_amount)}:
                          </Typography>
                          <Typography
                            variant="body1"
                            color="warning.main"
                            sx={{
                              fontWeight: 'medium',
                            }}
                          >
                            {remainingAmount.toLocaleString()} Ar
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </ProtectedTx>
              )}

              {/* Seat Information */}
              {seats.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventSeat
                      sx={{
                        fontSize: 'small',
                      }}
                    />
                    {t(Labels.seat_information)}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {t(Labels.assigned_seats)}:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {seats.map(seat => (
                        <Chip key={seat.id} label={seat.position} size="small" variant="outlined" color="primary" />
                      ))}
                    </Box>
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">{t(Labels.seat_release_warning)}</Typography>
                    </Alert>
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Cancellation Warning */}
          <Alert severity="warning">
            <Typography variant="body2">{t(Labels.cancel_reservation_warning)}</Typography>
          </Alert>

          {cancelReservationMutation.error && (
            <Alert severity="error">
              {cancelReservationMutation.error?.message ?? t(Labels.error_reservation_failed)}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={cancelReservationMutation.isPending} variant="outlined">
          {t(Labels.ui_cancel)}
        </Button>
        <Button
          onClick={handleConfirmCancel}
          variant="contained"
          color="error"
          disabled={cancelReservationMutation.isPending}
        >
          {cancelReservationMutation.isPending ? t(Labels.processing) : t(Labels.ui_confirm)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelReservationDialog;
export { CancelReservationDialog };
