import React from 'react';
import { Box, Container, Typography, Grid, type SxProps, type Theme } from '@mui/material';
import type { RentalCategoriesSection as RentalCategoriesSectionType } from '@/api/dynamic-page.api';
import CategoryCard from './CategoryCard';

interface RentalCategoriesSectionProps {
  section: RentalCategoriesSectionType;
  sx?: SxProps<Theme>;
}

const RentalCategoriesSection: React.FC<RentalCategoriesSectionProps> = ({ section, sx }) => {
  const { title, subtitle, categories, backgroundColor, containerMaxWidth } = section;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: backgroundColor ?? 'background.paper', ...sx }}>
      <Container maxWidth={containerMaxWidth ?? 'lg'}>
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
            {title}
          </Typography>
          {Boolean(subtitle) && (
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 800, mx: 'auto' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {Boolean(categories?.length) && (
          <Grid container spacing={4}>
            {categories.map(category => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={category.id}>
                <CategoryCard category={category} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default RentalCategoriesSection;
