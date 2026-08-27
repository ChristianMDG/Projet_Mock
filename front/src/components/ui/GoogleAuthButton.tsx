import React, { useCallback, useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useGoogleAuth } from '@/hooks/google-auth.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface CredentialResponse {
  credential: string;
}

const GOOGLE_GSI_SRC = 'https://accounts.google.com/gsi/client';

const GoogleAuthButton: React.FC = () => {
  const { t } = useTranslation();
  const { verifyGoogleToken, isLoading } = useGoogleAuth();
  const [isReady, setIsReady] = useState(false);

  const handleCredentialResponse = useCallback(
    async (response: CredentialResponse) => {
      if (response.credential) {
        await verifyGoogleToken(response.credential);
      }
    },
    [verifyGoogleToken],
  );

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (clientId) {
      const initialize = () => {
        if (window.google) {
          try {
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleCredentialResponse,
              use_fedcm_for_prompt: true,
              auto_select: false,
              cancel_on_tap_outside: true,
              context: 'signin',
              ux_mode: 'popup',
            });
            setIsReady(true);
          } catch (error) {
            console.error('Error initializing Google Sign-In (FedCM):', error);
          }
        }
      };

      const existing = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_GSI_SRC}"]`);

      if (existing && window.google) {
        initialize();
      } else if (existing) {
        existing.addEventListener('load', initialize, { once: true });
      } else {
        const script = document.createElement('script');
        script.src = GOOGLE_GSI_SRC;
        script.async = true;
        script.defer = true;
        script.onload = initialize;
        document.body.appendChild(script);
      }
    } else {
      console.warn('VITE_GOOGLE_CLIENT_ID is not set');
    }
  }, [handleCredentialResponse]);

  const handleClick = useCallback(() => {
    if (isReady && window.google) {
      window.google.accounts.id.prompt();
    }
  }, [isReady]);

  return (
    <Button
      fullWidth
      variant="contained"
      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
      onClick={handleClick}
      disabled={isLoading || !isReady}
      sx={{ bgcolor: '#4285F4', '&:hover': { bgcolor: '#2d6fcd' }, color: '#fff' }}
    >
      {t(Labels.authform_google)}
    </Button>
  );
};

export default GoogleAuthButton;
