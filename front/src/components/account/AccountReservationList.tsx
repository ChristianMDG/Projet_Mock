import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';
import { useReservationsByVoyageurId } from '@/hooks/reservation.hooks';
import { useAuthStore } from '@/stores/auth.store';
import { getPaymentChipColor, getStatusChipColor } from '@/utils/reservation.utils';

import { ReservationContent, ReservationHeader } from './reservation';
import { AccountReservationListSkeleton } from '@/skeleton';

export function AccountReservationList() {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();

  const [expandedAccordion, setExpandedAccordion] = React.useState<string | false>(false);
  const { data: reservations, isLoading, error } = useReservationsByVoyageurId(user?.id ?? 0);

  const handleAccordionChange = (panelId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panelId : false);
  };

  if (isLoading) {
    return <AccountReservationListSkeleton count={3} />;
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" component="h2">
          {t(Labels.nav_my_reservations)}
        </Typography>
        <Alert severity="error" sx={{ mt: 2 }}>
          {t(Labels.error_loading_reservations)}
        </Alert>
      </Paper>
    );
  }

  if (!reservations?.length) {
    return (
      <Paper sx={{ p: 3, border: '1px dashed', borderColor: 'divider' }}>
        <Typography variant="h6" component="h2">
          {t(Labels.nav_my_reservations)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t(Labels.no_reservations_description)}
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {reservations?.map(reservation => {
        const { facturation } = reservation;
        const paymentStatus = facturation?.paymentStatus;

        return (
          <Accordion
            key={reservation.id}
            expanded={expandedAccordion === `panel-${reservation.id}`}
            onChange={handleAccordionChange(`panel-${reservation.id}`)}
            slotProps={{
              transition: { unmountOnExit: true },
              heading: { component: 'h3' },
            }}
            sx={{
              borderRadius: 3,
              '&:before': { display: 'none' },
              '&.Mui-expanded': {
                boxShadow: theme => theme.shadows[2],
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls={`panel-${reservation.id}-content`}
              id={`panel-${reservation.id}-header`}
            >
              <ReservationHeader
                reservation={reservation}
                paymentStatus={paymentStatus}
                getStatusChipColor={getStatusChipColor}
                getPaymentChipColor={getPaymentChipColor}
                theme={theme}
                language={i18n.language}
                t={t}
              />
            </AccordionSummary>

            <AccordionDetails sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <ReservationContent reservation={reservation} language={i18n.language} theme={theme} t={t} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}

export default AccountReservationList;
