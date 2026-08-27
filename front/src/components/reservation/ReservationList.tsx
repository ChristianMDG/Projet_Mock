import React, { useState } from 'react';
import { Alert, alpha, Card, CardContent, Chip, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import Cancel from '@mui/icons-material/Cancel';
import Payment from '@mui/icons-material/Payment';
import Person from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import StyledIcon from '@/components/ui/StyledIcon';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { reservationKeys, useProcessPayment, useReservationsNotCanceledByVoyageId } from '@/hooks/reservation.hooks';
import { useQueryClient } from '@tanstack/react-query';
import { PaymentMethodEnum, PaymentStatusEnum, ReservationStatusEnum, ReservationStatusLabels } from '@/models/enums';
import { Reservation } from '@/models/Reservation';
import { PayableType } from '@/models/Payment';
import { PaymentDialog } from './PaymentDialog';
import { CancelReservationDialog } from './CancelReservationDialog';
import { Voyage } from '@/types';
import ProtectedTx from '../ProtectedTx';

interface ReservationState {
  selectedReservation: Reservation | null;
  paymentDialog: { open: boolean };
  cancelDialog: { open: boolean };
}

const ReservationList: React.FC<{ voyageId?: number }> = ({ voyageId }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [reservationState, setReservationState] = useState<ReservationState>({
    selectedReservation: null,
    paymentDialog: { open: false },
    cancelDialog: { open: false },
  });

  const { data: reservations = [], isLoading } = useReservationsNotCanceledByVoyageId(voyageId ?? 0);
  const processPaymentMutation = useProcessPayment();

  const handlePaymentClick = (reservation: Reservation) => {
    setReservationState({
      selectedReservation: { ...reservation, voyage: { id: voyageId } as Voyage },
      paymentDialog: { open: true },
      cancelDialog: { open: false },
    });
  };

  const handlePayment = async (amount: number, paymentMethod: PaymentMethodEnum = PaymentMethodEnum.CASH) => {
    if (reservationState.selectedReservation?.id) {
      const response = await processPaymentMutation.mutateAsync({
        amount,
        payableId: reservationState.selectedReservation.id,
        payableType: PayableType.RESERVATION,
        paymentMethod,
      });

      if (response.success) {
        handleDialogClose();
      }
    }
  };

  const handleDialogClose = async () => {
    setReservationState(prev => ({
      ...prev,
      paymentDialog: { open: false },
    }));
    processPaymentMutation.reset();

    if (voyageId) {
      await queryClient.invalidateQueries({ queryKey: reservationKeys.byVoyage(voyageId) });
    }
    if (reservationState.selectedReservation?.id) {
      await queryClient.invalidateQueries({
        queryKey: reservationKeys.detail(reservationState.selectedReservation.id),
      });
    }
  };

  const handleCancelClick = (reservation: Reservation) => {
    setReservationState({
      selectedReservation: { ...reservation, voyage: { id: voyageId } as Voyage },
      paymentDialog: { open: false },
      cancelDialog: { open: true },
    });
  };

  const handleCancelDialogClose = () => {
    setReservationState(prev => ({
      ...prev,
      cancelDialog: { open: false },
    }));
  };

  const getCardStyle = (status?: ReservationStatusEnum) => {
    switch (status) {
      case ReservationStatusEnum.CONFIRMED:
        return { borderLeft: '4px solid #4caf50', bgcolor: 'rgba(76, 175, 80, 0.04)' };
      case ReservationStatusEnum.PENDING_PAYMENT:
        return {
          borderLeft: '4px solid',
          borderLeftColor: 'warning.main',
          bgcolor: alpha(theme.palette.warning.main, 0.06),
        };
      case ReservationStatusEnum.COMPLETED:
        return { borderLeft: '4px solid', borderLeftColor: 'info.main', bgcolor: alpha(theme.palette.info.main, 0.06) };
      case ReservationStatusEnum.CANCELLED_BY_USER:
      case ReservationStatusEnum.CANCELLED_BY_OPERATOR:
        return { borderLeft: '4px solid #f44336', bgcolor: 'rgba(244, 67, 54, 0.04)' };
      case ReservationStatusEnum.NO_SHOW:
        return {
          borderLeft: '4px solid',
          borderLeftColor: 'text.disabled',
          bgcolor: alpha(theme.palette.action.disabled, 0.06),
        };
      default:
        return { borderLeft: '4px solid #f44336', bgcolor: 'rgba(244, 67, 54, 0.04)' };
    }
  };

  const getReservationStatusChipColor = (status?: ReservationStatusEnum) => {
    switch (status) {
      case ReservationStatusEnum.CONFIRMED:
        return 'success' as const;
      case ReservationStatusEnum.PENDING_PAYMENT:
        return 'warning' as const;
      case ReservationStatusEnum.COMPLETED:
        return 'info' as const;
      case ReservationStatusEnum.NO_SHOW:
        return 'default' as const;
      default:
        return 'error' as const;
    }
  };

  const isConfirmedNoPayment = (res: Reservation) =>
    res.status === ReservationStatusEnum.CONFIRMED && !res.facturation && !res.totalAmount;

  const showSeats = (res: Reservation) =>
    res.status === ReservationStatusEnum.CONFIRMED || res.facturation?.paymentStatus === PaymentStatusEnum.PAID;

  const getSeatLabel = (seat: { position?: string | null; seatNum?: string | null }) => {
    if (seat.position) return seat.position;
    const n = Number(seat.seatNum);
    if (!n) return seat.seatNum ?? '?';
    const row = String.fromCharCode(65 + Math.floor((n - 1) / 4));
    const col = ((n - 1) % 4) + 1;
    return `${row}${col}`;
  };

  const getAmountDisplayText = (reservation: Reservation) => {
    const isPaid = reservation.facturation?.paymentStatus === PaymentStatusEnum.PAID;
    const paidAmount = reservation.facturation?.amount ?? 0;
    if (isPaid) return `${t(Labels.paid_amount)}: ${paidAmount.toLocaleString()} Ar`;
    const parts = [];
    if (paidAmount > 0) parts.push(`${t(Labels.paid_amount)}: ${paidAmount.toLocaleString()} Ar`);
    const remaining = reservation.totalAmount ? reservation.totalAmount - paidAmount : 0;
    if (remaining > 0) parts.push(`${t(Labels.remaining_amount)}: ${remaining.toLocaleString()} Ar`);
    return parts.join(' · ') || `${t(Labels.remaining_amount)}: ${(reservation.totalAmount ?? 0).toLocaleString()} Ar`;
  };

  const getPaymentTooltip = (res: Reservation) => {
    const { paymentStatus } = res.facturation ?? {};
    if (paymentStatus === PaymentStatusEnum.PAID) return t(Labels.status_paid);
    if (paymentStatus === PaymentStatusEnum.PARTIALLY_PAID) return t(Labels.button_complete_payment);
    return t(Labels.button_pay);
  };

  const isPaymentDisabled = (res: Reservation) => {
    const { paymentStatus } = res.facturation ?? {};
    if (paymentStatus === PaymentStatusEnum.PAID) return true;
    const cancelled = [ReservationStatusEnum.CANCELLED_BY_USER, ReservationStatusEnum.CANCELLED_BY_OPERATOR];
    return cancelled.includes(res.status as ReservationStatusEnum);
  };

  if (isLoading) {
    return (
      <Stack spacing={2} sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          {t(Labels.loading)}
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={2} sx={{ my: 2 }}>
        {reservations.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center">
            {t(Labels.menu_reservations)}
          </Typography>
        ) : (
          reservations.map(res => (
            <Card key={res.id} sx={getCardStyle(res.status)}>
              <CardContent sx={{ pb: '8px !important', pt: 1, px: 1.5 }}>
                {/* Line 1: reference + seats + status chip */}
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <StyledIcon
                    icon={Person}
                    variant="secondary"
                    sx={{ width: 28, height: 28, borderRadius: 2, flexShrink: 0 }}
                  />
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ flex: 1, minWidth: 0, alignItems: 'center', flexWrap: 'wrap' }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      #{res.bookingReference}
                    </Typography>
                    {showSeats(res) &&
                      res.seats?.map(seat => (
                        <Chip
                          key={seat.seatNum}
                          label={getSeatLabel(seat)}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ height: 16, fontSize: '0.65rem' }}
                        />
                      ))}
                  </Stack>
                  {res.status && (
                    <Chip
                      label={t(ReservationStatusLabels[res.status])}
                      size="small"
                      color={getReservationStatusChipColor(res.status)}
                      sx={{ flexShrink: 0 }}
                    />
                  )}
                </Stack>
                {/* Line 2: amount + action buttons */}
                <ProtectedTx>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {!isConfirmedNoPayment(res) && getAmountDisplayText(res)}
                    </Typography>
                    <Stack direction="row" spacing={0.25}>
                      <Tooltip title={t(Labels.button_view_reservation)}>
                        <IconButton size="small" color="info" onClick={() => handlePaymentClick(res)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {res.facturation?.paymentStatus !== PaymentStatusEnum.PAID && (
                        <Tooltip title={t(Labels.button_cancel_reservation)}>
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleCancelClick(res)}
                              disabled={res.status?.includes('CANCELLED')}
                            >
                              <Cancel fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                      {!isConfirmedNoPayment(res) && (
                        <Tooltip title={getPaymentTooltip(res)}>
                          <span>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handlePaymentClick(res)}
                              disabled={isPaymentDisabled(res)}
                            >
                              <Payment fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </Stack>
                  </Stack>
                </ProtectedTx>
              </CardContent>
            </Card>
          ))
        )}

        {/* Show payment processing error if any */}
        {processPaymentMutation.isError && (
          <Alert severity="error" onClose={() => processPaymentMutation.reset()}>
            {t(processPaymentMutation.error?.message) ?? t(Labels.payment_processing_failed)}
          </Alert>
        )}
      </Stack>
      {reservationState.selectedReservation && (
        <PaymentDialog
          open={reservationState.paymentDialog.open}
          onClose={handleDialogClose}
          reservation={reservationState.selectedReservation}
          onPayment={handlePayment}
          isLoading={processPaymentMutation.isPending}
          error={processPaymentMutation.isError ? processPaymentMutation.error?.message : null}
        />
      )}
      {reservationState.selectedReservation && (
        <CancelReservationDialog
          open={reservationState.cancelDialog.open}
          onClose={handleCancelDialogClose}
          reservation={reservationState.selectedReservation}
        />
      )}
    </>
  );
};

export default ReservationList;
