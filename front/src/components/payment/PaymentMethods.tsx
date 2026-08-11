import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import PaymentCard from './PaymentCard';
import type { PaymentSection } from '@/api/dynamic-page.api';
import { useSectionContext } from '@/context/SectionProvider';
import { SECTION_TYPES } from '@/constants/section.types';
import MissingContent from '../shared/MissingContent';

const PaymentMethods: React.FC<{ showDesc?: boolean }> = ({ showDesc = true }) => {
  const { getSectionByType } = useSectionContext();
  const section = getSectionByType<PaymentSection>(SECTION_TYPES.PAYMENT_SECTION);

  // Get data from section context only
  const methods = section?.paymentMethods ?? [];

  if (!methods?.length) {
    return <MissingContent componentName="Payment Methods" />;
  }

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center' }}>
        {section?.title && (
          <Typography variant="h5" gutterBottom>
            {section.title}
          </Typography>
        )}
        {section?.description && showDesc && (
          <Typography variant="body1" sx={{ mb: 3 }}>
            {section.description}
          </Typography>
        )}
        <Box
          sx={{
            gap: 3,
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
