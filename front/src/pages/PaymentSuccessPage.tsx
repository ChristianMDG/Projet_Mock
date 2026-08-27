import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import NotesOutlined from '@mui/icons-material/NotesOutlined';
import { useTranslation } from 'react-i18next';
import { useVoyage } from '@/hooks/voyage.hooks';
import { useCreatePostPaymentReservation } from '@/hooks/payment.hooks';
import { useSearchVoyageur } from '@/hooks/voyageur.hooks';
import { usePaymentSuccessStore } from '@/stores/payment-success.store';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import { usePaymentStore } from '@/stores/payment.store';
import { SelectedSeats } from '@/components/forms/SelectedSeats';
import { UserDetailsForm } from '@/components/forms/UserDetailsForm';
import { PaymentSuccessPageSkeleton } from '@/skeleton';
import Labels from '@/labelKeys.json';
import { SeatStatusEnum } from '@/models/enums';
import { Seat } from '@/models/Seat';
import { SeatConfig } from '@/types/type.props';
import { populateVoyageur } from '@/utils/populate.voyageur';
import { ROUTES } from '@/constants/routes';
import SEO from '@/components/shared/SEO';
import { trackEvent } from '@/hooks/google-analytics.hook';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ voyageId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      document.getElementById('info-user')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const { phoneNumber, isPartial, resetPaymentFlow } = usePaymentStore();
  const { selectedSeats } = useSeatSelectionStore();
  const { userForm, notes, hasExistingAccount, setUserForm, setNotes, setHasExistingAccount, reset } =
    usePaymentSuccessStore();

  const userFormRef = useRef(userForm);
  userFormRef.current = userForm;

  const voyageId = params.voyageId ? Number(params.voyageId) : 0;

  const { data: foundVoyageur } = useSearchVoyageur(phoneNumber);

  const voyageSelectedSeats: SeatConfig[] = useMemo(() => selectedSeats[voyageId] ?? [], [selectedSeats, voyageId]);
  const hasSelectedSeats = voyageSelectedSeats.length > 0;

  const formValid = useMemo(
    () => Boolean(userForm.firstName && userForm.lastName && userForm.phone),
    [userForm.firstName, userForm.lastName, userForm.phone],
  );

  const navigateHome = useCallback(() => navigate(ROUTES.home[i18n.language]), [navigate, i18n.language]);

  const { data: voyage, isLoading: voyageLoading, error: voyageError } = useVoyage(voyageId ?? 0);
  const createReservationMutation = useCreatePostPaymentReservation();

  const seats = useMemo((): Seat[] => {
    if (voyage && voyageSelectedSeats.length)
      return voyageSelectedSeats.map(
        (seatConfig: SeatConfig): Seat => ({
          voyage,
          seatNum: `${seatConfig.id}`,
          crafter: voyage.crafter,
          seatStatus: SeatStatusEnum.RESERVED,
          position: seatConfig.position,
        }),
      );
    return [];
  }, [voyage, voyageSelectedSeats]);

  useEffect(() => {
    if (user) {
      setUserForm({
        id: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
        idNumber: user.idNumber ?? '',
      });
    }
  }, [user, setUserForm]);

  useEffect(() => {
    if (user) return;

    if (foundVoyageur) {
      setUserForm(populateVoyageur(foundVoyageur));
      setHasExistingAccount(true);
    } else {
      const trimmed = phoneNumber.trim();
      if (trimmed) {
        setUserForm({ ...userFormRef.current, phone: trimmed });
        setHasExistingAccount(false);
      }
    }
  }, [foundVoyageur, user, phoneNumber, setUserForm, setHasExistingAccount]);

  useEffect(() => () => reset(), [reset]);

  const handleSubmit = useCallback(() => {
    if (voyage && hasSelectedSeats && formValid) {
      createReservationMutation.mutate(
        {
          voyage,
          selectedSeats: seats,
          userForm,
          notes,
          autoProcess: false,
          redirectToLogin: !isAuthenticated,
          hasExistingAccount,
        },
        {
          onSuccess: () => {
            trackEvent(
              'reservation_confirmed',
              'Booking',
              `${voyage.departureGare?.name ?? ''} → ${voyage.arrivalGare?.name ?? ''}`,
              voyageSelectedSeats.length,
            );
            resetPaymentFlow();
          },
        },
      );
    }
  }, [
    voyage,
    hasSelectedSeats,
    formValid,
    seats,
    userForm,
    notes,
    hasExistingAccount,
    isAuthenticated,
    createReservationMutation,
    resetPaymentFlow,
    voyageSelectedSeats.length,
  ]);

  if (voyageLoading) {
    return <PaymentSuccessPageSkeleton showForm={!isAuthenticated} />;
  }

  const isPaymentValid = Boolean(voyageId && hasSelectedSeats);

  if (!isPaymentValid) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {t(Labels.payment_no_reservation_found)}
        </Typography>
        <Button variant="contained" onClick={navigateHome} sx={{ mt: 2 }}>
          {t(Labels.payment_return_home)}
        </Button>
      </Box>
    );
  }

  if (voyageError) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {t(Labels.error_loading_voyages)}
        </Typography>
        <Button variant="contained" onClick={navigateHome} sx={{ mt: 2 }}>
          {t(Labels.payment_return_home)}
        </Button>
      </Box>
    );
  }

  return (
    voyage && (
      <Box sx={{ minHeight: '100vh', maxWidth: 600, mx: 'auto' }}>
        <SEO title={t(Labels.payment_success)} />
        <SelectedSeats voyage={voyage} selectedSeats={seats} isPartial={isPartial} />

        <Card sx={{ my: 2 }} id="info-user">
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {t(Labels.reservation_form_title)}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Alert severity="success" sx={{ borderRadius: 2, boxShadow: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t(Labels.payment_success)}
                  </Typography>
                </Box>
              </Alert>

              <Alert severity="error" sx={{ borderRadius: 2, boxShadow: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {t(Labels.payment_success_confirm_instruction)}
                  </Typography>
                </Box>
              </Alert>

              <UserDetailsForm
                userForm={userForm}
                setUserForm={form => setUserForm(typeof form === 'function' ? form(userForm) : form)}
              />

              <TextField
                fullWidth
                label={t(Labels.note_label)}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                variant="outlined"
                multiline
                rows={3}
                placeholder={t(Labels.notes_placeholder)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <NotesOutlined fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
          </CardContent>

          <CardActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button fullWidth variant="outlined" disabled>
              {t(Labels.ui_cancel)}
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={createReservationMutation.isPending || !formValid}
              size="large"
            >
              {createReservationMutation.isPending ? t(Labels.creating_reservation) : t(Labels.create_reservation)}
            </Button>
          </CardActions>
        </Card>
      </Box>
    )
  );
};

export default PaymentSuccessPage;
