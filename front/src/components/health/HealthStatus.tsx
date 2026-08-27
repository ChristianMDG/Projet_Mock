import React from 'react';
import { Box, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useHealth, useHealthInfo } from '@/hooks/health.hooks';

const HealthStatus: React.FC = () => {
  const { t } = useTranslation();
  const health = useHealth();
  const info = useHealthInfo();

  const isLoading = health.isLoading || info.isLoading;
  const isError = health.isError || info.isError;
  const isReady = !isLoading;
  const hasData = Boolean(health.data) && Boolean(info.data);
  const showLoading = isLoading;
  const showError = isReady && isError;
  const showData = isReady && !isError && hasData;
  const isUp = health.data?.status === 'UP';

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.health_status_title)}
      </Typography>
      {showLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {showError && <Typography color="error">{t(Labels.health_status_error)}</Typography>}
      {showData && (
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="body2">{t(Labels.health_status_status_label)}</Typography>
            <Chip size="small" color={isUp ? 'success' : 'error'} label={health.data?.status ?? '-'} />
          </Stack>
          <Typography variant="body2">
            {t(Labels.health_status_application_label)}: {info.data?.application ?? '-'}
          </Typography>
          <Typography variant="body2">
            {t(Labels.health_status_version_label)}: {info.data?.version ?? '-'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {info.data?.profile ?? ''}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default HealthStatus;
