import React from 'react';
import { Box, Paper, Skeleton, Stack } from '@mui/material';

interface AccountReservationListSkeletonProps {
  count?: number;
}

const AccountReservationListSkeleton: React.FC<AccountReservationListSkeletonProps> = ({ count = 3 }) => {
  if (count === 0) {
    return (
      <Paper sx={{ p: 3, mt: 2, border: '1px dashed', borderColor: 'divider' }}>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '60%', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
      </Paper>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {Array.from({ length: count }, (_, idx) => (
        <Paper key={`skeleton-reservation-${idx}`} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
            }}
          >
            {/* Left section: Logo, Route, Status */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                flex: 1,
                alignItems: 'center',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {/* Koperative logo */}
              <Skeleton
                variant="rounded"
                sx={{
                  borderRadius: 2,
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                }}
              />

              <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                {/* Route: Departure -> Arrival */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="text" sx={{ fontSize: '1.125rem', width: 80 }} />
                  <Skeleton variant="circular" sx={{ width: 20, height: 20, flexShrink: 0 }} />
                  <Skeleton variant="text" sx={{ fontSize: '1.125rem', width: 80 }} />
                </Box>

                {/* Booking reference */}
                <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 120 }} />

                {/* Status chips */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Skeleton variant="rounded" sx={{ borderRadius: 4, width: 90, height: 28 }} />
                  <Skeleton variant="rounded" sx={{ borderRadius: 4, width: 80, height: 28 }} />
                </Box>
              </Stack>
            </Stack>

            {/* Right section: Price and date */}
            <Stack
              spacing={1}
              sx={{
                alignItems: { xs: 'flex-start', sm: 'flex-end' },
                minWidth: { sm: 120 },
              }}
            >
              {/* Total amount */}
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', fontWeight: 600, width: 100 }} />

              {/* Date */}
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 80 }} />
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default AccountReservationListSkeleton;
