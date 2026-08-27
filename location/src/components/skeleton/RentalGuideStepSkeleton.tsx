import { Paper, Box, Skeleton, alpha } from '@mui/material';

export default function RentalGuideStepSkeleton() {
  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box
          sx={{
            bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
            p: 1.5,
            borderRadius: 2,
            display: 'flex',
          }}
        >
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Skeleton variant="text" width="60%" height={32} />
      </Box>
      <Box component="ul" sx={{ pl: 2, m: 0, flexGrow: 1 }}>
        <Skeleton variant="text" width="90%" height={24} sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="85%" height={24} sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1.5 }} />
      </Box>
    </Paper>
  );
}
