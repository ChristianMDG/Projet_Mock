import React from 'react';
import { Avatar, Box, Card, CardContent, Grid, Rating, Typography, type SxProps, type Theme } from '@mui/material';
import { Star } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import type { Testimonials as TestimonialsType } from '@/api/dynamic-page.api';

interface TestimonialsProps {
  section: TestimonialsType;
  sx?: SxProps<Theme>;
}

const Testimonials: React.FC<TestimonialsProps> = ({ section, sx }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.customer-testimonials">
      <Typography variant="h3" component="h2" gutterBottom>
        {section.title}
      </Typography>
      {section.subtitle && (
        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          {section.subtitle}
        </Typography>
      )}
      <Grid container spacing={3}>
        {section.testimonials.map(testimonial => (
          <Grid size={{ xs: 12, md: 4 }} key={testimonial.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={testimonial.avatar?.url ?? testimonial.avatarUrl}
                    alt={testimonial.name}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.location}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={testimonial.rating}
                    readOnly
                    size="small"
                    icon={
                      <Star
                        sx={{
                          fontSize: 'inherit',
                        }}
                      />
                    }
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({testimonial.rating}/5)
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "{testimonial.comment}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Overall rating */}
      {section.overallRating && (
        <Box sx={{ textAlign: 'center', mt: 4, p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            {section.overallRating.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Typography variant="h3" color="primary" sx={{ mr: 1 }}>
              {section.overallRating.averageRating}
            </Typography>
            <Box>
              <Rating value={section.overallRating.averageRating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary">
                {t(Labels.testimonials_reviews_text, { total: section.overallRating.totalReviews })}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">
            {t(Labels.testimonials_recommendation_text, { percentage: section.overallRating.recommendation })}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Testimonials;
