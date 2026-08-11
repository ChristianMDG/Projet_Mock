import { Box, Typography, LinearProgress, alpha } from '@mui/material';

interface GaugeCardProps {
  label: string;
  value: number;
  total: number;
  color: string;
  loading?: boolean;
}

export default function GaugeCard({ label, value, total, color, loading = false }: GaugeCardProps) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
          {loading ? '…' : value}{' '}
          <Typography component="span" variant="caption" color="text.secondary">
            ({pct}%)
          </Typography>
        </Typography>
      </Box>
      <LinearProgress
        variant={loading ? 'indeterminate' : 'determinate'}
        value={pct}
        sx={{
          height: 10,
          borderRadius: 5,
          bgcolor: alpha(color, 0.12),
          '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: color },
        }}
      />
    </Box>
  );
}
