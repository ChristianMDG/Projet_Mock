import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';

const DynamicPageCardSkeleton: React.FC = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 1, borderRadius: 1 }} />
      <Skeleton variant="text" width="80%" height={20} />
    </CardContent>
  </Card>
);

export default DynamicPageCardSkeleton;
