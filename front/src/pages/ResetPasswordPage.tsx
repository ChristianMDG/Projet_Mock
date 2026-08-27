import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, IconButton, InputAdornment, Stack } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useResetPassword, parseAuthError } from '@/hooks/auth.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { ROUTES } from '@/constants/routes';
import { AuthLayout } from '@/pages/authentication';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormTextField from '@/components/inputs/FormTextField';

export default function ResetPasswordPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const phone = (state as { phone?: string })?.phone ?? '';
  const hasPhone = phone.length > 0;

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, error, isSuccess } = useResetPassword();

  const validationSchema = Yup.object({
    otp: Yup.string().required(t(Labels.authform_otp_required)),
    newPassword: Yup.string()
      .min(6, t(Labels.authform_password_min_length))
      .required(t(Labels.authform_password_required)),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], t(Labels.authform_password_mismatch))
      .required(t(Labels.authform_password_required)),
  });

  const initialValues = {
    otp: '',
    newPassword: '',
    confirmPassword: '',
  };

  const handleSubmit = (values: typeof initialValues) => {
    mutate(
      { phone, otp: values.otp, newPassword: values.newPassword },
      {
        onSuccess: () =>
          setTimeout(
            () => navigate(ROUTES.login[i18n.language as keyof typeof ROUTES.login], { state: { resetSuccess: true } }),
            2000,
          ),
      },
    );
  };

  const apiError = error ? t(parseAuthError(error) as keyof typeof Labels) : null;
  const hasApiError = Boolean(apiError);
  const navigateState = hasPhone ? undefined : { mode: 'forgot' as const };

  return (
    <AuthLayout
      seoTitle={t(Labels.authform_reset_password_title)}
      title={t(Labels.authform_reset_password_title)}
      subtitle={t(Labels.authform_reset_subtitle)}
    >
      {hasPhone ? (
        <>
          {isSuccess && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {t(Labels.authform_reset_success)}
            </Alert>
          )}
          {hasApiError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {apiError}
            </Alert>
          )}

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {() => (
              <Form>
                <Stack spacing={2.5}>
                  <FormTextField
                    name="otp"
                    label={t(Labels.authform_otp_label)}
                    placeholder="123456"
                    disabled={isPending}
                    helperText={t(Labels.authform_otp_description)}
                    slotProps={{
                      input: {
                        sx: { borderRadius: 2 },
                      },
                    }}
                  />
                  <FormTextField
                    name="newPassword"
                    label={t(Labels.authform_new_password)}
                    type={showPassword ? 'text' : 'password'}
                    disabled={isPending}
                    slotProps={{
                      input: {
                        sx: { borderRadius: 2 },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <FormTextField
                    name="confirmPassword"
                    label={t(Labels.authform_confirm_password)}
                    type={showPassword ? 'text' : 'password'}
                    disabled={isPending}
                    slotProps={{
                      input: {
                        sx: { borderRadius: 2 },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isPending}
                    sx={{
                      py: 1.8,
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {isPending ? t(Labels.authform_loading) : t(Labels.authform_confirm_reset)}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {t(Labels.error_phone_required)}
        </Alert>
      )}

      <Box
        sx={{
          textAlign: 'center',
          mt: 4,
        }}
      >
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(ROUTES.login[i18n.language as keyof typeof ROUTES.login], { state: navigateState })}
          color="primary"
          sx={{
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'transparent',
              textDecoration: 'underline',
            },
          }}
        >
          {t(Labels.authform_back_to)} {t(Labels.authform_login)}
        </Button>
      </Box>
    </AuthLayout>
  );
}
