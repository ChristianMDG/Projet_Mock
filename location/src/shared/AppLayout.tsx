import React from 'react';
import { Box, Container } from '@mui/material';
import RentalHeader from '../components/RentalHeader';
import RentalFooter from '../components/RentalFooter';
import { getMainContentStyles } from '../types/layout.utils';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box>
    <RentalHeader />
    <Container component="main" maxWidth="xl" sx={getMainContentStyles}>
      {children}
    </Container>
    <RentalFooter />
  </Box>
);

export default AppLayout;
