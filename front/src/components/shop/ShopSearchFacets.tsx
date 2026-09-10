import React, { memo } from 'react';
import { Stack, Chip, Button, Typography, useTheme, alpha } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckIcon from '@mui/icons-material/Check';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircle from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export type PriceRangeOption = 'all' | 'under-50k' | '50k-200k' | 'above-200k';

export interface ShopSearchFacetsProps {
  totalCount: number;
  searchTimeMs?: number;
  searchQuery?: string;
  onClearSearchQuery?: () => void;
  priceRange: PriceRangeOption;
  onPriceRangeChange: (range: PriceRangeOption) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
  onClearAllFilters?: () => void;
  hasActiveFilters?: boolean;
}

export const ShopSearchFacets: React.FC<ShopSearchFacetsProps> = ({
  totalCount,
  searchTimeMs = 8,
  searchQuery = '',
  onClearSearchQuery,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onToggleInStockOnly,
  onClearAllFilters,
  hasActiveFilters = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const subtleBorderColor = alpha(theme.palette.divider, 0.12);
  const hasQuery = Boolean(searchQuery.trim());
  const isPriceFiltered = priceRange !== 'all';

  const priceOptions: Array<{ id: PriceRangeOption; labelKey: string }> = [
    { id: 'all', labelKey: Labels.shop_search_price_all },
    { id: 'under-50k', labelKey: Labels.shop_search_price_under_50k },
    { id: '50k-200k', labelKey: Labels.shop_search_price_50k_200k },
    { id: 'above-200k', labelKey: Labels.shop_search_price_above_200k },
  ];

  return (
    <Stack spacing={1} sx={{ py: 0.5 }}>
      {/* Top row: Results stats & quick facet controls */}
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          rowGap: 1.5,
        }}
      >
        {/* Left: Instant Result Stat */}
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
            {t(Labels.shop_search_results_stat, { count: totalCount })}
          </Typography>

          <Chip
            icon={<BoltIcon sx={{ fontSize: '0.85rem !important', color: 'primary.main' }} />}
            label={`${searchTimeMs}ms`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.68rem',
              fontWeight: 700,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main',
              px: 0.25,
            }}
          />
        </Stack>

        {/* Right: Facet chips */}
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            rowGap: 1,
          }}
        >
          {/* Price Range Presets */}
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              rowGap: 1,
              my: { xs: 0.5, sm: 0 },
            }}
          >
            {priceOptions.map(opt => {
              const isSelected = priceRange === opt.id;
              return (
                <Chip
                  key={opt.id}
                  size="small"
                  label={t(opt.labelKey)}
                  onClick={() => onPriceRangeChange(opt.id)}
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  icon={isSelected ? <CheckIcon sx={{ fontSize: '0.8rem !important' }} /> : undefined}
                  sx={{
                    fontSize: '0.72rem',
                    height: 26,
                    fontWeight: isSelected ? 700 : 500,
                    borderColor: isSelected ? 'primary.main' : subtleBorderColor,
                    cursor: 'pointer',
                  }}
                />
              );
            })}
          </Stack>

          {/* In-Stock Filter Toggle */}
          <Chip
            size="small"
            icon={<CheckCircle sx={{ fontSize: '0.85rem !important' }} />}
            label={t(Labels.shop_search_in_stock_only)}
            onClick={onToggleInStockOnly}
            color={inStockOnly ? 'success' : 'default'}
            variant={inStockOnly ? 'filled' : 'outlined'}
            sx={{
              fontSize: '0.72rem',
              height: 26,
              fontWeight: inStockOnly ? 700 : 500,
              borderColor: inStockOnly ? 'success.main' : subtleBorderColor,
              cursor: 'pointer',
            }}
          />
        </Stack>
      </Stack>

      {/* Active filters bar if any filter is active */}
      {hasActiveFilters && (
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            rowGap: 1,
            pt: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem', fontWeight: 600 }}>
            Filtres actifs:
          </Typography>

          {hasQuery && (
            <Chip
              size="small"
              label={`"${searchQuery}"`}
              onDelete={onClearSearchQuery}
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.72rem', height: 24 }}
            />
          )}

          {isPriceFiltered && (
            <Chip
              size="small"
              icon={<AttachMoneyIcon sx={{ fontSize: '0.8rem !important' }} />}
              label={
                priceOptions.find(opt => opt.id === priceRange)?.labelKey
                  ? t(priceOptions.find(opt => opt.id === priceRange)!.labelKey)
                  : priceRange
              }
              onDelete={() => onPriceRangeChange('all')}
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.72rem', height: 24 }}
            />
          )}

          {inStockOnly && (
            <Chip
              size="small"
              label={t(Labels.shop_search_in_stock_only)}
              onDelete={onToggleInStockOnly}
              color="success"
              variant="outlined"
              sx={{ fontSize: '0.72rem', height: 24 }}
            />
          )}

          <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<RestartAltIcon sx={{ fontSize: '0.85rem !important' }} />}
            onClick={onClearAllFilters}
            sx={{
              fontSize: '0.72rem',
              textTransform: 'none',
              py: 0.25,
              px: 1,
              minWidth: 'auto',
              fontWeight: 600,
            }}
          >
            {t(Labels.shop_clear_all)}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default memo(ShopSearchFacets);
