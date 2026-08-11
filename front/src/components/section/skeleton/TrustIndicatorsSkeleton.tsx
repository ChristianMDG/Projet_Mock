import React from 'react';
import { Box, Container, Skeleton, Stack } from '@mui/material';

const TrustIndicatorsSkeleton: React.FC = () => (
  <Box sx={{ py: 4 }}>
    <Container maxWidth="lg">
      <Skeleton variant="text" width="40%" height={32} sx={{ mx: 'auto', mb: 3 }} />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: 'center' }}>
        {[1, 2, 3, 4].map(i => (
          <Box key={i} sx={{ flex: 1, textAlign: 'center', px: 2, width: '100%' }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="90%" />
          </Box>
        ))}
      </Stack>
    </Container>
  </Box>
);

export default TrustIndicatorsSkeleton;
