import React from 'react';
import { Box, Skeleton } from '@mui/material';

const LegalContentSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="50%" height={48} sx={{ mb: 4 }} />
    <Skeleton variant="text" width="100%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="95%" height={24} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="90%" height={24} sx={{ mb: 3 }} />

    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="98%" height={20} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="85%" height={20} sx={{ mb: 3 }} />

    <Skeleton variant="text" width="35%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="92%" height={20} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="88%" height={20} />
  </Box>
);

export default LegalContentSkeleton;
