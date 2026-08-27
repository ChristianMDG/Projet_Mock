import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import PaymentCard from './PaymentCard';
import type { PaymentSection } from '@/api/dynamic-page.api';
import { useSectionByComponent } from '@/hooks/dynamic-page.hooks';
import { SECTION_TYPES } from '@/constants/section.types';
import MissingContent from '../shared/MissingContent';

const PaymentMethods: React.FC<{ showDesc?: boolean }> = ({ showDesc = true }) => {
  const { data } = useSectionByComponent(SECTION_TYPES.PAYMENT_SECTION);
  const section = data?.data as PaymentSection | undefined;

  // Get data from section
  const methods = section?.paymentMethods ?? [];

  if (!methods?.length) {
    return <MissingContent componentName="Payment Methods" />;
  }

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', p: { xs: 1.5, xm: 2, sm: 3 } }}>
        {section?.title && (
          <Typography variant="h5" sx={{ mb: { xs: 1, xm: 1.5, sm: 2 } }}>
            {section.title}
          </Typography>
        )}
        {section?.description && showDesc && (
          <Typography variant="body1" sx={{ mb: { xs: 1.5, xm: 2, sm: 3 } }}>
            {section.description}
          </Typography>
        )}
        <Box
          sx={{
            gap: { xs: 1.5, xm: 2, sm: 3 },
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {methods.map(method => (
            <PaymentCard
              key={method.id}
              logoUrl={method?.logo?.url}
              logoAlt={method?.logo?.alternativeText ?? `${method.name}`}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
