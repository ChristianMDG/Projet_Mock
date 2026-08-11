import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

const PaymentPageSkeleton: React.FC = () => (
  <Box sx={{ minHeight: '100vh', maxWidth: 600, mx: 'auto', p: 2 }}>
    {/* Header Back Button */}
    <Box sx={{ mb: 3 }}>
      <Skeleton variant="rounded" width={120} height={36} />
    </Box>

    {/* Reservation Summary Card */}
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Title */}
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '60%', mb: 2 }} />

        {/* Route Info */}
        <Box sx={{ mb: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
        </Box>

        {/* Operator Info */}
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '70%' }} />
        </Box>

        {/* Total Amount */}
        <Box sx={{ textAlign: 'right' }}>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '40%', ml: 'auto' }} />
        </Box>
      </CardContent>
    </Card>

    {/* Payment Method Card */}
    <Card>
      <CardContent>
        {/* Payment Method Title */}
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '50%', mb: 2 }} />

        <Stack spacing={2}>
          {/* Payment Method Accordion */}
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '40%' }} />
              <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%' }} />
          </Box>

          {/* Phone Number Input */}
          <Box>
            <Skeleton variant="rounded" width="100%" height={56} />
          </Box>

          {/* Info Alert */}
          <Box
            sx={{
              backgroundColor: 'info.light',
              borderRadius: 1,
              p: 2,
              opacity: 0.3,
            }}
          >
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '90%' }} />
          </Box>

          {/* Payment Button */}
          <Skeleton variant="rounded" width="100%" height={48} />
        </Stack>
      </CardContent>
    </Card>
  </Box>
);

export default PaymentPageSkeleton;
