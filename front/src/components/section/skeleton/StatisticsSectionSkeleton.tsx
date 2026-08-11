import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const StatisticsSectionSkeleton: React.FC = () => (
  <Card sx={{ mb: 6, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
    <CardContent sx={{ py: 4 }}>
      <Skeleton
        variant="text"
        sx={{
          mb: 4,
          mx: 'auto',
          bgcolor: 'rgba(255,255,255,0.1)',
          width: '40%',
          height: 48,
        }}
      />
      <Grid
        container
        spacing={4}
        sx={{
          justifyContent: 'center',
        }}
      >
        {[1, 2, 3, 4].map(index => (
          <Grid key={index} size={{ xs: 6, md: 3 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Skeleton
                variant="text"
                sx={{
                  mb: 1,
                  mx: 'auto',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  width: '60%',
                  height: 48,
                }}
              />
              <Skeleton
                variant="text"
                sx={{
                  mx: 'auto',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  width: '80%',
                  height: 20,
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

export default StatisticsSectionSkeleton;
