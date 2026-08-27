import React from 'react';
import { Box, Container, Alert } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { TFunction, i18n } from 'i18next';
import Labels from '@/labelKeys.json';
import BasicHeader from './BasicHeader';
import BasicFooter from './BasicFooter';
import MessengerChat from '@/components/ui/MessengerChat';
import ProtectedTx from '@/components/ProtectedTx';
import { AuthorityEnum } from '@/models/enums';
import { CartDrawer } from '@/components/shop';
import type { LayoutProps } from '../types/app.types';
import { getMainContentStyles } from '../types/layout.utils';

const AppLayout: React.FC<LayoutProps & { t: TFunction; i18n: i18n }> = ({ children, t, i18n }) => {
  const { isGuichetAndInactive } = useAuth();

  return (
    <Box>
      <BasicHeader />
      <Container component="main" maxWidth="xl" sx={getMainContentStyles}>
        {isGuichetAndInactive && (
          <Alert severity="warning" elevation={1} sx={{ mb: 2, mt: 2 }}>
            {t(Labels.guichet_inactive_validation_warning)}
          </Alert>
        )}
        {children}
      </Container>
      <BasicFooter t={t} i18n={i18n} />
      <MessengerChat />
      <ProtectedTx allowedRoles={[AuthorityEnum.ADMIN]}>
        <CartDrawer />
      </ProtectedTx>
    </Box>
  );
};

export default AppLayout;
