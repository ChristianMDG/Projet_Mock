import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  QuestionAnswer,
  Logout,
  EventSeat,
  AltRoute,
  BarChart,
  DirectionsBus,
  Business,
  People,
  ManageAccounts,
  Category,
  AccountTree,
  Inventory,
  Inventory2,
  ReceiptLong,
  LocalOffer,
  TrendingUp,
  LocalShipping,
  Facebook,
  Percent,
  AccountBalance,
} from '@mui/icons-material';

import { useAuthStore } from '@/stores/auth.store';
import { useMessagingStore } from '@/stores/messaging.store';
import { useReservationStore } from '@/stores/reservation.store';
import Labels from '@/labelKeys.json';

export const SIDEBAR_WIDTH = 280;

interface SidebarProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuthStore();
  const { rooms } = useMessagingStore();

  // Calculer le nombre total de messages non lus
  const totalUnreadCount = useMemo(() => {
    return rooms.reduce((total, room) => total + (room.unreadCount || 0), 0);
  }, [rooms]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = (path: string) => {
    if (path === '/reservation') {
      useReservationStore.getState().resetFilters();
    }
    if (isMobile) {
      onClose();
    }
  };

  const menuItems = [
    { text: t(Labels.sidebar_home), path: '/', icon: <Home /> },
    {
      text: t(Labels.sidebar_messages),
      path: '/messages',
      icon: <QuestionAnswer />,
      badge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
    },
    { text: t(Labels.sidebar_reservations), path: '/reservation', icon: <EventSeat /> },
    { text: t(Labels.sidebar_routes), path: '/routes', icon: <AltRoute /> },
    { text: t(Labels.sidebar_analytics), path: '/analytics', icon: <BarChart /> },
    { text: t(Labels.sidebar_voyages), path: '/voyages', icon: <DirectionsBus /> },
    { text: t(Labels.sidebar_koperatives), path: '/koperatives', icon: <Business /> },
    { text: t(Labels.sidebar_users), path: '/users', icon: <People /> },
    { text: t(Labels.sidebar_operateur), path: '/operateur', icon: <ManageAccounts /> },
    { text: t(Labels.sidebar_classes), path: '/classes', icon: <Category /> },
    { text: t(Labels.sidebar_commissions), path: '/commissions', icon: <Percent /> },
    { text: t(Labels.sidebar_finance), path: '/finance', icon: <AccountBalance /> },
    { text: t(Labels.sidebar_facebook), path: '/facebook', icon: <Facebook /> },
    { text: t(Labels.sidebar_products), path: '/shop/products', icon: <Inventory /> },
    { text: t(Labels.sidebar_categories), path: '/shop/categories', icon: <Category /> },
    { text: t(Labels.sidebar_subcategories), path: '/shop/subcategories', icon: <AccountTree /> },
    { text: t(Labels.sidebar_orders), path: '/shop/orders', icon: <ReceiptLong /> },
    { text: t(Labels.sidebar_inventory), path: '/shop/inventory', icon: <Inventory2 /> },
    { text: t(Labels.sidebar_promotions), path: '/shop/promotions', icon: <LocalOffer /> },
    { text: t(Labels.sidebar_shop_analytics), path: '/shop/analytics', icon: <TrendingUp /> },
    { text: t(Labels.sidebar_delivery), path: '/shop/delivery', icon: <LocalShipping /> },
  ];

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: isMobile ? 0 : SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
          position: 'fixed',
          top: isMobile ? 0 : 64,
          bottom: 0,
          overflowY: 'auto',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Main Navigation */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <List sx={{ px: 1, pt: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive(item.path)}
                  onClick={() => handleNavClick(item.path)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    slotProps={{
                      primary: { variant: 'body2', sx: { fontWeight: 500 } },
                    }}
                  />
                  {item.badge !== undefined && (
                    <Chip
                      label={item.badge}
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
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* User Profile Section */}
        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
            <Avatar src={user?.photo?.url} sx={{ width: 36, height: 36 }} />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                {`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email ?? user?.phone}
              </Typography>
            </Box>
            <Tooltip title={t(Labels.sidebar_logout)}>
              <IconButton size="small" onClick={handleLogout} color="inherit">
                <Logout fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
}
