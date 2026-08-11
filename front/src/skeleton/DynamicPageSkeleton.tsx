import { Box, Container, Skeleton } from '@mui/material';

const DynamicPageSkeleton = () => (
  <>
    {/* PageHeader Skeleton */}
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Skeleton variant="text" sx={{ fontSize: '2.5rem', mx: 'auto', maxWidth: 600, mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mx: 'auto', maxWidth: 400, mb: 3 }} />
      </Box>
    </Container>

    {/* Dynamic Sections Skeleton */}
    <Container maxWidth="lg">
      <Box key={`section-skeleton`} sx={{ py: 4 }}>
        <Skeleton variant="text" sx={{ fontSize: '1.75rem', maxWidth: 400, mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '90%', mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%', mb: 2 }} />
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
      </Box>
      {/* CallToAction Skeleton */}
      <Box sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'background.paper' }}>
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', mx: 'auto', maxWidth: 400, mb: 1 }} />
        <Skeleton variant="text" sx={{ fontSize: '1rem', mx: 'auto', maxWidth: 500, mb: 3 }} />
        <Skeleton variant="rounded" width={200} height={42} sx={{ mx: 'auto', borderRadius: 1 }} />
      </Box>
    </Container>
  </>
);

export default DynamicPageSkeleton;
