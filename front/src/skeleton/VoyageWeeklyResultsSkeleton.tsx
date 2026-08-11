import { Box, Grid, Skeleton } from '@mui/material';

export default function VoyageWeeklyResultsSkeleton({ tabCount = 7 }: Readonly<{ tabCount?: number }>) {
  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Skeleton variant="text" width={200} height={36} />
            <Skeleton variant="text" width={120} height={24} />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="text" width={260} height={20} sx={{ ml: 'auto' }} />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, pb: 1 }}>
        {Array.from({ length: tabCount }).map((_, index) => (
          <Box
            key={`skeleton-day-${index + 1}`}
            sx={{ minWidth: 160, borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 1 }}
          >
            <Skeleton width={80} height={32} />
            <Skeleton width={120} height={22} />
          </Box>
        ))}
      </Box>

      <Grid container spacing={2} sx={{ my: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Skeleton variant="rounded" height={36} sx={{ minWidth: 140, borderRadius: 1 }} />
        </Grid>
      </Grid>
    </Box>
  );
}
