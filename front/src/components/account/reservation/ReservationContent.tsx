import { Alert, Divider, Grid, Stack, Theme, Typography } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import Labels from '@/labelKeys.json';
import { Reservation } from '@/models/Reservation';
import { useSeatsByReservation } from '@/hooks/seat.hooks';
import { PaymentSummary, ReservationDetails, VoyageDetails } from './';

interface ReservationContentProps {
  readonly theme: Theme;
  readonly language: string;
  readonly t: (key: string) => string;
  readonly reservation: Reservation;
}

export function ReservationContent(props: ReservationContentProps) {
  const { data: seats, isLoading: seatsLoading } = useSeatsByReservation(props.reservation.id);

  return (
    <>
      <ReservationDetails {...props} seats={seats} seatsLoading={seatsLoading} />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12 }}>
          <PaymentSummary {...props} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <VoyageDetails {...props} seats={seats} seatsLoading={seatsLoading} />
        </Grid>
      </Grid>
      {props.reservation.notes && (
        <Alert
          icon={
            <NoteAltOutlinedIcon
              sx={{
                fontSize: 'inherit',
              }}
            />
          }
          severity="info"
          sx={{ mt: 2 }}
        >
          {props.reservation.notes}
        </Alert>
      )}
      <Divider sx={{ my: 2 }} />
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
        }}
      >
        <ConfirmationNumberIcon
          color="primary"
          sx={{
            fontSize: 'small',
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {props.t(Labels.reservation_reference)}: {props.reservation.bookingReference}
        </Typography>
      </Stack>
    </>
  );
}

export default ReservationContent;
