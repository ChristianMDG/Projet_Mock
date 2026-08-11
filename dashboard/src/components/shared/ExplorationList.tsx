import { Box, Typography, Stack, LinearProgress, Chip, Divider, alpha } from '@mui/material';

/* ── Pie Chart Status List ── */

export interface StatusListItem {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface StatusExplorationListProps {
  title: string;
  items: StatusListItem[];
  total: number;
}

export function StatusExplorationList({ title, items, total }: StatusExplorationListProps) {
  if (items.length === 0) return null;
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.8rem' }}>
        {title}
      </Typography>
      <Stack spacing={1}>
        {items.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <Box
              key={item.id}
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.divider, 0.04),
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: alpha(item.color, 0.08) },
              })}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: item.color,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }} noWrap>
                    {item.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem', ml: 1 }}>
                    {item.value}
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      ({pct}%)
                    </Typography>
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    bgcolor: alpha(item.color, 0.12),
                    '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: item.color },
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Stack>
    </>
  );
}

/* ── Route Ranking List ── */

export interface RouteItem {
  name: string;
  count: number;
  revenue: number;
}

interface RouteExplorationListProps {
  title: string;
  routes: RouteItem[];
  formatCurrency: (amount: number) => string;
}

export function RouteExplorationList({ title, routes, formatCurrency }: RouteExplorationListProps) {
  if (routes.length === 0) return null;
  const maxCount = Math.max(...routes.map((r) => r.count));

  return (
    <>
      <Divider sx={{ my: 2.5 }} />
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, fontSize: '0.8rem' }}>
        {title}
      </Typography>
      <Stack spacing={1}>
        {routes.map((route, index) => {
          const pct = maxCount > 0 ? Math.round((route.count / maxCount) * 100) : 0;
          return (
            <Box
              key={route.name}
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: alpha(theme.palette.divider, 0.04),
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) },
              })}
            >
              <Chip
                label={`#${index + 1}`}
                size="small"
                color="primary"
                sx={{ height: 24, fontSize: '0.7rem', fontWeight: 700, minWidth: 36 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }} noWrap>
                    {route.name}
                  </Typography>
                  <Stack direction="row" spacing={1.5} sx={{ ml: 1, flexShrink: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'primary.main' }}>
                      {route.count} rés.
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'success.main' }}>
                      {formatCurrency(route.revenue)}
                    </Typography>
                  </Stack>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      bgcolor: 'primary.main',
                    },
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Stack>
    </>
  );
}
