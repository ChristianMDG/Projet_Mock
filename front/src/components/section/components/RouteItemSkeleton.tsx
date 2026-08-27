import React from 'react';
import { Card, Skeleton, Box, Stack, Paper } from '@mui/material';

const RouteItemSkeleton: React.FC = () => (
  <Card sx={{ my: 0.75, boxShadow: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
      {/* ── Left image skeleton ───────────────────────────────────────── */}
      <Box sx={{ position: 'relative', flexShrink: 0, width: { xs: 90, sm: 110, md: 130 } }}>
        <Skeleton
          variant="rectangular"
          sx={{
            width: '100%',
            height: '100%',
            minHeight: { xs: 90, sm: 100 },
          }}
        />
      </Box>

      {/* ── Body skeleton ─────────────────────────────────────────────── */}
      <Stack
        direction="row"
        sx={{
          flex: 1,
          alignItems: 'center',
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 1.5, sm: 2 },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton variant="text" sx={{ width: '70%', height: 28, mb: 0.5 }} />
          <Skeleton variant="text" sx={{ width: '40%', height: 20, mb: 1 }} />
          <Stack direction="row" spacing={0.75}>
            <Skeleton variant="rounded" sx={{ width: 60, height: 20, borderRadius: '6px' }} />
            <Skeleton variant="rounded" sx={{ width: 80, height: 20, borderRadius: '6px' }} />
          </Stack>
        </Box>

        {/* ── Price pill skeleton ──────────────────────────────────── */}
        <Paper
          variant="outlined"
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            px: { xs: 0.5, sm: 1 },
            py: { xs: 0.5, sm: 1 },
            minWidth: { xs: 80, sm: 90 },
            borderColor: 'divider',
          }}
        >
          <Skeleton variant="text" sx={{ width: 40, height: 16 }} />
          <Skeleton variant="text" sx={{ width: 60, height: 32 }} />
          <Skeleton variant="text" sx={{ width: 20, height: 16 }} />
        </Paper>
      </Stack>
    </Box>
  </Card>
);

export default RouteItemSkeleton;
