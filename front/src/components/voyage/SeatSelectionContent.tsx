import React from 'react';
import { Alert, Box, Button, Chip, Grid, Typography } from '@mui/material';
import { KrafterViewer } from '@/components/KrafterViewer';
import { SeatConfig } from '@/types/type.props';
import { Voyage } from '@/models/Voyage';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import PaymentMethods from '@/components/payment/PaymentMethods';
import SeatSelectionPanelSkeleton from './SeatSelectionPanelSkeleton';
import StoreIcon from '@mui/icons-material/Store';
import StyledIcon from '@/components/ui/StyledIcon';

interface SeatSelectionContentProps {
  loading: boolean;
  error: string | null;
  voyage: Voyage;
  voyageSelectedSeats: SeatConfig[];
  hasSelectedSeats: boolean;
  remainingAvailableSeats: number;
  totalReservedSeats: number;
  hasClass: boolean;
  handleSeatSelect: (seat: SeatConfig) => void;
  handleReservationClick: () => void;
  getSeatLabel: (seatCount: number) => string;
  lastBookedDate?: string;
}

export const SeatSelectionContent: React.FC<SeatSelectionContentProps> = ({
  loading,
  error,
  voyage,
  voyageSelectedSeats,
  hasSelectedSeats,
  remainingAvailableSeats,
  totalReservedSeats,
  hasClass,
  handleSeatSelect,
  handleReservationClick,
  getSeatLabel,
  lastBookedDate,
}) => {
  const { t } = useTranslation();

  if (loading) return <SeatSelectionPanelSkeleton />;
  if (error) return <Alert severity="error">{t(Labels.error_loading_voyages)}</Alert>;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <KrafterViewer
          voyage={voyage}
          selectedSeats={voyageSelectedSeats}
          onSelectSeat={handleSeatSelect}
          multiSelect={true}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ mt: 2, display: { xs: 'none', md: 'flex' }, gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label={`${remainingAvailableSeats} ${t(Labels.seat_available)}`}
            color="success"
            variant="outlined"
            size="small"
          />
          <Chip
            label={`${totalReservedSeats} ${t(Labels.seat_reserved)}`}
            color="error"
            variant="outlined"
            size="small"
          />
          {hasClass && <Chip label={voyage.classe?.name} size="small" color="secondary" variant="outlined" />}
        </Box>
        {lastBookedDate && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <StyledIcon icon={StoreIcon} sx={{ fontSize: 18 }} />
            <Typography
              variant="caption"
              sx={{
                fontStyle: 'italic',
                color: 'text.secondary',
              }}
            >
              {t(Labels.seat_last_booked_at, { date: lastBookedDate })}
            </Typography>
          </Box>
        )}
        {hasSelectedSeats && (
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>{t(Labels.ui_total)}: </strong>
                {voyageSelectedSeats.length} place{getSeatLabel(voyageSelectedSeats.length)} ×{' '}
                {voyage.pricePerSeat.toLocaleString('fr-FR')} Ar =
                <strong> {(voyageSelectedSeats.length * voyage.pricePerSeat).toLocaleString('fr-FR')} Ar</strong>
              </Typography>
            </Alert>
            <Button variant="contained" fullWidth size="large" sx={{ mb: 1 }} onClick={handleReservationClick}>
              {t(Labels.button_reserve_seats)} {voyageSelectedSeats.length} place
              {getSeatLabel(voyageSelectedSeats.length)}
            </Button>
          </Box>
        )}
        <PaymentMethods showDesc={false} />
      </Grid>
    </Grid>
  );
};
