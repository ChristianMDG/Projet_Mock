import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  Grid,
  Stack,
  Box,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import FlashOn from '@mui/icons-material/FlashOn';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Inventory from '@mui/icons-material/Inventory';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';
import { useProductBySlug } from '@/hooks/cms.hooks';
import { useAddCartItem } from '@/hooks/cart.hooks';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import {
  formatPrice,
  ProductSpecifications,
  SellerInfo,
  ProductImageGallery,
  RelatedProducts,
} from '@/components/shop';
import SEO from '@/components/shared/SEO';
import { ROUTES, generateRoute } from '@/constants/routes';
import { ProductDetailSkeleton } from '@/skeleton';
import Labels from '@/labelKeys.json';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const setDrawerOpen = useCartStore(state => state.setDrawerOpen);
  const setActiveStep = useCheckoutStore(state => state.setActiveStep);
  const { mutateAsync: addCartItemMutation, isPending: isAddingToCart } = useAddCartItem();
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const { data: product, isLoading, isPending } = useProductBySlug(slug);
  const { price, originalPrice, hasOriginalPrice, discount, hasParentCategory, hasWeight } = useMemo(() => {
    const priceValue = Number(product?.price ?? 0);
    const originalPriceValue = product?.originalPrice === undefined ? undefined : Number(product.originalPrice);
    const hasOriginal = originalPriceValue !== undefined && originalPriceValue > priceValue;
    return {
      price: priceValue,
      originalPrice: hasOriginal ? originalPriceValue : 0,
      hasOriginalPrice: hasOriginal,
      discount: hasOriginal ? Math.round(((originalPriceValue - priceValue) / originalPriceValue) * 100) : 0,
      hasParentCategory: Boolean(product?.category?.category),
      hasWeight: typeof product?.weight === 'number',
    };
  }, [product]);

  const handleAddToCart = async () => {
    if (product) {
      addItem(product, 1);
      try {
        await addCartItemMutation({ productId: product.id, quantity: 1 });
      } catch (err) {
        console.error(err);
      }
      setDrawerOpen(true);
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      setIsBuyingNow(true);
      addItem(product, 1);
      try {
        await addCartItemMutation({ productId: product.id, quantity: 1 });
      } catch (err) {
        console.error(err);
      } finally {
        setIsBuyingNow(false);
      }
      setActiveStep(0);
      navigate(ROUTES.shopCheckout[i18n.language]);
    }
  };

  if (isLoading || isPending) {
    return <ProductDetailSkeleton />;
  }

  if (product) {
    const shopHref = ROUTES.shop[i18n.language];
    const goToShop = () => navigate(shopHref);

    return (
      <>
        <SEO title={product.name} />

        <Breadcrumbs separator={<ChevronRight fontSize="small" color="action" />} sx={{ mb: 3 }}>
          <MuiLink component="button" underline="hover" color="inherit" onClick={goToShop}>
            {t(Labels.shop_nav_label)}
          </MuiLink>
          {hasParentCategory && (
            <MuiLink component="button" underline="hover" color="inherit" onClick={goToShop}>
              {product.category?.category?.name}
            </MuiLink>
          )}
          {product.category?.name && (
            <MuiLink component="button" underline="hover" color="inherit" onClick={goToShop}>
              {product.category.name}
            </MuiLink>
          )}
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Gallery */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ProductImageGallery
              images={product.images ?? []}
              alt={product.name}
              badges={
                <>
                  {product.isNew && <Chip label={t(Labels.shop_badge_new)} color="success" size="small" />}
                  {discount > 0 && <Chip label={`-${discount}%`} color="error" size="small" />}
                </>
              }
            />
          </Grid>

          {/* Product Info & Actions */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2.5}>
              {product.category?.name && (
                <Box>
                  <Chip label={product.category.name} color="primary" variant="outlined" size="small" />
                </Box>
              )}

              <Typography variant="h4" component="h1">
                {product.name}
              </Typography>

              {/* Pricing */}
              <Box>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'baseline' }}>
                  <Typography variant="h4" color="primary">
                    {formatPrice(price)}
                  </Typography>
                  {hasOriginalPrice && (
                    <>
                      <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {formatPrice(originalPrice)}
                      </Typography>
                      <Chip label={`-${discount}%`} color="error" size="small" />
                    </>
                  )}
                </Stack>

                {hasOriginalPrice && (
                  <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                    {t(Labels.shop_save)} {formatPrice(originalPrice - price)}
                  </Typography>
                )}
              </Box>

              <Divider />

              {product.description && (
                <Typography variant="body1" color="text.secondary">
                  {product.description}
                </Typography>
              )}

              {/* Highlights */}
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1}>
                  {hasWeight && (
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Inventory fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {t(Labels.shop_weight)}: {product.weight}g
                      </Typography>
                    </Stack>
                  )}
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <LocalShipping fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {t(Labels.shop_delivery_voyage)}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>

              {/* Actions */}
              <Stack spacing={1.5}>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isAddingToCart || isBuyingNow}
                  startIcon={
                    isAddingToCart && !isBuyingNow ? <CircularProgress size={20} color="inherit" /> : <ShoppingCart />
                  }
                  onClick={handleAddToCart}
                >
                  {t(Labels.shop_add_to_cart)}
                </Button>

                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={isAddingToCart || isBuyingNow}
                  startIcon={isBuyingNow ? <CircularProgress size={20} color="inherit" /> : <FlashOn />}
                  onClick={handleBuyNow}
                >
                  {t(Labels.shop_buy_now)}
                </Button>
              </Stack>

              <SellerInfo product={product} />
            </Stack>
          </Grid>
        </Grid>

        <ProductSpecifications product={product} />
        <RelatedProducts
          product={product}
          onProductClick={p => p.slug && navigate(generateRoute.shopProduct(p.slug, i18n.language))}
        />
      </>
    );
  }

  return (
    <Box sx={{ maxWidth: 'sm', mx: 'auto', py: 8, textAlign: 'center' }}>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {t(Labels.shop_product_not_found)}
      </Typography>
      <Button variant="contained" onClick={() => navigate(ROUTES.shop[i18n.language])}>
        {t(Labels.shop_back_to_shop)}
      </Button>
    </Box>
  );
};

export default ProductDetailPage;
