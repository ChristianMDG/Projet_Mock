import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StyledIcon from '@/components/ui/StyledIcon';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import dayjs from 'dayjs';

import { useVehicle } from '../hooks/vehicle.hooks';
import { useCreateReservation, useInitiateRentalPayment } from '../hooks/reservation.hooks';
import { useCheckoutStepper } from '../hooks/rental-checkout.hooks';
import RentalPaymentStatusTracker from '../components/payment/RentalPaymentStatusTracker';
import RentalDriverInfoStep from '../components/checkout/RentalDriverInfoStep';
import RentalPaymentStep from '../components/checkout/RentalPaymentStep';
import RentalConfirmationStep from '../components/checkout/RentalConfirmationStep';
import { CheckoutStep } from '../types/rental.types';
import { useRentalCheckoutStore } from '../stores/rental-checkout.store';

export default function RentalCheckoutPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');

  const { step, reservationId, setReservation, setTransaction, reset } = useRentalCheckoutStore();

  const { data: vehicle, isLoading: isVehicleLoading } = useVehicle(id ? Number(id) : undefined);
  const { mutate: createRes, isPending: isCreating } = useCreateReservation();
  const { mutate: initiatePay, isPending: isInitiating } = useInitiateRentalPayment(reservationId!);
  const { steps, activeStep, handleBack } = useCheckoutStepper();

  // Redirect if params missing
  useEffect(() => {
    const hasParams = Boolean(startParam && endParam);
    if (hasParams) {
      // params ok
    } else {
      navigate('/location');
    }
  }, [startParam, endParam, navigate]);

  // Clean up on unmount
  useEffect(() => {
    return () => reset();
  }, [reset]);

  const isMissingParams = !startParam || !endParam;
  if (isMissingParams) return null;

  if (isVehicleLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isVehicleMissing = !vehicle;
  if (isVehicleMissing) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5">Véhicule introuvable</Typography>
        <Button component={Link} to="/location" sx={{ mt: 2 }}>
          Retour
        </Button>
      </Box>
    );
  }

  const startDate = dayjs(startParam);
  const endDate = dayjs(endParam);
  const days = endDate.diff(startDate, 'day');
  const totalPrice = days > 0 ? days * vehicle.pricePerDay : 0;

  return (
    <Box component="main" sx={{ flexGrow: 1, pb: 8 }}>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {step !== 'tracking' && step !== 'confirmation' && (
          <Button
            startIcon={<StyledIcon icon={ArrowBackIcon} />}
            onClick={handleBack}
            sx={{ mb: 3, color: 'text.secondary' }}
          >
            {t(Labels.rental_checkout_back_btn)}
          </Button>
        )}

        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 4 }}>
          {t(Labels.rental_checkout_title)}
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            {step === CheckoutStep.DRIVER_INFO && (
              <RentalDriverInfoStep
                vehicleId={Number(id)}
                startParam={startParam!}
                endParam={endParam!}
                createRes={createRes}
                setReservation={setReservation}
              />
            )}

            {step === CheckoutStep.PAYMENT && (
              <RentalPaymentStep initiatePay={initiatePay} setTransaction={setTransaction} />
            )}

            {step === CheckoutStep.TRACKING && <RentalPaymentStatusTracker />}

            {step === CheckoutStep.CONFIRMATION && <RentalConfirmationStep />}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 88 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {t(Labels.rental_checkout_summary_title)}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box
                  component="img"
                  src={vehicle.imageUrl}
                  alt={vehicle.model}
                  sx={{ width: 80, height: 60, objectFit: 'cover', bgcolor: 'action.hover', borderRadius: 1 }}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {vehicle.brand} {vehicle.model}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t(Labels.rental_checkout_rental_duration, { days })}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {t(Labels.rental_checkout_total)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                  {totalPrice.toLocaleString('fr-MG')} Ar
                </Typography>
              </Box>

              {step === CheckoutStep.DRIVER_INFO && (
                <Button
                  type="submit"
                  form="driver-form"
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  disabled={isCreating}
                  sx={{ py: 1.5, fontWeight: 700 }}
                >
                  {isCreating ? <CircularProgress size={24} /> : t(Labels.rental_checkout_continue)}
                </Button>
              )}

              {step === CheckoutStep.PAYMENT && (
                <Button
                  type="submit"
                  form="payment-form"
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                  disabled={isInitiating}
                  sx={{ py: 1.5, fontWeight: 700 }}
                >
                  {isInitiating ? <CircularProgress size={24} /> : t(Labels.rental_checkout_pay_and_confirm)}
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
