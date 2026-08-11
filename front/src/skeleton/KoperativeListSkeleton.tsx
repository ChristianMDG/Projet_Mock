import { Box, Grid, List, ListItemButton, Skeleton } from '@mui/material';

const KoperativeListSkeleton = ({ count = 4 }: { count?: number }) => (
  <List>
    {Array.from({ length: count }).map((_, idx) => (
      <ListItemButton key={idx} sx={{ padding: 2, marginBottom: 1 }}>
        <Grid
          container
          sx={{
            width: 1,
            alignItems: 'center',
          }}
          spacing={2}
        >
          <Grid size={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton
                variant="rounded"
                sx={{
                  width: 48,
                  height: 48,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" sx={{ fontSize: '1.1rem', width: '70%', mb: 1 }} />
                <Skeleton variant="text" sx={{ fontSize: '0.95rem', width: '50%' }} />
              </Box>
            </Box>
          </Grid>
          <Grid size={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 1,
              }}
            >
              <Skeleton
                variant="rounded"
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  width: 120,
                  height: 18,
                }}
              />
              <Skeleton variant="text" sx={{ fontSize: '0.9rem', width: '60%' }} />
            </Box>
          </Grid>
        </Grid>
      </ListItemButton>
    ))}
  </List>
);

export default KoperativeListSkeleton;
