import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

const PaymentMethodsSkeleton: React.FC = () => (
  <Card sx={{ textAlign: 'center' }}>
    <CardContent>
      <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mb: 1 }} />
      <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto', mb: 3 }} />
      <Box
        sx={{
          gap: 3,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {[1, 2, 3].map(index => (
          <Skeleton
            key={index}
            variant="circular"
            width={65}
            height={65}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.1)',
            }}
          />
        ))}
      </Box>
    </CardContent>
  </Card>
);

export default PaymentMethodsSkeleton;
