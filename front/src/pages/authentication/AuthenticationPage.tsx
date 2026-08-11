import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  AuthBranding,
  AuthFormFields,
  AuthFormHeader,
  AuthModeSwitcher,
  AuthSubmitButton,
  MobileHeader,
  SocialLogin,
  TermsAndPrivacy,
} from './index';
import { useAuthForm } from '@/hooks/auth.hooks';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

interface AuthenticationPageProps {
  showSocialLogin?: boolean;
  onSuccess?: () => void;
  redirectTo?: string;
  initialMode?: 'login' | 'register' | 'forgot';
  prefillPhone?: string;
  reservationSuccess?: boolean;
}

const AuthenticationPage: React.FC<AuthenticationPageProps> = ({
  showSocialLogin = true,
  onSuccess,
  redirectTo,
  initialMode,
  prefillPhone,
  reservationSuccess,
}) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobileQuery = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = mounted ? isMobileQuery : false;

  const {
    form,
    mode,
    loading,
    error,
    showPassword,
    validationErrors,
    isFormValid,
    successMessage,
    handleInputChange,
    handleSubmit,
    handleModeChange,
    togglePasswordVisibility,
    clearError,
  } = useAuthForm({ showSocialLogin, onSuccess, redirectTo, initialMode, prefillPhone });
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 0, md: 2 },
        px: { xs: 0, md: 2 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: { xs: 0, md: 2 },
          justifyContent: 'center',
          px: { xs: 0, md: 'auto' },
          width: '100%',
        }}
      >
        <Grid
          container
          spacing={{ xs: 0, md: 2 }}
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: { xs: 0, md: 3 },
            boxShadow: { xs: 'none', md: 3 },
            maxWidth: { xs: '100%', sm: 450, md: 1000 },
            background: { xs: 'none', md: 'white' },
          }}
        >
          {!isMobile && (
            <Grid
              size={{ md: 6 }}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                minHeight: { md: 500, lg: 600 },
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
              }}
            >
              <AuthBranding />
            </Grid>
          )}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              minHeight: { xs: '100vh', md: 500, lg: 600 },
              bgcolor: { xs: 'background.default', md: 'transparent' },
              p: { xs: 0, md: 3 },
            }}
          >
            <Card
              sx={{
                mx: 'auto',
                width: '100%',
                display: 'flex',
                overflow: 'hidden',
                boxShadow: { xs: 0, sm: 1 },
                borderRadius: { xs: 0, sm: 2 },
                maxWidth: { sm: 400, md: 450 },
                minHeight: { sm: 'auto' },
                flexDirection: 'column',
                border: { xs: 0, sm: 1 },
                borderColor: alpha(theme.palette.divider, 0.6),
              }}
            >
              <MobileHeader isMobile={isMobile} />
              <CardContent>
                <AuthFormHeader mode={mode} />
                {reservationSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {t(Labels.login_reservation_success_message)}
                  </Alert>
                )}
                {successMessage && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                  </Alert>
                )}
                {error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                      <IconButton aria-label="close" color="inherit" size="small" onClick={clearError}>
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    {error}
                  </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                  <AuthFormFields
                    form={form}
                    mode={mode}
                    loading={loading}
                    showPassword={showPassword}
                    validationErrors={validationErrors}
                    onInputChange={handleInputChange}
                    onPasswordVisibilityToggle={togglePasswordVisibility}
                    onModeChange={handleModeChange}
                  />
                  <AuthSubmitButton mode={mode} loading={loading} isFormValid={isFormValid} />
                </Box>
                {showSocialLogin && mode !== 'forgot' && (
                  <>
                    <Divider sx={{ my: { xs: 1.5, sm: 3 } }}>
                      <Typography variant="body2" color="text.secondary">
                        {t(Labels.authform_continue_with)}
                      </Typography>
                    </Divider>
                    <SocialLogin />
                  </>
                )}
                <AuthModeSwitcher mode={mode} onModeChange={handleModeChange} />
                {mode === 'register' && <TermsAndPrivacy />}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthenticationPage;
