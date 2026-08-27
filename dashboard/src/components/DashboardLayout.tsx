import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppProvider, Navigation, Router, Session } from '@toolpad/core/AppProvider';
import { DashboardLayout as ToolpadDashboardLayout } from '@toolpad/core/DashboardLayout';
import { Account } from '@toolpad/core/Account';
import {
  Home,
  QuestionAnswer,
  EventSeat,
  AltRoute,
  BarChart,
  People,
  Category,
  ManageAccounts,
  Facebook,
  Percent,
  AccountBalance,
  ShoppingCart,
} from '@mui/icons-material';
import { Stack, Chip } from '@mui/material';

import { useAuthStore } from '@/stores/auth.store';
import { useMessagingStore } from '@/stores/messaging.store';
import ColorSchemeToggle from '@/shared/ColorSchemeToggle';
import { LanguageToggle } from '@/shared';
import Logo from './Logo';
import Labels from '@/labelKeys.json';
import { appTheme } from '@/themes/appTheme';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { rooms } = useMessagingStore();

  const totalUnreadCount = useMemo(() => {
    return rooms.reduce((total, room) => total + (room.unreadCount || 0), 0);
  }, [rooms]);

  const [session, setSession] = useState<Session | null>(() => {
    if (user) {
      return {
        user: {
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
          email: user.email ?? user.phone ?? '',
          image: user.photo?.url ?? '',
        },
      };
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      setSession({
        user: {
          name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User',
          email: user.email ?? user.phone ?? '',
          image: user.photo?.url ?? '',
        },
      });
    } else {
      setSession(null);
    }
  }, [user]);

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        navigate('/login');
      },
      signOut: () => {
        logout();
        setSession(null);
        navigate('/login');
      },
    };
  }, [logout, navigate]);

  const navigation: Navigation = useMemo(
    () => [
      {
        kind: 'header',
        title: t(Labels.sidebar_group_general),
      },
      {
        segment: '',
        title: t(Labels.sidebar_home),
        icon: <Home />,
      },
      {
        segment: 'messages',
        title: t(Labels.sidebar_messages),
        icon: <QuestionAnswer />,
        action:
          totalUnreadCount > 0 ? (
            <Chip
              label={totalUnreadCount}
              size="small"
              color="primary"
              sx={{
                height: 20,
                minWidth: 20,
                '& .MuiChip-label': {
                  px: 0.75,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                },
              }}
            />
          ) : undefined,
      },
      {
        kind: 'divider',
      },
      {
        kind: 'header',
        title: t(Labels.sidebar_group_operations),
      },
      {
        segment: 'reservation',
        title: t(Labels.sidebar_reservations),
        icon: <EventSeat />,
      },
      {
        segment: 'shop/orders',
        title: t(Labels.sidebar_orders),
        icon: <ShoppingCart />,
      },
      {
        segment: 'routes',
        title: t(Labels.sidebar_routes),
        icon: <AltRoute />,
      },
      {
        kind: 'divider',
      },
      {
        kind: 'header',
        title: t(Labels.sidebar_group_administration),
      },
      {
        segment: 'users',
        title: t(Labels.sidebar_users),
        icon: <People />,
      },
      {
        segment: 'operateur',
        title: t(Labels.sidebar_operateur),
        icon: <ManageAccounts />,
      },
      {
        segment: 'classes',
        title: t(Labels.sidebar_classes),
        icon: <Category />,
      },
      {
        segment: 'commissions',
        title: t(Labels.sidebar_commissions),
        icon: <Percent />,
      },
      {
        segment: 'finance',
        title: t(Labels.sidebar_finance),
        icon: <AccountBalance />,
      },
      {
        kind: 'divider',
      },
      {
        kind: 'header',
        title: t(Labels.sidebar_group_reports),
      },
      {
        segment: 'analytics',
        title: t(Labels.sidebar_analytics),
        icon: <BarChart />,
      },
      {
        segment: 'facebook',
        title: t(Labels.sidebar_facebook),
        icon: <Facebook />,
      },
    ],
    [t, totalUnreadCount]
  );

  const router: Router = useMemo(
    () => ({
      pathname: location.pathname,
      searchParams: new URLSearchParams(location.search),
      navigate: (path) => navigate(String(path)),
    }),
    [location, navigate]
  );

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      branding={{
        title: '',
        logo: <Logo height={24} />,
      }}
      theme={appTheme}
      session={session}
      authentication={authentication}
    >
      <ToolpadDashboardLayout
        slots={{
          toolbarActions: () => (
            <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0.5}>
              <LanguageToggle />
              <ColorSchemeToggle />
            </Stack>
          ),
          toolbarAccount: Account,
        }}
      >
        <Outlet />
      </ToolpadDashboardLayout>
    </AppProvider>
  );
}
