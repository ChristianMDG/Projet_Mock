import React from 'react';
import { Card, CardContent, Grid, Skeleton } from '@mui/material';

interface SeatGridSkeletonProps {
  rows?: number;
  columns?: number;
}

/**
 * Skeleton loading component for seat grid
 */
export const SeatGridSkeleton: React.FC<SeatGridSkeletonProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width={200} height={28} sx={{ mb: 2 }} />
        <Grid container spacing={1.5}>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <Grid
              container
              size={12}
              spacing={{ xs: 2, sm: 2, md: 3 }}
              key={`skeleton-row-${rowIdx + 1}`}
              sx={{ mb: 1, display: 'flex', alignContent: 'center', justifyContent: 'space-evenly' }}
            >
              {Array.from({ length: columns }).map((_, colIdx) => (
                <Grid size={12 / columns} key={`skeleton-seat-${rowIdx + 1}-${colIdx + 1}`} sx={{ display: 'flex' }}>
                  <Skeleton variant="rectangular" width="100%" height={48} sx={{ borderRadius: 4, minHeight: 24 }} />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
