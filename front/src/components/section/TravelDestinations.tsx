import React from 'react';
import { Box, Container, Typography, Card, CardMedia, CardContent, Button, Stack, Grid } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { optimizeCloudinaryUrl } from '@/utils/cloudinaryUtils';
import type { TravelDestinations as TravelDestinationsType } from '@/api/dynamic-page.api';

interface TravelDestinationsProps {
  section: TravelDestinationsType;
}

const TravelDestinations: React.FC<TravelDestinationsProps> = ({ section }) => {
  const sortedDestinations = [...section.destinations].sort((a, b) => a.order - b.order);

  const getGridSize = (gridSize: 'small' | 'medium' | 'large') => {
    switch (gridSize) {
      case 'large':
        return { xs: 12, sm: 12, md: 8 };
      case 'medium':
        return { xs: 12, sm: 6, md: 6 };
      case 'small':
        return { xs: 12, sm: 6, md: 4 };
      default:
        return { xs: 12, sm: 6, md: 6 };
    }
  };

  const getCardHeight = (gridSize: 'small' | 'medium' | 'large') => {
    switch (gridSize) {
      case 'large':
        return 500;
      case 'medium':
        return 350;
      case 'small':
        return 300;
      default:
        return 350;
    }
  };

  return (
    <Box sx={{ py: 6, bgcolor: section.backgroundColor ?? '#f5f5f5' }}>
      <Container
        sx={{
          maxWidth: section.containerMaxWidth ?? 'xl',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {section.title}
          </Typography>
          {section.subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
              {section.subtitle}
            </Typography>
          )}
        </Box>

        <Grid container spacing={3}>
          {sortedDestinations.map(destination => (
            <Grid key={destination.id} size={getGridSize(destination.gridSize)}>
              <Card
                sx={{
                  height: getCardHeight(destination.gridSize),
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: destination.link ? 'pointer' : 'default',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: destination.link ? 'scale(1.02)' : 'none',
                  },
                }}
                onClick={() => {
                  if (destination.link) {
                    window.location.href = destination.link;
                  }
                }}
              >
                <CardMedia
                  component="img"
                  image={optimizeCloudinaryUrl(destination.image.url, {
                    width: 800,
                    height: getCardHeight(destination.gridSize),
                  })}
                  alt={`${destination.city}, ${destination.country}`}
                  width="800"
                  height={getCardHeight(destination.gridSize)}
                  sx={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover',
                  }}
                />
                <CardContent
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
                    color: 'white',
                    p: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      opacity: 0.9,
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    {destination.country}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      mb: destination.description ? 1 : 0,
                    }}
                  >
                    {destination.city}
                  </Typography>
                  {destination.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {destination.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {section.buttonText && section.buttonUrl && (
          <Stack
            direction="row"
            sx={{
              mt: 4,
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              href={section.buttonUrl}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {section.buttonText}
            </Button>
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default TravelDestinations;
