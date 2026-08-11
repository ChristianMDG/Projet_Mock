import { useMutation } from '@tanstack/react-query';
import { updateLanguagePreference } from '@/api/user.api';
import type { LanguagePreference } from '@/models/UserInfo';
import { useAuthStore } from '@/stores/auth.store';
import { useCallback, useEffect } from 'react';

export const useUpdateLanguagePreference = () => {
  return useMutation({
    mutationFn: (language: LanguagePreference) => updateLanguagePreference(language),
  });
};

export const useLanguagePreference = () => {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const updatePreferenceMutation = useUpdateLanguagePreference();

  const updateLanguage = useCallback(
    async (language: LanguagePreference) => {
      if (isAuthenticated && user) {
        try {
          await updatePreferenceMutation.mutateAsync(language);
          setUser({ ...user, languagePreference: language });
        } catch (error) {
          console.error('Failed to update language preference:', error);
        }
      }
    },
    [isAuthenticated, user, updatePreferenceMutation, setUser],
  );

  return {
    currentLanguage: user?.languagePreference,
    updateLanguage,
    isUpdating: updatePreferenceMutation.isPending,
  };
};

export const useLanguageSync = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { updateLanguage } = useLanguagePreference();

  useEffect(() => {
    if (isAuthenticated && user && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const urlLang = currentPath.startsWith('/fr') ? 'FR' : currentPath.startsWith('/en') ? 'EN' : 'MG';

      if (user.languagePreference && user.languagePreference === urlLang) {
        return;
      }
      updateLanguage(urlLang as LanguagePreference);
    }
  }, [isAuthenticated, user, updateLanguage]);
};
