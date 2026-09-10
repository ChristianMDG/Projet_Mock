import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';

import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenusDrawer from './MenusDrawer';
import LanguageSelector from '@/components/shared/LanguageSelector';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate, Link, useLocation, matchPath } from 'react-router-dom';
import { useColorScheme, useMediaQuery, Button } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { GlobalSearchModal } from '@/components/search';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { ROUTES, generateRoute } from '@/constants/routes';
import LabelKeys from '@/labelKeys.json';
import taxibrousseLight from '@/assets/taxibrousse-light.svg';
import taxibrousseDark from '@/assets/taxibrousse-dark.svg';
import taxibroussePng from '@/assets/taxibrousse.png';
import { HideOnMobile, HideOnScroll } from './ResponsiveComponents';
import { LoginPopper } from './LoginPopper';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AirportShuttle from '@mui/icons-material/AirportShuttle';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import Business from '@mui/icons-material/Business';
import Domain from '@mui/icons-material/Domain';
import EventSeat from '@mui/icons-material/EventSeat';
import Home from '@mui/icons-material/Home';
import Info from '@mui/icons-material/Info';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import VehicleIcon from '@/components/shared/VehicleIcon';
import StyledIcon from '@/components/ui/StyledIcon';
import { CartIconButton } from '@/components/shop';
import { customStorage } from '@/utils/customStorage';
import { AuthorityEnum } from '@/models/enums';
import ProtectedTx from '@/components/ProtectedTx';
import { hasAdministrativeRole } from '@/utils/auth.utils';

interface TabConfig {
  label: string;
  path: string;
  hide?: boolean;
  icon?: React.ReactNode;
  category?: string;
}

const SearchTrigger = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  width: 40,
  height: 40,
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.light, 0.04),
  border: `2px solid ${alpha(theme.palette.primary.light, 0.2)}`,
  borderRadius: '24px',
  boxSizing: 'border-box',
  textTransform: 'none',
  transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow', 'transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    borderColor: alpha(theme.palette.primary.light, 0.4),
    backgroundColor: alpha(theme.palette.primary.light, 0.08),
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
    transform: 'translateY(-1px)',
  },
  '&:focus-visible': {
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  [theme.breakpoints.down('sm')]: {
    width: 36,
    height: 36,
    marginLeft: theme.spacing(1),
  },
}));

const BasicHeader = () => {
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const { user, isAuthenticated, logout } = useAuth();
  const { mode, setMode } = useColorScheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Handle hydration-safe media query
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });

  const isAdminOrOperator = user?.admin ?? user?.authorities?.some(a => a.name === AuthorityEnum.OPERATOR);
  const isAuthorizedForVoyage = hasAdministrativeRole(user);
  const prefersDark = useMediaQuery('(prefers-color-scheme: light )', {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const effectiveMode = React.useMemo(() => {
    if (mounted) {
      if (mode === 'system') {
        return prefersDark ? 'dark' : 'light';
      }
      return mode;
    }
    return 'light';
  }, [mode, prefersDark, mounted]);

  const settings = [
    {
      label: t(LabelKeys.settings_account),
      icon: (
        <AccountCircle
          sx={{
            fontSize: 'small',
          }}
        />
      ),
      action: () => navigate(user ? ROUTES.accountDetail[i18n.language] : ROUTES.home[i18n.language]),
    },
    {
      label: t(LabelKeys.settings_logout),
      icon: (
        <Logout
          sx={{
            fontSize: 'small',
          }}
        />
      ),
      action: () => logout(),
    },
  ];

  const handleMenuItemClick = (setting: (typeof settings)[0]) => {
    setting.action();
    handleCloseUserMenu();
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    customStorage.setItem('X-Theme-App', newMode);
    document.cookie = `mui-mode=${newMode}; path=/; max-age=31536000`;
  };

  const koperativeId = user?.koperative?.id;
  const koperativeName = user?.koperative?.name;
  const koperativeSlug = user?.koperative?.slug;

  const tabConfig: TabConfig[] = useMemo(
    () => [
      {
        label: koperativeName ?? 'TAXIBROUSSE',
        path: koperativeSlug
          ? generateRoute.koperativeDetail(koperativeSlug, i18n.language)
          : ROUTES.home[i18n.language],
        hide: !koperativeId,
        icon: <StyledIcon icon={Domain} variant="primary" />,
        category: 'booking',
      },
      {
        label: t(LabelKeys.nav_home),
        path: ROUTES.home[i18n.language],
        hide: !!koperativeId,
        icon: <StyledIcon icon={Home} variant="primary" />,
        category: 'main',
      },
      {
        label: t(LabelKeys.nav_cooperatives),
        path: ROUTES.koperativesList[i18n.language],
        hide: !!koperativeId,
        icon: <StyledIcon icon={Business} />,
        category: 'main',
      },
      {
        label: t(LabelKeys.nav_cooperative_info),
        path: koperativeSlug
          ? generateRoute.cooperativeInfo(koperativeSlug, i18n.language)
          : ROUTES.home[i18n.language],
        hide: !koperativeId,
        icon: <StyledIcon icon={Info} />,
        category: 'cooperative',
      },
      {
        label: t(LabelKeys.nav_stations),
        path: ROUTES.garesList[i18n.language],
        icon: <StyledIcon icon={AirportShuttle} />,
        category: 'main',
      },
      {
        label: t(LabelKeys.menu_voyages),
        path: ROUTES.voyagesList[i18n.language],
        icon: <StyledIcon icon={VehicleIcon} />,
        hide: !isAuthorizedForVoyage,
        category: 'cooperative',
      },
      {
        label: t(LabelKeys.shop_nav_label),
        path: ROUTES.shop[i18n.language],
        icon: <StyledIcon icon={StorefrontOutlined} />,
        category: 'booking',
      },
      {
        label: t(LabelKeys.operator_booking_title),
        path: ROUTES.operatorBooking[i18n.language],
        icon: <StyledIcon icon={EventSeat} />,
        hide: !isAdminOrOperator,
        category: 'booking',
      },
      {
        label: t(LabelKeys.nav_page_infos),
        path: matchPath(ROUTES.dynamicPage[i18n.language], location.pathname)
          ? location.pathname
          : ROUTES.pageInformations[i18n.language],
        icon: <StyledIcon icon={Info} />,
        category: 'booking',
      },
    ],
    [
      t,
      koperativeId,
      koperativeName,
      koperativeSlug,
      i18n.language,
      location.pathname,
      isAdminOrOperator,
      isAuthorizedForVoyage,
    ],
  );

  const navigate = useNavigate();

  const value = React.useMemo(() => {
    const foundTab = tabConfig.find(tab => matchPath({ path: tab.path, end: true }, location.pathname));
    if (foundTab && !foundTab.hide) {
      return foundTab.path;
    }
    const homePath = ROUTES.home[i18n.language];
    const homeTab = tabConfig.find(tab => tab.path === homePath);
    return homeTab && !homeTab.hide ? homePath : false;
  }, [tabConfig, location.pathname, i18n.language]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <AppBar
      color="inherit"
      sx={{
        position: 'fixed',
      }}
    >
      <Container maxWidth="xl">
        <HideOnScroll mobile={mounted ? isMobile : false}>
          <Toolbar disableGutters>
            <IconButton
              onClick={handleOpenDrawer}
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: { xs: 0, md: 2 }, borderRadius: 2, display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon sx={{ color: 'primary.main', fontSize: { xs: 24, md: 32 } }} titleAccess="Open Menu" />
            </IconButton>
            <Button
              component={mounted ? Link : 'button'}
              to={mounted ? ROUTES.home[i18n.language] : '/'}
              variant="text"
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              <Box
                component="img"
                src={effectiveMode === 'dark' ? taxibrousseDark : taxibrousseLight}
                alt="Taxibrousse"
                className="header-logo"
                width={160}
                height={23}
                onError={e => {
                  (e.currentTarget as HTMLImageElement).src = taxibroussePng;
                }}
                sx={{
                  height: { xs: 23, md: 28 },
                }}
              />
            </Button>

            <Box
              sx={{
                flexDirection: 'row',
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <IconButton
                sx={{ ml: 1, display: { xs: 'none', sm: 'inline-flex' } }}
                onClick={() => handleModeChange(effectiveMode === 'dark' ? 'light' : 'dark')}
                color="inherit"
                aria-label="Toggle Theme"
                size="large"
              >
                {effectiveMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <ProtectedTx allowedRoles={[AuthorityEnum.ADMIN]}>
                <CartIconButton />
              </ProtectedTx>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <LanguageSelector />
              </Box>

              {/* Global Search Button */}
              <SearchTrigger
                onClick={() => setSearchModalOpen(true)}
                aria-label={t(LabelKeys.global_search_placeholder)}
                title={t(LabelKeys.global_search_placeholder)}
              >
                <SearchIcon fontSize="small" />
              </SearchTrigger>

              {isAuthenticated && user ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: { xs: 1, sm: 1.5 },
                  }}
                >
                  <Tooltip title={`${user.firstName} ${user.lastName}`}>
                    <IconButton
                      onClick={handleOpenUserMenu}
                      size="large"
                      aria-label="Account settings"
                      sx={{
                        p: 0,
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        borderRadius: '24px',
                        border: theme => `2px solid ${alpha(theme.palette.primary.light, 0.2)}`,
                        transition: theme =>
                          theme.transitions.create(['background-color', 'border-color', 'box-shadow', 'transform'], {
                            duration: theme.transitions.duration.shorter,
                          }),
                        '&:hover': {
                          borderColor: theme => alpha(theme.palette.primary.light, 0.4),
                          boxShadow: theme => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: 'secondary.main',
                          color: 'primary.main',
                          width: { xs: 28, sm: 32 },
                          height: { xs: 28, sm: 32 },
                        }}
                        alt={user.firstName}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <LoginPopper />
              )}
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
                  <MenuItem key={setting.label} onClick={() => handleMenuItemClick(setting)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {setting.icon}
                      <Typography>{setting.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </HideOnScroll>
        <HideOnMobile mobile={mounted ? isMobile : false}>
          <Toolbar disableGutters sx={{ minHeight: '0 !important' }}>
            {mounted && (
              <Tabs onChange={handleChange} value={value} aria-label="Tabs navigation">
                {tabConfig
                  .filter(tab => !tab.hide)
                  .map(tab => (
                    <Tab key={tab.path} label={tab.label} value={tab.path} />
                  ))}
              </Tabs>
            )}
          </Toolbar>
        </HideOnMobile>
      </Container>
      <MenusDrawer isOpen={openDrawer} handleOpen={handleOpenDrawer} tabConfig={tabConfig} />
      <GlobalSearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </AppBar>
  );
};

export default BasicHeader;
