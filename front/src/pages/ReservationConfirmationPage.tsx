import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, CardActions, CardContent, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants';
import { Reservation } from '@/types';
import { ReservationContent } from '@/components/account/reservation/ReservationContent';
import { ReservationHeader } from '@/components/account/reservation/ReservationHeader';
import { getPaymentChipColor, getStatusChipColor } from '@/utils/reservation.utils';
import Labels from '@/labelKeys.json';
import SEO from '@/components/shared/SEO';
import { trackEvent } from '@/hooks/google-analytics.hook';

const ReservationConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const reservation = (location.state as { reservation?: Reservation } | null)?.reservation;

  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (reservation) {
      trackEvent('booking_completed', 'Booking', `Booking Confirmed: ${reservation.bookingReference}`);
    }
  }, [reservation]);

  const handleCreateAccount = () => {
    trackEvent('create_account_from_confirmation_clicked', 'Account', 'Create Account');
    if (reservation?.voyageur?.phone) {
      navigate(ROUTES.login[i18n.language], {
        state: {
          from: ROUTES.accountDetail[i18n.language],
          mode: 'register',
          prefillPhone: reservation.voyageur.phone,
          reservationSuccess: true,
        },
      });
    }
  };

  if (reservation) {
    return (
      <Box sx={{ minHeight: '100vh', maxWidth: 850, mx: 'auto', py: 2 }}>
        <SEO title={t(Labels.reservation_confirmation_title)} />

        <Alert severity="success" sx={{ mb: 3, borderRadius: 3, boxShadow: 1 }}>
          <Typography variant="h6">{t(Labels.reservation_confirmation_title)}</Typography>
        </Alert>

        {/* Reservation details — printable zone */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <ReservationHeader
              reservation={reservation}
              paymentStatus={reservation.facturation?.paymentStatus}
              getStatusChipColor={getStatusChipColor}
              getPaymentChipColor={getPaymentChipColor}
              theme={theme}
              language={i18n.language}
              t={t}
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent>
            <ReservationContent reservation={reservation} theme={theme} language={i18n.language} t={t} />
          </CardContent>
        </Card>

        {/* Account creation / reminder */}
        {skipped ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t(Labels.reservation_photo_reminder)}
          </Alert>
        ) : (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t(Labels.reservation_create_account_optional)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(Labels.reservation_create_account_description)}
              </Typography>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
              <Button fullWidth variant="contained" onClick={handleCreateAccount}>
                {t(Labels.authform_create_account)}
              </Button>
              <Button
                fullWidth
                variant="text"
                onClick={() => {
                  trackEvent('skip_account_creation_clicked', 'Account', 'Skip Account Creation');
                  setSkipped(true);
                }}
              >
                {t(Labels.reservation_skip_account_creation)}
              </Button>
            </CardActions>
          </Card>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography variant="h6" color="error">
        {t(Labels.payment_no_reservation_found)}
      </Typography>
      <Button variant="contained" onClick={() => navigate(ROUTES.home[i18n.language])} sx={{ mt: 2 }}>
        {t(Labels.payment_return_home)}
      </Button>
    </Box>
  );
};

export default ReservationConfirmationPage;
