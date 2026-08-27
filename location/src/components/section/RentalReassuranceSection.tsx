import React from 'react';
import { Box, Container, Typography, Grid, type SxProps, type Theme } from '@mui/material';
import type { RentalReassuranceSection as RentalReassuranceSectionType } from '@/api/dynamic-page.api';

interface RentalReassuranceSectionProps {
  section: RentalReassuranceSectionType;
  sx?: SxProps<Theme>;
}

import IndicatorCard from './IndicatorCard';

const RentalReassuranceSection: React.FC<RentalReassuranceSectionProps> = ({ section, sx }) => {
  const { title, subtitle, indicators, backgroundColor, containerMaxWidth } = section;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: backgroundColor ?? 'background.default', ...sx }}>
      <Container maxWidth={containerMaxWidth ?? 'lg'}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          {Boolean(title) && (
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              {title}
            </Typography>
          )}
          {Boolean(subtitle) && (
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 800, mx: 'auto' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {Boolean(indicators?.length) && (
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {indicators.map(indicator => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={indicator.id}>
                <IndicatorCard indicator={indicator} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default RentalReassuranceSection;
