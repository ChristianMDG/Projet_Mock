import React from 'react';
import { Box, Stack, Skeleton, Card, CardContent, Grid } from '@mui/material';

const LiveRoutePricingSkeleton: React.FC = () => (
  <Box sx={{ pt: 6 }}>
    {/* Title Skeleton */}
    <Skeleton
      variant="text"
      sx={{
        mb: 2,
        width: '40%',
        height: 48,
      }}
    />

    {/* Filters Skeleton - matching RouteFilters */}
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: { xs: 2, sm: 1 } }}>
      <Skeleton
        variant="text"
        sx={{
          width: 220,
          height: 24,
        }}
      />
      <Skeleton
        variant="text"
        sx={{
          width: 100,
          height: 32,
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton
          variant="text"
          sx={{
            width: 120,
            height: 24,
          }}
        />
        <Skeleton
          variant="text"
          sx={{
            width: 100,
            height: 32,
          }}
        />
      </Box>
    </Box>

    {/* List items - matching RouteItem Card/Grid structure */}
    <Stack spacing={0}>
      {[1, 2, 3, 4, 5].map(index => (
        <Card key={index} sx={{ my: 1, boxShadow: { sm: 0.25 } }}>
          <CardContent sx={{ p: 1 }}>
            <Grid
              container
              spacing={{ xs: 1, sm: 2 }}
              sx={{
                alignItems: 'center',
              }}
            >
              {/* Image */}
              <Grid size={{ xs: 4, sm: 2, md: 1.5 }}>
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: '100%',
                    height: { xs: 80, sm: 72, md: 80 },
                    borderRadius: 2,
                  }}
                />
              </Grid>

              {/* Route Details */}
              <Grid size={{ xs: 8, sm: 4, md: 4 }}>
                <Box>
                  <Skeleton
                    variant="text"
                    sx={{
                      width: '70%',
                      height: 28,
                    }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{
                      width: '40%',
                      height: 20,
                    }}
                  />
                </Box>
              </Grid>

              {/* Type/Promo */}
              <Grid size={{ xs: 6, sm: 3, md: 3 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: 'center',
                    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    sx={{
                      borderRadius: '16px',
                      width: 50,
                      height: 20,
                    }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{
                      width: 80,
                      height: 20,
                    }}
                  />
                </Stack>
              </Grid>

              {/* Price Section */}
              <Grid size={{ xs: 6, sm: 3, md: 3.5 }}>
                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Skeleton
                    variant="text"
                    sx={{
                      width: 60,
                      height: 20,
                    }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{
                      width: 120,
                      height: 28,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  </Box>
);

export default LiveRoutePricingSkeleton;
