import React, { useRef, useEffect } from 'react';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidOutlinedIcon from '@mui/icons-material/PhoneAndroidOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useCurrencyFormatter } from '@/utils/currency.utils';
import PaymentMethodAccordion from '@/components/payment/PaymentMethodAccordion';
import Labels from '@/labelKeys.json';
import { MobileMoneyOperatorEnum } from '@/models/enums';
import FormTextField from '@/components/inputs/FormTextField';
import StyledIcon from '@/components/ui/StyledIcon';
import { trackEvent } from '@/hooks/google-analytics.hook';

interface PaymentFormData {
  paymentMethodId: string;
  mobileMoneyOperator: MobileMoneyOperatorEnum;
  phoneNumber: string;
}

interface PaymentMethodSelectionProps {
  total: number;
  onBack?: () => void;
  onSubmit: (values: PaymentFormData, helpers: FormikHelpers<PaymentFormData>) => Promise<void>;
  isBusy: boolean;
  paymentError: string | null;
  onDismissError?: () => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  total,
  onBack,
  onSubmit,
  isBusy,
  paymentError,
  onDismissError,
}) => {
  const { t } = useTranslation();
  const { formatAriary } = useCurrencyFormatter();
  const { selectedPaymentMethod, paymentPhone, setSelectedPaymentMethod } = useCheckoutStore();
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const { MVOLA, AIRTEL } = MobileMoneyOperatorEnum;

  useEffect(() => {
    const isMobileMoney = [
      MobileMoneyOperatorEnum.MVOLA,
      MobileMoneyOperatorEnum.AIRTEL,
      MobileMoneyOperatorEnum.ORANGE,
    ].includes(selectedPaymentMethod.toUpperCase() as MobileMoneyOperatorEnum);
    if (isMobileMoney) {
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
    }
  }, [selectedPaymentMethod]);

  const initialValues: PaymentFormData = {
    paymentMethodId: selectedPaymentMethod || 'mvola',
    mobileMoneyOperator: (selectedPaymentMethod
      ? selectedPaymentMethod
      : 'mvola'
    ).toUpperCase() as MobileMoneyOperatorEnum,
    phoneNumber: paymentPhone,
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
    <Box>
      {onBack && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ fontWeight: 500 }}>
            {t(Labels.button_back)}
          </Button>
        </Box>
      )}

      <Typography variant="h4" gutterBottom>
        {t(Labels.payment_method_mobile_money)}
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ values, setFieldValue, isSubmitting }) => {
          const handleMethodChange = (method: string) => {
            setFieldValue('paymentMethodId', method);
            setFieldValue('mobileMoneyOperator', method.toUpperCase());
            setSelectedPaymentMethod(method);
            trackEvent('payment_method_selected', 'Shop', method.toUpperCase());
          };

          const isSubmitDisabled = () => {
            if (isSubmitting || isBusy) {
              return true;
            }
            const isOperatorMobileMoney = [MVOLA, AIRTEL].includes(values.mobileMoneyOperator);
            const hasPhone = Boolean(values.phoneNumber);
            return isOperatorMobileMoney && hasPhone === false;
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
                <PaymentMethodAccordion selectedMethod={values.paymentMethodId} onMethodChange={handleMethodChange} />

                {[MVOLA, AIRTEL].includes(values.mobileMoneyOperator) && (
                  <>
                    <FormTextField
                      inputRef={phoneInputRef}
                      name="phoneNumber"
                      label={t(Labels.payment_phone_number)}
                      placeholder={phonePlaceholder}
                      helperText={t(Labels.payment_phone_helper_text)}
                      slotProps={{
                        input: {
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        },
                      }}
                    />
                    <Alert severity="info" sx={{ my: 2 }}>
                      {t(Labels.payment_phone_notification)}
                    </Alert>
                  </>
                )}

                {paymentError && (
                  <Alert severity="error" onClose={onDismissError}>
                    {paymentError}
                  </Alert>
                )}

                {values.paymentMethodId && (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitDisabled()}
                    sx={{ py: 1.5 }}
                    startIcon={<StyledIcon icon={PhoneAndroidOutlinedIcon} />}
                  >
                    {isSubmitting || isBusy ? (
                      t(Labels.processing)
                    ) : (
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                        <span>{t(Labels.button_pay)}</span>
                        <span style={{ fontWeight: 800 }}>{formatAriary(total)}</span>
                      </Stack>
                    )}
                  </Button>
                )}
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default PaymentMethodSelection;
