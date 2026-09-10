import React, { memo } from 'react';
import { Stack, Typography, Chip, Button, Divider } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export interface SearchFooterProps {
  totalCount?: number;
  tookMs?: number;
  onViewAll?: () => void;
}

export const SearchFooter: React.FC<SearchFooterProps> = ({ totalCount, tookMs, onViewAll }) => {
  const { t } = useTranslation();

  return (
    <>
      <Divider />
      <Stack
        direction="row"
        sx={{
          px: 2,
          py: 0.75,
          bgcolor: 'action.hover',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <BoltIcon color="primary" fontSize="small" />
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            {t(Labels.shop_search_instant)}
          </Typography>
          {tookMs !== undefined && (
            <Chip label={`${tookMs} ms`} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
          )}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Chip label="↑↓" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
            <Typography variant="caption" color="text.secondary">
              {t(Labels.global_search_navigate)}
            </Typography>
            <Chip label="↵" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
            <Typography variant="caption" color="text.secondary">
              {t(Labels.global_search_select)}
            </Typography>
            <Chip label="ESC" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
            <Typography variant="caption" color="text.secondary">
              {t(Labels.global_search_close)}
            </Typography>
          </Stack>

          {Boolean(onViewAll && totalCount) && (
            <Button
              size="small"
              variant="text"
              color="primary"
              onClick={onViewAll}
              endIcon={<ArrowForwardIcon fontSize="small" />}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                py: 0.25,
                px: 0.75,
              }}
            >
              {t(Labels.global_search_view_all)} ({totalCount})
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default memo(SearchFooter);
