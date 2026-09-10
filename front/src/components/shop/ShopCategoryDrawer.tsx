import React, { useState, memo } from 'react';
import {
  Drawer,
  Stack,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CategoryIcon from '@mui/icons-material/Category';
import AppsIcon from '@mui/icons-material/Apps';
import { useTranslation } from 'react-i18next';
import type { Category, ProductCategory } from '@/models/Shop';
import StyledIcon from '@/components/ui/StyledIcon';
import { iconMap, type IconName } from '@/shared/IconMapper';
import Labels from '@/labelKeys.json';

export interface ShopCategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategorySlug?: string;
  onCategorySelect: (category: Category) => void;
  onSubcategorySelect?: (category: Category, subcategorySlug: string) => void;
  onAllProductsSelect?: () => void;
}

const ShopCategoryDrawer: React.FC<ShopCategoryDrawerProps> = ({
  open,
  onClose,
  categories,
  activeCategorySlug,
  onCategorySelect,
  onSubcategorySelect,
  onAllProductsSelect,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const [drillCategory, setDrillCategory] = useState<Category | null>(null);

  const handleClose = () => {
    setDrillCategory(null);
    onClose();
  };

  const handleCategoryClick = (category: Category) => {
    const hasSubcategories = Boolean(category.subcategories && category.subcategories.length > 0);
    if (hasSubcategories) {
      setDrillCategory(category);
    } else {
      handleClose();
      onCategorySelect(category);
    }
  };

  const handleAllProductsClick = () => {
    handleClose();
    if (onAllProductsSelect) {
      onAllProductsSelect();
    }
  };

  const handleSubcategoryClick = (category: Category, subSlug: string) => {
    handleClose();
    if (onSubcategorySelect) {
      onSubcategorySelect(category, subSlug);
    } else {
      onCategorySelect(category);
    }
  };

  const isLevelOne = drillCategory === null;
  const isLevelTwo = Boolean(drillCategory);

  const subtleBorderColor = alpha(theme.palette.divider, 0.12);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100vw', sm: 380 },
            maxWidth: { xs: '100vw', sm: 420 },
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[8],
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Level 1: Toutes les catégories (Carrefour Root List) */}
      {isLevelOne && (
        <Stack sx={{ height: 1 }}>
          {/* Header */}
          <Stack
            direction="row"
            sx={{
              p: 2,
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: subtleBorderColor,
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <StyledIcon icon={CategoryIcon} sx={{ fontSize: '1.35rem' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {t(Labels.shop_all_categories)}
              </Typography>
            </Stack>

            <IconButton size="small" onClick={handleClose} edge="end" aria-label="Fermer">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* Body List */}
          <List sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
            {/* Quick Action: Tous les produits */}
            <ListItem disablePadding>
              <ListItemButton onClick={handleAllProductsClick} sx={{ py: 1.25, px: 2 }}>
                <ListItemIcon sx={{ minWidth: 38 }}>
                  <StyledIcon icon={AppsIcon} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: !activeCategorySlug ? 700 : 600,
                        color: !activeCategorySlug ? 'primary.main' : 'text.primary',
                      }}
                    >
                      {t(Labels.shop_all_categories)}
                    </Typography>
                  }
                />
                <ChevronRightIcon color="action" fontSize="small" />
              </ListItemButton>
            </ListItem>

            <Divider sx={{ my: 1, borderColor: subtleBorderColor }} />

            {/* Categories List */}
            {categories.map(category => {
              const isSelected = category.slug === activeCategorySlug;
              const hasSub = Boolean(category.subcategories && category.subcategories.length > 0);
              const subCount = category.subcategories?.length ?? 0;

              return (
                <ListItem key={category.slug} disablePadding>
                  <ListItemButton
                    onClick={() => handleCategoryClick(category)}
                    sx={{
                      py: 1.25,
                      px: 2,
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 46 }}>
                      <Avatar
                        src={category.image?.url}
                        alt={category.name}
                        variant="rounded"
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: 'action.selected',
                          color: 'primary.main',
                          border: isSelected ? 1.5 : 0,
                          borderColor: 'primary.main',
                          '& img': { objectFit: 'cover' },
                        }}
                      >
                        <CategoryIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? 'primary.main' : 'text.primary',
                          }}
                        >
                          {category.name}
                        </Typography>
                      }
                      secondary={
                        hasSub ? (
                          <Typography variant="caption" color="text.secondary">
                            {`${subCount} ${t(Labels.shop_items, { count: subCount })}`}
                          </Typography>
                        ) : undefined
                      }
                    />

                    <ChevronRightIcon color="action" fontSize="small" />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Stack>
      )}

      {/* Level 2: Category Drill-down (Carrefour Style Subcategories List) */}
      {isLevelTwo && drillCategory && (
        <Stack sx={{ height: 1 }}>
          {/* Level 2 Header: Back to all categories */}
          <Stack
            direction="row"
            sx={{
              p: 1.5,
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: 1,
              borderColor: subtleBorderColor,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setDrillCategory(null)}
              color="inherit"
              size="small"
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.85rem',
                color: 'text.primary',
              }}
            >
              {t(Labels.shop_all_categories)}
            </Button>

            <IconButton size="small" onClick={handleClose} edge="end" aria-label="Fermer">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* Level 2 Body */}
          <List disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
            {/* Top Action: Voir tout dans cette catégorie */}
            <ListItem disablePadding sx={{ p: 1.5, pb: 1 }}>
              <ListItemButton
                onClick={() => {
                  handleClose();
                  onCategorySelect(drillCategory);
                }}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  border: 1,
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                  },
                }}
              >
                <ListItemAvatar sx={{ minWidth: 50 }}>
                  <Avatar
                    src={drillCategory.image?.url}
                    alt={drillCategory.name}
                    variant="rounded"
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: 'background.paper',
                      '& img': { objectFit: 'cover' },
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                      }}
                    >
                      {drillCategory.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {drillCategory.description ?? t(Labels.shop_browse_products)}
                    </Typography>
                  }
                />
                <ArrowForwardIcon color="primary" fontSize="small" />
              </ListItemButton>
            </ListItem>

            <Typography
              variant="overline"
              color="text.secondary"
              sx={{
                display: 'block',
                px: 2.5,
                pt: 1,
                pb: 0.5,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              {t(Labels.shop_all_subcategories)}
            </Typography>

            <Divider sx={{ mb: 0.5, borderColor: subtleBorderColor }} />

            {/* Subcategories list */}
            {(drillCategory.subcategories ?? []).map((sub: ProductCategory) => {
              const subIconComponent = sub.icon && iconMap[sub.icon as IconName];
              return (
                <ListItem key={sub.slug} disablePadding>
                  <ListItemButton
                    onClick={() => handleSubcategoryClick(drillCategory, sub.slug)}
                    sx={{ py: 1.25, px: 2.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {subIconComponent ? (
                        <StyledIcon icon={subIconComponent} sx={{ fontSize: '1.05rem', color: 'primary.main' }} />
                      ) : (
                        <ChevronRightIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: 'text.primary',
                          }}
                        >
                          {sub.name}
                        </Typography>
                      }
                    />
                    <ChevronRightIcon color="action" fontSize="small" />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Stack>
      )}
    </Drawer>
  );
};

export default memo(ShopCategoryDrawer);
