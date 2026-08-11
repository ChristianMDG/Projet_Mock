import React from 'react';
import { Box, Container, Skeleton, Card, CardContent, Grid } from '@mui/material';

const BenefitsShowcaseSkeleton: React.FC = () => (
  <Box sx={{ py: 6 }}>
    <Container maxWidth="lg">
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
      </Box>

      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Skeleton variant="circular" width={64} height={64} sx={{ mx: 'auto', mb: 2 }} />
                <Skeleton variant="text" width="60%" height={28} sx={{ mx: 'auto', mb: 1 }} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="40%" sx={{ mx: 'auto', mt: 2 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default BenefitsShowcaseSkeleton;
