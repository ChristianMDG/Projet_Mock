import React from 'react';
import { Box, Container, Grid, Card, CardContent, Skeleton } from '@mui/material';

const NewsSectionSkeleton: React.FC = () => (
  <Box sx={{ py: 6 }}>
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Skeleton variant="text" width="40%" height={48} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
      </Box>

      <Grid container spacing={4}>
        {[1, 2, 3].map(index => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%' }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3, mb: 2 }} />
                <Skeleton variant="text" width="90%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="95%" height={20} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="80%" height={20} />
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 1 }} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default NewsSectionSkeleton;
