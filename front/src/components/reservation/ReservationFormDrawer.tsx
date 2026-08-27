import { SwipeableDrawer } from '@mui/material';
import { Voyage } from '@/models/Voyage';
import { SeatConfig } from '@/types/type.props';
import { ReservationFormCard } from '@/components/reservation/ReservationFormCard';
import React, { useEffect } from 'react';
import { trackEvent } from '@/hooks/google-analytics.hook';

interface ReservationFormDrawerProps {
  open: boolean;
  onClose: () => void;
  voyage: Voyage;
  selectedSeats: SeatConfig[];
  onSuccess?: (reservationCode: string) => void;
}

export const ReservationFormDrawer: React.FC<ReservationFormDrawerProps> = ({
  open,
  onClose,
  voyage,
  selectedSeats,
  onSuccess,
}) => {
  useEffect(() => {
    if (open) {
      trackEvent('reservation_form_opened', 'Booking');
    }
  }, [open]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen={false}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%' },
          maxWidth: 600,
          margin: '0 auto',
          bgcolor: 'inherit',
        },
      }}
    >
      <ReservationFormCard voyage={voyage} selectedSeats={selectedSeats} onClose={onClose} onSuccess={onSuccess} />
    </SwipeableDrawer>
  );
};
