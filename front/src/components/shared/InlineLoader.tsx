import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface InlineLoaderProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({ size = 'medium', message }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 50;
      default:
        return 35;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <CircularProgress size={getSize()} thickness={4} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default InlineLoader;
