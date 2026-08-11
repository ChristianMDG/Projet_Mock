import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { Help, Info, Phone, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import Labels from '@/labelKeys.json';
import { StyledIcon, TaxibrousseRedIcon } from '@/components/ui';
import { formatPhoneForDisplay, getOperatorName } from '@/utils/phoneUtils';

interface MenuDrawerProps {
  readonly isOpen: boolean;
  readonly handleOpen: (open: boolean) => void;
  readonly tabConfig: Array<{
    label: string;
    path: string;
    icon?: React.ReactNode;
    hide?: boolean;
  }>;
}

export default function MenusDrawer({ isOpen, handleOpen, tabConfig }: MenuDrawerProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

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

  const menuItems = tabConfig
    .filter(item => !item.hide && !!item.path)
    .map(item => ({
      text: item.label,
      path: item.path,
      icon: item.icon,
    }));

  const settingsItems = [
    { text: t(Labels.menu_settings), icon: <StyledIcon icon={Settings} /> },
    { text: t(Labels.menu_help), icon: <StyledIcon icon={Help} /> },
    { text: t(Labels.menu_about), icon: <StyledIcon icon={Info} /> },
  ];

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
            p: 1,
            gap: 2,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 0,
          }}
        >
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
            <Avatar sx={{ width: 48, height: 48, backgroundColor: 'secondary.light' }}>
              <TaxibrousseRedIcon />
            </Avatar>
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
                    sx={{
                      height: 16,
                      fontSize: '0.6rem',
                      color: 'primary.contrastText',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      ml: 0.5,
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Paper>

        <List>
          {menuItems.map(item => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
        <List>
          {settingsItems.map(item => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
