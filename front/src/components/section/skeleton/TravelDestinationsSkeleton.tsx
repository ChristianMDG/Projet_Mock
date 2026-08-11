import React from 'react';
import { Box, Container, Skeleton, Card, Grid } from '@mui/material';

const TravelDestinationsSkeleton: React.FC = () => (
  <Box sx={{ py: 6 }}>
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} />
      </Box>

      <Grid container spacing={3}>
        {/* Large card */}
        <Grid size={{ xs: 12, sm: 12, md: 8 }}>
          <Card>
            <Skeleton variant="rectangular" height={500} />
          </Card>
        </Grid>

        {/* Medium cards */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <Skeleton variant="rectangular" height={350} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Card>
            <Skeleton variant="rectangular" height={350} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 6 }}>
          <Card>
            <Skeleton variant="rectangular" height={350} />
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Skeleton variant="rectangular" width={200} height={48} sx={{ borderRadius: 2 }} />
      </Box>
    </Container>
  </Box>
);

export default TravelDestinationsSkeleton;
