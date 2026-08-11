import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthenticationPage } from './authentication';
import SEO from '@/components/shared/SEO';

import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface LocationState {
  from?: string;
  mode?: 'login' | 'register' | 'forgot';
  prefillPhone?: string;
  reservationSuccess?: boolean;
  resetSuccess?: boolean;
}

interface LoginPageProps {
  showSocialLogin?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ showSocialLogin = false }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;
  const from = state?.from ?? '/';
  const initialMode = state?.mode ?? 'login';
  const prefillPhone = state?.prefillPhone;
  const reservationSuccess = state?.reservationSuccess;

  const handleLoginSuccess = useCallback(() => {
    navigate(from, { replace: true });
  }, [navigate, from]);

  return (
    <>
      <SEO title={t(Labels.authform_login)} />
      <AuthenticationPage
        showSocialLogin={showSocialLogin}
        onSuccess={handleLoginSuccess}
        redirectTo={from}
        initialMode={initialMode}
        prefillPhone={prefillPhone}
        reservationSuccess={reservationSuccess}
      />
    </>
  );
};

export default LoginPage;
