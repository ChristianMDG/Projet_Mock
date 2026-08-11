import React from 'react';
import { Alert, Box, Container, Typography } from '@mui/material';
import type { DynamicPageHeader } from '@/api/dynamic-page.api';

interface PageHeaderProps {
  header: DynamicPageHeader;
}

const PageHeader: React.FC<PageHeaderProps> = ({ header }) => {
  return (
    <Container maxWidth="lg" sx={{ pt: 4, px: '0 !important' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" component="h2" gutterBottom color="primary">
          {header.title}
        </Typography>
        {header.description && (
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            {header.description}
          </Typography>
        )}
        {header.alertMessage && (
          <Alert severity={header.alertType} sx={{ mb: 3 }}>
            {header.alertTitle && <strong>{header.alertTitle}: </strong>}
            {header.alertMessage}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default PageHeader;
