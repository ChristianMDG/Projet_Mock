import React from 'react';
import { Box, Card, CardContent, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import { Icon } from '@/shared/IconMapper';
import type { FeatureItem, WhyChooseUs as WhyChooseUsType } from '@/api/dynamic-page.api';

interface WhyChooseUsProps {
  section: WhyChooseUsType;
  sx?: SxProps<Theme>;
}

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.why-choose-us">
      <Typography variant="h3" component="h2" gutterBottom>
        {section.title}
      </Typography>
      {section.subtitle && (
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          {section.subtitle}
        </Typography>
      )}
      <Grid container spacing={3}>
        {section.features.map((feature: FeatureItem) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`feature-${feature.id}`}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    color: 'primary.main',
                    mb: 2,
                    '& > svg': { fontSize: 48 },
                  }}
                >
                  <Icon iconName={feature.icon} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Stats */}
      {section.showStatistics && section.statistics && section.statistics.length > 0 && (
        <Card sx={{ mt: 6 }}>
          <CardContent>
            <Grid container spacing={3} sx={{ textAlign: 'center' }}>
              {section.statistics.map((stat, index) => (
                <Grid
                  size={{ xs: 6, md: 12 / section.statistics.length }}
                  key={stat.id ? `stat-${stat.id}` : `stat-index-${index}`}
                >
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1">{stat.label}</Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default WhyChooseUs;
