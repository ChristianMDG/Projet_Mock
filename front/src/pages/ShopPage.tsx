import React from 'react';
import { Stack, Fade, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShopBanner, ShopCategoryImageList, FeaturedProducts } from '@/components/shop';
import { useShopPage } from '@/hooks/shop.hooks';
import { useProducts } from '@/hooks/cms.hooks';
import { ShopPageSkeleton } from '@/skeleton';
import SEO from '@/components/shared/SEO';
import Labels from '@/labelKeys.json';
import { generateRoute } from '@/constants/routes';
import type { Product } from '@/models/Shop';

const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { categories, isCategoriesPending, isCategoriesSuccess, navigateToCategory } = useShopPage();
  const { data: products = [] } = useProducts();

  const handleProductClick = (product: Product) => {
    if (product.slug) {
      navigate(generateRoute.shopProduct(product.slug, i18n.language));
    }
  };

  return (
    <>
      <SEO
        title={t(Labels.shop_nav_label)}
        description={t(
          Labels.shop_banner_subtitle,
          'Achetez vos produits en ligne et faites-vous livrer en taxi-brousse',
        )}
        image="/images/shop-banner.jpg"
      />

      {isCategoriesPending && <ShopPageSkeleton />}

      {isCategoriesSuccess && (
        <Fade in={isCategoriesSuccess} timeout={300}>
          <Stack>
            <ShopBanner />

            <Container maxWidth="lg" sx={{ px: '0 !important' }}>
              <Stack spacing={{ xs: 3, md: 4 }} sx={{ py: { xs: 3, md: 4 } }}>
                <ShopCategoryImageList categories={categories} onCategoryClick={navigateToCategory} />

                <FeaturedProducts products={products} onProductClick={handleProductClick} />
              </Stack>
            </Container>
          </Stack>
        </Fade>
      )}
    </>
  );
};

export default ShopPage;
