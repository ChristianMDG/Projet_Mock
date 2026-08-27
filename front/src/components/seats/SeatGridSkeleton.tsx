import React from 'react';
import { Box, Paper, Skeleton } from '@mui/material';

interface SeatGridSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton loading component for seat grid
 */
export const SeatGridSkeleton: React.FC<SeatGridSkeletonProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1, sm: 1.5, md: 2, lg: 3 },
        borderRadius: 6,
        borderColor: theme => (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(1, 22, 56, 0.08)'),
      }}
    >
      <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5, md: 2 }, width: '100%' }}>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <Box
            key={`skeleton-row-${rowIdx + 1}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 1.5, md: 2 },
              width: '100%',
            }}
          >
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Box
                key={`skeleton-seat-${rowIdx + 1}-${colIdx + 1}`}
                sx={{
                  flex: '1 1 0px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 5, minHeight: 24 }} />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
