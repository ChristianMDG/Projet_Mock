import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  useColorScheme,
  useMediaQuery,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import Logout from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import taxibrousseLightLocUrl from '@/assets/taxibrousse-light-loc.svg?url';
import { useAuth } from '@/context/AuthContext';
import { LoginPopper } from '@/shared/LoginPopper';
import { ROUTES } from '@/constants/routes';
import LabelKeys from '@/labelKeys.json';
import StyledIcon from '@/components/ui/StyledIcon';
import StyledTab from '@/components/ui/StyledTab';
import LanguageSelector from '@/components/shared/LanguageSelector';
import { customStorage } from '@/utils/customStorage';
import { TFunction } from 'i18next';

const getNavLinks = (t: TFunction) => [
  { label: t(LabelKeys.rental_header_nav_utilities), path: '/utilitaires' },
  { label: t(LabelKeys.rental_header_nav_cars), path: '/voitures' },
  { label: t(LabelKeys.rental_header_nav_agencies), path: '/agences' },
  { label: t(LabelKeys.rental_header_nav_guide), path: '/guide' },
];

export default function RentalHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { mode, setMode } = useColorScheme();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveMode = useMemo(() => {
    if (mounted) {
      if (mode === 'system') {
        return prefersDark ? 'dark' : 'light';
      }
      return mode;
    }
    return 'light';
  }, [mode, prefersDark, mounted]);

  const handleModeChange = (newMode: 'light' | 'dark') => {
    setMode(newMode);
    customStorage.setItem('X-Theme-App', newMode);
    document.cookie = `mui-mode=${newMode}; path=/; max-age=31536000`;
  };

  const navLinks = useMemo(() => getNavLinks(t), [t]);

  const currentTab = navLinks.find(nav => location.pathname.startsWith(nav.path))?.path || false;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    handleCloseUserMenu();
  };

  const settings = [
    {
      label: t(LabelKeys.settings_account),
      icon: <StyledIcon icon={AccountCircle} sx={{ fontSize: 'small' }} />,
      action: () => navigate(user ? ROUTES.accountDetail[i18n.language] : ROUTES.home[i18n.language]),
    },
    {
      label: t(LabelKeys.settings_logout),
      icon: <StyledIcon icon={Logout} sx={{ fontSize: 'small' }} />,
      action: () => logout(),
    },
  ];

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 2 }}>
          {/* Logo */}
          <Button
            component={Link}
            to="/"
            variant="text"
            sx={{ p: 0.5, minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Box
              component="img"
              src={taxibrousseLightLocUrl}
              alt="Taxibrousse Location"
              sx={{ height: { xs: 28, md: 36 } }}
            />
          </Button>

          {/* Nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
              sx={{ minHeight: '64px', alignItems: 'center' }}
            >
              {navLinks.map(nav => (
                <StyledTab
                  key={nav.path}
                  value={nav.path}
                  label={nav.label}
                  cardStyle={false}
                  sx={{
                    minHeight: '64px',
                    fontWeight: currentTab === nav.path ? 600 : 400,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* Right controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Dark / light toggle */}
            <IconButton
              onClick={() => handleModeChange(effectiveMode === 'dark' ? 'light' : 'dark')}
              color="inherit"
              aria-label={t(LabelKeys.rental_header_toggle_theme)}
              size="large"
              sx={{ display: mounted && isMobile ? 'none' : 'inline-flex' }}
            >
              {effectiveMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Language selector */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <LanguageSelector />
            </Box>

            {/* Account */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {isAuthenticated && user ? (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title={t(LabelKeys.rental_header_open_settings)}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        sx={{ bgcolor: 'secondary.main', color: 'primary.main', width: 32, height: 32 }}
                        alt={user.firstName}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map(setting => (
                      <MenuItem key={setting.label} onClick={() => handleMenuItemClick(setting.action)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {setting.icon}
                          <Typography>{setting.label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <LoginPopper />
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
