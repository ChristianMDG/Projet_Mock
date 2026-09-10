import React, { memo } from 'react';
import { Card, Stack, Typography, Chip, Button, Paper, CircularProgress } from '@mui/material';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import FlashOn from '@mui/icons-material/FlashOn';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Inventory from '@mui/icons-material/Inventory';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';
import { formatPrice } from './utils';
import SellerInfo from './SellerInfo';
import Labels from '@/labelKeys.json';
import type { Product } from '@/models/Shop';

interface ProductBuyBoxProps {
  product: Product;
  price: number;
  originalPrice: number;
  hasOriginalPrice: boolean;
  hasWeight: boolean;
  isAddingToCart: boolean;
  isBuyingNow: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const ProductBuyBox: React.FC<ProductBuyBoxProps> = ({
  product,
  price,
  originalPrice,
  hasOriginalPrice,
  hasWeight,
  isAddingToCart,
  isBuyingNow,
  onAddToCart,
  onBuyNow,
}) => {
  const { t } = useTranslation();
  const hasCategory = Boolean(product.category?.name);
  const hasShortDescription = Boolean(product.shortDescription);
  const hasDiscount = Boolean(product.discountPercentage && product.discountPercentage > 0);
  const isInStock = Boolean(product.inStock);
  const isActionDisabled = isAddingToCart || isBuyingNow;

  return (
    <Card
      sx={{
        position: { md: 'sticky' },
        top: { md: 88 },
        p: { xs: 2, md: 2.5 },
      }}
    >
      <Stack spacing={2}>
        {/* Category & Status */}
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          {hasCategory && <Chip label={product.category!.name} color="primary" size="small" />}
          {isInStock && (
            <Chip
              icon={<CheckCircle fontSize="small" />}
              label={t(Labels.shop_stock_available)}
              color="success"
              size="small"
            />
          )}
        </Stack>

        {/* Title & Short Description */}
        <Stack spacing={0.5}>
          <Typography variant="h5" component="h1">
            {product.name}
          </Typography>
          {hasShortDescription && <Typography variant="body2">{product.shortDescription}</Typography>}
        </Stack>

        {/* Pricing */}
        <Paper variant="outlined" sx={{ bgcolor: 'action.hover', p: 1.5 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
            <Typography variant="h4" color="primary">
              {formatPrice(price)}
            </Typography>
            {hasOriginalPrice && (
              <>
                <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                  {formatPrice(originalPrice)}
                </Typography>
                {hasDiscount && <Chip label={`-${product.discountPercentage}%`} color="error" size="small" />}
              </>
            )}
          </Stack>
          {hasOriginalPrice && (
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5, fontWeight: 600 }}>
              {t(Labels.shop_save)} {formatPrice(originalPrice - price)}
            </Typography>
          )}
        </Paper>

        {/* Action Buttons */}
        <Stack spacing={1}>
          <Button
            size="medium"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isActionDisabled}
            startIcon={
              isAddingToCart && !isBuyingNow ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <ShoppingCart fontSize="small" />
              )
            }
            onClick={onAddToCart}
          >
            {t(Labels.shop_add_to_cart)}
          </Button>

          <Button
            size="medium"
            variant="contained"
            color="secondary"
            fullWidth
            disabled={isActionDisabled}
            startIcon={isBuyingNow ? <CircularProgress size={18} color="inherit" /> : <FlashOn fontSize="small" />}
            onClick={onBuyNow}
          >
            {t(Labels.shop_buy_now)}
          </Button>
        </Stack>

        {/* Highlights */}
        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'background.default' }}>
          <Stack spacing={0.75}>
            {hasWeight && (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Inventory fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {t(Labels.shop_weight)}: {product.weight}g
                </Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <LocalShipping fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {t(Labels.shop_delivery_voyage)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <SellerInfo product={product} />
      </Stack>
    </Card>
  );
};

export default memo(ProductBuyBox);
