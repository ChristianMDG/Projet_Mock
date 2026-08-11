import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PersonIcon from '@mui/icons-material/PersonRounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useAuth } from '@/context/AuthContext';
import { IconButton } from '@mui/material';
import { ROUTES } from '@/constants/routes';

export function LoginPopper() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogin = () => {
    handleMenuClose();
    navigate(ROUTES.login[i18n.language], { state: { mode: 'login' } });
  };

  const handleRegister = () => {
    handleMenuClose();
    navigate(ROUTES.login[i18n.language], { state: { mode: 'register' } });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <IconButton
        id="login-popper-button"
        aria-controls={open ? 'login-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={handleMenuOpen}
        sx={{ color: 'primary.main' }}
      >
        <PersonIcon sx={{ fontSize: 26 }} />
      </IconButton>
      <Menu
        id="login-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        sx={theme => ({
          mt: theme.spacing(1),
          '& .MuiPaper-root': {
            minWidth: 180,
            boxShadow: theme.shadows[8],
            borderRadius: theme.spacing(1),
            mt: theme.spacing(0.5),
          },
        })}
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={handleLogin}
          sx={{
            gap: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <PersonIcon /> {t(Labels.login_connect)}
        </MenuItem>
        <MenuItem
          onClick={handleRegister}
          sx={{
            gap: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <PersonAddIcon /> {t(Labels.login_create_account)}
        </MenuItem>
      </Menu>
    </Box>
  );
}
