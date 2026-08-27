import { Box, Paper, Grid, Skeleton } from '@mui/material';

export default function RentalAgencySkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
      }}
    >
      <Skeleton variant="text" width="70%" height={32} sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
            <Skeleton variant="text" width="80%" />
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
            <Skeleton variant="text" width="50%" />
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
            <Box sx={{ width: '60%' }}>
              <Skeleton variant="text" />
              <Skeleton variant="text" width="80%" />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
