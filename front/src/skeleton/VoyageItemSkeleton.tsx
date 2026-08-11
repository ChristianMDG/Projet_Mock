import { Box, Grid, Paper, Skeleton } from '@mui/material';

export function VoyageItemSkeleton() {
  return (
    <Paper sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider' }} elevation={0}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={28} height={28} />
          <Skeleton variant="text" width={160} height={28} />
        </Box>
        <Skeleton variant="text" width={80} height={24} />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="70%" height={20} />
        </Grid>
        <Grid size="grow">
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
            <Skeleton variant="rounded" height={60} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
