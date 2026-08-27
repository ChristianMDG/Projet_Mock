import React from 'react';
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlined from '@mui/icons-material/LockOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import PhoneInput from '@/components/shared/PhoneInput';
import AccountTypeTabs from '@/components/ui/AccountTypeTabs';
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
  isGuichet?: boolean;
  onInputChange: (field: keyof AccountModel) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordVisibilityToggle: () => void;
  onGuichetChange?: (checked: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  form,
  loading,
  showPassword,
  validationErrors = {},
  isGuichet = false,
  onInputChange,
  onPasswordVisibilityToggle,
  onGuichetChange,
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
          placeholder="Rakoto"
          error={!!validationErrors.lastName}
          helperText={validationErrors.lastName}
          size="medium"
          margin="dense"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
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
          placeholder="Jean"
          error={!!validationErrors.firstName}
          helperText={validationErrors.firstName}
          size="medium"
          margin="dense"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label={t(Labels.id_number)}
          value={form.idNumber ?? ''}
          onChange={onInputChange('idNumber')}
          disabled={loading}
          required
          placeholder="101 234 567 890"
          error={!!validationErrors.idNumber}
          helperText={validationErrors.idNumber}
          size="medium"
          margin="dense"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
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
        <FormControl fullWidth variant="outlined" error={!!validationErrors.password}>
          <InputLabel htmlFor="password" required>
            {t(Labels.authform_password)}
          </InputLabel>
          <OutlinedInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={onInputChange('password')}
            disabled={loading}
            required
            autoComplete="new-password"
            size="medium"
            placeholder="••••••••"
            startAdornment={
              <InputAdornment position="start">
                <LockOutlined fontSize="small" color="action" />
              </InputAdornment>
            }
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
            <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 2 }}>
              {validationErrors.password}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AccountTypeTabs isGuichet={isGuichet} onGuichetChange={onGuichetChange} disabled={loading} />
      </Grid>
    </Grid>
  );
};

export default RegisterForm;
