import React from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Divider, Stack, Grid } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import type { TrustIndicators as TrustIndicatorsType } from '@/api/dynamic-page.api';
import { Icon } from '@/shared/IconMapper';

interface TrustIndicatorsProps {
  section: TrustIndicatorsType;
}

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({ section }) => {
  const isHorizontal = section.layout === 'horizontal';
  const isGrid = section.layout === 'grid';

  if (isHorizontal) {
    return (
      <Box sx={{ py: 4, bgcolor: section.backgroundColor || 'background.paper' }}>
        <Container
          sx={{
            maxWidth: section.containerMaxWidth || 'lg',
          }}
        >
          {section.title && (
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
              {section.title}
            </Typography>
          )}
          {section.subtitle && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
              {section.subtitle}
            </Typography>
          )}

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            divider={section.showBorder ? <Divider orientation="vertical" flexItem /> : undefined}
            sx={{ alignItems: 'center' }}
          >
            {section.indicators.map(indicator => (
              <Box key={indicator.id} sx={{ flex: 1, textAlign: 'center', px: 2 }}>
                <Icon iconName={indicator.icon} sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {indicator.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {indicator.description}
                </Typography>
                {indicator.link && indicator.linkText && (
                  <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    href={indicator.link}
                    sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                  >
                    {indicator.linkText}
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, bgcolor: section.backgroundColor || 'background.default' }}>
      <Container
        sx={{
          maxWidth: section.containerMaxWidth || 'lg',
        }}
      >
        {section.title && (
          <Typography variant="h4" gutterBottom align="center">
            {section.title}
          </Typography>
        )}
        {section.subtitle && (
          <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            {section.subtitle}
          </Typography>
        )}

        <Grid container spacing={3}>
          {section.indicators.map(indicator => (
            <Grid key={indicator.id} size={{ xs: 12, sm: 6, md: isGrid ? 6 : 12 }}>
              <Card
                sx={{
                  height: '100%',
                  border: section.showBorder ? 1 : 0,
                  borderColor: 'divider',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        minWidth: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: 'success.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon iconName={indicator.icon} sx={{ fontSize: 28, color: 'success.main' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {indicator.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {indicator.description}
                      </Typography>
                      {indicator.link && indicator.linkText && (
                        <Button
                          size="small"
                          endIcon={<ArrowForwardIcon />}
                          href={indicator.link}
                          sx={{ textTransform: 'none' }}
                        >
                          {indicator.linkText}
                        </Button>
                      )}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TrustIndicators;
