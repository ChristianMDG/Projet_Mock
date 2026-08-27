import { useState } from 'react';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/models/Voyage';
import { SeatConfig } from '@/types/type.props';
import { KrafterViewer } from '@/components/KrafterViewer';
import ButtonTx from '@/components/ui/ButtonTx';
import { ReservationFormDrawer } from '@/components/reservation';
import { Box } from '@mui/material';

interface SeatReservationProps {
  voyage: Voyage;
  multiSelect?: boolean;
}

export const SeatReservation = ({ voyage, multiSelect = true }: SeatReservationProps) => {
  const { t } = useTranslation();

  const [selectedSeats, setSelectedSeats] = useState<SeatConfig[]>([]);
  const [showReservationForm, setShowReservationForm] = useState(false);

  const handleMultiSelectSeat = (seatConfig: SeatConfig) => {
    setSelectedSeats(prev => {
      if (prev.some(sc => sc.id === seatConfig.id)) {
        return prev.filter(sc => sc.id !== seatConfig.id);
      } else {
        return [...prev, seatConfig];
      }
    });
  };

  const handleReserveSeats = () => {
    setShowReservationForm(true);
  };

  const handleCloseReservationForm = () => {
    setShowReservationForm(false);
    setSelectedSeats([]);
  };

  if (!voyage.id) {
    return null;
  }

  return (
    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <KrafterViewer
        voyage={voyage}
        selectedSeats={selectedSeats}
        onSelectSeat={handleMultiSelectSeat}
        multiSelect={multiSelect}
      />
      {selectedSeats.length > 0 && (
        <ButtonTx
          disableElevation={false}
          variant="contained"
          startIcon={<BookOnlineIcon />}
          onClick={handleReserveSeats}
          size="large"
          sx={{ my: 2, height: '48px' }}
        >
          {t(Labels.button_reserve_seats)} ({selectedSeats.length})
        </ButtonTx>
      )}

      <ReservationFormDrawer
        voyage={voyage}
        open={showReservationForm}
        selectedSeats={selectedSeats}
        onClose={handleCloseReservationForm}
      />
    </Box>
  );
};
