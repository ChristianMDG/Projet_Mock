import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { GoogleLoginWithToken } from '@/api/user.api';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const verifyGoogleToken = useCallback(
    async (idToken: string): Promise<boolean> => {
      setIsLoading(true);

      try {
        // API call
        const data = await GoogleLoginWithToken(idToken);

        if (data?.token && data?.user) {
          authLogin(data.token, data.user);
          navigate(ROUTES.home[i18n.language]);
          return true;
        }

        return false;
      } catch (error) {
        console.error('Google Authentication error:', error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [authLogin, navigate, i18n.language],
  );

  return {
    verifyGoogleToken,
    isLoading,
  };
}
