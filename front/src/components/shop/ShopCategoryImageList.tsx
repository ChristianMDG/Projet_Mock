import React, { useMemo, memo } from 'react';
import { Typography, Stack, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/cms.hooks';
import type { Category } from '@/models/Shop';
import Labels from '@/labelKeys.json';
import ShopCategoryCard from '@/components/shop/ShopCategoryCard';

export interface ShopCategoryImageListProps {
  categories?: Category[];
  onCategoryClick: (category: Category) => void;
  title?: string;
  showSubheader?: boolean;
}

const BORDERED_GRID_SX = {
  '--Grid-borderWidth': '1px',
  borderTop: 'var(--Grid-borderWidth) solid',
  borderLeft: 'var(--Grid-borderWidth) solid',
  borderColor: 'divider',
  '& > div': {
    borderRight: 'var(--Grid-borderWidth) solid',
    borderBottom: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider',
  },
} as const;

export const ShopCategoryImageList: React.FC<ShopCategoryImageListProps> = ({
  title,
  categories: propCategories,
  showSubheader = true,
  onCategoryClick,
}) => {
  const { t } = useTranslation();
  const { data: fetchedCategories = [] } = useCategories();

  const categories = useMemo(() => {
    if (propCategories) {
      return propCategories;
    }
    const map = new Map<string, Category>();
    fetchedCategories.forEach(c => {
      if (c.slug) {
        map.set(c.slug, c);
      }
    });
    return Array.from(map.values());
  }, [propCategories, fetchedCategories]);

  const displayTitle = title ?? t(Labels.shop_filter_by_category);
  const hasCategories = categories.length > 0;

  if (hasCategories) {
    return (
      <Stack spacing={{ xs: 1.5, md: 2 }}>
        {showSubheader && <Typography variant="h6">{displayTitle}</Typography>}

        <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 0, bgcolor: 'transparent' }}>
          <Grid container sx={BORDERED_GRID_SX}>
            {categories.map(category => (
              <Grid size={{ xs: 4, sm: 3, md: 2 }} key={category.slug}>
                <ShopCategoryCard category={category} onClick={onCategoryClick} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Stack>
    );
  }

  return null;
};

export default memo(ShopCategoryImageList);
