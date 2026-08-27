import React from 'react';
import { Box, Container, Typography, Grid, type SxProps, type Theme } from '@mui/material';
import type { RentalHowItWorks as RentalHowItWorksType } from '@/api/dynamic-page.api';

interface RentalHowItWorksProps {
  section: RentalHowItWorksType;
  sx?: SxProps<Theme>;
}

import RentalStepCard from './RentalStepCard';

const RentalHowItWorks: React.FC<RentalHowItWorksProps> = ({ section, sx }) => {
  const { title, subtitle, steps, backgroundColor, containerMaxWidth } = section;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: backgroundColor ?? 'background.default', ...sx }}>
      <Container maxWidth={containerMaxWidth ?? 'lg'}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            {title}
          </Typography>
          {Boolean(subtitle) && (
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 800, mx: 'auto' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {Boolean(steps?.length) && (
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 12 / Math.min(steps.length, 4) }} key={step.id}>
                <RentalStepCard step={step} index={index} total={steps.length} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default RentalHowItWorks;
