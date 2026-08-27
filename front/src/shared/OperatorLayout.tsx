import React, { useMemo } from 'react';
import { useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EventSeat from '@mui/icons-material/EventSeat';
import ConfirmationNumber from '@mui/icons-material/ConfirmationNumber';
import People from '@mui/icons-material/People';
import Phone from '@mui/icons-material/Phone';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import { AppProvider, type Navigation, type Session, type Authentication } from '@toolpad/core/AppProvider';
import {
  DashboardLayout,
  DashboardHeader,
  type DashboardHeaderProps,
  type SidebarFooterProps,
} from '@toolpad/core/DashboardLayout';
import type { Router } from '@toolpad/core';
import StyledIcon from '@/components/ui/StyledIcon';
import VehicleIcon from '@/components/shared/VehicleIcon';
import LanguageSelector from '@/components/shared/LanguageSelector';
import { useAuth } from '@/context/AuthContext';
import { AuthorityEnum } from '@/models/enums';
import { hasAnyRole } from '@/utils/auth.utils';
import { formatPhoneForDisplay, getOperatorName } from '@/utils/phoneUtils';
import { customStorage } from '@/utils/customStorage';
import { ROUTES } from '@/constants/routes';
import Labels from '@/labelKeys.json';
import taxibrousseDarkSvg from '@/assets/taxibrousse-dark.svg';
import taxibrousseLightSvg from '@/assets/taxibrousse-light.svg';
import type { LayoutProps } from '@/types/app.types';
import { appTheme } from '@/themes/appTheme';

const OperatorLayout: React.FC<LayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, setMode, systemMode } = useColorScheme();
  const currentMode = mode === 'system' ? systemMode : mode;

  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    customStorage.setItem('X-Theme-App', newMode);
    document.cookie = `mui-mode=${newMode}; path=/; max-age=31536000`;
  };

  const displayName = useMemo(() => {
    const firstName = user?.firstName?.trim();
    const lastName = user?.lastName?.trim();
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return firstName ?? lastName ?? user?.email ?? user?.phone ?? '';
  }, [user]);

  const session = useMemo<Session | null>(() => {
    if (user) {
      return {
        user: {
          name: displayName,
          email: user.email ?? user.phone ?? '',
          image: user.photo?.url ?? '',
        },
      };
    }
    return null;
  }, [user, displayName]);

  const authentication = useMemo<Authentication>(() => {
    return {
      signIn: () => {},
      signOut: () => {
        logout();
        navigate(ROUTES.home[i18n.language]);
      },
    };
  }, [logout, navigate, i18n.language]);

  const CustomHeader = React.useCallback(
    (props: DashboardHeaderProps) => {
      const taxibrousseLogo = currentMode === 'dark' ? taxibrousseDarkSvg : taxibrousseLightSvg;

      return (
        <DashboardHeader
          {...props}
          branding={{
            title: '',
            logo: (
              <Box
                component="img"
                src={taxibrousseLogo}
                alt="Taxibrousse Logo"
                sx={{ height: '22px', cursor: 'pointer', objectFit: 'contain' }}
                onClick={() => navigate(ROUTES.home[i18n.language])}
              />
            ),
          }}
        />
      );
    },
    [currentMode, i18n.language, navigate],
  );

  const CustomSidebarFooter = React.useCallback(
    ({ mini }: SidebarFooterProps) => {
      const formattedPhone = user?.phone ? formatPhoneForDisplay(user.phone) : null;
      const phoneOperator = user?.phone ? getOperatorName(user.phone) : null;

      return (
        <Box sx={{ p: 1, mt: 'auto' }}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              borderRadius: 2,
              borderColor: 'divider',
              boxShadow: 'none',
            }}
          >
            {!mini && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  src={user?.photo?.url}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'secondary.main',
                    color: 'primary.main',
                    fontWeight: 'bold',
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                    {displayName}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }} noWrap>
                    {user?.email ?? user?.phone ?? ''}
                  </Typography>
                  {formattedPhone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                      <Phone fontSize="small" sx={{ opacity: 0.8, fontSize: 14 }} />
                      <Typography variant="caption" sx={{ opacity: 0.8 }} noWrap>
                        {formattedPhone}
                      </Typography>
                      {phoneOperator && phoneOperator !== 'Unknown' && (
                        <Chip
                          label={phoneOperator}
                          size="small"
                          variant="outlined"
                          color="primary"
                          sx={{
                            height: 14,
                            fontSize: '0.55rem',
                            ml: 0.5,
                          }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: mini ? 'center' : 'space-between',
                px: mini ? 0 : 0.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  onClick={() => handleModeChange(mode === 'dark' ? 'light' : 'dark')}
                  color="inherit"
                  aria-label="Toggle Theme"
                  size="small"
                >
                  {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
                </IconButton>
                {!mini && (
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {mode === 'dark' ? t('Theme: Dark') : t('Theme: Light')}
                  </Typography>
                )}
              </Box>
              {!mini && <LanguageSelector />}
            </Box>
          </Paper>
        </Box>
      );
    },
    [user, displayName, mode, setMode, t],
  );

  const router = useMemo<Router>(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path: string | URL) => navigate(String(path)),
    }),
    [location.pathname, location.search, navigate],
  );

  const navItems = useMemo(
    () => [
      {
        segment: ROUTES.voyagesList[i18n.language].replace(/^\//, ''),
        title: t(Labels.menu_voyages),
        icon: <StyledIcon icon={VehicleIcon} />,
        allowedRoles: [AuthorityEnum.ADMIN, AuthorityEnum.KOPERATIVE, AuthorityEnum.GUICHET],
      },
      {
        segment: ROUTES.reservationsList[i18n.language].replace(/^\//, ''),
        title: t(Labels.reservation_management_title),
        icon: <StyledIcon icon={EventSeat} />,
        allowedRoles: [AuthorityEnum.ADMIN, AuthorityEnum.KOPERATIVE, AuthorityEnum.GUICHET],
      },
      {
        segment: ROUTES.operatorBooking[i18n.language].replace(/^\//, ''),
        title: t(Labels.operator_booking_title),
        icon: <StyledIcon icon={ConfirmationNumber} />,
        allowedRoles: [AuthorityEnum.ADMIN, AuthorityEnum.OPERATOR],
      },
      {
        segment: ROUTES.operators[i18n.language].replace(/^\//, ''),
        title: t(Labels.operator_list_title),
        icon: <StyledIcon icon={People} />,
        allowedRoles: [AuthorityEnum.ADMIN, AuthorityEnum.KOPERATIVE, AuthorityEnum.GUICHET],
      },
    ],
    [i18n.language, t],
  );

  const visibleNavItems: Navigation = useMemo(
    () => navItems.filter(item => hasAnyRole(user, item.allowedRoles)),
    [navItems, user],
  );

  return (
    <AppProvider
      navigation={visibleNavItems}
      router={router}
      theme={appTheme}
      session={session}
      authentication={authentication}
    >
      <DashboardLayout slots={{ header: CustomHeader, sidebarFooter: CustomSidebarFooter }}>
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
          {children}
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
};

export default OperatorLayout;
