import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

const PaymentMethodsSkeleton: React.FC = () => (
  <Card
    elevation={0}
    sx={{
      boxShadow: { xs: 0, xm: 0, sm: 1 },
      border: { xs: 'none', xm: 'none', sm: '1px solid' },
      borderColor: 'divider',
    }}
  >
    <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, xm: 2, sm: 3 } }}>
      <Skeleton variant="text" width="40%" height={40} sx={{ mx: 'auto', mb: { xs: 0.5, xm: 1, sm: 1.5 } }} />
      <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto', mb: { xs: 1.5, xm: 2, sm: 3 } }} />
      <Box
        sx={{
          gap: { xs: 1.5, xm: 2, sm: 3 },
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
            sx={{
              width: { xs: 45, xm: 55, sm: 65 },
              height: { xs: 45, xm: 55, sm: 65 },
              bgcolor: 'rgba(0, 0, 0, 0.1)',
            }}
          />
        ))}
      </Box>
    </CardContent>
  </Card>
);

export default PaymentMethodsSkeleton;
