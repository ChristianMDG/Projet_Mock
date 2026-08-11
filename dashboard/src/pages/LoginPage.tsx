import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage, type AuthProvider, type AuthResponse } from '@toolpad/core/SignInPage';
import { useColorScheme } from '@/shared/ColorSchemeToggle';
import { appTheme } from '@/themes/appTheme';
import taxibrousseDark from '@/assets/taxibrousse-dark.svg';
import taxibrousseLight from '@/assets/taxibrousse-light.svg';
import { useLogin } from '@/hooks/auth.hook';
import { useEffect } from 'react';

const providers = [{ id: 'credentials', name: 'Credentials' }];

export default function LoginPage() {
  const { mode } = useColorScheme();
  const { login, isLoading, error, clearError } = useLogin();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSignIn = async (_provider: AuthProvider, formData: FormData): Promise<AuthResponse> => {
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;

    if (phone && password) {
      return new Promise<AuthResponse>((resolve) => {
        login(
          { phone, password },
          {
            onSuccess: () => resolve({}),
            onError: () => resolve({ error: error ?? 'Erreur de connexion' }),
          }
        );
      });
    }

    return {
      error: 'Veuillez remplir tous les champs',
    };
  };

  const isDark = mode === 'dark';
  const logo = isDark ? taxibrousseDark : taxibrousseLight;

  return (
    <AppProvider
      theme={appTheme}
      branding={{
        logo: <img src={logo} alt="Taxibrousse" />,
        title: 'Taxibrousse',
      }}
    >
      <SignInPage
        providers={providers}
        signIn={handleSignIn}
        slotProps={{
          emailField: {
            id: 'phone',
            label: 'Téléphone',
            placeholder: '034 00 000 00',
            autoComplete: 'tel',
            name: 'phone',
            type: 'tel',
          },
          passwordField: {
            label: 'Mot de passe',
            placeholder: 'Entrez votre mot de passe',
          },
          submitButton: {
            children: isLoading ? 'Connexion...' : 'Se connecter',
          },
        }}
      />
    </AppProvider>
  );
}
