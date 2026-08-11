import React from 'react';
import type { AccountModel, AuthMode, LoginFormData } from '@/types/auth.types';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import PasswordResetForm from './PasswordResetForm';

interface ValidationErrors {
  phone?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
}

interface AuthFormFieldsProps {
  form: LoginFormData | AccountModel;
  mode: AuthMode;
  loading: boolean;
  showPassword: boolean;
  validationErrors?: ValidationErrors;
  onInputChange: (field: keyof (LoginFormData | AccountModel)) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordVisibilityToggle: () => void;
  onModeChange: (mode: AuthMode) => void;
}

const AuthFormFields: React.FC<AuthFormFieldsProps> = ({
  form,
  mode,
  loading,
  showPassword,
  validationErrors = {},
  onInputChange,
  onPasswordVisibilityToggle,
  onModeChange,
}) => {
  switch (mode) {
    case 'login':
      return (
        <LoginForm
          form={form as LoginFormData}
          loading={loading}
          showPassword={showPassword}
          validationErrors={validationErrors}
          onInputChange={
            onInputChange as (field: keyof LoginFormData) => (event: React.ChangeEvent<HTMLInputElement>) => void
          }
          onPasswordVisibilityToggle={onPasswordVisibilityToggle}
          onModeChange={onModeChange}
        />
      );
    case 'register':
      return (
        <RegisterForm
          form={form as AccountModel}
          loading={loading}
          showPassword={showPassword}
          validationErrors={validationErrors}
          onInputChange={
            onInputChange as (field: keyof AccountModel) => (event: React.ChangeEvent<HTMLInputElement>) => void
          }
          onPasswordVisibilityToggle={onPasswordVisibilityToggle}
        />
      );
    case 'forgot':
      return (
        <PasswordResetForm
          form={{ phone: form.phone }}
          loading={loading}
          validationErrors={validationErrors}
          onInputChange={
            onInputChange as (field: keyof LoginFormData) => (event: React.ChangeEvent<HTMLInputElement>) => void
          }
        />
      );
    default:
      return <></>;
  }
};

export default AuthFormFields;
