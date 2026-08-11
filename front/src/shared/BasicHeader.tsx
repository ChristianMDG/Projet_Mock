import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import MenusDrawer from './MenusDrawer';
import { LanguageSelector } from '@/components/shared';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useNavigate, Link, useLocation, matchPath } from 'react-router-dom';
import { useColorScheme, useMediaQuery, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { ROUTES, generateRoute } from '@/constants/routes';
import LabelKeys from '@/labelKeys.json';
import taxibrousseLight from '@/assets/taxibrousse-light.svg';
import taxibrousseDark from '@/assets/taxibrousse-dark.svg';
import taxibroussePng from '@/assets/taxibrousse.png';
import { HideOnMobile, HideOnScroll } from './ResponsiveComponents';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { LoginPopper } from './LoginPopper';
import {
  AccountCircle,
  AirportShuttle,
  AttachMoney,
  Business,
  Domain,
  EventSeat,
  Home,
  Info,
  LocalOffer,
  LocationOn,
  Logout,
  People,
  Schedule,
  Security,
} from '@mui/icons-material';
import { AuthorityEnum } from '@/models/enums';
import { VehicleIcon } from '@/components/shared';
import { StyledIcon } from '@/components/ui';
import { customStorage } from '@/utils/customStorage';

interface TabConfig {
  label: string;
  path: string;
  hide?: boolean;
  icon?: React.ReactNode;
}

const BasicHeader = () => {
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { mode, setMode } = useColorScheme();
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Handle hydration-safe media query
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  });

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

  const koperativesMatch = matchPath(ROUTES.koperativeDetail[i18n.language], location.pathname);
  const schedulerId = koperativesMatch?.params?.id ?? user?.koperative?.id;
  const isOperator = user?.authorities?.some(a => a.name === AuthorityEnum.OPERATOR) ?? false;

  const tabConfig: TabConfig[] = useMemo(
    () => [
      {
        label: user?.koperative?.name ?? 'TAXIBROUSSE',
        path: user?.koperative?.id
          ? generateRoute.koperativeDetail(user.koperative.id, i18n.language)
          : ROUTES.home[i18n.language],
        hide: !user?.koperative?.id,
        icon: <StyledIcon icon={Domain} variant="primary" />,
      },
      {
        label: t(LabelKeys.nav_home),
        path: ROUTES.home[i18n.language],
        hide: !!user?.koperative?.id,
        icon: <StyledIcon icon={Home} variant="primary" />,
      },
      {
        label: t(LabelKeys.nav_cooperatives),
        path: ROUTES.koperativesList[i18n.language],
        hide: !!user?.koperative?.id,
        icon: <StyledIcon icon={Business} />,
      },
      {
        label: t(LabelKeys.nav_cooperative_info),
        path: user?.koperative?.id
          ? generateRoute.cooperativeInfo(user.koperative.id, i18n.language)
          : ROUTES.home[i18n.language],
        hide: !user?.koperative?.id,
        icon: <StyledIcon icon={Info} />,
      },
      {
        label: t(LabelKeys.nav_stations),
        path: ROUTES.garesList[i18n.language],
        icon: <StyledIcon icon={AirportShuttle} />,
      },
      {
        label: t(LabelKeys.menu_voyages),
        path: ROUTES.voyagesList[i18n.language],
        icon: <StyledIcon icon={VehicleIcon} />,
      },
      {
        label: t(LabelKeys.operator_list_title),
        path: ROUTES.operators[i18n.language],
        icon: <StyledIcon icon={People} />,
      },
      {
        label: t(LabelKeys.operator_booking_title),
        path: ROUTES.operatorBooking[i18n.language],
        hide: !isOperator,
        icon: <StyledIcon icon={EventSeat} />,
      },
      // Admin Tabs
      {
        label: t(LabelKeys.nav_booking_rates),
        path: ROUTES.bookingRates[i18n.language],
        hide: !user?.isAdmin,
        icon: <StyledIcon icon={AttachMoney} />,
      },
      {
        label: t(LabelKeys.nav_destinations),
        path: ROUTES.destinations[i18n.language],
        hide: !user?.isAdmin,
        icon: <StyledIcon icon={LocationOn} />,
      },
      {
        label: t(LabelKeys.nav_safety_insurance),
        path: ROUTES.safetyInsurance[i18n.language],
        hide: !user?.isAdmin,
        icon: <StyledIcon icon={Security} />,
      },
      {
        label: t(LabelKeys.nav_promotions),
        path: ROUTES.promotions[i18n.language],
        hide: !user?.isAdmin,
        icon: <StyledIcon icon={LocalOffer} />,
      },
      {
        label: t(LabelKeys.voyage_scheduler_title),
        path: schedulerId ? generateRoute.voyageScheduler(schedulerId, i18n.language) : '',
        hide: !schedulerId,
        icon: <StyledIcon icon={Schedule} />,
      },
      // Default fallback Tab
      {
        label: t(LabelKeys.nav_page_infos),
        path: matchPath(ROUTES.dynamicPage[i18n.language], location.pathname)
          ? location.pathname
          : ROUTES.pageInformations[i18n.language],
        icon: <StyledIcon icon={Info} />,
      },
    ],
    [
      user?.koperative?.id,
      user?.koperative?.name,
      user?.isAdmin,
      koperativesMatch,
      t,
      i18n.language,
      schedulerId,
      location.pathname,
    ],
  );

  const navigate = useNavigate();

  const value = React.useMemo(() => {
    const foundTab = tabConfig.find(tab => matchPath({ path: tab.path, end: true }, location.pathname));
    return foundTab ? foundTab.path : ROUTES.home[i18n.language];
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
                gap: { xs: 1, md: 2 },
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => handleModeChange(effectiveMode === 'dark' ? 'light' : 'dark')}
                color="inherit"
                aria-label="Toggle Theme"
              >
                {effectiveMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <LanguageSelector />
              {isAuthenticated && user ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 2,
                  }}
                >
                  <Tooltip title={`${user.firstName} ${user.lastName}`}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        sx={{ bgcolor: 'secondary.main', color: 'primary.main', width: 32, height: 32 }}
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
    </AppBar>
  );
};

export default BasicHeader;
