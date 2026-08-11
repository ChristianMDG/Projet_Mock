import React from 'react';
import { Alert, Box, Button, Chip, Collapse, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { KrafterViewer } from '@/components/KrafterViewer';
import { SeatConfig } from '@/types/type.props';
import { Voyage } from '@/models/Voyage';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import { usePaymentStore } from '@/stores/payment.store';
import { useSeatManagement } from '@/hooks/seat.hooks';
import { useTranslation } from 'react-i18next';
import { generateRoute } from '@/constants/routes';
import Labels from '@/labelKeys.json';
import PaymentMethods from '@/components/payment/PaymentMethods';
import SeatSelectionPanelSkeleton from './SeatSelectionPanelSkeleton';

interface SeatSelectionPanelProps {
  voyage: Voyage;
  onSeatSelect?: (seats: SeatConfig[]) => void;
}

export const SeatSelectionPanel: React.FC<SeatSelectionPanelProps> = ({ voyage, onSeatSelect }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { selectedSeats, expandedVoyageId, addSelectedSeat, removeSelectedSeat } = useSeatSelectionStore();
  const resetPaymentFlow = usePaymentStore(s => s.resetPaymentFlow);

  const voyageId = voyage.id ?? 0;
  const voyageSelectedSeats = selectedSeats[voyageId] ?? [];

  function handleSeatSelect(seat: SeatConfig) {
    const isSelected = voyageSelectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      removeSelectedSeat(voyageId, seat.id);
      onSeatSelect?.(voyageSelectedSeats.filter(s => s.id !== seat.id));
    } else {
      addSelectedSeat(voyageId, seat);
      onSeatSelect?.([...voyageSelectedSeats, seat]);
    }
  }

  function handleReservationClick() {
    if (voyageSelectedSeats.length) {
      resetPaymentFlow();
      navigate(generateRoute.paymentVoyage(voyageId, i18n.language));
    }
  }

  const { loading, error, reservedSeatsCount } = useSeatManagement({
    voyage,
    selectedSeats: voyageSelectedSeats,
    onSelectSeat: handleSeatSelect,
    multiSelect: true,
  });

  // Calculate total selectable seats from crafter config (non-hidden, non-disabled seats)
  const totalSelectableSeats = voyage.crafter?.seatCapacity ?? 0;

  // Calculate actual available seats (total selectable - already reserved)
  const actualAvailableSeats = Math.max(0, totalSelectableSeats - reservedSeatsCount);

  // Calculate remaining available seats after current selection
  const remainingAvailableSeats = Math.max(0, actualAvailableSeats - voyageSelectedSeats.length);

  // Calculate total reserved seats (already reserved + currently selected)
  const totalReservedSeats = reservedSeatsCount + voyageSelectedSeats.length;
  const isExpanded = expandedVoyageId === voyageId;

  return (
    <Collapse in={isExpanded} timeout={350} unmountOnExit>
      <Box sx={{ mt: { xs: 2, md: 4 } }}>
        {loading ? (
          <SeatSelectionPanelSkeleton />
        ) : error ? (
          <Alert severity="error">{t(Labels.error_loading_voyages)}</Alert>
        ) : (
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
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
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
                {voyage.classe?.name && (
                  <Chip label={voyage.classe.name} size="small" color="secondary" variant="outlined" />
                )}
              </Box>
              {!!voyageSelectedSeats.length && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    {t(Labels.selected_seats)}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {voyageSelectedSeats.map((seat: SeatConfig) => (
                      <Chip
                        key={seat.id}
                        label={`Place ${seat.position}`}
                        color="primary"
                        variant="outlined"
                        onDelete={() => handleSeatSelect(seat)}
                      />
                    ))}
                  </Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>{t(Labels.ui_total)}: </strong>
                      {voyageSelectedSeats.length} place{voyageSelectedSeats.length > 1 ? 's' : ''} ×{' '}
                      {voyage.pricePerSeat.toLocaleString('fr-FR')} Ar =
                      <strong> {(voyageSelectedSeats.length * voyage.pricePerSeat).toLocaleString('fr-FR')} Ar</strong>
                    </Typography>
                  </Alert>
                  <Button variant="contained" fullWidth size="large" sx={{ mb: 1 }} onClick={handleReservationClick}>
                    {t(Labels.button_reserve_seats)} {voyageSelectedSeats.length} place
                    {voyageSelectedSeats.length > 1 ? 's' : ''}
                  </Button>
                </Box>
              )}
              <PaymentMethods showDesc={false} />
            </Grid>
          </Grid>
        )}
      </Box>
    </Collapse>
  );
};
