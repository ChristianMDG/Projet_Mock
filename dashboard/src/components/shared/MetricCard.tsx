import { Card, Box, Typography, Avatar, Skeleton, alpha, CardContent } from '@mui/material';

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ReactNode;
  loading?: boolean;
}

export default function MetricCard({ label, value, sub, color, icon, loading = false }: MetricCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        border: `1px solid`,
        borderColor: alpha(color, 0.3),
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: alpha(color, 0.12), color }}>{icon}</Avatar>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6, fontSize: '0.68rem' }}
            color="text.secondary"
          >
            {label}
          </Typography>
        </Box>
        {loading ? (
          <Skeleton width={100} height={36} />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 0.5,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
              {value}
            </Typography>
            {sub && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                {sub}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
