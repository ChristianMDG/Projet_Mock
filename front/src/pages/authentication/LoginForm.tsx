import React from 'react';
import { Box, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { PhoneInput } from '@/components/shared';
import type { AuthMode, LoginFormData } from '@/types/auth.types';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

interface ValidationErrors {
  phone?: string;
  password?: string;
}

interface LoginFormProps {
  form: LoginFormData;
  loading: boolean;
  showPassword: boolean;
  validationErrors?: ValidationErrors;
  onInputChange: (field: keyof LoginFormData) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordVisibilityToggle: () => void;
  onModeChange: (mode: AuthMode) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  form,
  loading,
  showPassword,
  validationErrors = {},
  onInputChange,
  onPasswordVisibilityToggle,
  onModeChange,
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
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: { xs: 1, sm: 1.5 },
            },
          }}
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
            autoComplete="current-password"
            size="medium"
            sx={{
              borderRadius: { xs: 1, sm: 1.5 },
            }}
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
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: { xs: 0.5, sm: 1.5 },
          }}
        >
          <Link
            component="button"
            type="button"
            onClick={() => onModeChange('forgot')}
            color="primary"
            sx={{
              fontSize: { xs: '0.875rem', sm: '0.9rem' },
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {t(Labels.authform_forgot_password)}
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
