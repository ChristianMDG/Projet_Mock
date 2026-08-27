import React, { useCallback } from 'react';
import { Alert, Box, Divider, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  AuthFormFields,
  AuthFormHeader,
  AuthModeSwitcher,
  AuthSubmitButton,
  SocialLogin,
  TermsAndPrivacy,
  AuthLayout,
} from './index';
import { useAuthForm } from '@/hooks/auth.hooks';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';
import GuichetRegistrationForm from './GuichetRegistrationForm';

interface AuthenticationPageProps {
  showSocialLogin?: boolean;
  onSuccess?: () => void;
  redirectTo?: string;
  initialMode?: 'login' | 'register' | 'forgot';
  prefillPhone?: string;
  reservationSuccess?: boolean;
}

const AuthenticationPage: React.FC<AuthenticationPageProps> = ({
  showSocialLogin = false,
  onSuccess,
  redirectTo,
  initialMode,
  prefillPhone,
  reservationSuccess,
}) => {
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
    registeredUser,
    showGuichetForm,
    setShowGuichetForm,
    isGuichet,
    setIsGuichet,
  } = useAuthForm({ showSocialLogin, onSuccess, redirectTo, initialMode, prefillPhone });
  const { t } = useTranslation();

  const handleGuichetChange = useCallback(
    (checked: boolean) => {
      setIsGuichet(checked);
    },
    [setIsGuichet],
  );

  const handleGuichetSuccess = useCallback(() => {
    setShowGuichetForm(false);
    handleModeChange('login');
  }, [setShowGuichetForm, handleModeChange]);

  const showDivider = showSocialLogin && mode !== 'forgot';
  const showTerms = mode === 'register';

  return (
    <AuthLayout seoTitle={t(Labels.authform_login)} renderHeader={() => <AuthFormHeader mode={mode} />}>
      {reservationSuccess && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {t(Labels.login_reservation_success_message)}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, borderRadius: 2 }}
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={clearError}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {showGuichetForm && registeredUser ? (
        <GuichetRegistrationForm registeredUser={registeredUser} onSuccess={handleGuichetSuccess} />
      ) : (
        <>
          <Box component="form" onSubmit={handleSubmit}>
            <AuthFormFields
              form={form}
              mode={mode}
              loading={loading}
              showPassword={showPassword}
              validationErrors={validationErrors}
              isGuichet={isGuichet}
              onInputChange={handleInputChange}
              onPasswordVisibilityToggle={togglePasswordVisibility}
              onModeChange={handleModeChange}
              onGuichetChange={handleGuichetChange}
            />
            <AuthSubmitButton mode={mode} loading={loading} isFormValid={isFormValid} />
          </Box>

          {showDivider && (
            <>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  {t(Labels.authform_continue_with)}
                </Typography>
              </Divider>
              <SocialLogin />
            </>
          )}

          <AuthModeSwitcher mode={mode} onModeChange={handleModeChange} />
          {showTerms && <TermsAndPrivacy />}
        </>
      )}
    </AuthLayout>
  );
};

export default AuthenticationPage;
