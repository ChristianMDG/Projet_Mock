import React, { useRef, useState } from 'react';
import { Box, Container, Grid, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShopBanner, ProductGrid, FeaturedProducts, ShopCategoryImageList } from '@/components/shop';
import { buildDefaultFilters, type ShopFilters } from '@/components/shop/utils';
import { useProducts, useCategories } from '@/hooks/cms.hooks';
import { generateRoute } from '@/constants/routes';
import type { Product } from '@/models/Shop';
import { ShopPageSkeleton, ProductGridSkeleton } from '@/skeleton';
import SEO from '@/components/shared/SEO';
import Labels from '@/labelKeys.json';

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const productsRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<ShopFilters>(() => buildDefaultFilters(500000));

  const { data: products = [], isPending: isProductsPending } = useProducts(filters);
  const { isPending: isCategoriesPending } = useCategories();
  const hasCategoriesLoaded = !isCategoriesPending;

  const handleProductClick = (product: Product) => {
    navigate(generateRoute.shopProduct(product.slug, i18n.language));
  };

  const handleBrowse = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasFilterSelected = Boolean(filters.categorySlugs.length > 0 || filters.subcategorySlugs.length > 0);

  return (
    <>
      <SEO title={t(Labels.shop_nav_label)} />

      {isCategoriesPending && <ShopPageSkeleton />}

      {hasCategoriesLoaded && (
        <Box sx={{ py: 1 }}>
          <ShopBanner onBrowse={handleBrowse} />
          <Container maxWidth="lg">
            <ShopCategoryImageList
              filters={filters}
              onChange={setFilters}
              onCategoryClick={() => productsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            />
            {hasFilterSelected && (
              <Grid container spacing={3} ref={productsRef} sx={{ mt: 1 }}>
                {/* Products column */}
                <Grid size={12}>
                  <Fade in={isProductsPending} timeout={300} mountOnEnter unmountOnExit>
                    <Box>
                      <ProductGridSkeleton count={8} />
                    </Box>
                  </Fade>

                  <Fade in={!isProductsPending} timeout={400} mountOnEnter unmountOnExit>
                    <Box>
                      <ProductGrid products={products} onProductClick={handleProductClick} />
                      <FeaturedProducts products={products} onProductClick={handleProductClick} />
                    </Box>
                  </Fade>
                </Grid>
              </Grid>
            )}
          </Container>
        </Box>
      )}
    </>
  );
};

export default ShopPage;
