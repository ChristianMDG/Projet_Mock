import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, CardActionArea } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatPrice } from './utils';
import Labels from '@/labelKeys.json';

import type { Product } from '@/models/Shop';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t } = useTranslation();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'none',
      }}
    >
      <CardActionArea
        onClick={() => onClick?.(product)}
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          '&:hover .MuiCardActionArea-focusHighlight': { opacity: 0.08 },
          '& .MuiCardActionArea-focusHighlight': { bgcolor: 'primary.main' },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="div"
            sx={{
              aspectRatio: '4 / 3',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {product.images?.[0]?.url ? (
              <Box
                component="img"
                src={product.images[0].url}
                alt={product.name}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box sx={{ color: 'text.disabled', fontSize: 48, lineHeight: 1 }}>📦</Box>
            )}
          </CardMedia>
          <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {product.isNew && <Chip label={t(Labels.shop_badge_new)} color="success" size="small" />}
            {discount > 0 && <Chip label={`-${discount}%`} color="error" size="small" />}
          </Box>
        </Box>
        <CardContent sx={{ flexGrow: 1, pb: 1, px: 1.5 }}>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
            {product.category?.name}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5, lineHeight: 1.3 }}>
            {product.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.shortDescription}
          </Typography>
        </CardContent>
        <Box
          sx={{
            px: 1.5,
            pb: 1.5,
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {formatPrice(product.price)}
          </Typography>
          {product.originalPrice && (
            <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice)}
            </Typography>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
