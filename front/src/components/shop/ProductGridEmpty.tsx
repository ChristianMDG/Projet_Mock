import React, { memo } from 'react';
import { Typography, Button, Stack, Paper } from '@mui/material';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Labels from '@/labelKeys.json';

interface ProductGridEmptyProps {
  onClearFilters?: () => void;
  searchQuery?: string;
}

const ProductGridEmpty: React.FC<ProductGridEmptyProps> = ({ onClearFilters, searchQuery }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const hasClearAction = Boolean(onClearFilters);
  const hasQuery = Boolean(searchQuery?.trim());
  const shopRoute = ROUTES.shop[i18n.language] ?? ROUTES.shop.mg;

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 1.5 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
          <Inventory2Outlined fontSize="small" color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {hasQuery ? t(Labels.shop_search_no_results_for, { query: searchQuery }) : t(Labels.shop_no_products)}
          </Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          {hasQuery ? t(Labels.shop_search_suggestions_title) : t(Labels.shop_no_products_desc)}
        </Typography>

        {hasQuery && (
          <Stack spacing={0.5} sx={{ pl: 2, color: 'text.secondary', fontSize: '0.825rem' }}>
            <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>
              • {t(Labels.shop_search_suggestion_check_spelling)}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>
              • {t(Labels.shop_search_suggestion_broader_terms)}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>
              • {t(Labels.shop_search_suggestion_remove_filters)}
            </Typography>
          </Stack>
        )}

        <Stack direction="row" spacing={1} sx={{ pt: 0.5, flexWrap: 'wrap', gap: 1 }}>
          {hasClearAction && (
            <Button variant="outlined" size="small" onClick={onClearFilters}>
              {hasQuery ? t(Labels.shop_search_clear) : t(Labels.shop_reset_filters)}
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(shopRoute)}
            endIcon={<ArrowBackIcon fontSize="small" sx={{ transform: 'rotate(180deg)' }} />}
          >
            {t(Labels.shop_all_categories)}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default memo(ProductGridEmpty);
