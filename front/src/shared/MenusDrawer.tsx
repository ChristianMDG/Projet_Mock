import React, { useMemo } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useColorScheme,
} from '@mui/material';
import Phone from '@mui/icons-material/Phone';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import Labels from '@/labelKeys.json';
import { formatPhoneForDisplay, getOperatorName } from '@/utils/phoneUtils';
import LanguageSelector from '@/components/shared/LanguageSelector';
import { customStorage } from '@/utils/customStorage';
import taxibroussePng from '@/assets/taxibrousse.png';

interface MenuDrawerProps {
  readonly isOpen: boolean;
  readonly handleOpen: (open: boolean) => void;
  readonly tabConfig: Array<{
    label: string;
    path: string;
    icon?: React.ReactNode;
    hide?: boolean;
    category?: string;
  }>;
}

export default function MenusDrawer({ isOpen, handleOpen, tabConfig }: MenuDrawerProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { mode, setMode } = useColorScheme();

  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    customStorage.setItem('X-Theme-App', newMode);
    document.cookie = `mui-mode=${newMode}; path=/; max-age=31536000`;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleOpen(false);
  };

  const getUserDisplayName = (): string => {
    if (!isAuthenticated || !user) return 'TAXIBROUSSE';
    const firstName = user.firstName?.trim();
    const lastName = user.lastName?.trim();
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    if (user.email) return user.email.split('@')[0];
    if (user.phone) return user.phone;
    return t(Labels.ui_profile_name);
  };

  const { groupedMenuItems, categoryKeys } = useMemo(() => {
    const items = tabConfig
      .filter(item => !item.hide && !!item.path)
      .map(item => ({
        text: item.label,
        path: item.path,
        icon: item.icon,
        category: item.category ?? 'other',
      }));

    const grouped = items.reduce(
      (acc, item) => {
        if (acc[item.category]) {
          acc[item.category].push(item);
        } else {
          acc[item.category] = [item];
        }
        return acc;
      },
      {} as Record<string, typeof items>,
    );

    return {
      groupedMenuItems: grouped,
      categoryKeys: Object.keys(grouped),
    };
  }, [tabConfig]);

  const displayName = getUserDisplayName();
  const subtitle = isAuthenticated && user ? (user.email ?? t(Labels.ui_userinfo_profile)) : t(Labels.nav_buy_ticket);

  // Format phone number for display
  const formattedPhone = user?.phone ? formatPhoneForDisplay(user.phone) : null;
  const phoneOperator = user?.phone ? getOperatorName(user.phone) : null;

  return (
    <Drawer open={isOpen} onClose={() => handleOpen(false)}>
      <Box sx={{ width: 280 }}>
        <Paper
          elevation={2}
          sx={{
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated && user ? (
              <Avatar
                src={user.photo?.url}
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: 'secondary.main',
                  color: 'primary.main',
                  fontWeight: 'bold',
                }}
              />
            ) : (
              <Avatar src={taxibroussePng} sx={{ width: 48, height: 48, backgroundColor: 'secondary.light' }} />
            )}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" noWrap>
                {displayName}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }} noWrap>
                {subtitle}
              </Typography>
              {formattedPhone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Phone fontSize="small" sx={{ opacity: 0.8 }} />
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
                        height: 16,
                        fontSize: '0.6rem',
                        ml: 0.5,
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ opacity: 0.5 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                onClick={() => handleModeChange(mode === 'dark' ? 'light' : 'dark')}
                color="inherit"
                aria-label="Toggle Theme"
                size="large"
                sx={{ p: 1 }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {mode === 'dark' ? t('Theme: Dark') : t('Theme: Light')}
              </Typography>
            </Box>
            <LanguageSelector />
          </Box>
        </Paper>

        {categoryKeys.map((cat, index) => (
          <React.Fragment key={cat}>
            <List>
              {groupedMenuItems[cat].map(item => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton onClick={() => handleNavigation(item.path)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {index < categoryKeys.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </Box>
    </Drawer>
  );
}
