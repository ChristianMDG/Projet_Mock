import { Typography, Box, Chip, Divider, Grid, Stack, alpha, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DirectionsBus, CalendarToday, Phone, EventSeat, Business, Notes as NotesIcon } from '@mui/icons-material';
import type { Reservation } from '@/types/reservation.types';
import type { Seat } from '@/types/voyage.types';
import Labels from '@/labelKeys.json';
import { formatDateCustom } from '@/utils/format';
import { PhoneLink } from '@/components/shared';

interface ReservationDetailContentProps {
  reservation: Reservation;
  seats: Seat[];
  seatsLoading: boolean;
}

const formatCurrency = (amount?: number | null) => `${(amount ?? 0).toLocaleString('fr-FR')} Ar`;
const formatDepartureDate = (iso?: string) => formatDateCustom(iso, 'dddd D MMMM YYYY à HH:mm');

const OPERATOR_DISPLAY_NAMES: Record<string, string> = {
  MVOLA: 'MVola',
  ORANGE: 'Orange Money',
  AIRTEL: 'Airtel Money',
};

const formatOperatorName = (operator?: string): string => {
  if (operator) {
    const normalized = operator.toUpperCase();
    return OPERATOR_DISPLAY_NAMES[normalized] || operator;
  }
  return 'N/A';
};

const formatReservationNotes = (reservation: Reservation, fetchedSeats: Seat[]): string => {
  const { notes, facturation, voyageur } = reservation;
  if (notes) {
    const operator = formatOperatorName(facturation?.paymentMethodIdentifier);
    const phone = facturation?.paymentPhoneNumber || voyageur?.phone || 'N/A';
    const seatList = fetchedSeats.length > 0 ? fetchedSeats.map((s) => s.position ?? s.seatNum).join(', ') : 'Aucun';

    return notes.replace('{operator}', operator).replace('{phone}', phone).replace('{seats}', seatList);
  }
  return '';
};

export default function ReservationDetailContent({ reservation, seats, seatsLoading }: ReservationDetailContentProps) {
  const { t } = useTranslation();

  const voyage = reservation.voyage;
  const facturation = reservation.facturation;
  const hasNotes = Boolean(reservation.notes);

  const showSkeleton = seatsLoading;
  const hasSeats = seats.length > 0;
  const showSeats = Boolean(!seatsLoading && hasSeats);

  const montantTransfert = facturation?.montantTransfert ?? 0;

  return (
    <Grid container spacing={{ xs: 1.5, sm: 2.5 }} alignItems="center">
      {/* Route & Departure */}
      {voyage && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <DirectionsBus sx={{ fontSize: '1.15rem', color: 'primary.main', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                {`${voyage.departureGare?.ville?.name ?? voyage.departureCity ?? '?'} → ${voyage.arrivalGare?.ville?.name ?? voyage.arrivalCity ?? '?'}`}
              </Typography>
            </Box>

            {voyage.departureTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <CalendarToday sx={{ fontSize: '1rem', color: 'text.secondary', flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontSize: { xs: '0.78rem', sm: '0.825rem' }, fontWeight: 500 }}
                >
                  {formatDepartureDate(voyage.departureTime)}
                </Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      )}

      {/* Koperative, Seats & Transfer Amount */}
      <Grid size={{ xs: 12, sm: voyage ? 6 : 12 }}>
        <Stack spacing={1}>
          {/* Koperative & Phone */}
          {voyage?.koperative && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Business sx={{ fontSize: '1.1rem', color: 'primary.main', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.825rem', sm: '0.875rem' } }}>
                  {voyage.koperative.name || 'N/A'}
                </Typography>
              </Box>

              {voyage.koperative.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Phone sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                  <PhoneLink phone={voyage.koperative.phone} sx={{ fontWeight: 600, fontSize: '0.8rem' }} />
                </Box>
              )}
            </Box>
          )}

          {/* Seats chips & Montant transfert */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}
          >
            {/* Seats */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EventSeat sx={{ fontSize: '1.05rem', color: 'text.secondary', flexShrink: 0 }} />
              {showSkeleton ? (
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[1, 2].map((i) => (
                    <Skeleton key={i} variant="rounded" width={38} height={22} sx={{ borderRadius: 1 }} />
                  ))}
                </Box>
              ) : showSeats ? (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {seats.map((seat) => (
                    <Chip
                      key={seat.id}
                      label={seat.position ?? seat.seatNum}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={(theme) => ({
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 22,
                        px: 0.25,
                        borderColor: alpha(theme.palette.primary.main, 0.4),
                      })}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Aucune place
                </Typography>
              )}
            </Box>

            {/* Montant transfert */}
            {montantTransfert > 0 && (
              <Chip
                label={`${t(Labels.reservation_a_transferer)} : ${formatCurrency(montantTransfert)}`}
                size="small"
                sx={(theme) => ({
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  height: 22,
                  bgcolor: alpha(theme.palette.success.main, 0.08),
                  color: 'success.main',
                  border: '1px solid',
                  borderColor: alpha(theme.palette.success.main, 0.2),
                })}
              />
            )}
          </Box>
        </Stack>
      </Grid>

      {/* Notes */}
      {hasNotes && (
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ mb: 1, opacity: 0.5 }} />
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              p: 1,
              bgcolor: alpha(theme.palette.action.hover, 0.04),
              borderRadius: 1.5,
            })}
          >
            <NotesIcon sx={{ fontSize: '1rem', color: 'text.secondary', mt: 0.2, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.78rem', sm: '0.825rem' } }}>
              {formatReservationNotes(reservation, seats)}
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
}
