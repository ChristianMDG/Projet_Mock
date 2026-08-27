import React from 'react';
import { Grid, TextField, Typography, InputAdornment } from '@mui/material';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import BadgeOutlined from '@mui/icons-material/BadgeOutlined';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import StyledIcon from '@/components/ui/StyledIcon';
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
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      )}

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label={t(Labels.first_name)}
            value={userForm.firstName}
            onChange={e => setUserForm(prev => ({ ...prev, firstName: e.target.value }))}
            variant="outlined"
            placeholder="Jean"
            disabled={disabled}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon icon={PersonOutlined} fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
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
            placeholder="Rakoto"
            disabled={disabled}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon icon={PersonOutlined} fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
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
            placeholder="034 00 000 00"
            disabled={disabled}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon icon={PhoneOutlined} fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={t(Labels.id_number)}
            value={userForm.idNumber}
            onChange={e => setUserForm(prev => ({ ...prev, idNumber: e.target.value }))}
            variant="outlined"
            placeholder="101 234 567 890"
            disabled={disabled}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon icon={BadgeOutlined} fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};
