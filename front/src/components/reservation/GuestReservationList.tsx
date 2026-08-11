import { useState } from 'react';
import { useGuestReservationStore } from '@/stores/guest-reservation.store';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  useTheme,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';
import { useGuestReservations } from '@/hooks/reservation.hooks';
import { getPaymentChipColor, getStatusChipColor } from '@/utils/reservation.utils';
import { ReservationContent, ReservationHeader } from '@/components/account/reservation';
import { AccountReservationListSkeleton } from '@/skeleton';

import { StyledIcon } from '..';

export function GuestReservationList() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  // Zustand store
  const { phoneNumber, idNumber, searched, searchParams, setPhoneNumber, setIdNumber, setSearched, setSearchParams } =
    useGuestReservationStore();
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const {
    data: reservations,
    isLoading,
    error,
  } = useGuestReservations(searched ? searchParams.phoneNumber : '', searched ? searchParams.idNumber : '');

  const hasInput = Boolean(phoneNumber && idNumber);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasInput) {
      setSearchParams({ phoneNumber, idNumber });
      setSearched(true);
      setExpandedAccordion(false);
    }
  };

  const handleAccordionChange = (panelId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panelId : false);
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
            <Grid size={{ xs: 12, sm: 'grow' }}>
              <TextField
                fullWidth
                label={t(Labels.operator_form_phone_label)}
                placeholder={t(Labels.operator_form_phone_placeholder)}
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                autoComplete="tel"
                slotProps={{
                  htmlInput: { inputMode: 'tel' },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <StyledIcon icon={PhoneIcon} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 'grow' }}>
              <TextField
                fullWidth
                label={t(Labels.operator_form_idnumber_label)}
                placeholder={t(Labels.operator_form_idnumber_placeholder)}
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                autoComplete="off"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <StyledIcon icon={BadgeIcon} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 'auto' }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ height: 1 }}
                disabled={!hasInput || isLoading}
                startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
              >
                {t(Labels.reservation_form_search_user)}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {searched && isLoading && <AccountReservationListSkeleton count={3} />}

        {searched && error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {t(Labels.error_loading_reservations)}
          </Alert>
        )}

        <Alert severity="info" sx={{ mt: 2 }}>
          {t(Labels.guest_reservation_info_message)}
        </Alert>
        {searched && !isLoading && !error && !reservations?.length && (
          <Alert severity="warning" sx={{ mt: 2 }} icon={<StyledIcon icon={SearchIcon} />}>
            {t(Labels.reservation_not_found_check_info)}
          </Alert>
        )}
      </Paper>
      {searched && !isLoading && !!reservations?.length && (
        <Box sx={{ mt: 2 }}>
          {reservations.map(reservation => {
            const panelId = `reservation-${reservation.id}`;
            const isExpanded = expandedAccordion === panelId;
            const paymentStatus = reservation.facturation?.paymentStatus;

            return (
              <Accordion
                key={reservation.id}
                expanded={isExpanded}
                onChange={handleAccordionChange(panelId)}
                sx={{ mb: 1 }}
                elevation={1}
              >
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <ReservationHeader
                    reservation={reservation}
                    paymentStatus={paymentStatus}
                    getStatusChipColor={getStatusChipColor}
                    getPaymentChipColor={getPaymentChipColor}
                    theme={theme}
                    t={t}
                    language={i18n.language}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <ReservationContent reservation={reservation} theme={theme} language={i18n.language} t={t} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </>
  );
}

export default GuestReservationList;
