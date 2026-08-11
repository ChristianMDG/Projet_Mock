import React from 'react';
import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

const PromotionBannerSkeleton: React.FC = () => {
  return (
    <Card
      sx={{
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ py: 3 }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ flex: 1 }}>
            {/* Chips skeleton */}
            <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
              <Skeleton
                variant="circular"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  width: 24,
                  height: 24,
                }}
              />
              <Skeleton
                variant="rounded"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  width: 120,
                  height: 24,
                }}
              />
              <Skeleton
                variant="rounded"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  width: 100,
                  height: 24,
                }}
              />
            </Stack>

            {/* Title skeleton */}
            <Skeleton
              variant="text"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mb: 1,
                width: '80%',
                height: 40,
              }}
            />

            {/* Subtitle skeleton */}
            <Skeleton
              variant="text"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mb: 2,
                width: '90%',
                height: 28,
              }}
            />

            {/* Button and text skeleton */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                alignItems: 'flex-start',
              }}
            >
              <Skeleton
                variant="rounded"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: 2,
                  width: 200,
                  height: 42,
                }}
              />
              <Skeleton
                variant="text"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  width: 150,
                  height: 24,
                }}
              />
            </Stack>
          </Box>

          {/* Image skeleton */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Skeleton
              variant="rounded"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                width: 120,
                height: 120,
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PromotionBannerSkeleton;
