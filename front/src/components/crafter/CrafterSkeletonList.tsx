import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';

const SKELETON_ITEMS_COUNT = 3;

const CrafterCardSkeleton: React.FC = () => (
  <Card sx={{ mb: 1 }}>
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        {/* Image Skeleton */}
        <Grid size="auto">
          <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
        </Grid>

        {/* Content Skeleton */}
        <Grid size="grow">
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Skeleton width={70} height={18} variant="rounded" />
              <Skeleton width={120} height={20} />
            </Box>
            <Skeleton width={180} height={16} sx={{ mb: 0.25 }} />
            <Skeleton width={150} height={14} />
          </Box>
        </Grid>

        {/* Actions Skeleton */}
        <Grid size="auto">
          <Box sx={{ display: 'flex', gap: 0.5, flexDirection: 'column' }}>
            <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 1 }} />
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const CrafterSkeletonList: React.FC = () => (
  <Box>
    {Array.from({ length: SKELETON_ITEMS_COUNT }, (_, index) => (
      <CrafterCardSkeleton key={`skeleton-item-${index}`} />
    ))}
  </Box>
);

export default CrafterSkeletonList;
