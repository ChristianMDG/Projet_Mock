import React from 'react';
import { Chip, Skeleton, Stack, Typography } from '@mui/material';
import Labels from '@/labelKeys.json';
import { Seat } from '@/models/Seat';

interface SeatDisplayProps {
  seats?: Seat[];
  isLoading: boolean;
  skeletonCount?: number;
  t: (key: string) => string;
}

export const SeatDisplay: React.FC<SeatDisplayProps> = ({ seats, isLoading, t, skeletonCount = 3 }) => {
  const seatLabels = React.useMemo(() => {
    return seats?.map(seat => seat.position ?? `${seat.seatNum}`) ?? [];
  }, [seats]);

  if (isLoading) {
    return (
      <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <Skeleton
            key={index}
            variant="circular"
            sx={{
              width: 32,
              height: 24,
            }}
          />
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      <Typography
        variant="h6"
        color="text.primary"
        sx={{
          fontWeight: 600,
        }}
      >
        {t(Labels.reserved_seats)}
      </Typography>
      {seatLabels.length ? (
        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {seatLabels.map(seat => (
            <Chip key={seat} size="small" sx={{ fontWeight: 'bold' }} label={seat} variant="outlined" />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t(Labels.no_seats_message)}
        </Typography>
      )}
    </Stack>
  );
};
