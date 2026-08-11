import React from 'react';
import { Box, Skeleton } from '@mui/material';

const AboutUsSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <Skeleton variant="text" width="100%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="90%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="95%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="85%" height={24} />
  </Box>
);

export default AboutUsSkeleton;
