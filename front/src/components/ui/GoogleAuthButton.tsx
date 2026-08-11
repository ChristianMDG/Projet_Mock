import React, { useEffect, useRef } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useGoogleAuth } from '@/hooks/google-auth.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface CredentialResponse {
  credential: string;
}

const GoogleAuthButton: React.FC = () => {
  const { t } = useTranslation();
  const { verifyGoogleToken, isLoading } = useGoogleAuth();
  const buttonDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // load google script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  });

  const initializeGoogleSignIn = () => {
    if (!window.google || !buttonDivRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonDivRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: buttonDivRef.current?.offsetWidth,
      });
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
    }
  };

  const handleCredentialResponse = async (response: CredentialResponse) => {
    if (response.credential) {
      await verifyGoogleToken(response.credential);
    }
  };

  const handleClick = () => {
    // Triggers the actual hidden Google button
    const googleButton = buttonDivRef.current?.querySelector('div[role="button"]');
    if (googleButton) {
      (googleButton as HTMLElement).click();
    }
  };

  return (
    <>
      <div ref={buttonDivRef} style={{ display: 'none' }} />
      <Button
        fullWidth
        variant="outlined"
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <GoogleIcon />}
        onClick={handleClick}
        disabled={isLoading}
      >
        {t(Labels.authform_google)}
      </Button>
    </>
  );
};

export default GoogleAuthButton;
