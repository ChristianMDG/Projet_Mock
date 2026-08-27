import React from 'react';
import { Box, Container, Skeleton } from '@mui/material';

const RentalHeroSectionSkeleton: React.FC = () => (
  <Box sx={{ position: 'relative', minHeight: { xs: '60vh', md: '80vh' }, display: 'flex', alignItems: 'center' }}>
    <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: 'absolute', top: 0, left: 0 }} />
    <Container
      maxWidth="lg"
      sx={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', md: 'flex-start' },
      }}
    >
      <Skeleton variant="text" height={80} sx={{ width: { xs: '80%', md: '50%' }, mb: 2 }} />
      <Skeleton variant="text" height={40} sx={{ width: { xs: '60%', md: '30%' } }} />
    </Container>
  </Box>
);

export default RentalHeroSectionSkeleton;
