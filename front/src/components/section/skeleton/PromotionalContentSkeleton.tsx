import React from 'react';
import { Box, Container, Grid, Card, CardContent, Skeleton } from '@mui/material';

const PromotionalContentSkeleton: React.FC = () => (
  <Box sx={{ py: 6 }}>
    <Container maxWidth="lg">
      <Skeleton variant="text" width="40%" height={48} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {[
          { id: 1, size: 5 },
          { id: 2, size: 7 },
          { id: 3, size: 7 },
          { id: 4, size: 5 },
        ].map(item => (
          <Grid key={item.id} size={{ xs: 12, md: item.size }}>
            <Card sx={{ height: '100%' }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3 }} />
                  <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
                </Box>
                <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton variant="text" width="30%" height={20} />
                  <Skeleton variant="rectangular" width={50} height={24} sx={{ borderRadius: 3 }} />
                </Box>
                <Skeleton variant="rectangular" width="100%" height={8} sx={{ mb: 2, borderRadius: 1 }} />
                <Skeleton variant="text" width="60%" height={16} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1, mb: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 6, p: 4, borderRadius: 2 }}>
        <Skeleton variant="text" width="50%" height={40} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width="70%" height={24} sx={{ mx: 'auto', mb: 3 }} />
        <Skeleton variant="rectangular" width={200} height={48} sx={{ mx: 'auto', borderRadius: 1 }} />
      </Box>
    </Container>
  </Box>
);

export default PromotionalContentSkeleton;
