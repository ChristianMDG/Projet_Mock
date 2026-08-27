import React from 'react';
import { alpha, Avatar, Box, Chip, ChipProps, Stack, Theme, Typography } from '@mui/material';

import { PaymentStatusEnum, PaymentStatusLabels, ReservationStatusEnum, ReservationStatusLabels } from '@/models/enums';
import TaxibrousseRedIcon from '@/components/ui/TaxibrousseRedIcon';
import { Reservation } from '@/types';
import dayjs from '@/utils/dayjs';
import KoperativeVerifiedIcon from '@/components/shared/KoperativeVerifiedIcon';
import VoyageTypeChip from '@/components/voyage/VoyageTypeChip';

interface ReservationHeaderProps {
  reservation: Reservation;
  paymentStatus?: PaymentStatusEnum;
  getStatusChipColor: (status?: ReservationStatusEnum) => ChipProps['color'];
  getPaymentChipColor: (status?: PaymentStatusEnum) => ChipProps['color'];
  theme: Theme;
  t: (key: string) => string;
  language: string;
}

export const ReservationHeader: React.FC<ReservationHeaderProps> = ({
  reservation,
  paymentStatus,
  getStatusChipColor,
  getPaymentChipColor,
  language,
  theme,
  t,
}) => {
  const { voyage } = reservation;

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
        }}
      >
        <Avatar
          variant="rounded"
          src={voyage?.koperative?.logoUrl}
          alt={voyage?.koperative?.name}
          sx={{ width: 56, height: 56, bgcolor: alpha(theme.palette.primary.main, 0.08) }}
        >
          {voyage?.koperative?.name?.[0] ?? '?'}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{voyage?.koperative?.name}</span>
            <KoperativeVerifiedIcon koperative={voyage?.koperative} fontSize="inherit" />
          </Typography>
          <Typography
            variant="body2"
            component="h4"
            color="text.secondary"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {voyage?.departureGare?.ville?.name}
            <TaxibrousseRedIcon sx={{ fontSize: 11, mx: 0.5 }} />
            {voyage?.arrivalGare?.ville?.name}
          </Typography>
        </Box>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {reservation.status && (
          <Chip
            label={t(ReservationStatusLabels[reservation.status])}
            size="small"
            color={getStatusChipColor(reservation.status)}
          />
        )}
        {paymentStatus && (
          <Chip
            label={t(PaymentStatusLabels[paymentStatus])}
            size="small"
            variant="outlined"
            color={getPaymentChipColor(paymentStatus)}
          />
        )}
        {voyage?.typeVoyage && <VoyageTypeChip type={voyage.typeVoyage} size="small" />}
        <Typography variant="body1" color="text.primary">
          {dayjs(voyage!.departureTime).locale(language).format('ddd DD MMM YYYY')}
        </Typography>
      </Stack>
    </Stack>
  );
};
