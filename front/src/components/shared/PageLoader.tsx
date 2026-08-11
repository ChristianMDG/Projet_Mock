import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import taxibrousseLight from '@/assets/taxibrousse-light.svg';
import taxibrousseDark from '@/assets/taxibrousse-dark.svg';

interface PageLoaderProps {
  fullScreen?: boolean;
  minHeight?: string | number;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ fullScreen = false, minHeight = '200px' }) => {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always use light theme logo for SSR, then switch to correct theme after mount
  const logoSrc = mounted && theme.palette.mode === 'dark' ? taxibrousseDark : taxibrousseLight;

  return (
    <Box
      sx={{
        backgroundColor: theme => theme.palette.background.default,

        ...(fullScreen && {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }),

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fullScreen ? 'calc(100vh - 120px)' : minHeight,
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        component="img"
        src={logoSrc}
        alt="Taxibrousse"
        sx={{
          height: 32,
        }}
      />
      <CircularProgress size={60} thickness={4} />
    </Box>
  );
};

export default PageLoader;
