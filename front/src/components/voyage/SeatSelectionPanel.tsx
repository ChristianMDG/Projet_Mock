import React, { useMemo } from 'react';
import { Box, Collapse } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SeatConfig } from '@/types/type.props';
import { Voyage } from '@/models/Voyage';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import { usePaymentStore } from '@/stores/payment.store';
import { useSeatManagement } from '@/hooks/seat.hooks';
import { useTranslation } from 'react-i18next';
import { generateRoute } from '@/constants/routes';
import { SeatSelectionContent } from './SeatSelectionContent';
import { SeatStatusEnum } from '@/models/enums';
import { formatDate } from '@/utils/reservation-display.utils';

interface SeatSelectionPanelProps {
  voyage: Voyage;
  onSeatSelect?: (seats: SeatConfig[]) => void;
}

export const SeatSelectionPanel: React.FC<SeatSelectionPanelProps> = ({ voyage, onSeatSelect }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { selectedSeats, expandedVoyageId, addSelectedSeat, removeSelectedSeat } = useSeatSelectionStore();
  const resetPaymentFlow = usePaymentStore(s => s.resetPaymentFlow);

  const voyageId = voyage.id ?? 0;
  const voyageSelectedSeats = selectedSeats[voyageId] ?? [];
  const hasSelectedSeats = voyageSelectedSeats.length > 0;

  const getSeatLabel = (seatCount: number) => {
    return seatCount > 1 ? 's' : '';
  };

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
    if (hasSelectedSeats) {
      resetPaymentFlow();
      navigate(generateRoute.paymentVoyage(voyageId, i18n.language));
    }
  }

  const { loading, error, remainingAvailableSeats, totalReservedSeats, seats } = useSeatManagement({
    voyage,
    selectedSeats: voyageSelectedSeats,
    onSelectSeat: handleSeatSelect,
    multiSelect: true,
  });

  const lastBookedDate = useMemo(() => {
    return seats
      .filter(s => s.seatStatus === SeatStatusEnum.RESERVED && s.createdAt)
      .map(s => s.createdAt!)
      .sort()
      .at(-1);
  }, [seats]);

  const formattedLastBookedDate = useMemo(() => {
    return lastBookedDate ? formatDate(lastBookedDate, i18n.language) : undefined;
  }, [lastBookedDate, i18n.language]);

  const isExpanded = expandedVoyageId === voyageId;
  const hasClass = Boolean(voyage.classe?.name);

  return (
    <Collapse in={isExpanded} timeout={350} unmountOnExit>
      <Box sx={{ mt: { xs: 2, md: 4 } }}>
        <SeatSelectionContent
          loading={loading}
          error={error}
          voyage={voyage}
          voyageSelectedSeats={voyageSelectedSeats}
          hasSelectedSeats={hasSelectedSeats}
          remainingAvailableSeats={remainingAvailableSeats}
          totalReservedSeats={totalReservedSeats}
          hasClass={hasClass}
          handleSeatSelect={handleSeatSelect}
          handleReservationClick={handleReservationClick}
          getSeatLabel={getSeatLabel}
          lastBookedDate={formattedLastBookedDate}
        />
      </Box>
    </Collapse>
  );
};
