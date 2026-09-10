import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';

const ProductCardSkeleton: React.FC = () => (
  <Card
    elevation={0}
    sx={{
      height: 1,
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 0,
      border: 'none',
      boxShadow: 'none',
      bgcolor: 'background.paper',
    }}
  >
    <Skeleton
      variant="rectangular"
      sx={{
        aspectRatio: '1 / 1',
        width: 1,
        height: 'auto',
        bgcolor: 'action.hover',
      }}
    />
    <CardContent sx={{ flexGrow: 1, p: { xs: 1, sm: 1.5 }, '&:last-child': { pb: { xs: 1, sm: 1.5 } } }}>
      <Skeleton variant="text" sx={{ width: '35%', height: 12, mb: 0.5 }} />
      <Skeleton variant="text" sx={{ width: '85%', height: 18, mb: 0.5 }} />
      <Skeleton variant="text" sx={{ width: '50%', height: 14, mb: 1 }} />
      <Skeleton variant="text" sx={{ width: '40%', height: 22 }} />
    </CardContent>
  </Card>
);

export default ProductCardSkeleton;
