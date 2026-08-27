import {
  Typography,
  Paper,
  RadioGroup,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  Box,
  TextField,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { RentalPaymentInitiationResponse } from '@/types/rental.types';

interface RentalPaymentStepProps {
  initiatePay: any;
  setTransaction: (reference: string, operatorName: string) => void;
}

export default function RentalPaymentStep({ initiatePay, setTransaction }: RentalPaymentStepProps) {
  const { t } = useTranslation();

  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {t(Labels.rental_checkout_payment_title)}
      </Typography>
      <Formik
        initialValues={{ paymentMethod: 'MOBILE_MONEY', phoneNumber: '' }}
        validationSchema={Yup.object({
          phoneNumber: Yup.string().required(t(Labels.authform_field_required)),
        })}
        onSubmit={values => {
          initiatePay(
            { paymentMethod: 'MOBILE_MONEY', phoneNumber: values.phoneNumber },
            {
              onSuccess: (res: RentalPaymentInitiationResponse) => {
                if (res.paymentUrl) {
                  window.location.href = res.paymentUrl;
                } else {
                  setTransaction(res.transactionReference, res.operatorName);
                }
              },
            },
          );
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form id="payment-form">
            <RadioGroup name="paymentMethod" value={values.paymentMethod} onChange={handleChange}>
              <Card variant="outlined" sx={{ mb: 2, borderColor: 'primary.main' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <FormControlLabel value="MOBILE_MONEY" control={<Radio />} label="" sx={{ m: 0 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {t(Labels.rental_checkout_mobile_money)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {t(Labels.rental_checkout_mobile_money_desc)}
                    </Typography>
                    <TextField
                      fullWidth
                      name="phoneNumber"
                      label={t(Labels.rental_checkout_phone)}
                      placeholder={t(Labels.rental_checkout_phone_placeholder)}
                      value={values.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && (errors.phoneNumber as string)}
                    />
                  </Box>
                </CardContent>
              </Card>
            </RadioGroup>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
