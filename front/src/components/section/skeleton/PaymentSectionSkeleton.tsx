import React from 'react';
import { Card, CardContent, Grid, Skeleton } from '@mui/material';

const PaymentSectionSkeleton: React.FC = () => (
  <Card sx={{ my: 4 }}>
    <CardContent>
      <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto', mb: 3 }} />
      <Grid container spacing={3}>
        {[0, 1, 2].map(key => (
          <Grid key={key} size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

export default PaymentSectionSkeleton;
