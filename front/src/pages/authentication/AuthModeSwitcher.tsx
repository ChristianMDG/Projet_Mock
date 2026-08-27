import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Person from '@mui/icons-material/Person';
import Login from '@mui/icons-material/Login';
import type { AuthMode } from '@/types/auth.types';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

const MODE_CONFIG: Record<
  Exclude<AuthMode, 'reset'>,
  { text: string; btn: string; icon: React.ReactNode; target: AuthMode }
> = {
  login: {
    text: Labels.authform_no_account_yet,
    btn: Labels.authform_create_account,
    icon: <Person />,
    target: 'register',
  },
  register: {
    text: Labels.authform_already_have_account,
    btn: Labels.authform_sign_in,
    icon: <Login />,
    target: 'login',
  },
  forgot: { text: Labels.authform_back_to, btn: Labels.authform_login, icon: <Login />, target: 'login' },
};

const AuthModeSwitcher: React.FC<{ mode: AuthMode; onModeChange: (mode: AuthMode) => void }> = ({
  mode,
  onModeChange,
}) => {
  const { t } = useTranslation();
  if (mode === 'reset') return <></>;

  const config = MODE_CONFIG[mode];

  return (
    <Box
      sx={{
        textAlign: 'center',
        mt: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {t(config.text)}
      </Typography>
      <Button
        fullWidth
        variant="text"
        color="primary"
        startIcon={config.icon}
        onClick={() => onModeChange(config.target)}
        sx={{ mt: 1.5 }}
      >
        {t(config.btn)}
      </Button>
    </Box>
  );
};

export default AuthModeSwitcher;
