import React from 'react';
import { Box, Typography } from '@mui/material';
import type { AuthMode } from '@/types/auth.types';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

interface AuthFormHeaderProps {
  mode: AuthMode;
}

const AuthFormHeader: React.FC<AuthFormHeaderProps> = ({ mode }) => {
  const { t } = useTranslation();
  const getMainTitle = () => {
    switch (mode) {
      case 'register':
        return t(Labels.authform_create_account);
      case 'forgot':
        return t(Labels.authform_forgot_password);
      default:
        return t(Labels.login_connect);
    }
  };
  const getSubtitle = () => {
    switch (mode) {
      case 'forgot':
        return t(Labels.authform_forgot_subtitle);
      default:
        return t(Labels.authform_welcome_title);
    }
  };
  return (
    <Box
      sx={{
        textAlign: 'center',
        mb: 3,
      }}
    >
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        {getMainTitle()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {getSubtitle()}
      </Typography>
    </Box>
  );
};

export default AuthFormHeader;
