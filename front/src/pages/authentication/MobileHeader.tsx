import React from 'react';
import { Box } from '@mui/material';
import taxibrousseDark from '@/assets/taxibrousse-dark.svg';
import taxibrousseLogo from '@/assets/taxibrousse.png';

interface MobileHeaderProps {
  isMobile: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isMobile }) => {
  if (!isMobile) return null;

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        p: { xs: 1.5, sm: 3 },
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* PNG Logo on top */}
      <Box
        component="img"
        src={taxibrousseLogo}
        alt="Taxibrousse Logo"
        sx={{
          height: { xs: 64, sm: 72 },
          mb: { xs: 1, sm: 2 },
          borderRadius: 2,
          boxShadow: 3,
          background: '#fff',
          display: 'block',
          mx: 'auto',
        }}
      />

      {/* Dark SVG Logo */}
      <Box
        component="img"
        src={taxibrousseDark}
        alt="Taxibrousse"
        sx={{
          height: { xs: 28, sm: 40 },
          display: 'block',
          mx: 'auto',
          opacity: 0.95,
        }}
      />
    </Box>
  );
};

export default MobileHeader;
