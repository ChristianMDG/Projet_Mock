import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const LoyaltyProgramSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="50%" height={48} sx={{ mb: 1 }} />
    <Skeleton variant="text" width="70%" height={24} sx={{ mb: 3 }} />
    <Grid container spacing={2}>
      {[1, 2, 3, 4].map(index => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Skeleton variant="rounded" width={60} height={24} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ mx: 'auto', mb: 1 }} />
              {[1, 2, 3].map(benefitIndex => (
                <Skeleton key={benefitIndex} variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default LoyaltyProgramSkeleton;
