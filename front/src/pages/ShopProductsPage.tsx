import React from 'react';
import { Stack, Fade, Button, Container, Paper, useTheme, alpha } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShopBanner, ProductGrid, ShopCategoryTabs, ShopAlgoliaSearch, ShopSearchFacets } from '@/components/shop';
import { useShopProductsPage } from '@/hooks/shop.hooks';
import { ProductGridSkeleton } from '@/skeleton';
import ShopProductsPageSkeleton from '@/skeleton/ShopProductsPageSkeleton';
import SEO from '@/components/shared/SEO';
import { ROUTES } from '@/constants/routes';
import { optimizeCloudinaryUrl } from '@/utils/cloudinaryUtils';
import Labels from '@/labelKeys.json';

const ShopProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    productsRef,
    categorySlug,
    categories,
    selectedCategory,
    activeSubcategories,
    selectedSubcategories,
    products,
    allProducts,
    productCount,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    inStockOnly,
    toggleInStockOnly,
    clearAllFilters,
    hasActiveFilters,
    searchTimeMs,
    isCategoriesPending,
    isCategoriesSuccess,
    isProductsPending,
    isProductsSuccess,
    handleProductClick,
    navigateToCategory,
    toggleSubcategory,
    clearSubcategories,
  } = useShopProductsPage();

  const pageTitle = selectedCategory?.name ?? t(Labels.shop_browse_products);
  const shopRoute = ROUTES.shop[i18n.language] ?? ROUTES.shop.mg;
  const subtleBorderColor = alpha(theme.palette.divider, 0.12);

  const categoryImageUrl = selectedCategory?.image?.url;
  const ogImageUrl = categoryImageUrl
    ? optimizeCloudinaryUrl(categoryImageUrl, { width: 1200, height: 630 })
    : undefined;
  const categoryDescription = selectedCategory?.description || `${pageTitle} - Taxibrousse`;

  return (
    <>
      <SEO title={pageTitle} description={categoryDescription} image={ogImageUrl} imageAlt={pageTitle} />

      {isCategoriesPending && <ShopProductsPageSkeleton />}

      {isCategoriesSuccess && (
        <Stack sx={{ pb: 4 }}>
          {/* Top Hero Banner (displays category hero or shop banner) */}
          <ShopBanner category={selectedCategory} />

          <Container maxWidth="lg" sx={{ px: '0 !important', pt: { xs: 2, md: 3 } }}>
            <Stack spacing={{ xs: 2, md: 2.5 }}>
              {/* Unified Filter Container */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  border: 1,
                  borderColor: subtleBorderColor,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                }}
              >
                <Stack spacing={1.5}>
                  {/* Algolia-Style Instant Search Bar */}
                  <ShopAlgoliaSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearchSubmit={setSearchQuery}
                    categories={categories}
                    products={allProducts}
                    onCategorySelect={navigateToCategory}
                    onProductSelect={handleProductClick}
                    isSearching={isProductsPending}
                  />

                  {/* Category Visual Image Strip & Subcategories Drawer */}
                  <ShopCategoryTabs
                    categories={categories}
                    activeCategorySlug={categorySlug}
                    activeSubcategories={activeSubcategories}
                    selectedSubcategorySlugs={selectedSubcategories}
                    onCategoryClick={navigateToCategory}
                    onSubcategoryClick={toggleSubcategory}
                    onClearSubcategories={clearSubcategories}
                    onAllClick={() => navigate(shopRoute)}
                  />

                  {/* Algolia Search Facet Toolbar */}
                  <ShopSearchFacets
                    totalCount={productCount}
                    searchTimeMs={searchTimeMs}
                    searchQuery={searchQuery}
                    onClearSearchQuery={() => setSearchQuery('')}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    inStockOnly={inStockOnly}
                    onToggleInStockOnly={toggleInStockOnly}
                    onClearAllFilters={clearAllFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                </Stack>
              </Paper>

              {/* Navigation Back Button */}
              {Boolean(categorySlug) && (
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(shopRoute)}
                  sx={{ alignSelf: 'flex-start' }}
                  color="primary"
                  size="small"
                >
                  {t(Labels.shop_back_to_shop)}
                </Button>
              )}

              {/* Product Grid / Results Area */}
              <Stack ref={productsRef} spacing={{ xs: 1.5, md: 2 }}>
                {isProductsPending && (
                  <Fade in={isProductsPending} timeout={300} mountOnEnter unmountOnExit>
                    <Stack>
                      <ProductGridSkeleton count={8} />
                    </Stack>
                  </Fade>
                )}

                {isProductsSuccess && (
                  <Fade in={isProductsSuccess} timeout={400} mountOnEnter unmountOnExit>
                    <Stack>
                      <ProductGrid
                        title={undefined}
                        products={products}
                        onProductClick={handleProductClick}
                        onClearFilters={clearAllFilters}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        searchQuery={searchQuery}
                      />
                    </Stack>
                  </Fade>
                )}
              </Stack>
            </Stack>
          </Container>
        </Stack>
      )}
    </>
  );
};

export default ShopProductsPage;
