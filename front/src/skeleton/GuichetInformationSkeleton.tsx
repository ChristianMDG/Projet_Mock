import React from 'react';
import { alpha, Paper, Skeleton, Stack } from '@mui/material';
import { Theme } from '@mui/material/styles';

interface GuichetInformationSkeletonProps {
  theme: Theme;
}

export const GuichetInformationSkeleton: React.FC<GuichetInformationSkeletonProps> = ({ theme }) => (
  <Stack spacing={2} sx={{ mt: 3 }}>
    <Skeleton
      variant="text"
      sx={{
        width: 180,
        height: 24,
      }}
    />

    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: 1,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.info.main, 0.05),
        borderColor: alpha(theme.palette.info.main, 0.2),
      }}
    >
      <Stack spacing={1.5}>
        {/* Header */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: 1,
              width: 24,
              height: 24,
            }}
          />
          <Stack sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton
              variant="text"
              sx={{
                width: 120,
                height: 20,
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                width: 80,
                height: 16,
              }}
            />
          </Stack>
        </Stack>

        {/* Contact Info */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
          }}
        >
          <Skeleton
            variant="circular"
            sx={{
              width: 16,
              height: 16,
            }}
          />
          <Skeleton
            variant="text"
            sx={{
              width: 140,
              height: 16,
            }}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
          }}
        >
          <Skeleton
            variant="circular"
            sx={{
              width: 16,
              height: 16,
            }}
          />
          <Skeleton
            variant="text"
            sx={{
              width: 100,
              height: 16,
            }}
          />
        </Stack>

        {/* Operators */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
          }}
        >
          <Skeleton
            variant="circular"
            sx={{
              width: 16,
              height: 16,
            }}
          />
          <Skeleton
            variant="text"
            sx={{
              width: 160,
              height: 16,
            }}
          />
        </Stack>

        {/* Operator Chips */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            gap: 1,
            ml: 3,
            flexWrap: 'wrap',
          }}
        >
          <Skeleton
            variant="rounded"
            sx={{
              width: 80,
              height: 28,
            }}
          />
          <Skeleton
            variant="rounded"
            sx={{
              width: 90,
              height: 28,
            }}
          />
          <Skeleton
            variant="rounded"
            sx={{
              width: 75,
              height: 28,
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  </Stack>
);
