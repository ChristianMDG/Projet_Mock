import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const ContactSkeleton: React.FC = () => (
  <Box sx={{ mb: 6 }}>
    <Skeleton variant="text" width="30%" height={48} sx={{ mb: 4 }} />
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={20} />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ mb: 2, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="30%" height={40} sx={{ borderRadius: 1 }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default ContactSkeleton;
