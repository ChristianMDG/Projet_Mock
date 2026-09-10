import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Chip, Breadcrumbs, Link as MuiLink, Grid, Container, Paper, Button } from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';
import { useProductBySlug } from '@/hooks/cms.hooks';
import { useAddCartItem } from '@/hooks/cart.hooks';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import {
  ProductSpecifications,
  ProductImageGallery,
  RelatedProducts,
  ProductBuyBox,
  ProductDescription,
} from '@/components/shop';
import SEO from '@/components/shared/SEO';
import { ROUTES, generateRoute } from '@/constants/routes';
import { ProductDetailSkeleton } from '@/skeleton';
import { optimizeCloudinaryUrl } from '@/utils/cloudinaryUtils';
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

  const { price, originalPrice, hasOriginalPrice, hasParentCategory, hasWeight } = useMemo(() => {
    const priceValue = Number(product?.price ?? 0);
    const originalPriceValue = product?.originalPrice === undefined ? undefined : Number(product.originalPrice);
    const hasOriginal = originalPriceValue !== undefined && originalPriceValue > priceValue;
    return {
      price: priceValue,
      originalPrice: hasOriginal ? originalPriceValue : 0,
      hasOriginalPrice: hasOriginal,
      hasParentCategory: Boolean(product?.category?.category),
      hasWeight: typeof product?.weight === 'number',
    };
  }, [product]);

  const hasDiscount = Boolean(product?.discountPercentage && product.discountPercentage > 0);

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
    return (
      <Container maxWidth="lg" sx={{ px: '0 !important' }}>
        <ProductDetailSkeleton />
      </Container>
    );
  }

  if (product) {
    const shopHref = ROUTES.shop[i18n.language];
    const goToShop = () => navigate(shopHref);
    const hasCategory = Boolean(product.category?.name);
    const isNew = Boolean(product.isNew);

    const primaryImageUrl = product.images?.[0]?.url;
    const ogImageUrl = primaryImageUrl
      ? optimizeCloudinaryUrl(primaryImageUrl, { width: 1200, height: 630 })
      : undefined;

    const rawDescription = product.shortDescription || product.description || '';
    const cleanDescription = rawDescription
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const isAvailable = Boolean(product.inStock);
    const availabilityLabel = isAvailable ? t(Labels.shop_stock_available) : t(Labels.shop_out_of_stock);
    const hasPrice = price > 0;
    const currencyCode = product.currency ?? 'MGA';
    const currencyLabel = currencyCode === 'MGA' ? 'Ar' : currencyCode;
    const formattedPrice = hasPrice ? `${new Intl.NumberFormat('fr-MG').format(price)} ${currencyLabel}` : '';

    const productTitle = hasPrice
      ? `${product.name} • ${formattedPrice} (${availabilityLabel})`
      : `${product.name} (${availabilityLabel})`;

    const pricePrefix = hasPrice ? `${formattedPrice} • ${availabilityLabel}` : availabilityLabel;
    const productDescription = cleanDescription
      ? `${pricePrefix} - ${cleanDescription}`
      : `${product.name} • ${pricePrefix}`;

    const canonicalProductUrl = generateRoute.shopProduct(product.slug, i18n.language);

    return (
      <Container maxWidth="lg" sx={{ px: '0 !important' }}>
        <SEO
          title={productTitle}
          description={productDescription}
          image={ogImageUrl}
          imageAlt={product.name}
          type="product"
          productPrice={price}
          productCurrency={currencyCode}
          productAvailability={isAvailable ? 'instock' : 'oos'}
          url={canonicalProductUrl}
        />

        <Breadcrumbs separator={<ChevronRight fontSize="small" />}>
          <MuiLink component="button" onClick={goToShop}>
            {t(Labels.shop_nav_label)}
          </MuiLink>
          {hasParentCategory && (
            <MuiLink component="button" onClick={goToShop}>
              {product.category?.category?.name}
            </MuiLink>
          )}
          {hasCategory && (
            <MuiLink component="button" onClick={goToShop}>
              {product.category!.name}
            </MuiLink>
          )}
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={{ xs: 2.5, md: 4 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <ProductImageGallery
              images={product.images ?? []}
              alt={product.name}
              badges={
                <>
                  {isNew && <Chip label={t(Labels.shop_badge_new)} color="success" size="small" />}
                  {hasDiscount && <Chip label={`-${product.discountPercentage}%`} color="error" size="small" />}
                </>
              }
            />
            <ProductDescription product={product} />
            <ProductSpecifications product={product} />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <ProductBuyBox
              product={product}
              price={price}
              originalPrice={originalPrice}
              hasOriginalPrice={hasOriginalPrice}
              hasWeight={hasWeight}
              isAddingToCart={isAddingToCart}
              isBuyingNow={isBuyingNow}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </Grid>
        </Grid>

        <RelatedProducts
          product={product}
          onProductClick={p => p.slug && navigate(generateRoute.shopProduct(p.slug, i18n.language))}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ px: '0 !important', py: 6 }}>
      <SEO title={t(Labels.shop_product_not_found)} noIndex />
      <Paper variant="outlined" sx={{ maxWidth: 'sm', mx: 'auto', p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t(Labels.shop_product_not_found)}
        </Typography>
        <Button variant="contained" onClick={() => navigate(ROUTES.shop[i18n.language])}>
          {t(Labels.shop_back_to_shop)}
        </Button>
      </Paper>
    </Container>
  );
};

export default ProductDetailPage;
