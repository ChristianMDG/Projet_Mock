import React from 'react';
import { alpha, Avatar, Box, Chip, Grid, Stack, Theme, Typography } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PaymentIcon from '@mui/icons-material/Payment';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Labels from '@/labelKeys.json';
import { Reservation } from '@/types';
import { Seat } from '@/models/Seat';
import { formatCurrency, formatDateTime } from '@/utils/reservation-display.utils';
import { voyageDateUtils } from '@/utils/dayjs';
import { SeatDisplay } from './SeatDisplay';

interface ReservationDetailsProps {
  readonly reservation: Reservation;
  readonly t: (key: string) => string;
  readonly language: string;
  readonly theme: Theme;
  readonly seats?: Seat[];
  readonly seatsLoading?: boolean;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  t,
  seats,
  seatsLoading,
  reservation,
  language,
  theme,
}) => {
  const {
    voyage: { departureTime, estimatedArrivalTime },
  } = reservation;

  const duration =
    departureTime && estimatedArrivalTime
      ? voyageDateUtils.formatDuration(departureTime, estimatedArrivalTime)
      : undefined;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <CalendarTodayIcon
              color="primary"
              sx={{
                fontSize: 'small',
              }}
            />
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {t(Labels.voyage_departure)}
              <ArrowForwardIcon
                sx={{
                  mx: 0.5,
                  fontSize: 'inherit',
                }}
              />
              {formatDateTime(reservation.voyage!.departureTime, language)}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <AccessTimeIcon
              color="primary"
              sx={{
                fontSize: 'small',
              }}
            />
            <Typography variant="body2">{duration ?? t(Labels.duration_not_available_bad_road_conditions)}</Typography>
          </Stack>
          {reservation.voyage?.classe?.name && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
              }}
            >
              <WorkspacePremiumIcon
                color="primary"
                sx={{
                  fontSize: 'small',
                }}
              />
              <Chip
                label={`${t(Labels.ui_reservation_classe)}: ${reservation.voyage.classe.name}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>
          )}
        </Stack>
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <SeatDisplay seats={seats} isLoading={seatsLoading ?? false} t={t} skeletonCount={3} />
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
          }}
        >
          <Avatar variant="rounded" sx={{ width: 36, height: 36, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
            <PaymentIcon color="primary" />
          </Avatar>
          <Box>
            <Typography variant="h6">{t(Labels.payment_method)}</Typography>
            <Typography
              variant="subtitle2"
              color="text.primary"
              sx={{
                fontWeight: 'bold',
                display: 'block',
              }}
            >
              {formatCurrency(reservation.facturation?.totalAmount ?? reservation.totalAmount, language)}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};
