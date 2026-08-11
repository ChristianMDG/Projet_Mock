import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Card, CardActions, CardContent, TextField, Typography } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useVoyage } from '@/hooks/voyage.hooks';
import { useCreatePostPaymentReservation } from '@/hooks/payment.hooks';
import { usePaymentSuccessStore } from '@/stores/payment-success.store';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import { usePaymentStore } from '@/stores/payment.store';
import { SelectedSeats, UserDetailsForm } from '@/components/forms';
import { PaymentSuccessPageSkeleton } from '@/skeleton';
import Labels from '@/labelKeys.json';
import { SeatStatusEnum } from '@/models/enums';
import { Seat } from '@/models/Seat';
import { SeatConfig } from '@/types/type.props';
import { searchVoyageur } from '@/api/voyageur.api';
import { populateVoyageur } from '@/utils/populate.voyageur';
import { ROUTES } from '@/constants/routes';
import SEO from '@/components/shared/SEO';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ voyageId: string }>();
  const { user, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();

  const { phoneNumber, resetPaymentFlow } = usePaymentStore();
  const { selectedSeats } = useSeatSelectionStore();
  const { userForm, notes, hasExistingAccount, setUserForm, setNotes, setHasExistingAccount, isFormValid, reset } =
    usePaymentSuccessStore();

  const voyageId = params.voyageId ? Number(params.voyageId) : 0;
  const voyageSelectedSeats: SeatConfig[] = selectedSeats[voyageId] ?? [];
  const hasSelectedSeats = voyageSelectedSeats.length > 0;

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
    const trimmed = phoneNumber.trim();
    if (Boolean(trimmed && /^\d+$/.test(trimmed)) && !userForm.phone) {
      searchVoyageur(trimmed)
        .then(foundUser => {
          if (foundUser) {
            setUserForm(populateVoyageur(foundUser));
            setHasExistingAccount(true);
            return;
          }

          setUserForm({ ...userForm, phone: trimmed });
          setHasExistingAccount(false);
        })
        .catch(() => {
          setUserForm({ ...userForm, phone: trimmed });
          setHasExistingAccount(false);
        });
    }
  }, [phoneNumber, userForm, setUserForm, setHasExistingAccount]);

  useEffect(() => {
    const shouldPrefillUser = Boolean(user && !userForm.id);
    if (shouldPrefillUser) {
      setUserForm({
        id: user!.id,
        firstName: user!.firstName ?? '',
        lastName: user!.lastName ?? '',
        phone: user!.phone ?? '',
        email: user!.email ?? '',
        idNumber: user!.idNumber ?? '',
        address: user!.address ?? '',
      });
    }
  }, [user, userForm.id, setUserForm]);

  useEffect(() => () => reset(), [reset]);

  const handleSubmit = useCallback(() => {
    if (voyage && hasSelectedSeats && isFormValid()) {
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
        { onSuccess: () => resetPaymentFlow() },
      );
    }
  }, [
    voyage,
    hasSelectedSeats,
    seats,
    userForm,
    notes,
    hasExistingAccount,
    isAuthenticated,
    isFormValid,
    createReservationMutation,
    resetPaymentFlow,
  ]);

  const isPaymentValid = Boolean(voyageId && hasSelectedSeats);

  if (!isPaymentValid) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {t(Labels.payment_no_reservation_found)}
        </Typography>
        <Button variant="contained" onClick={() => navigate(ROUTES.home[i18n.language])} sx={{ mt: 2 }}>
          {t(Labels.payment_return_home)}
        </Button>
      </Box>
    );
  }

  if (voyageLoading) {
    return <PaymentSuccessPageSkeleton showForm={!isAuthenticated} />;
  }

  if (voyageError || !voyage) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {t(Labels.error_loading_voyages)}
        </Typography>
        <Button variant="contained" onClick={() => navigate(ROUTES.home[i18n.language])} sx={{ mt: 2 }}>
          {t(Labels.payment_return_home)}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', maxWidth: 600, mx: 'auto' }}>
      <SEO title={t(Labels.payment_success)} />
      <Alert severity="success" sx={{ mb: 3, borderRadius: 3, boxShadow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">{t(Labels.payment_success)}</Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {t(Labels.payment_success_description)}
        </Typography>
      </Alert>

      <SelectedSeats voyage={voyage} selectedSeats={seats} />

      <Card sx={{ my: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {t(Labels.reservation_form_title)}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
            disabled={createReservationMutation.isPending || !isFormValid()}
            size="large"
          >
            {createReservationMutation.isPending ? t(Labels.creating_reservation) : t(Labels.create_reservation)}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default PaymentSuccessPage;
