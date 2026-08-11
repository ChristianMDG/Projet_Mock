import React, { useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, Container, Divider, Stack, Typography } from '@mui/material';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import EventSeatRoundedIcon from '@mui/icons-material/EventSeatRounded';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useFilteredVoyages } from '@/hooks/voyage.hooks';
import { SeatBooking } from '@/components/seat';
import { AuthorityEnum, VoyageStatusEnum } from '@/models/enums';
import { Voyage } from '@/models/Voyage';
import Labels from '@/labelKeys.json';
import dayjs from '@/utils/dayjs';
import SEO from '@/components/shared/SEO';

const VoyageBookingCard: React.FC<{ voyage: Voyage }> = ({ voyage }) => {
  const { t } = useTranslation();
  const [showSeatBooking, setShowSeatBooking] = useState(false);

  const departureLabel = dayjs(voyage.departureTime).format('DD/MM/YYYY HH:mm');
  const from = voyage.departureGare?.name ?? '—';
  const to = voyage.arrivalGare?.name ?? '—';

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            alignItems: { sm: 'center' },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                mb: 0.5,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'medium',
                }}
              >
                {from}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                →
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'medium',
                }}
              >
                {to}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              useFlexGap
              sx={{
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {t(Labels.voyage_table_departure)}: {departureLabel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(Labels.voyage_available_seats)}: {voyage.availableSeats ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(Labels.voyage_table_price)}: {voyage.pricePerSeat} Ar
              </Typography>
            </Stack>
          </Box>
          <Chip
            icon={<EventSeatRoundedIcon />}
            label={t(Labels.reservation_confirmed_success).includes('success') ? 'Réserver' : 'Réserver'}
            color="primary"
            onClick={() => setShowSeatBooking(prev => !prev)}
            sx={{ cursor: 'pointer' }}
          />
        </Stack>

        {showSeatBooking && (
          <Box
            sx={{
              mt: 2,
            }}
          >
            <Divider sx={{ mb: 2 }} />
            <SeatBooking
              voyage={voyage}
              onBookingComplete={() => setShowSeatBooking(false)}
              enableBookingFlow
              showAdvancedControls={false}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const OperatorBookingPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const isOperator = user?.authorities?.some(a => a.name === AuthorityEnum.OPERATOR) ?? false;
  const koperative = user?.koperative;
  const departureGare = user?.departureGare;

  const { data: voyages = [], isLoading } = useFilteredVoyages({
    koperativeId: koperative?.id,
    departureGareId: departureGare?.id,
    statuses: [VoyageStatusEnum.SCHEDULED, VoyageStatusEnum.ONGOING],
  });

  if (!isOperator) {
    return (
      <Container
        sx={{
          pt: 4,
          maxWidth: 'md',
        }}
      >
        <Alert severity="warning">{t(Labels.operator_confirm_warning)}</Alert>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        pt: 3,
        pb: 4,
        maxWidth: 'lg',
      }}
    >
      <SEO title={t(Labels.operator_booking_title)} />
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          mb: 1,
        }}
      >
        {t(Labels.operator_booking_title)}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 3,
        }}
      >
        {t(Labels.voyage_management_operator_subtitle)}
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 3,
        }}
      >
        {koperative ? (
          <Chip icon={<BusinessRoundedIcon />} label={koperative.name} variant="outlined" />
        ) : (
          <Alert severity="error" sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'medium',
              }}
            >
              {t(Labels.operator_no_koperative)}
            </Typography>
            <Typography variant="body2">{t(Labels.operator_no_koperative_hint)}</Typography>
          </Alert>
        )}
        {departureGare && <Chip icon={<LocationOnRoundedIcon />} label={departureGare.name} variant="outlined" />}
      </Stack>
      {koperative && (
        <>
          {isLoading && <Typography color="text.secondary">{t(Labels.operator_loading)}</Typography>}

          {!isLoading && voyages.length === 0 && (
            <Alert severity="info">{t(Labels.operator_booking_voyages_empty)}</Alert>
          )}

          <Stack spacing={2}>
            {voyages.map(voyage => (
              <VoyageBookingCard key={voyage.id} voyage={voyage} />
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default OperatorBookingPage;
