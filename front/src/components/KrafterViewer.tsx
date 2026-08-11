import React from 'react';
import { Alert, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/models/Voyage';
import { SeatConfig } from '@/types/type.props';
import { useSeatManagement } from '@/hooks/seat.hooks';
import { SeatGrid } from './seats/SeatGrid';
import { Crafter } from '@/models/Crafter';

export interface KrafterViewerProps {
  voyage?: Voyage;
  selectedSeats?: SeatConfig[];
  onSelectSeat?: (seatConfig: SeatConfig) => void;
  multiSelect?: boolean;
  readonly?: boolean;
  viewLoading?: boolean;
}

export const KrafterViewer: React.FC<KrafterViewerProps> = ({
  voyage,
  selectedSeats = [],
  onSelectSeat,
  multiSelect = false,
  readonly = false,
  viewLoading = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { loading, error, getSeatStatus, handleSeatClick } = useSeatManagement({
    voyage,
    selectedSeats,
    onSelectSeat,
    multiSelect,
  });

  if (loading || viewLoading) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          display: 'inline-block',
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography>{t(Labels.loading)}</Typography>
      </Paper>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t(Labels[error as keyof typeof Labels] || error)}
        </Alert>
      )}
      <SeatGrid
        crafter={voyage?.crafter ?? ({} as Crafter)}
        getSeatStatus={getSeatStatus}
        onSeatClick={handleSeatClick}
        readonly={readonly}
      />
    </>
  );
};
