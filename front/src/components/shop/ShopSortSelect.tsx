import React, { memo } from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { SortOption } from '@/models/Shop';
import Labels from '@/labelKeys.json';

interface ShopSortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; labelKey: string }[] = [
  { value: 'relevance', labelKey: Labels.shop_sort_relevance },
  { value: 'price-asc', labelKey: Labels.shop_sort_price_asc },
  { value: 'price-desc', labelKey: Labels.shop_sort_price_desc },
  { value: 'newest', labelKey: Labels.shop_sort_newest },
  { value: 'best-seller', labelKey: Labels.shop_sort_best_seller },
];

const ShopSortSelect: React.FC<ShopSortSelectProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <FormControl size="small" sx={{ minWidth: { xs: 120, sm: 140 } }}>
      <Select
        value={value}
        onChange={e => onChange(e.target.value as SortOption)}
        displayEmpty
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.8rem' },
          '& .MuiSelect-select': { py: { xs: 0.5, sm: 0.75 }, px: { xs: 1, sm: 1.5 } },
        }}
      >
        {SORT_OPTIONS.map(option => (
          <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.8rem' }}>
            {t(option.labelKey)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(ShopSortSelect);
