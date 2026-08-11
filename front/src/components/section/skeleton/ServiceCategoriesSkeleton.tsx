import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const ServiceCategoriesSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="40%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={4}>
      {[1, 2, 3, 4].map(index => (
        <Grid key={index} size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
                <Skeleton variant="text" width="50%" height={32} />
              </Box>
              {[1, 2, 3, 4, 5].map(itemIndex => (
                <Box key={itemIndex} sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                  <Skeleton variant="circular" width={16} height={16} sx={{ mr: 1 }} />
                  <Skeleton variant="text" width="80%" height={24} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ServiceCategoriesSkeleton;
