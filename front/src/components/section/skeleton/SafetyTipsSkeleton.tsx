import React from 'react';
import { Box, Alert, Skeleton } from '@mui/material';

const SafetyTipsSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="30%" height={48} sx={{ mb: 4 }} />
    {[1, 2, 3, 4].map(index => (
      <Alert key={index} severity="info" sx={{ mb: 2 }}>
        <Box>
          <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={20} />
        </Box>
      </Alert>
    ))}
  </Box>
);

export default SafetyTipsSkeleton;
