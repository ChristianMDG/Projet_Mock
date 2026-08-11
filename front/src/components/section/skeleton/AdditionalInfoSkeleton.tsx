import React from 'react';
import { Box, Skeleton } from '@mui/material';

const AdditionalInfoSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    {/* Alert skeleton */}
    <Skeleton variant="rounded" height={56} sx={{ mb: 3 }} />

    {/* Title skeleton */}
    <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />

    {/* Items skeleton */}
    {[1, 2, 3, 4].map(index => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          mb: 2,
          gap: 1,
        }}
      >
        <Skeleton variant="circular" width={24} height={24} sx={{ mt: 0.5 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" height={24} />
        </Box>
      </Box>
    ))}
  </Box>
);

export default AdditionalInfoSkeleton;
