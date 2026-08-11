import React from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Stack, Chip, Grid } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import type { BenefitsShowcase as BenefitsShowcaseType } from '@/api/dynamic-page.api';
import { Icon } from '@/shared/IconMapper';

interface BenefitsShowcaseProps {
  section: BenefitsShowcaseType;
}

const BenefitsShowcase: React.FC<BenefitsShowcaseProps> = ({ section }) => {
  return (
    <Box sx={{ py: 6, bgcolor: section.backgroundColor || '#ffffff' }}>
      <Container
        sx={{
          maxWidth: section.containerMaxWidth || 'lg',
        }}
      >
        <Box sx={{ mb: 5, textAlign: 'center' }}>
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
          {section.benefits.map(benefit => (
            <Grid key={benefit.id} size={{ xs: 12, sm: 6, md: 4, lg: section.benefits.length >= 6 ? 4 : 4 }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  border: benefit.highlighted ? 2 : 0,
                  borderColor: benefit.highlighted ? `${benefit.color}.main` : 'transparent',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: `${benefit.color}.light`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      mx: 'auto',
                    }}
                  >
                    <Icon iconName={benefit.icon} sx={{ fontSize: 32, color: `${benefit.color}.main` }} />
                  </Box>

                  {benefit.highlighted && <Chip label="Recommandé" color={benefit.color} size="small" sx={{ mb: 1 }} />}

                  <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    {benefit.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    {benefit.description}
                  </Typography>

                  {benefit.link && benefit.linkText && (
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'center',
                      }}
                    >
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        href={benefit.link}
                        sx={{ textTransform: 'none' }}
                      >
                        {benefit.linkText}
                      </Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BenefitsShowcase;
