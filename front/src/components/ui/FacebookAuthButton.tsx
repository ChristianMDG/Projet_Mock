import React, { useEffect, useRef, useState } from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import { Facebook as FacebookIcon } from '@mui/icons-material';
import { useFacebookAuth } from '@/hooks/facebook-auth.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

declare global {
  interface Window {
    fbAsyncInit: (() => void) | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB: any;
  }
}

const localeMap: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  mg: 'mg_MG',
};

const FacebookAuthButton: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { verifyFacebookToken, isLoading } = useFacebookAuth();
  const fbInitialized = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [isLoginAllowed, setIsLoginAllowed] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check login conditions only on client
    const isLocalhostClient = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const isSecureClient = window.location.protocol === 'https:';
    setIsLoginAllowed(isSecureClient || isLocalhostClient);
  }, []);

  function initializeFacebook() {
    const alreadyInitialized = fbInitialized.current;
    const fbAvailable = Boolean(window.FB);

    if (alreadyInitialized || !fbAvailable) return;

    window.FB.init({
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
      xfbml: false,
      version: 'v18.0',
      frictionlessRequests: false,
    });

    fbInitialized.current = true;
  }

  useEffect(() => {
    if (mounted) {
      const fbLocale = localeMap[i18n.language] || 'en_US';
      const scriptId = 'facebook-jssdk';
      const expectedSrc = `https://connect.facebook.net/${fbLocale}/sdk.js`;

      const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
      const hasCorrectLocale = existing?.src?.includes(`/${fbLocale}/`);

      // If script exists with correct locale, initialize
      if (hasCorrectLocale) {
        if (window.FB) initializeFacebook();
        return;
      }

      // Remove old script if present
      if (existing) {
        existing.remove();
        delete (window as any).FB;
        fbInitialized.current = false;
      }

      // Create and load new script
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = expectedSrc;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.FB) initializeFacebook();
      };
      script.onerror = () => {
        console.error('Failed to load Facebook SDK');
      };

      document.body.appendChild(script);
      window.fbAsyncInit = () => initializeFacebook();

      return () => {
        window.fbAsyncInit = undefined;
      };
    }
  }, [i18n.language, mounted]);

  const handleFacebookLogin = () => {
    const fbLoaded = Boolean(window.FB);
    if (!fbLoaded) {
      console.error('Facebook SDK not loaded');
      return;
    }

    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      /^127\./.test(hostname) ||
      /^192\.168\./.test(hostname);
    const isSecure = window.location.protocol === 'https:';

    if (!isSecure && !isLocalhost) {
      console.warn(
        'Facebook login blocked: FB.login cannot be called from insecure (http) pages. Use HTTPS or localhost for development.',
      );
      return;
    }

    type FBResponse = { authResponse?: { accessToken?: string } } | Record<string, unknown>;

    window.FB.login(
      function (response: FBResponse) {
        const resp = response as { authResponse?: { accessToken?: string } };
        const accessToken = resp?.authResponse?.accessToken;
        if (accessToken) {
          verifyFacebookToken(accessToken).catch(err => console.error('verifyFacebookToken error', err));
        } else {
          console.error('Facebook login failed');
        }
      },
      {
        scope: 'email,public_profile,user_friends',
        auth_type: 'rerequest',
      },
    );
  };

  const isLoginBlocked = !isLoginAllowed;

  const FbButton = (
    <Button
      fullWidth
      variant="outlined"
      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <FacebookIcon />}
      onClick={handleFacebookLogin}
      disabled={isLoading || isLoginBlocked}
    >
      {t(Labels.authform_facebook)}
    </Button>
  );

  // During SSR/initial render, show disabled button
  if (mounted) {
    if (isLoginAllowed) {
      return FbButton;
    }

    return (
      <Tooltip title={`${t(Labels.authform_facebook)} — requires https or localhost`}>
        <span>{FbButton}</span>
      </Tooltip>
    );
  }

  return (
    <Button fullWidth variant="outlined" startIcon={<FacebookIcon />} disabled>
      {t(Labels.authform_facebook)}
    </Button>
  );
};

export default FacebookAuthButton;
