import React from 'react';
import { Alert, Box, Card, CardActions, CardContent, Skeleton } from '@mui/material';

interface PaymentSuccessPageSkeletonProps {
  showForm?: boolean;
}

const PaymentSuccessPageSkeleton: React.FC<PaymentSuccessPageSkeletonProps> = ({ showForm = false }) => (
  <Box sx={{ minHeight: '100vh', maxWidth: 600, mx: 'auto', p: 2 }}>
    {/* Header Back Button */}
    <Box sx={{ mb: 3 }}>
      <Skeleton variant="rounded" width={120} height={36} />
    </Box>

    {/* Success Alert */}
    <Alert severity="success" sx={{ mb: 3, opacity: 0.7 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '60%' }} />
      </Box>
      <Box sx={{ mt: 1 }}>
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '80%' }} />
      </Box>
    </Alert>

    {/* Voyage Summary Card */}
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Title */}
        <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '50%', mb: 2 }} />

        {/* Route Info */}
        <Box sx={{ mb: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '85%' }} />
        </Box>

        {/* Operator Info */}
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '75%' }} />
        </Box>

        {/* Selected Seats Section */}
        <Box>
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '40%', mb: 1 }} />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} variant="rounded" width={40} height={32} />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>

    {/* Main Content Card */}
    <Card>
      <CardContent sx={{ py: showForm ? 2 : 4 }}>
        {showForm ? (
          // Form skeleton for non-authenticated users
          <>
            <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '60%', mb: 2 }} />

            {/* User Details Form Fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton variant="rounded" width="100%" height={56} />
              <Skeleton variant="rounded" width="100%" height={56} />
              <Skeleton variant="rounded" width="100%" height={56} />
              <Skeleton variant="rounded" width="100%" height={120} />
            </Box>
          </>
        ) : (
          // Processing message for authenticated users
          <Box sx={{ textAlign: 'center' }}>
            <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '60%', mx: 'auto', mb: 1 }} />
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '80%', mx: 'auto' }} />
          </Box>
        )}
      </CardContent>

      {/* Card Actions for non-authenticated users */}
      {showForm && (
        <CardActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Skeleton variant="rounded" width="48%" height={40} />
          <Skeleton variant="rounded" width="48%" height={40} />
        </CardActions>
      )}
    </Card>
  </Box>
);

export default PaymentSuccessPageSkeleton;
