import React from 'react';
import {
  Box,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { PhoneInput } from '@/components/shared';
import type { AccountModel } from '@/types/auth.types';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

interface ValidationErrors {
  phone?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
}

interface RegisterFormProps {
  form: AccountModel;
  loading: boolean;
  showPassword: boolean;
  validationErrors?: ValidationErrors;
  onInputChange: (field: keyof AccountModel) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordVisibilityToggle: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  form,
  loading,
  showPassword,
  validationErrors = {},
  onInputChange,
  onPasswordVisibilityToggle,
}) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={{ xs: 1.5, sm: 2.5 }}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label={t(Labels.authform_last_name)}
          value={form.lastName}
          onChange={onInputChange('lastName')}
          disabled={loading}
          required
          error={!!validationErrors.lastName}
          helperText={validationErrors.lastName}
          size="medium"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label={t(Labels.authform_first_name)}
          value={form.firstName}
          onChange={onInputChange('firstName')}
          disabled={loading}
          required
          error={!!validationErrors.firstName}
          helperText={validationErrors.firstName}
          size="medium"
        />
      </Grid>
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
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label={t(Labels.id_number)}
          value={form.idNumber ?? ''}
          onChange={onInputChange('idNumber')}
          disabled={loading}
          error={!!validationErrors.idNumber}
          helperText={validationErrors.idNumber}
          size="medium"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label={t(Labels.ui_userinfo_email)}
          type="email"
          value={form.email}
          onChange={onInputChange('email')}
          disabled={loading}
          error={!!validationErrors.email}
          helperText={validationErrors.email}
          size="medium"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth variant="outlined" error={!!validationErrors.password}>
          <InputLabel htmlFor="password">{t(Labels.authform_password)}</InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={onInputChange('password')}
            disabled={loading}
            required
            autoComplete="new-password"
            size="medium"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onPasswordVisibilityToggle}
                  edge="end"
                  size="medium"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label={t(Labels.authform_password)}
          />
          {validationErrors.password && (
            <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 2 }}>{validationErrors.password}</Box>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default RegisterForm;
