import PersonIcon from '@mui/icons-material/PersonRounded';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useAuth } from '@/context/AuthContext';
import { Button, SxProps, Theme, useMediaQuery, useTheme, alpha } from '@mui/material';
import { ROUTES } from '@/constants/routes';

interface LoginPopperProps {
  sx?: SxProps<Theme>;
}

export function LoginPopper({ sx }: LoginPopperProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isAuthenticated) return null;

  const handleLogin = () => {
    navigate(ROUTES.login[i18n.language], { state: { mode: 'login' } });
  };

  return (
    <Button
      id="login-popper-button"
      color="primary"
      size={isMobile ? 'small' : 'medium'}
      aria-label={t(Labels.login_connect)}
      onClick={handleLogin}
      sx={{
        borderRadius: '24px',
        textTransform: 'none',
        px: { xs: 1, sm: 1.5 },
        py: 0.25,
        fontWeight: 600,
        fontSize: '0.85rem',
        backgroundColor: alpha(theme.palette.primary.light, 0.04),
        backdropFilter: 'blur(8px)',
        border: `2px solid ${alpha(theme.palette.primary.light, 0.2)}`,
        color: 'primary.main',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.light, 0.08),
          borderColor: alpha(theme.palette.primary.light, 0.4),
        },
        ...sx,
      }}
      startIcon={<PersonIcon />}
      disableElevation
    >
      {t(Labels.login_connect)}
    </Button>
  );
}
