import { Box, Avatar, Typography, alpha, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import type { Reservation } from '@/types/reservation.types';
import { useSeatsByVoyageAndReservation } from '@/hooks/seat.hook';
import { useReservation } from '@/hooks/reservation.hook';
import ReservationDetailContent from '@/components/reservation/ReservationDetailContent';
import { ReservationStatusChip } from '@/components/reservation/ReservationStatusChip';
import { PhoneLink } from '@/components/shared';

interface RecentReservationAccordionProps {
  r: Reservation;
  defaultExpanded: boolean;
}

export function RecentReservationAccordion({ r, defaultExpanded }: RecentReservationAccordionProps) {
  const { data: fullReservation } = useReservation(r.id);
  const res = fullReservation ?? r;

  const voyageId = res.voyage?.id;
  const reservationId = res.id;

  const { data: seats = [], isLoading: seatsLoading } = useSeatsByVoyageAndReservation(voyageId, reservationId);

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={(theme) => ({
        border: 'none',
        boxShadow: 1,
        borderRadius: '12px !important',
        overflow: 'hidden',
        '&:before': { display: 'none' },
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        transition: 'all 0.2s ease-in-out',
      })}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={(theme) => ({
          p: 1.5,
          minHeight: 48,
          '& .MuiAccordionSummary-content': { m: 0 },
          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) },
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
              {res.voyageur?.firstName?.[0] ?? '?'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {res.voyageur ? `${res.voyageur.firstName} ${res.voyageur.lastName}` : res.bookingReference}
              </Typography>
              <PhoneLink
                phone={res.voyageur?.phone}
                fallback={res.bookingReference}
                stopPropagation
                sx={{ fontSize: '0.78rem', fontWeight: 700 }}
              />
            </Box>
          </Box>
          <ReservationStatusChip status={res.status} />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 1.5, sm: 2 }, pt: 0 }}>
        <Divider sx={{ mb: 1.5, opacity: 0.5 }} />
        <ReservationDetailContent reservation={res} seats={seats} seatsLoading={seatsLoading} />
      </AccordionDetails>
    </Accordion>
  );
}

export default RecentReservationAccordion;
