import { Card, CardContent, CardActions, Box, Skeleton } from '@mui/material';

export default function RentalVehicleCardSkeleton() {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3 }}>
      <Box sx={{ position: 'relative', bgcolor: 'background.default', p: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={160} sx={{ borderRadius: 1 }} />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" width="60%" height={28} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={30} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={40} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={40} />
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        <Box>
          <Skeleton variant="text" width={80} height={28} />
          <Skeleton variant="text" width={50} height={16} />
        </Box>
        <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
      </CardActions>
    </Card>
  );
}
