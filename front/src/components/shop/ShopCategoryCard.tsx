import React, { memo } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Category } from '@/models/Shop';
import { Icon } from '@/shared/IconMapper';
import Labels from '@/labelKeys.json';

interface ShopCategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick: (category: Category) => void;
}

const ShopCategoryCard: React.FC<ShopCategoryCardProps> = ({ category, isSelected, onClick }) => {
  const { t } = useTranslation();
  const hasImage = Boolean(category.image?.url);
  const subCount = category.subcategories?.length ?? 0;
  const hasSubs = subCount > 0;

  return (
    <Card
      elevation={0}
      sx={{
        height: 1,
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none',
        bgcolor: isSelected ? 'action.selected' : 'background.paper',
        '&:hover': {
          boxShadow: 'none',
        },
      }}
    >
      <CardActionArea
        onClick={() => onClick(category)}
        sx={{
          height: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        {hasImage && category.image?.url ? (
          <CardMedia
            component="img"
            image={category.image.url}
            alt={category.name}
            loading="lazy"
            sx={{
              width: 1,
              height: { xs: 90, sm: 100 },
              objectFit: 'cover',
            }}
          />
        ) : (
          <CardContent
            sx={{
              height: { xs: 90, sm: 100 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
              color: 'primary.main',
            }}
          >
            <Icon iconName={category.icon ?? 'Category'} />
          </CardContent>
        )}

        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: { xs: '0.75rem', sm: '0.85rem' } }} noWrap>
            {category.name}
          </Typography>
          {hasSubs && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
              {subCount} {t(Labels.shop_items, { count: subCount })}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default memo(ShopCategoryCard);
