import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import type { UserFormData } from '@/types/user.type';

interface UserDetailsFormProps {
  userForm: UserFormData;
  setUserForm: React.Dispatch<React.SetStateAction<UserFormData>>;
  disabled?: boolean;
  title?: string;
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ userForm, setUserForm, disabled = false, title }) => {
  const { t } = useTranslation();

  return (
    <>
      {title && (
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {title}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label={t(Labels.first_name)}
            value={userForm.firstName}
            onChange={e => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
            variant="outlined"
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label={t(Labels.last_name)}
            value={userForm.lastName}
            onChange={e => setUserForm(prev => ({ ...prev, lastName: e.target.value }))}
            variant="outlined"
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label={t(Labels.phone)}
            value={userForm.phone}
            onChange={e => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
            variant="outlined"
            type="tel"
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t(Labels.email)}
            value={userForm.email}
            onChange={e => setUserForm(prev => ({ ...prev, email: e.target.value }))}
            variant="outlined"
            type="email"
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t(Labels.id_number)}
            value={userForm.idNumber}
            onChange={e => setUserForm(prev => ({ ...prev, idNumber: e.target.value }))}
            variant="outlined"
            disabled={disabled}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t(Labels.address)}
            value={userForm.address}
            onChange={e => setUserForm(prev => ({ ...prev, address: e.target.value }))}
            variant="outlined"
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </>
  );
};
