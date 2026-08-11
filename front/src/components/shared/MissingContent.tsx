import React from 'react';
import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material';
import { Refresh, Settings, Translate } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { ButtonTx } from '../ui';

interface MissingContentProps {
  componentName: string;
}

const MissingContent: React.FC<MissingContentProps> = ({ componentName }) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
  };

  return (
    <Alert severity="warning" icon={<Translate color="warning" />} variant="outlined" sx={{ borderRadius: 2, my: 2 }}>
      <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" component="span">
          {t(Labels.cms_content_missing_title)}
        </Typography>
      </AlertTitle>{' '}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 3,
        }}
      >
        {t(Labels.cms_content_missing_description)}{' '}
        <Typography
          component="span"
          variant="body2"
          color="text.primary"
          sx={{
            fontWeight: 'medium',
          }}
        >
          {componentName}
        </Typography>{' '}
        ({i18n.language.toUpperCase()})
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <ButtonTx
          variant="contained"
          size="small"
          startIcon={<Settings />}
          onClick={() => window.open(`https://${import.meta.env.VITE_DOMAIN_CMS}/admin`, '_blank')}
          allowedRoles={['ADMIN']}
        >
          {t(Labels.cms_content_open_admin)}
        </ButtonTx>

        <Button variant="outlined" size="small" startIcon={<Refresh />} onClick={handleRefresh}>
          {t(Labels.cms_content_refresh_page)}
        </Button>
      </Stack>
    </Alert>
  );
};

export default MissingContent;
