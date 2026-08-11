import React from 'react';
import { Box, Card, CardContent, Grid, Typography, type SxProps, type Theme } from '@mui/material';
import { Icon } from '@/shared/IconMapper';
import type { BookingRuleItem, BookingRules as BookingRulesType } from '@/api/dynamic-page.api';

interface BookingRulesProps {
  section: BookingRulesType;
  sx?: SxProps<Theme>;
}

const BookingRules: React.FC<BookingRulesProps> = ({ section, sx }) => {
  return (
    <Box sx={{ mb: 6, ...sx }} data-section="page.booking-rules">
      <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 4 }}>
        {section.title}
      </Typography>
      <Grid container spacing={3}>
        {section.rules.map((rule: BookingRuleItem) => (
          <Grid size={{ xs: 12, md: 6 }} key={`rule-${rule.id}`}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                  <Icon iconName={rule.icon} color="primary" />
                  <Typography variant="h6" component="h3">
                    {rule.title}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {rule.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BookingRules;
