import { Paper, Avatar, Skeleton, alpha } from '@mui/material';

export default function RentalAboutValueSkeleton() {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 4,
        borderRadius: 3,
        height: '100%',
        textAlign: 'center',
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
          mx: 'auto',
          mb: 3,
        }}
      >
        <Skeleton variant="circular" width={40} height={40} />
      </Avatar>
      <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto', mb: 2 }} />
      <Skeleton variant="text" width="90%" height={20} sx={{ mx: 'auto' }} />
      <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto' }} />
    </Paper>
  );
}
