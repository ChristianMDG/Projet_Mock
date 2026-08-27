import React from 'react';
import { Alert, Box, Card, CardActions, CardContent, Divider, Grid, Skeleton, Stack } from '@mui/material';

interface PaymentSuccessPageSkeletonProps {
  showForm?: boolean;
}

const PaymentSuccessPageSkeleton: React.FC<PaymentSuccessPageSkeletonProps> = ({ showForm = false }) => (
  <Box sx={{ minHeight: '100vh', maxWidth: 600, mx: 'auto' }}>
    {/* Voyage Summary Card (SelectedSeats Skeleton) */}
    <Card sx={{ mb: 3, mt: 1 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Koperative & Guichet Info */}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Skeleton variant="rounded" width={60} height={60} />
            <Stack spacing={0.5} sx={{ flex: 1 }}>
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: '40%' }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%' }} />
            </Stack>
          </Stack>

          <Divider />

          {/* Voyage Info */}
          <Box>
            <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '30%', mb: 1 }} />
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Skeleton variant="text" sx={{ fontSize: '1.1rem', width: '30%' }} />
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" sx={{ fontSize: '1.1rem', width: '30%' }} />
            </Stack>
          </Box>

          <Divider />

          {/* Seats & Price */}
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '40%', mb: 1 }} />
              <Stack direction="row" spacing={0.5}>
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} variant="rounded" width={32} height={24} />
                ))}
              </Stack>
            </Box>
            <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 80 }} />
              <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: 100 }} />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>

    {/* Main Content Card */}
    <Card sx={{ my: 2 }}>
      <CardContent>
        {/* Title */}
        <Skeleton variant="text" sx={{ fontSize: '2rem', width: '60%', mb: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {/* Success Alert */}
          <Alert severity="success" sx={{ borderRadius: 2, boxShadow: 0, opacity: 0.7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="text" sx={{ fontSize: '1rem', width: 120 }} />
            </Box>
          </Alert>

          {showForm ? (
            // Form skeleton for non-authenticated users
            <>
              {/* User Details Form Fields */}
              <Grid container spacing={1.5}>
                {Array.from({ length: 4 }, (_, i) => (
                  <Grid key={i} size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rounded" width="100%" height={40} />
                  </Grid>
                ))}
              </Grid>

              {/* Notes Field */}
              <Skeleton variant="rounded" width="100%" height={88} />
            </>
          ) : (
            // Processing message for authenticated users
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '60%', mx: 'auto', mb: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '80%', mx: 'auto' }} />
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Card Actions for non-authenticated users */}
      {showForm && (
        <CardActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Skeleton variant="rounded" width="50%" height={42} />
          <Skeleton variant="rounded" width="50%" height={42} />
        </CardActions>
      )}
    </Card>
  </Box>
);

export default PaymentSuccessPageSkeleton;
