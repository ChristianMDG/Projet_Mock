import React, { memo } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Chip, Stack, Rating } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatPrice } from './utils';
import Labels from '@/labelKeys.json';
import type { Product } from '@/models/Shop';
import ShopSearchHighlight from './ShopSearchHighlight';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  searchQuery?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, searchQuery }) => {
  const { t } = useTranslation();

  const imageUrl = product.images?.[0]?.url;
  const hasImage = Boolean(imageUrl);
  const hasCategory = Boolean(product.category?.name);
  const hasDiscount = Boolean(product.discountPercentage && product.discountPercentage > 0);
  const isNew = Boolean(product.isNew);
  const isBestSeller = Boolean(product.isBestSeller);
  const hasOriginalPrice = Boolean(product.originalPrice && product.originalPrice > product.price);
  const hasRating = product.rating > 0;
  const isLowStock = product.inStock && product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <Card
      elevation={0}
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none',
        bgcolor: 'background.paper',
        position: 'relative',
        '&:hover': {
          boxShadow: 'none',
        },
      }}
    >
      <CardActionArea
        onClick={() => onClick?.(product)}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: 1,
        }}
      >
        {hasImage ? (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={product.name}
            sx={{
              aspectRatio: '1 / 1',
              width: 1,
              height: 1,
              objectFit: 'cover',
            }}
          />
        ) : (
          <CardContent
            sx={{
              aspectRatio: '1 / 1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'action.hover',
            }}
          >
            <Typography variant="h3" sx={{ color: 'text.disabled', lineHeight: 1 }}>
              📦
            </Typography>
          </CardContent>
        )}

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ position: 'absolute', top: 6, left: 6, flexWrap: 'wrap', zIndex: 1 }}
        >
          {isBestSeller && (
            <Chip
              label={t(Labels.shop_best_seller)}
              color="warning"
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
            />
          )}
          {isNew && (
            <Chip
              label={t(Labels.shop_badge_new)}
              color="success"
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
            />
          )}
          {hasDiscount && (
            <Chip
              label={`-${product.discountPercentage}%`}
              color="error"
              size="small"
              sx={{ fontWeight: 700, fontSize: '0.65rem', height: 20 }}
            />
          )}
        </Stack>

        <CardContent sx={{ flexGrow: 1, p: { xs: 1, sm: 1.5 }, '&:last-child': { pb: { xs: 1, sm: 1.5 } } }}>
          {hasCategory && (
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ letterSpacing: 0.5, display: 'block', fontSize: '0.6rem', lineHeight: 1.5 }}
              noWrap
            >
              {product.category?.name}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              mt: 0.25,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            <ShopSearchHighlight text={product.name} query={searchQuery} />
          </Typography>

          {hasRating && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.5 }}>
              <Rating value={product.rating} precision={0.5} size="small" readOnly sx={{ fontSize: '0.85rem' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                ({product.reviewCount})
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline', mt: 0.5, flexWrap: 'wrap' }}>
            <Typography
              variant="subtitle1"
              color="primary.main"
              sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}
            >
              {formatPrice(product.price)}
            </Typography>
            {hasOriginalPrice && (
              <>
                <Typography
                  variant="caption"
                  sx={{ textDecoration: 'line-through', fontSize: '0.7rem' }}
                  color="text.secondary"
                >
                  {formatPrice(product.originalPrice!)}
                </Typography>
                {hasDiscount && (
                  <Typography variant="caption" color="error.main" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                    -{product.discountPercentage}%
                  </Typography>
                )}
              </>
            )}
          </Stack>

          {isLowStock && (
            <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600, fontSize: '0.65rem', mt: 0.25 }}>
              {t(Labels.shop_low_stock)}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default memo(ProductCard);
