import React from 'react';
import { Box, FormControl, Paper, Tabs, Typography } from '@mui/material';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import StoreIcon from '@mui/icons-material/Store';
import StyledIcon from './StyledIcon';
import StyledTab from './StyledTab';

interface AccountTypeTabsProps {
  isGuichet: boolean;
  onGuichetChange?: (isGuichet: boolean) => void;
  disabled?: boolean;
}

export const AccountTypeTabs: React.FC<AccountTypeTabsProps> = ({ isGuichet, onGuichetChange, disabled = false }) => {
  return (
    <FormControl component="fieldset" disabled={disabled} fullWidth>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          border: '1px solid',
          borderColor: 'divider',
          flexWrap: 'wrap',
          borderRadius: 2,
          p: 0.5,
        }}
      >
        <Tabs
          value={isGuichet ? 1 : 0}
          onChange={(_, newValue) => onGuichetChange?.(newValue === 1)}
          variant="fullWidth"
          sx={{
            width: '100%',
            minHeight: 40,
            '& .MuiTabs-indicator': {
              height: '100%',
              borderRadius: 1.5,
              backgroundColor: 'primary.main',
              boxShadow: 2,
              zIndex: 0,
            },
            '& .MuiTab-root': {
              zIndex: 1,
              minHeight: 40,
              padding: '6px 16px',
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 1.5,
              transition: 'all 0.3s ease',
              '&.Mui-selected': {
                color: 'primary.contrastText',
                backgroundColor: 'transparent',
              },
            },
          }}
        >
          <StyledTab
            disableRipple
            cardStyle={false}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StyledIcon icon={PersonOutlined} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'inherit' }}>
                  Voyageur
                </Typography>
              </Box>
            }
          />
          <StyledTab
            disableRipple
            cardStyle={false}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StyledIcon icon={StoreIcon} />
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'inherit' }}>
                  Guichetier
                </Typography>
              </Box>
            }
          />
        </Tabs>
      </Paper>
    </FormControl>
  );
};

export default AccountTypeTabs;
