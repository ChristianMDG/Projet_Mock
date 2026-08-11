import { useMutation } from '@tanstack/react-query';
import { createAccount, forgotPassword, loginWithToken, resetPassword } from '@/api/user.api';
import { useAuth } from '@/context/AuthContext';
import { normalizePhoneNumber, validatePhoneNumber } from '@/utils/phoneUtils';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';
import { customStorage } from '@/utils/customStorage';
import type {
  AccountModel,
  AuthMode,
  AuthResponse,
  LoginCredentials,
  LoginFormData,
  UseAuthFormOptions,
  ValidationErrors,
} from '@/types/auth.types';
import { AuthenticationError } from '@/api/interceptor.api';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants/routes';
import dayjs from '@/utils/dayjs';

const WELCOME_DURATION_MS = 13 * 60 * 1000;

const AUTH_TIMESTAMP_KEY = 'txbr_auth_timestamp';

export const useWelcomeMessageVisible = () => {
  const { isAuthenticated } = useAuthStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timestamp = customStorage.getItem(AUTH_TIMESTAMP_KEY);
    const remaining = timestamp ? WELCOME_DURATION_MS - (dayjs().valueOf() - parseInt(timestamp, 10)) : 0;
    const shouldShow = isAuthenticated && remaining > 0;

    setVisible(shouldShow);
    if (shouldShow) {
      const timer = setTimeout(() => setVisible(false), remaining);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  return visible;
};

const ERROR_LABEL_MAP: Record<string, string> = {
  error_invalid_credentials: 'error_invalid_credentials',
  error_phone_already_taken: 'error_phone_already_taken',
  error_network: 'error_network',
  error_server_error: 'error_server_error',
  error_validation_failed: 'error_validation_failed',
  error_access_denied: 'error_access_denied',
  error_unknown: 'error_unknown',
  error_bad_request: 'error_bad_request',
  error_not_found: 'error_not_found',
  error_service_unavailable: 'error_service_unavailable',
  error_invalid_otp: 'error_invalid_otp',
  error_user_not_found: 'error_user_not_found',
};

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginFormData): Promise<AuthResponse> => {
      const credentials: LoginCredentials = {
        phone: data.phone,
        password: data.password,
      };
      return await loginWithToken(credentials);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: AccountModel) => {
      return await createAccount(data);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (phone: string) => {
      return await forgotPassword(phone);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ phone, otp, newPassword }: { phone: string; otp: string; newPassword: string }) => {
      return await resetPassword(phone, otp, newPassword);
    },
  });
}

export function parseAuthError(error: unknown): string {
  if (error instanceof AuthenticationError) {
    return ERROR_LABEL_MAP[error.message] || error.message;
  }
  if (error instanceof Error) {
    if (ERROR_LABEL_MAP[error.message]) {
      return ERROR_LABEL_MAP[error.message];
    }
    return error.message;
  }
  return 'error_unknown';
}

export const useAuthForm = (options: UseAuthFormOptions = {}) => {
  const { t, i18n } = useTranslation();
  const { showSocialLogin = true, onSuccess, redirectTo, initialMode = 'login', prefillPhone = '' } = options;
  const defaultRedirectTo = ROUTES.home[i18n.language];
  const finalRedirectTo = redirectTo ?? defaultRedirectTo;
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [form, setForm] = useState<LoginFormData>({
    phone: prefillPhone,
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const forgotPasswordMutation = useForgotPassword();
  const mutations = [loginMutation, registerMutation, forgotPasswordMutation];
  const loading = isSubmitting || mutations.some(m => m.isPending);

  const getTranslatedError = useCallback(
    (error: unknown): string | null => {
      if (error) {
        const errorKey = parseAuthError(error);
        const translated = t(errorKey as keyof typeof Labels);
        return translated !== errorKey ? translated : errorKey;
      }
      return null;
    },
    [t],
  );

  const mutationError = mutations.find(m => m.error)?.error;
  const error = errorMessage ?? getTranslatedError(mutationError);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setErrorMessage(null);
    mutations.forEach(m => m.reset());
  }, [mode]);

  useEffect(() => {
    if (loginMutation.isSuccess && loginMutation.data) {
      authLogin(loginMutation.data.token, loginMutation.data.user);
      onSuccess?.();
      navigate(finalRedirectTo);
    }
  }, [loginMutation.isSuccess, loginMutation.data, authLogin, navigate, onSuccess, finalRedirectTo]);

  const handleInputChange = useCallback(
    (field: keyof LoginFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setForm(prev => ({
        ...prev,
        [field]: value,
      }));
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field as keyof ValidationErrors];
        return updated;
      });
    },
    [],
  );

  const validatePhone = useCallback(
    (phone: string): string | undefined => {
      if (phone.trim()) {
        const phoneValidation = validatePhoneNumber(phone);
        return phoneValidation.isValid ? undefined : phoneValidation.message;
      }
      return t(Labels.authform_phone_required);
    },
    [t],
  );

  const validatePassword = useCallback(
    (password: string, mode: AuthMode): string | undefined => {
      if (mode === 'forgot') return undefined;
      if (password.trim() && password.length >= 6) return undefined;
      if (password.length > 0 && password.length < 6) return t(Labels.authform_password_min_length);
      return t(Labels.authform_password_required);
    },
    [t],
  );

  const validateEmail = useCallback(
    (email: string): string | undefined => {
      if (email.trim()) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? undefined : t(Labels.authform_email_invalid);
      }
      return t(Labels.authform_email_required);
    },
    [t],
  );

  const validateRequiredField = useCallback(
    (value: string | undefined, fieldName: string): string | undefined => {
      if (value?.trim()) return undefined;
      return t(Labels.authform_field_required).replace('{field}', fieldName);
    },
    [t],
  );

  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};
    const phoneError = validatePhone(form.phone);
    if (phoneError) errors.phone = phoneError;
    const passwordError = validatePassword(form.password, mode);
    if (passwordError) errors.password = passwordError;
    if (mode === 'register') {
      const firstNameError = validateRequiredField(form.firstName, t(Labels.authform_first_name));
      if (firstNameError) errors.firstName = firstNameError;
      const lastNameError = validateRequiredField(form.lastName, t(Labels.authform_last_name));
      if (lastNameError) errors.lastName = lastNameError;
      if (form.email && form.email.trim() !== '') {
        const emailError = validateEmail(form.email);
        if (emailError) errors.email = emailError;
      }
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form, mode, validatePhone, validatePassword, validateEmail, validateRequiredField, t]);

  const isFormValid = useCallback((): boolean => {
    if (mode === 'forgot') {
      return form.phone.trim() !== '' && !validationErrors.phone;
    }
    if (mode === 'register') {
      return (
        form.phone.trim() !== '' &&
        form.password.trim() !== '' &&
        form.firstName?.trim() !== '' &&
        form.lastName?.trim() !== '' &&
        Object.keys(validationErrors).length === 0
      );
    }
    return form.phone.trim() !== '' && form.password.trim() !== '' && Object.keys(validationErrors).length === 0;
  }, [form, mode, validationErrors]);

  const clearError = useCallback(() => {
    setErrorMessage(null);
    mutations.forEach(m => m.reset());
  }, [mutations]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      clearError();
      if (validateForm()) {
        setIsSubmitting(true);
        setSuccessMessage(null);
        try {
          const normalizedPhone = normalizePhoneNumber(form.phone);
          if (normalizedPhone) {
            if (mode === 'login') {
              await loginMutation.mutateAsync({ ...form, phone: normalizedPhone });
            } else if (mode === 'register') {
              await registerMutation.mutateAsync({
                lastName: form.lastName ?? '',
                firstName: form.firstName ?? '',
                email: form.email,
                phone: normalizedPhone,
                username: normalizedPhone,
                password: form.password,
                idNumber: form.idNumber ?? '',
                isActive: true,
              });
              setSuccessMessage(t(Labels.authform_register_success));
              setMode('login');
              setForm(prev => ({ ...prev, password: '' }));
            } else if (mode === 'forgot') {
              await forgotPasswordMutation.mutateAsync(normalizedPhone);
              navigate(ROUTES.resetPassword[i18n.language], { state: { phone: normalizedPhone } });
            }
          } else {
            setValidationErrors({ phone: t(Labels.authform_phone_invalid) });
          }
        } catch (err) {
          const translatedError = getTranslatedError(err);
          if (translatedError) setErrorMessage(translatedError);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [
      form,
      mode,
      validateForm,
      loginMutation,
      registerMutation,
      forgotPasswordMutation,
      setMode,
      t,
      clearError,
      getTranslatedError,
      navigate,
    ],
  );

  const handleModeChange = useCallback((newMode: AuthMode) => {
    setMode(newMode);
    setValidationErrors({});
    setForm(prev => ({
      phone: prev.phone,
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    }));
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const resetForm = useCallback(() => {
    setForm({
      phone: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    });
    setValidationErrors({});
    setIsSubmitting(false);
    setShowPassword(false);
  }, []);

  return {
    form,
    mode,
    loading,
    error,
    showPassword,
    validationErrors,
    isSubmitting,
    successMessage,
    isFormValid: isFormValid(),
    showSocialLogin,
    handleInputChange,
    handleSubmit,
    handleModeChange,
    togglePasswordVisibility,
    resetForm,
    clearError,
    setMode: handleModeChange,
    setLoading: () => {},
    setError: setErrorMessage,
    setShowPassword: setShowPassword,
  };
};
