import { Box, Card, CardContent, Divider, Grid, Skeleton } from '@mui/material';

const KoperativeDetailSkeleton = () => (
  <Box
    sx={{
      p: { xs: 1, sm: 2, md: 4 },
    }}
  >
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid size={{ xs: 12, md: 4, lg: 3 }}>
        <Card sx={{ mx: 'auto', width: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Skeleton
                variant="circular"
                sx={{
                  width: 80,
                  height: 80,
                }}
              />
              <Skeleton
                variant="text"
                sx={{
                  width: 120,
                  height: 32,
                }}
              />
              <Skeleton
                variant="text"
                sx={{
                  width: 180,
                  height: 20,
                }}
              />
              <Divider sx={{ my: 2, width: 1 }} />
              <Skeleton
                variant="text"
                sx={{
                  width: 200,
                  height: 24,
                }}
              />
              <Skeleton
                variant="text"
                sx={{
                  width: 200,
                  height: 24,
                }}
              />
              <Skeleton
                variant="text"
                sx={{
                  width: 200,
                  height: 24,
                }}
              />
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ mt: 2, mx: 'auto', width: 1 }}>
          <CardContent>
            <Skeleton
              variant="text"
              sx={{
                width: 100,
                height: 28,
              }}
            />
            <Skeleton
              variant="rectangular"
              sx={{
                width: 200,
                height: 40,
              }}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 8, lg: 9 }}>
        <Card>
          <CardContent>
            <Skeleton
              variant="text"
              sx={{
                mb: 2,
                width: '100%',
                height: 48,
              }}
            />
            <Skeleton
              variant="rectangular"
              sx={{
                width: '100%',
                height: 320,
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default KoperativeDetailSkeleton;
