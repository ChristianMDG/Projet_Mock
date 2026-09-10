import React, { useState, useMemo, memo } from 'react';
import { Stack, Chip, Avatar, useTheme, alpha } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { useTranslation } from 'react-i18next';
import type { Category, ProductCategory } from '@/models/Shop';
import StyledIcon from '@/components/ui/StyledIcon';
import { iconMap, type IconName } from '@/shared/IconMapper';
import ShopCategoryDrawer from './ShopCategoryDrawer';
import Labels from '@/labelKeys.json';

interface ShopCategoryTabsProps {
  categories: Category[];
  activeCategorySlug: string;
  activeSubcategories?: ProductCategory[];
  selectedSubcategorySlugs?: string[];
  onCategoryClick: (category: Category) => void;
  onSubcategoryClick?: (subSlug: string) => void;
  onClearSubcategories?: () => void;
  onAllClick?: () => void;
}

const ShopCategoryTabs: React.FC<ShopCategoryTabsProps> = ({
  categories,
  activeCategorySlug,
  activeSubcategories = [],
  selectedSubcategorySlugs = [],
  onCategoryClick,
  onSubcategoryClick,
  onClearSubcategories,
  onAllClick,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const subtleBorderColor = alpha(theme.palette.divider, 0.12);

  const activeCategory = useMemo(
    () => categories.find(c => c.slug === activeCategorySlug),
    [categories, activeCategorySlug],
  );

  const subcategories = activeCategory?.subcategories ?? activeSubcategories;
  const hasSubcategories = Boolean(activeCategory && subcategories.length > 0);

  return (
    <Stack spacing={1} sx={{ width: 1 }}>
      {/* Horizontal Category Strip with Madagascar Images */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          py: 0.5,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {/* "Toutes les catégories" Option (opens Carrefour-style explorer drawer) */}
        <Chip
          icon={<StyledIcon icon={CategoryIcon} />}
          label={t(Labels.shop_all_categories)}
          onClick={() => setIsDrawerOpen(true)}
          color={!activeCategorySlug ? 'primary' : 'default'}
          variant={!activeCategorySlug ? 'filled' : 'outlined'}
          sx={{
            fontWeight: !activeCategorySlug ? 700 : 500,
            height: 36,
            px: 0.5,
            fontSize: '0.825rem',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        />

        {/* Category Cards with Images */}
        {categories.map(category => {
          const isSelected = category.slug === activeCategorySlug;
          return (
            <Chip
              key={category.slug}
              avatar={
                <Avatar
                  src={category.image?.url}
                  alt={category.name}
                  variant="rounded"
                  sx={{
                    width: '26px !important',
                    height: '26px !important',
                    '& img': {
                      objectFit: 'cover',
                    },
                  }}
                />
              }
              label={category.name}
              onClick={() => onCategoryClick(category)}
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                fontWeight: isSelected ? 700 : 500,
                height: 36,
                px: 0.5,
                fontSize: '0.825rem',
                flexShrink: 0,
              }}
            />
          );
        })}
      </Stack>

      {/* Subcategories Row (displayed inline directly when active category has subcategories) */}
      {hasSubcategories && (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            py: 0.25,
            alignItems: 'center',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Chip
            size="small"
            label={t(Labels.shop_all_subcategories)}
            color={selectedSubcategorySlugs.length === 0 ? 'primary' : 'default'}
            variant={selectedSubcategorySlugs.length === 0 ? 'filled' : 'outlined'}
            onClick={onClearSubcategories}
            sx={{
              fontWeight: selectedSubcategorySlugs.length === 0 ? 700 : 500,
              fontSize: '0.72rem',
              height: 26,
              borderColor: selectedSubcategorySlugs.length === 0 ? 'primary.main' : subtleBorderColor,
              flexShrink: 0,
            }}
          />
          {subcategories.map(sub => {
            const isSubSelected = selectedSubcategorySlugs.includes(sub.slug);
            const subIconComponent = sub.icon && iconMap[sub.icon as IconName];
            return (
              <Chip
                key={sub.slug}
                size="small"
                icon={
                  subIconComponent ? (
                    <StyledIcon icon={subIconComponent} sx={{ fontSize: '0.85rem !important' }} />
                  ) : undefined
                }
                label={sub.name}
                color={isSubSelected ? 'primary' : 'default'}
                variant={isSubSelected ? 'filled' : 'outlined'}
                onClick={onSubcategoryClick ? () => onSubcategoryClick(sub.slug) : undefined}
                sx={{
                  fontWeight: isSubSelected ? 700 : 500,
                  fontSize: '0.72rem',
                  height: 26,
                  borderColor: isSubSelected ? 'primary.main' : subtleBorderColor,
                  flexShrink: 0,
                }}
              />
            );
          })}
        </Stack>
      )}

      {/* Carrefour-Style Category Explorer Drawer */}
      <ShopCategoryDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
        activeCategorySlug={activeCategorySlug}
        onCategorySelect={category => {
          setIsDrawerOpen(false);
          onCategoryClick(category);
        }}
        onSubcategorySelect={(category, subSlug) => {
          setIsDrawerOpen(false);
          onCategoryClick(category);
          if (onSubcategoryClick) {
            onSubcategoryClick(subSlug);
          }
        }}
        onAllProductsSelect={() => {
          setIsDrawerOpen(false);
          if (onAllClick) {
            onAllClick();
          }
        }}
      />
    </Stack>
  );
};

export default memo(ShopCategoryTabs);
