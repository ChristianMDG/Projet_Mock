import React, { memo } from 'react';
import { Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface SeatLegendProps {
  showLegend: boolean;
}

/**
 * Enhanced legend component showing all seat status types
 */
export const SeatLegend: React.FC<SeatLegendProps> = memo(({ showLegend }) => {
  const { t } = useTranslation();

  if (!showLegend) return null;

  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Chip
        size="small"
        label={t(Labels.seat_selector_available)}
        sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}
      />
      <Chip
        size="small"
        label={t(Labels.seat_selector_reserved)}
        sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}
      />
      <Chip
        size="small"
        label={t(Labels.seat_selector_selected)}
        sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
      />
      <Chip
        size="small"
        label={t(Labels.enum_seat_status_blocked)}
        sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}
      />
      <Chip
        size="small"
        label={t(Labels.seat_configuration_status_damaged)}
        sx={{ bgcolor: 'grey.500', color: 'grey.50' }}
      />
    </Box>
  );
});

SeatLegend.displayName = 'SeatLegend';
