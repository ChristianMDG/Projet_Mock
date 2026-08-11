import React from 'react';
import { Box, Paper, Skeleton, Stack } from '@mui/material';

interface AccountReservationListSkeletonProps {
  count?: number;
}

const AccountReservationListSkeleton: React.FC<AccountReservationListSkeletonProps> = ({ count = 3 }) => {
  if (count === 0) {
    return (
      <Paper sx={{ p: 3, border: '1px dashed', borderColor: 'divider' }}>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '60%', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {Array.from({ length: count }, (_, idx) => (
        <Paper key={`skeleton-reservation-${idx}`} sx={{ mb: 2, p: 2 }}>
          <Stack
            direction={{ sm: 'row' }}
            sx={{
              justifyContent: 'space-between',
              alignItems: { sm: 'center' },
            }}
          >
            {/* Left section: Logo, Route, Status */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              {/* Koperative logo */}
              <Skeleton
                variant="rounded"
                sx={{
                  borderRadius: 1.5,
                  width: 48,
                  height: 48,
                }}
              />

              <Stack spacing={0.5} sx={{ flex: 1 }}>
                {/* Route: Departure -> Arrival */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Skeleton variant="text" sx={{ fontSize: '1rem', width: '25%' }} />
                  <Skeleton
                    variant="circular"
                    sx={{
                      width: 16,
                      height: 16,
                    }}
                  />
                  <Skeleton variant="text" sx={{ fontSize: '1rem', width: '25%' }} />
                </Box>

                {/* Booking reference */}
                <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '30%' }} />

                {/* Status chip */}
                <Box sx={{ mt: 0.5 }}>
                  <Skeleton
                    variant="rounded"
                    sx={{
                      borderRadius: 3,
                      width: 80,
                      height: 24,
                    }}
                  />
                </Box>
              </Stack>
            </Stack>

            {/* Right section: Price and details */}
            <Stack
              spacing={1}
              sx={{
                alignItems: 'flex-end',
              }}
            >
              {/* Total amount */}
              <Skeleton variant="text" sx={{ fontSize: '1.25rem', fontWeight: 600, width: 50 }} />

              {/* Date */}
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 30 }} />
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default AccountReservationListSkeleton;
