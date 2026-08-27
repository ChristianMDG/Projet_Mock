import React from 'react';
import { Grid } from '@mui/material';
import PhoneInput from '@/components/shared/PhoneInput';
import type { LoginFormData } from '@/types/auth.types';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

interface ValidationErrors {
  phone?: string;
}

interface PasswordResetFormProps {
  form: Pick<LoginFormData, 'phone'>;
  loading: boolean;
  validationErrors?: ValidationErrors;
  onInputChange: (field: 'phone') => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  form,
  loading,
  validationErrors = {},
  onInputChange,
}) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={{ xs: 1.5, sm: 2.5 }}>
      <Grid size={{ xs: 12 }}>
        <PhoneInput
          fullWidth
          label={t(Labels.ui_userinfo_phone)}
          value={form.phone}
          onChange={value => onInputChange('phone')({ target: { value } } as React.ChangeEvent<HTMLInputElement>)}
          disabled={loading}
          required
          storageFormat={true}
          showOperator={true}
          autoComplete="tel"
          error={!!validationErrors.phone}
          helperText={validationErrors.phone}
        />
      </Grid>
    </Grid>
  );
};

export default PasswordResetForm;
