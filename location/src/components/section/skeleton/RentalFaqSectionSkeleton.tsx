import React from 'react';
import { Box, Container, Skeleton } from '@mui/material';

const RentalFaqSectionSkeleton: React.FC = () => (
  <Box sx={{ py: { xs: 6, md: 10 } }}>
    <Container maxWidth="md">
      <Box
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Skeleton variant="text" width="50%" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="70%" height={30} />
      </Box>

      <Box>
        {[1, 2, 3, 4].map(item => (
          <Skeleton key={item} variant="rectangular" width="100%" height={64} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Box>
    </Container>
  </Box>
);

export default RentalFaqSectionSkeleton;
