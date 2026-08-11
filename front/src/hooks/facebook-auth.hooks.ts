import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { FacebookLoginWithToken } from '@/api/user.api';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';

export function useFacebookAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const verifyFacebookToken = useCallback(
    async (accessToken: string): Promise<boolean> => {
      setIsLoading(true);

      try {
        // API call to verify and authenticate
        const data = await FacebookLoginWithToken(accessToken);

        if (data?.token && data?.user) {
          authLogin(data.token, data.user);
          navigate(ROUTES.home[i18n.language]);
          return true;
        }

        return false;
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.warn('Facebook user not found in system');
        } else {
          console.error('Facebook Authentication error:', error);
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [authLogin, navigate, i18n.language],
  );

  return {
    verifyFacebookToken,
    isLoading,
  };
}
