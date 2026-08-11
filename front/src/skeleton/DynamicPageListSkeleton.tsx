import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const DynamicPageListSkeleton = ({ count = 6 }: { count?: number }) => (
  <Box>
    {/* Title skeleton */}
    <Skeleton variant="text" sx={{ fontSize: '2.5rem', maxWidth: 400, mx: 'auto', mb: 2 }} />

    {/* Subtitle skeleton */}
    <Skeleton variant="text" sx={{ fontSize: '1.25rem', maxWidth: 600, mx: 'auto', mb: 6 }} />

    {/* Cards grid skeleton */}
    <Grid container spacing={4}>
      {Array.from({ length: count }).map((_, idx) => (
        <Grid key={`static-page-skeleton-${idx + 1}`} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              borderLeft: '4px solid',
              borderLeftColor: 'secondary.main',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Icon + Title */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" sx={{ fontSize: '1.25rem', width: '60%', ml: 1 }} />
              </Box>

              {/* Description */}
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '100%', mb: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '80%', mb: 3 }} />

              {/* Button */}
              <Skeleton variant="rounded" height={36} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default DynamicPageListSkeleton;
