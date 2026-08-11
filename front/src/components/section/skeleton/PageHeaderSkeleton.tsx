import React from 'react';
import { Box, Skeleton } from '@mui/material';

const PageHeaderSkeleton: React.FC = () => (
  <Box sx={{ textAlign: 'center', py: 6, mb: 4 }}>
    <Skeleton variant="text" width="60%" height={64} sx={{ mb: 2, mx: 'auto' }} />
    <Skeleton variant="text" width="80%" height={28} sx={{ mx: 'auto' }} />
  </Box>
);

export default PageHeaderSkeleton;
