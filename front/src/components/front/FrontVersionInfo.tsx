import React from 'react';
import { Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useAppVersion } from '@/hooks/front.hooks';

const FrontVersionInfo: React.FC = () => {
  const { t } = useTranslation();
  const { data, isFetching, isError, refetch } = useAppVersion(false);

  const isReady = !isFetching;
  const hasData = Boolean(data);
  const showLoading = isFetching;
  const showError = isReady && isError;
  const showData = isReady && !isError && hasData;

  const handleRefresh = () => {
    refetch().catch(() => undefined);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {t(Labels.front_version_title)}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
        <Button variant="outlined" onClick={handleRefresh} disabled={isFetching}>
          {t(Labels.front_version_refresh_button)}
        </Button>
        {showLoading && <CircularProgress size={20} />}
      </Stack>
      {showError && <Typography color="error">{t(Labels.front_version_error)}</Typography>}
      {showData && (
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="body2">{t(Labels.front_version_label)}</Typography>
            <Chip size="small" color="primary" label={data?.version ?? '-'} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {data?.timestamp ?? ''}
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

export default FrontVersionInfo;
