import React from 'react';
import { Button, Grid } from '@mui/material';
import type { AuthMode } from '@/types/auth.types';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

interface AuthSubmitButtonProps {
  mode: AuthMode;
  loading: boolean;
  isFormValid: boolean;
}

const AuthSubmitButton: React.FC<AuthSubmitButtonProps> = ({ mode, loading, isFormValid }) => {
  const { t } = useTranslation();

  const getButtonText = () => {
    if (loading) return t(Labels.authform_loading);

    switch (mode) {
      case 'register':
        return t(Labels.authform_create_account);
      case 'forgot':
        return t(Labels.authform_reset_password_btn);
      default:
        return t(Labels.authform_sign_in);
    }
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading || !isFormValid}
        sx={{
          mt: { xs: 1.5, sm: 2.5 },
          py: { xs: 1.2, sm: 1.5 },
          px: { xs: 2, sm: 3 },
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          boxShadow: theme => theme.shadows[2],
          '&:hover': {
            boxShadow: theme => theme.shadows[4],
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: theme => theme.shadows[1],
          },
          '&:disabled': {
            opacity: 0.65,
            cursor: 'not-allowed',
            boxShadow: 'none',
            transform: 'none',
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.light',
            outlineOffset: '2px',
          },
        }}
      >
        {getButtonText()}
      </Button>
    </Grid>
  );
};

export default AuthSubmitButton;
