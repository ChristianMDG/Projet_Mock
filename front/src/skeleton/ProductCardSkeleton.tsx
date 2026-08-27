import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

const ProductCardSkeleton: React.FC = () => (
  <Card
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'none',
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Box sx={{ aspectRatio: '4 / 3' }}>
      <Skeleton variant="rectangular" sx={{ width: '100%', height: '100%', bgcolor: 'action.hover' }} />
    </Box>
    <CardContent sx={{ flexGrow: 1, pb: 1, px: 1.5 }}>
      <Skeleton variant="text" sx={{ width: '40%', height: 16, mb: 1 }} />
      <Skeleton variant="text" sx={{ width: '85%', height: 20, mb: 1 }} />
      <Skeleton variant="text" sx={{ width: '95%', height: 16, mb: 0.5 }} />
      <Skeleton variant="text" sx={{ width: '70%', height: 16, mb: 1.5 }} />
      <Skeleton variant="text" sx={{ width: '50%', height: 16 }} />
    </CardContent>
    <Box sx={{ px: 1.5, pb: 1.5, mt: 'auto', display: 'flex', justifyContent: 'space-between' }}>
      <Skeleton variant="text" sx={{ width: '35%', height: 24 }} />
    </Box>
  </Card>
);

export default ProductCardSkeleton;
