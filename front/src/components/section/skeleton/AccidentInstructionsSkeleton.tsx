import React from 'react';
import { Box, Container, Skeleton, Card, CardContent, Stack, Grid } from '@mui/material';

const AccidentInstructionsSkeleton: React.FC = () => (
  <Box sx={{ py: 6 }}>
    <Container
      sx={{
        maxWidth: 'lg',
      }}
    >
      <Skeleton
        variant="text"
        sx={{
          mx: 'auto',
          mb: 2,
          width: '50%',
          height: 40,
        }}
      />
      <Skeleton
        variant="text"
        sx={{
          mx: 'auto',
          mb: 4,
          width: '70%',
          height: 24,
        }}
      />

      <Skeleton
        variant="rectangular"
        sx={{
          mb: 4,
          borderRadius: 1,
          height: 60,
        }}
      />

      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mb: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Skeleton
                    variant="circular"
                    sx={{
                      width: 40,
                      height: 40,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        mb: 1,
                        alignItems: 'center',
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        sx={{
                          width: 24,
                          height: 24,
                        }}
                      />
                      <Skeleton
                        variant="text"
                        sx={{
                          width: '60%',
                        }}
                      />
                    </Stack>
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        borderRadius: 2,
                        width: 80,
                        height: 24,
                      }}
                    />
                  </Box>
                </Stack>
                <Skeleton
                  variant="text"
                  sx={{
                    width: '100%',
                  }}
                />
                <Skeleton
                  variant="text"
                  sx={{
                    width: '90%',
                  }}
                />
                <Skeleton
                  variant="text"
                  sx={{
                    width: '95%',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default AccidentInstructionsSkeleton;
