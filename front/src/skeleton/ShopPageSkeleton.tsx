import React from 'react';
import { Grid, Skeleton, Stack, Box, Container } from '@mui/material';

const BORDERED_GRID_SX = {
  '--Grid-borderWidth': '1px',
  borderTop: 'var(--Grid-borderWidth) solid',
  borderLeft: 'var(--Grid-borderWidth) solid',
  borderColor: 'divider',
  '& > div': {
    borderRight: 'var(--Grid-borderWidth) solid',
    borderBottom: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider',
  },
} as const;

const ShopPageSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ px: '0 !important' }}>
      <Stack spacing={2} sx={{ pb: 4 }}>
        {/* Promo Bar Skeleton */}
        <Skeleton variant="rectangular" sx={{ width: 1, height: { xs: 100, sm: 140 } }} />

        {/* Category Title Skeleton */}
        <Skeleton variant="text" sx={{ width: 180, height: 28 }} />

        {/* Categories Bordered Grid Skeleton */}
        <Box sx={{ overflow: 'hidden' }}>
          <Grid container sx={BORDERED_GRID_SX}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Grid size={{ xs: 4, sm: 3, md: 2 }} key={idx}>
                <Box>
                  <Skeleton variant="rectangular" sx={{ width: 1, height: { xs: 90, sm: 100 } }} />
                  <Box sx={{ p: 1 }}>
                    <Skeleton variant="text" sx={{ width: '70%', height: 18 }} />
                    <Skeleton variant="text" sx={{ width: '40%', height: 14 }} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
};

export default ShopPageSkeleton;
