import React from 'react';
import { Box } from '@mui/material';
import taxibrousseDark from '@/assets/taxibrousse-dark.svg';
import taxibrousseLogo from '@/assets/taxibrousse.png';

const AuthBranding: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        maxWidth: 350,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { md: 2, lg: 2.5 },
      }}
    >
      <Box
        component="img"
        src={taxibrousseLogo}
        alt="Taxibrousse Logo"
        sx={{
          height: 124,
          borderRadius: 4,
          boxShadow: theme => theme.shadows[3],
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme => theme.shadows[6],
            transform: 'scale(1.05)',
          },
        }}
      />

      <Box
        component="img"
        src={taxibrousseDark}
        alt="Taxibrousse"
        sx={{
          height: { md: 50, lg: 60 },
          opacity: 0.95,
          transition: 'opacity 0.3s ease',
          '&:hover': {
            opacity: 1,
          },
        }}
      />
    </Box>
  );
};

export default AuthBranding;
