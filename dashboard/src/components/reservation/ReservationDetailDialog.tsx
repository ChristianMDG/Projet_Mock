import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Stack,
  Avatar,
  Paper,
  alpha,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Person,
  DirectionsBus,
  EventSeat,
  Payment,
  CalendarToday,
  Phone,
  Email,
  ConfirmationNumber,
} from '@mui/icons-material';
import type { Reservation } from '@/types/reservation.types';
import Labels from '@/labelKeys.json';
import {
  ReservationStatusLabels,
  PaymentStatusLabels,
  ReservationStatusEnum,
  PaymentStatusEnum,
} from '@/types/reservation.types';

interface ReservationDetailDialogProps {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  if (status === 'CONFIRMED' || status === 'COMPLETED') return 'success';
  if (status === 'PENDING_PAYMENT') return 'warning';
  if (status.includes('CANCELLED') || status === 'NO_SHOW') return 'error';
  return 'default';
};

const getPaymentColor = (status: string) => {
  if (status === 'PAID') return 'success';
  if (status === 'PARTIALLY_PAID') return 'info';
  if (status === 'PENDING') return 'warning';
  if (status === 'FAILED') return 'error';
  return 'default';
};

const formatCurrency = (amount: number) => `${amount.toLocaleString('fr-FR')} Ar`;

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ReservationDetailDialog({ reservation, open, onClose }: ReservationDetailDialogProps) {
  const { t } = useTranslation();
  if (reservation) {
    const voyageur = reservation.voyageur;
    const voyage = reservation.voyage;
    const facturation = reservation.facturation;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 36,
                height: 36,
              }}
            >
              <ConfirmationNumber fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                {t(Labels.reservation_detail_title)} {reservation.bookingReference}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID #{reservation.id}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={t(ReservationStatusLabels[reservation.status as ReservationStatusEnum] ?? reservation.status)}
            color={getStatusColor(reservation.status) as any}
            size="small"
          />
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2.5 }}>
          <Grid container spacing={3}>
            {/* Voyageur Info */}
            <Grid size={{ xs: 12 }}>
              <Paper
                variant="outlined"
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                })}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Person fontSize="small" /> {t(Labels.reservation_traveler)}
                </Typography>
                <Stack spacing={1.5}>
                  <InfoRow
                    icon={<Person sx={{ fontSize: '1rem' }} />}
                    label={t(Labels.reservation_full_name)}
                    value={voyageur ? `${voyageur.firstName} ${voyageur.lastName}` : 'N/A'}
                  />
                  {voyageur?.phone && (
                    <InfoRow
                      icon={<Phone sx={{ fontSize: '1rem' }} />}
                      label={t(Labels.reservation_phone)}
                      value={voyageur.phone}
                    />
                  )}
                  {voyageur?.email && (
                    <InfoRow
                      icon={<Email sx={{ fontSize: '1rem' }} />}
                      label={t(Labels.reservation_email)}
                      value={voyageur.email}
                    />
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Voyage Info */}
            {voyage && (
              <Grid size={{ xs: 12 }}>
                <Paper
                  variant="outlined"
                  sx={(theme) => ({
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.03),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <DirectionsBus fontSize="small" /> {t(Labels.reservation_voyage)}
                  </Typography>
                  <Stack spacing={1.5}>
                    <InfoRow
                      icon={<DirectionsBus sx={{ fontSize: '1rem' }} />}
                      label={t(Labels.reservation_route)}
                      value={`${voyage.departureCity ?? '?'} → ${voyage.arrivalCity ?? '?'}`}
                    />
                    {voyage.departureDate && (
                      <InfoRow
                        icon={<CalendarToday sx={{ fontSize: '1rem' }} />}
                        label={t(Labels.reservation_departure_date)}
                        value={new Date(voyage.departureDate).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      />
                    )}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Seats */}
            {reservation.seats && reservation.seats.length > 0 && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  sx={(theme) => ({
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.warning.main, 0.03),
                  })}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <EventSeat fontSize="small" /> {t(Labels.reservation_seats)} ({reservation.seats.length})
                  </Typography>
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }} useFlexGap>
                    {reservation.seats.map((seat) => (
                      <Chip
                        key={seat.id}
                        label={seat.seatNumber}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            )}

            {/* Payment Info */}
            <Grid
              size={{
                xs: 12,
                sm: reservation.seats && reservation.seats.length > 0 ? 6 : 12,
              }}
            >
              <Paper
                variant="outlined"
                sx={(theme) => ({
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.03),
                })}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Payment fontSize="small" /> {t(Labels.reservation_payment)}
                </Typography>
                <Stack spacing={1}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {t(Labels.reservation_total_amount)}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {formatCurrency(reservation.totalAmount)}
                    </Typography>
                  </Box>
                  {facturation && (
                    <>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {t(Labels.reservation_paid)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                          {formatCurrency(facturation.paidAmount)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          {t(Labels.reservation_remaining)}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'error.main' }}>
                          {formatCurrency(facturation.remainingAmount)}
                        </Typography>
                      </Box>
                      <Box sx={{ pt: 0.5 }}>
                        <Chip
                          label={
                            t(PaymentStatusLabels[facturation.paymentStatus as PaymentStatusEnum]) ??
                            facturation.paymentStatus
                          }
                          color={getPaymentColor(facturation.paymentStatus) as any}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Box>
                    </>
                  )}
                </Stack>
              </Paper>
            </Grid>

            {/* Notes */}
            {reservation.notes && (
              <Grid size={{ xs: 12 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {t(Labels.reservation_notes)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {reservation.notes}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined">
            {t(Labels.common_close)}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return null;
}
