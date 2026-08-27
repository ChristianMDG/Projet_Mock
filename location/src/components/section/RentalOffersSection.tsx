import React from 'react';
import { Box, Container, Typography, Grid, type SxProps, type Theme } from '@mui/material';
import type { RentalOffersSection as RentalOffersSectionType } from '@/api/dynamic-page.api';
import OfferCard from './OfferCard';

interface RentalOffersSectionProps {
  section: RentalOffersSectionType;
  sx?: SxProps<Theme>;
}

const RentalOffersSection: React.FC<RentalOffersSectionProps> = ({ section, sx }) => {
  const { title, subtitle, offers, backgroundColor, containerMaxWidth } = section;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: backgroundColor ?? 'background.paper', ...sx }}>
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

        {Boolean(offers?.length) && (
          <Grid container spacing={4}>
            {offers.map(offer => (
              <Grid size={{ xs: 12, md: offer.gridSize === 'large' ? 8 : 4 }} key={offer.id}>
                <OfferCard offer={offer} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default RentalOffersSection;
