import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';

const MissionSectionSkeleton: React.FC = () => (
  <Card sx={{ mb: 6 }}>
    <CardContent sx={{ p: 4, textAlign: 'center' }}>
      <Skeleton variant="text" width="40%" height={48} sx={{ mb: 3, mx: 'auto' }} />
      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2, mx: 'auto' }} />
      <Skeleton variant="text" width="90%" height={24} sx={{ mb: 2, mx: 'auto' }} />
      <Skeleton variant="text" width="70%" height={24} sx={{ mx: 'auto' }} />
    </CardContent>
  </Card>
);

export default MissionSectionSkeleton;
