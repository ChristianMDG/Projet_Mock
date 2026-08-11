import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface OTPVerificationModalProps {
  open: boolean;
  onClose: () => void;
  phoneNumber: string;
  amount: number;
  onVerify: (otp: string) => Promise<void>;
}

interface OTPFormData {
  otp: string;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({ open, onClose, phoneNumber, onVerify }) => {
  const { t } = useTranslation();
  const [resendCountdown, setResendCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(/^\d{6}$/, t(Labels.payment_otp_invalid))
      .required(t(Labels.field_required)),
  });

  const initialValues: OTPFormData = {
    otp: '',
  };

  useEffect(() => {
    if (open) {
      setResendCountdown(RESEND_COOLDOWN);
      setAttempts(0);
    }
  }, [open]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleSubmit = async (values: OTPFormData, { setSubmitting, setFieldError }: FormikHelpers<OTPFormData>) => {
    try {
      await onVerify(values.otp);
    } catch {
      setAttempts(prev => prev + 1);
      setFieldError('otp', t(Labels.payment_otp_invalid));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = () => {
    setResendCountdown(RESEND_COOLDOWN);
    setAttempts(0);
    console.log('Resending OTP to:', phoneNumber);
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{2})(\d{3})(\d{2})/, '$1 $2 $3 $4');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { maxWidth: 400 } } }}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {t(Labels.payment_otp_title)}
        </Typography>
      </DialogTitle>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t(Labels.payment_otp_instruction).replace('{phone}', formatPhoneNumber(phoneNumber))}
              </Typography>

              {attempts >= maxAttempts && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {t(Labels.payment_otp_max_attempts)}
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <TextField
                    key={index}
                    variant="outlined"
                    size="small"
                    slotProps={{
                      htmlInput: {
                        maxLength: 1,
                        style: { textAlign: 'center', fontSize: '1.5rem' },
                        'data-index': index,
                      },
                    }}
                    sx={{ width: 48 }}
                    value={values.otp[index] || ''}
                    onChange={e => {
                      const newValue = e.target.value;
                      if (/^\d*$/.test(newValue)) {
                        const newOtp = values.otp.split('');
                        newOtp[index] = newValue;
                        const otpString = newOtp.join('').slice(0, OTP_LENGTH);
                        setFieldValue('otp', otpString);

                        if (newValue && index < OTP_LENGTH - 1) {
                          const nextField = document.querySelector(
                            `input[data-index="${index + 1}"]`,
                          ) as HTMLInputElement;
                          nextField?.focus();
                        }
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !values.otp[index] && index > 0) {
                        const prevField = document.querySelector(
                          `input[data-index="${index - 1}"]`,
                        ) as HTMLInputElement;
                        prevField?.focus();
                      }
                    }}
                    disabled={attempts >= maxAttempts}
                  />
                ))}
              </Box>

              {errors.otp && touched.otp && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.otp}
                </Alert>
              )}

              <Box sx={{ textAlign: 'center' }}>
                {resendCountdown > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    {t(Labels.payment_otp_resend_countdown).replace('{seconds}', resendCountdown.toString())}
                  </Typography>
                ) : (
                  <Button variant="text" onClick={handleResendOTP} disabled={attempts >= maxAttempts}>
                    {t(Labels.payment_otp_resend)}
                  </Button>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button onClick={onClose} disabled={isSubmitting}>
                {t(Labels.ui_cancel)}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting || values.otp.length !== OTP_LENGTH || attempts >= maxAttempts}
                startIcon={isSubmitting && <CircularProgress size={20} />}
              >
                {isSubmitting ? t(Labels.processing) : t(Labels.payment_otp_verify)}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default OTPVerificationModal;
