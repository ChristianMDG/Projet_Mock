import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack, Phone, PhoneAndroidOutlined } from '@mui/icons-material';

import { MobileMoneyOperatorEnum, PaymentTransactionStatusEnum, SeatStatusEnum } from '@/models/enums';
import { useCurrencyFormatter } from '@/utils/currency.utils';
import { useTranslation } from 'react-i18next';
import { useReservationPayment, usePaymentWebSocket } from '@/hooks/payment.hooks';
import { usePaymentStore } from '@/stores/payment.store';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import { useVoyage } from '@/hooks/voyage.hooks';
import PaymentMethodAccordion from '@/components/payment/PaymentMethodAccordion';
import PaymentStatusInline from '@/components/payment/PaymentStatusInline';
import { PaymentPageSkeleton } from '@/skeleton';
import Labels from '@/labelKeys.json';
import FormTextField from '@/components/inputs/FormTextField';
import { ROUTES, generateRoute } from '@/constants/routes';

import { SelectedSeats } from '@/components/forms';
import { Seat } from '@/models/Seat';
import { SeatConfig } from '@/types/type.props';
import { Section } from '@/components/section';
import { SECTION_TYPES } from '@/constants';
import SEO from '@/components/shared/SEO';
import { StyledIcon } from '@/components';

interface PaymentFormData {
  paymentMethodId: string;
  mobileMoneyOperator: MobileMoneyOperatorEnum;
  phoneNumber: string;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ voyageId: string }>();

  const { formatAriary } = useCurrencyFormatter();
  const { t, i18n } = useTranslation();

  const {
    paymentMethodId,
    phoneNumber,
    paymentLoading,
    paymentError,
    transactionReference,
    showPaymentStatus,
    paymentStatus: currentStatus,
    setPaymentMethodId,
    setPhoneNumber,
    setPaymentLoading,
    setPaymentError,
    setTransactionReference,
    setShowPaymentStatus,
    setPaymentStatus: setCurrentStatus,
  } = usePaymentStore();

  const { selectedSeats } = useSeatSelectionStore();
  const reservationPaymentMutation = useReservationPayment();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (showPaymentStatus) {
      setTimeout(() => document.getElementById('selected-seats')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [showPaymentStatus]);

  const voyageId = params.voyageId ? Number(params.voyageId) : 0;
  const { MVOLA, AIRTEL } = MobileMoneyOperatorEnum;

  // WebSocket integration for real-time payment updates
  const { isConnected: wsConnected, lastNotification } = usePaymentWebSocket({
    transactionReference,
    enabled: !!transactionReference && showPaymentStatus,
    onSuccess: notification => setCurrentStatus(notification.status),
    onFailure: notification => setCurrentStatus(notification.status),
    onTimeout: notification => setCurrentStatus(notification.status),
  });

  const { data: voyage, isPending: voyageLoading } = useVoyage(voyageId);

  const voyageSelectedSeats: SeatConfig[] = selectedSeats[voyageId] ?? [];

  const paymentSummary = useMemo(() => {
    if (voyage && voyageSelectedSeats.length)
      return {
        selectedSeats: voyageSelectedSeats.map((seat: SeatConfig) => seat.position),
        totalAmount: voyageSelectedSeats.length * voyage.pricePerSeat,
        departure: voyage.departureGare?.name ?? 'N/A',
        arrival: voyage.arrivalGare?.name ?? 'N/A',
        koperativeName: voyage.koperative?.name ?? 'N/A',
      } as const;
  }, [voyage, voyageSelectedSeats]);

  const seats: Seat[] = useMemo(
    () =>
      voyageSelectedSeats.map((seatConfig: SeatConfig) => ({
        seatNum: seatConfig.id.toString(),
        seatStatus: SeatStatusEnum.RESERVED,
        position: seatConfig.position,
        voyage,
        crafter: voyage?.crafter,
      })),
    [voyageSelectedSeats, voyage],
  );

  const handleSubmit = async (
    { paymentMethodId, phoneNumber, mobileMoneyOperator }: PaymentFormData,
    { setSubmitting }: FormikHelpers<PaymentFormData>,
  ) => {
    setPaymentError(null);
    setPaymentLoading(true);
    setPaymentMethodId(paymentMethodId);
    setPhoneNumber(phoneNumber);

    try {
      if (voyage && paymentSummary) {
        await reservationPaymentMutation.mutateAsync({
          voyage,
          totalAmount: paymentSummary.totalAmount,
          phoneNumber,
          paymentMethodId,
          mobileMoneyOperator,
          seatPositions: voyageSelectedSeats.map((s: SeatConfig) => s.position),
        });
      } else {
        throw new Error(t(Labels.error_loading_voyages));
      }
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : t(Labels.payment_processing_failed));
    } finally {
      setPaymentLoading(false);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (currentStatus === PaymentTransactionStatusEnum.COMPLETED) {
      const id = setTimeout(() => navigate(generateRoute.paymentSuccess(voyageId, i18n.language)), 2000);
      return () => clearTimeout(id);
    }
  }, [currentStatus, navigate, voyageId, i18n.language]);

  const handleRetryPayment = () => {
    setShowPaymentStatus(false);
    setTransactionReference(null);
    setPaymentError(null);
    setCurrentStatus(null);
  };

  if (voyageLoading && isClient) {
    return <PaymentPageSkeleton />;
  }

  if (paymentSummary && voyage) {
    const initialValues: PaymentFormData = {
      paymentMethodId,
      mobileMoneyOperator: paymentMethodId.toUpperCase() as MobileMoneyOperatorEnum,
      phoneNumber,
    };

    const validationSchema = Yup.object({
      paymentMethodId: Yup.string().required(t(Labels.payment_select_method)),
      mobileMoneyOperator: Yup.string().required(t(Labels.payment_select_operator)),
      phoneNumber: Yup.string().when('paymentMethodId', {
        is: (val: MobileMoneyOperatorEnum) => [MVOLA, AIRTEL].includes(val),
        then: schema =>
          schema
            .matches(/^03[2-9]\d{7}$/, t(Labels.payment_validation_invalid_phone))
            .required(t(Labels.payment_validation_phone_required)),
        otherwise: schema => schema.optional(),
      }),
    });

    return (
      <Box sx={{ minHeight: '100vh', maxWidth: 600, mx: 'auto' }}>
        <SEO title={t(Labels.button_pay)} />
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 1, fontWeight: 500 }}>
          {t(Labels.button_back)}
        </Button>
        <Box id="selected-seats">
          <SelectedSeats voyage={voyage} selectedSeats={seats} />
        </Box>
        <Card>
          <CardContent>
            {showPaymentStatus ? (
              <Box>
                <PaymentStatusInline
                  transactionReference={transactionReference}
                  wsConnected={wsConnected}
                  lastNotification={lastNotification}
                  onRetry={handleRetryPayment}
                  operator={paymentMethodId.toUpperCase() as MobileMoneyOperatorEnum}
                  paymentStatus={currentStatus as PaymentTransactionStatusEnum}
                  setPaymentStatus={setCurrentStatus}
                />
              </Box>
            ) : (
              <>
                <Typography variant="h4" gutterBottom>
                  {t(Labels.payment_method_mobile_money)}
                </Typography>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                  {({ values, setFieldValue, isSubmitting }) => {
                    const handleMethodChange = (method: string) => {
                      setFieldValue('paymentMethodId', method);
                      setFieldValue('mobileMoneyOperator', method.toUpperCase());
                      setPaymentMethodId(method);
                    };

                    const isSubmitDisabled = () => {
                      if (isSubmitting || paymentLoading) return true;
                      return [MVOLA, AIRTEL].includes(values.mobileMoneyOperator) && !values.phoneNumber;
                    };

                    const phonePlaceholder = (() => {
                      const map: Record<string, string> = {
                        [MVOLA]: '034 00 000 00',
                        [AIRTEL]: '033 00 000 00',
                      };
                      return map[values.mobileMoneyOperator as unknown as string] ?? '034 00 000 00';
                    })();

                    return (
                      <Form>
                        <Stack spacing={2}>
                          <PaymentMethodAccordion
                            selectedMethod={values.paymentMethodId}
                            onMethodChange={handleMethodChange}
                          />

                          {[MVOLA, AIRTEL].includes(values.mobileMoneyOperator) && (
                            <>
                              <FormTextField
                                name="phoneNumber"
                                label={t(Labels.payment_phone_number)}
                                placeholder={phonePlaceholder}
                                helperText={t(Labels.payment_phone_helper_text)}
                                slotProps={{
                                  input: {
                                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                                  },
                                }}
                              />
                              <Alert severity="info" sx={{ my: 2, borderRadius: 3, boxShadow: 1 }}>
                                {t(Labels.payment_phone_notification)}
                              </Alert>
                            </>
                          )}

                          {paymentError && <Alert severity="error">{paymentError}</Alert>}

                          {values.paymentMethodId && (
                            <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              fullWidth
                              disabled={isSubmitDisabled()}
                              sx={{ py: 1.5 }}
                              startIcon={<StyledIcon icon={PhoneAndroidOutlined} />}
                            >
                              {isSubmitting || paymentLoading
                                ? t(Labels.processing)
                                : `${t(Labels.button_pay)} ${formatAriary(paymentSummary.totalAmount)}`}
                            </Button>
                          )}
                        </Stack>
                      </Form>
                    );
                  }}
                </Formik>
              </>
            )}
          </CardContent>
        </Card>

        <Box sx={{ mt: 3 }}>
          <Section
            section={{
              id: 1,
              __component: 'page.section-reference',
              sectionTitle: '',
              sectionType: SECTION_TYPES.SAFETY_MEASURES,
            }}
          />
        </Box>
      </Box>
    );
  }

  return Boolean(voyageId) && voyageLoading ? (
    <PaymentPageSkeleton />
  ) : (
    <Box sx={{ textAlign: 'center', py: 3 }}>
      <Typography variant="h6" color="error" gutterBottom>
        {t(Labels.payment_no_reservation_found)}
      </Typography>
      <Button variant="contained" onClick={() => navigate(ROUTES.home[i18n.language])}>
        {t(Labels.payment_return_home)}
      </Button>
    </Box>
  );
};

export default PaymentPage;
