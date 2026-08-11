import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useResetPassword, parseAuthError } from '@/hooks/auth.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { ROUTES } from '@/constants/routes';
import SEO from '@/components/shared/SEO';

type LabelKey = keyof typeof Labels;

export default function ResetPasswordPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const phone = (state as { phone?: string })?.phone ?? '';

  const [form, setForm] = useState({ otp: '', newPassword: '', confirmPassword: '' });
  const [errorKeys, setErrorKeys] = useState<Partial<Record<string, LabelKey>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending, error, isSuccess } = useResetPassword();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errorKeys[field]) setErrorKeys(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const errs: Partial<Record<string, LabelKey>> = {};
    if (!form.otp.trim()) errs.otp = 'authform_otp_required';
    if (form.newPassword.length < 6) errs.newPassword = 'authform_password_min_length';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'authform_password_mismatch';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrorKeys(errs);
    mutate(
      { phone, otp: form.otp, newPassword: form.newPassword },
      {
        onSuccess: () =>
          setTimeout(() => navigate(ROUTES.login[i18n.language], { state: { resetSuccess: true } }), 2000),
      },
    );
  };

  const apiError = error ? t(parseAuthError(error) as keyof typeof Labels) : null;

  return (
    <Container
      sx={{
        paddingTop: 3,
        maxWidth: 'xs',
      }}
    >
      <SEO title={t(Labels.authform_reset_password_title)} />
      <Card>
        <CardContent>
          <Box
            sx={{
              textAlign: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h4" color="primary" gutterBottom>
              {t(Labels.authform_reset_password_title)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(Labels.authform_reset_subtitle)}
            </Typography>
          </Box>

          {phone ? (
            <>
              {isSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {t(Labels.authform_reset_success)}
                </Alert>
              )}
              {apiError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {apiError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    name="otp"
                    label={t(Labels.authform_otp_label)}
                    placeholder="123456"
                    value={form.otp}
                    onChange={handleChange('otp')}
                    error={!!errorKeys.otp}
                    helperText={errorKeys.otp ? t(Labels[errorKeys.otp]) : t(Labels.authform_otp_description)}
                    disabled={isPending}
                  />
                  <TextField
                    fullWidth
                    name="newPassword"
                    label={t(Labels.authform_new_password)}
                    type={showPassword ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={handleChange('newPassword')}
                    error={!!errorKeys.newPassword}
                    helperText={errorKeys.newPassword ? t(Labels[errorKeys.newPassword]) : undefined}
                    disabled={isPending}
                    slotProps={{
                      input: {
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
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label={t(Labels.authform_confirm_password)}
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    error={!!errorKeys.confirmPassword}
                    helperText={errorKeys.confirmPassword ? t(Labels[errorKeys.confirmPassword]) : undefined}
                    disabled={isPending}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isPending}
                    sx={{ py: 1.5, fontWeight: 600 }}
                  >
                    {isPending ? t(Labels.authform_loading) : t(Labels.authform_confirm_reset)}
                  </Button>
                </Stack>
              </Box>
            </>
          ) : (
            <Alert severity="error">{t(Labels.error_phone_required)}</Alert>
          )}

          <Box
            sx={{
              textAlign: 'center',
              mt: 3,
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(ROUTES.login[i18n.language], { state: phone ? undefined : { mode: 'forgot' } })}
              color="primary"
            >
              {t(Labels.authform_back_to)} {t(Labels.authform_login)}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
