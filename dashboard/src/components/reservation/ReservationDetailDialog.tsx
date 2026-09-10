import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ConfirmationNumber } from '@mui/icons-material';
import type { Reservation, ReservationStatusEnum } from '@/types/reservation.types';
import { useSeatsByVoyageAndReservation } from '@/hooks/seat.hook';
import Labels from '@/labelKeys.json';
import ReservationDetailContent from '@/components/reservation/ReservationDetailContent';
import { ReservationStatusChip } from '@/components/reservation/ReservationStatusChip';

interface ReservationDetailDialogProps {
  reservation: Reservation | null;
  open: boolean;
  onClose: () => void;
}

export default function ReservationDetailDialog({ reservation, open, onClose }: ReservationDetailDialogProps) {
  const { t } = useTranslation();

  const voyageId = reservation?.voyage?.id;
  const reservationId = reservation?.id;

  const { data: seats = [], isLoading: seatsLoading } = useSeatsByVoyageAndReservation(
    open && voyageId ? voyageId : undefined,
    open && reservationId ? reservationId : undefined
  );

  if (reservation) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 36,
                height: 36,
              }}
            >
              <ConfirmationNumber fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                {t(Labels.reservation_detail_title)} {reservation.bookingReference}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID #{reservation.id}
              </Typography>
            </Box>
          </Box>
          <ReservationStatusChip status={reservation.status as ReservationStatusEnum} />
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 2.5 }}>
          <ReservationDetailContent reservation={reservation} seats={seats} seatsLoading={seatsLoading} />
        </DialogContent>

        <Divider />

        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={onClose} variant="outlined" size="small">
            {t(Labels.reservation_close)}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return null;
}
