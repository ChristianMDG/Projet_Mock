import React from 'react';
import { Box, Typography } from '@mui/material';
import { useAuthStore } from '@/stores/auth.store';
import { useTranslation } from 'react-i18next';
import { useWelcomeMessageVisible } from '@/hooks/auth.hooks';
import Labels from '@/labelKeys.json';

const WelcomeMessage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const visible = useWelcomeMessageVisible();

  return visible ? (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h4" sx={{ color: 'common.white', fontWeight: 700, mb: 1 }}>
        {`${user?.firstName}, ${t(Labels.welcome_message_title)} !`}
      </Typography>
      <Typography variant="body2" sx={{ color: 'secondary.light', opacity: 0.9 }}>
        {t(Labels.welcome_message_description)}
      </Typography>
    </Box>
  ) : null;
};

export default WelcomeMessage;
