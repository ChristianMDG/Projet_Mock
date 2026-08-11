import React from 'react';
import { Card, CardContent, Grid, Typography, Box, Avatar } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { PaymentSection as PaymentSectionType } from '@/api/dynamic-page.api';

interface PaymentSectionProps {
  section: PaymentSectionType;
  sx?: SxProps<Theme>;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ section, sx }) => {
  const methods = section?.paymentMethods ?? [];

  return methods.length > 0 ? (
    <Card sx={{ mb: 6, ...sx }} data-section="page.payment-section">
      <CardContent>
        {section.title && (
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: 'center',
            }}
          >
            {section.title}
          </Typography>
        )}
        {section.description && (
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              textAlign: 'center',
            }}
          >
            {section.description}
          </Typography>
        )}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {methods.map(method => (
            <Grid key={method.id} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {method.logo?.url && (
                  <Avatar
                    src={method.logo.url}
                    alt={method.logo.alternativeText ?? method.name}
                    sx={{
                      mb: 2,
                      boxShadow: 1,
                      width: 80,
                      height: 80,
                      bgcolor: 'background.paper',
                    }}
                  />
                )}
                <Typography variant="h6" gutterBottom>
                  {method.name}
                </Typography>
                {method.description && (
                  <Typography variant="body2" color="text.secondary">
                    {method.description}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  ) : null;
};

export default PaymentSection;
