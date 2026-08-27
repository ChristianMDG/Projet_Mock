import React from 'react';
import { Box, Container, Skeleton, Grid, Card, CardContent } from '@mui/material';

const KoperativeTypesListSkeleton: React.FC = () => {
  return (
    <Box sx={{ py: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Skeleton variant="text" width="30%" height={40} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="40%" height={24} sx={{ mx: 'auto', mb: 4 }} />
        <Grid container spacing={3} sx={{ mt: 2, justifyContent: 'center' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={i}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
                  <Skeleton variant="text" width="60%" height={24} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default KoperativeTypesListSkeleton;
