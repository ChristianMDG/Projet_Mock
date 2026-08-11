import React, { memo } from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { Seat } from './Seat';
import { SeatGridSkeleton } from './SeatGridSkeleton';
import { SeatStatus } from './constants';
import { Crafter } from '@/models/Crafter';
import { SeatConfig } from '@/types/type.props';
import { useCrafterConfig } from '@/hooks/crafter.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface SeatGridProps {
  crafter: Crafter;
  getSeatStatus: (seatNumber: number) => SeatStatus;
  onSeatClick: (seatConfig: SeatConfig) => void;
  readonly?: boolean;
}

/**
 * Grid component for rendering all seats based on crafter configuration
 */
export const SeatGrid: React.FC<SeatGridProps> = memo(({ crafter, getSeatStatus, onSeatClick, readonly = false }) => {
  const { data: config, isPending } = useCrafterConfig(crafter);
  const { t } = useTranslation();

  if (isPending) {
    return <SeatGridSkeleton />;
  }

  return (
    <Card sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
      <CardContent>
        {crafter && (
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            {t(Labels.crafter_seat_configuration_preview)}
            {crafter.model && crafter.registrationNumber && (
              <Typography component="span" variant="h6" sx={{ fontWeight: 600, ml: 1 }} color="text.primary">
                {crafter.registrationNumber}
              </Typography>
            )}
          </Typography>
        )}
        <Grid container spacing={1.5}>
          {config!.seats.map((row, rowIdx) => (
            <Grid
              container
              size={12}
              spacing={{ xs: 2, sm: 2, md: 3 }}
              key={`row-${rowIdx + 1}`}
              sx={{ mb: 1, display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}
            >
              {row.map(seat => {
                const status = getSeatStatus(seat.id);
                return (
                  <Grid size={seat.hide ? 'auto' : 12 / row.length} key={`seat-${seat.id}`} sx={{ display: 'flex' }}>
                    {seat.hide ? (
                      <></>
                    ) : (
                      <Seat
                        seatConfig={seat}
                        seatStatus={status}
                        onSeatClick={readonly ? (_seatConfig: SeatConfig) => {} : onSeatClick}
                        readonly={readonly}
                        t={t}
                      />
                    )}
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
});

SeatGrid.displayName = 'SeatGrid';
