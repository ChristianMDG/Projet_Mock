import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

interface VoyageListSkeletonProps {
  count?: number;
}

const VoyageCardSkeleton: React.FC = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      {/* Route section: departureGare -> arrivalGare */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '25%' }} />
        <Skeleton variant="circular" width={22} height={22} />
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '25%' }} />
      </Box>

      {/* Departure time section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '50%' }} />
      </Box>

      {/* Crafter section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '40%' }} />
      </Box>

      {/* Driver section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '45%' }} />
      </Box>

      {/* Status and seats section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 3 }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '30%' }} />
      </Box>
    </CardContent>
  </Card>
);

const VoyageListSkeleton: React.FC<VoyageListSkeletonProps> = ({ count = 3 }) => {
  const skeletonKeys = Array.from({ length: count }, (_, idx) => `skeleton-voyage-${idx}`);

  return (
    <Box>
      {skeletonKeys.map(key => (
        <VoyageCardSkeleton key={key} />
      ))}
    </Box>
  );
};

export default VoyageListSkeleton;
