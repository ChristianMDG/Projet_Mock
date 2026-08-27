import React, { useMemo } from 'react';
import {
  Box,
  Card,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListSubheader,
  Typography,
  Chip,
  Button,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  type SxProps,
  type Theme,
} from '@mui/material';
import DeleteSweep from '@mui/icons-material/DeleteSweep';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/cms.hooks';
import type { Category, ProductCategory } from '@/models/Shop';
import { Icon } from '@/shared/IconMapper';
import Labels from '@/labelKeys.json';
import { type ShopFilters } from './utils';

export interface ShopCategoryImageListProps {
  categories?: Category[];
  filters?: ShopFilters;
  onChange?: (filters: ShopFilters) => void;
  selectedCategorySlug?: string;
  onSelectCategory?: (category: Category) => void;
  onCategoryClick?: (category: Category) => void;
  title?: string;
  showSubheader?: boolean;
  sx?: SxProps<Theme>;
}

export const ShopCategoryImageList: React.FC<ShopCategoryImageListProps> = ({
  sx,
  title,
  filters,
  selectedCategorySlug: propSelectedSlug,
  categories: propCategories,
  showSubheader = true,
  onChange,
  onSelectCategory,
  onCategoryClick,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const { data: fetchedCategories = [] } = useCategories();
  const categories = useMemo(
    () => propCategories ?? [...new Map(fetchedCategories.map(c => [c.slug, c])).values()],
    [propCategories, fetchedCategories],
  );

  const selectedCategorySlug = filters?.categorySlugs?.[0] ?? propSelectedSlug;
  const selectedSubcategories = filters?.subcategorySlugs ?? [];

  const activeCategory = useMemo(
    () => categories.find(c => c.slug === selectedCategorySlug),
    [categories, selectedCategorySlug],
  );

  const activeSubcategories = useMemo(() => activeCategory?.subcategories ?? [], [activeCategory]);

  const cols = isXs ? 2 : isSm ? 3 : 4;
  const displayTitle = title ?? t(Labels.shop_filter_by_category);
  const hasCategories = categories.length > 0;
  const hasActiveFilters = Boolean(selectedCategorySlug || selectedSubcategories.length > 0);

  const handleCategoryClick = (category: Category) => {
    onSelectCategory?.(category);
    onCategoryClick?.(category);

    if (filters && onChange) {
      const isAlreadySelected = filters.categorySlugs.includes(category.slug);
      onChange({
        ...filters,
        categorySlugs: isAlreadySelected ? [] : [category.slug],
        subcategorySlugs: [],
      });
    }
  };

  const handleSubcategoryClick = (sub: ProductCategory) => {
    if (filters && onChange) {
      const isSelected = selectedSubcategories.includes(sub.slug);
      onChange({
        ...filters,
        subcategorySlugs: isSelected
          ? selectedSubcategories.filter(s => s !== sub.slug)
          : [...selectedSubcategories, sub.slug],
      });
    }
  };

  const handleClearAll = () => {
    if (filters && onChange) {
      onChange({
        ...filters,
        categorySlugs: [],
        subcategorySlugs: [],
      });
    }
  };

  return (
    hasCategories && (
      <Box sx={{ width: '100%', my: 2, ...sx }}>
        <ImageList
          cols={cols}
          gap={16}
          sx={{
            m: 0,
            overflow: 'visible',
          }}
        >
          {showSubheader && (
            <ImageListItem key="Subheader" cols={cols} sx={{ height: 'auto !important', pb: 1 }}>
              <ListSubheader
                component="div"
                sx={{
                  px: 0,
                  bgcolor: 'transparent',
                  lineHeight: 'normal',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
                  {displayTitle}
                </Typography>
                {hasActiveFilters && (
                  <Button
                    variant="text"
                    color="primary"
                    startIcon={<DeleteSweep />}
                    onClick={handleClearAll}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    {t(Labels.shop_clear_all)}
                  </Button>
                )}
              </ListSubheader>
            </ImageListItem>
          )}

          {categories.map((category, index) => {
            const isSelected = selectedCategorySlug === category.slug;
            const hasImage = Boolean(category.image?.url);
            const subCount = category.subcategories?.length ?? 0;
            const hasSubcategories = subCount > 0;
            const isFirst = index === 0;

            const itemCols = isFirst && !isXs ? 2 : 1;
            const itemRows = isFirst && !isXs ? 2 : 1;
            const minHeight = itemRows === 2 ? 320 : 180;
            const maxHeight = itemRows === 2 ? 400 : 220;

            return (
              <ImageListItem
                key={category.slug}
                cols={itemCols}
                rows={itemRows}
                component={Card}
                onClick={() => handleCategoryClick(category)}
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  borderRadius: '16px !important',
                  overflow: 'hidden !important',
                  transform: 'translateZ(0)',
                  border: 2,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  boxShadow: isSelected ? theme.shadows[4] : undefined,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: theme.shadows[6],
                    transform: 'translateY(-2px)',
                    '& img': {
                      transform: 'scale(1.06)',
                    },
                  },
                }}
              >
                {hasImage && category.image?.url ? (
                  <Box
                    component="img"
                    srcSet={`${category.image.url}?w=300&fit=crop&auto=format&dpr=2 2x`}
                    src={`${category.image.url}?w=300&fit=crop&auto=format`}
                    alt={category.name}
                    loading="lazy"
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight,
                      maxHeight,
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      borderRadius: '14px',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight,
                      maxHeight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'action.hover',
                      color: 'primary.main',
                      borderRadius: '14px',
                      '& svg': {
                        fontSize: itemRows === 2 ? 72 : 48,
                      },
                    }}
                  >
                    <Icon iconName={category.icon || 'Category'} />
                  </Box>
                )}

                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderRadius: '50%',
                      p: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: theme.shadows[2],
                      zIndex: 2,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 18 }} />
                  </Box>
                )}

                <ImageListItemBar
                  title={
                    <Typography variant="subtitle1" color="primary.contrastText" noWrap sx={{ fontWeight: 700 }}>
                      {category.name}
                    </Typography>
                  }
                  subtitle={
                    hasSubcategories ? (
                      <Typography variant="caption" color="primary.contrastText" sx={{ opacity: 0.9 }}>
                        {subCount} {t(Labels.shop_items, { count: subCount })}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="primary.contrastText" sx={{ opacity: 0.9 }} noWrap>
                        {category.description}
                      </Typography>
                    )
                  }
                  sx={{
                    background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.85)} 0%, ${alpha(theme.palette.common.black, 0.45)} 70%, transparent 100%)`,
                    borderBottomLeftRadius: '14px',
                    borderBottomRightRadius: '14px',
                    overflow: 'hidden',
                  }}
                />
              </ImageListItem>
            );
          })}
        </ImageList>

        {/* Subcategories pill filter when a category is selected */}
        {Boolean(activeCategory && activeSubcategories.length > 0) && (
          <Card sx={{ mt: 2.5, p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
                mb: 1.5,
              }}
            >
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                {activeCategory?.icon && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                    <Icon iconName={activeCategory.icon} />
                  </Box>
                )}
                <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700 }}>
                  {activeCategory?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  • {t(Labels.shop_subcategories)} ({activeSubcategories.length})
                </Typography>
              </Stack>

              {selectedSubcategories.length > 0 && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => onChange?.({ ...filters!, subcategorySlugs: [] })}
                  sx={{ textTransform: 'none', fontSize: '0.75rem', p: 0.5, minWidth: 'auto' }}
                >
                  {t(Labels.shop_clear_all)}
                </Button>
              )}
            </Box>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Chip
                label={t(Labels.shop_all_subcategories)}
                color={selectedSubcategories.length === 0 ? 'primary' : 'default'}
                variant={selectedSubcategories.length === 0 ? 'filled' : 'outlined'}
                onClick={() => onChange?.({ ...filters!, subcategorySlugs: [] })}
                clickable
              />
              {activeSubcategories.map(sub => {
                const isSubSelected = selectedSubcategories.includes(sub.slug);
                return (
                  <Chip
                    key={sub.slug}
                    label={sub.name}
                    color={isSubSelected ? 'primary' : 'default'}
                    variant={isSubSelected ? 'filled' : 'outlined'}
                    onClick={() => handleSubcategoryClick(sub)}
                    clickable
                  />
                );
              })}
            </Stack>
          </Card>
        )}
      </Box>
    )
  );
};

export default ShopCategoryImageList;
