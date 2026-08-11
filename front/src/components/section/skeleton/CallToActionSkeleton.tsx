import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';

const CallToActionSkeleton: React.FC = () => (
  <Card sx={{ my: 4, textAlign: 'center' }}>
    <CardContent sx={{ p: 4 }}>
      <Skeleton variant="text" width="60%" height={56} sx={{ mb: 2, mx: 'auto' }} />
      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 3, mx: 'auto' }} />
      <Skeleton variant="rectangular" width={200} height={48} sx={{ mx: 'auto', borderRadius: 2 }} />
    </CardContent>
  </Card>
);

export default CallToActionSkeleton;
