import { Paper, Box, Typography, Avatar, Skeleton, alpha } from '@mui/material';

export interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  loading?: boolean;
}

export default function StatCard({ icon, label, value, color, loading = false }: StatCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.25s ease',
        '&:hover': { borderColor: color, boxShadow: `0 2px 12px ${alpha(color, 0.15)}` },
      }}
    >
      <Avatar sx={{ width: 44, height: 44, bgcolor: alpha(color, 0.12), color }}>{icon}</Avatar>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {label}
        </Typography>
        {loading ? (
          <Skeleton width={80} height={28} />
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2 }}>
            {value}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
