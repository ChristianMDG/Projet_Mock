import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProducts, useCategories } from '@/hooks/cms.hooks';
import { generateRoute } from '@/constants/routes';
import type { Category, Product, SortOption } from '@/models/Shop';
import type { ProductFilters } from '@/types/cms.types';

/**
 * Hook for the ShopPage (categories listing only).
 * No products fetching — just categories + navigation.
 */
export function useShopPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const { data: rawCategories = [], isPending: isCategoriesPending, isSuccess: isCategoriesSuccess } = useCategories();

  const categories = useMemo(() => {
    const map = new Map<string, Category>();
    rawCategories.forEach(cat => {
      if (cat.slug) {
        map.set(cat.slug, cat);
      }
    });
    return Array.from(map.values());
  }, [rawCategories]);

  const navigateToCategory = useCallback(
    (category: Category) => {
      navigate(generateRoute.shopCategory(category.slug, i18n.language));
    },
    [navigate, i18n.language],
  );

  return {
    categories,
    isCategoriesPending,
    isCategoriesSuccess,
    navigateToCategory,
  };
}

export type PriceRangeOption = 'all' | 'under-50k' | '50k-200k' | 'above-200k';

/**
 * Hook for ShopProductsPage (products filtered by category).
 * Performs filtering and sorting on the server via query params,
 * supplemented with instant Algolia-style client search & facets.
 */
export function useShopProductsPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { slug: categorySlug = '' } = useParams<{ slug: string }>();
  const productsRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Reset selected subcategories when active category changes
  useEffect(() => {
    setSelectedSubcategories([]);
  }, [categorySlug]);

  // Server-side filters passed to useProducts
  const serverFilters = useMemo<ProductFilters>(() => {
    const filters: ProductFilters = {
      sort: sortBy,
    };
    if (selectedSubcategories.length > 0) {
      filters.subcategorySlugs = selectedSubcategories;
    } else if (categorySlug) {
      filters.categorySlugs = [categorySlug];
    }
    if (priceRange === 'under-50k') {
      filters.priceMax = 50000;
    } else if (priceRange === '50k-200k') {
      filters.priceMin = 50000;
      filters.priceMax = 200000;
    } else if (priceRange === 'above-200k') {
      filters.priceMin = 200000;
    }
    return filters;
  }, [categorySlug, selectedSubcategories, sortBy, priceRange]);

  const { data: rawCategories = [], isPending: isCategoriesPending, isSuccess: isCategoriesSuccess } = useCategories();
  const {
    data: rawProducts = [],
    isPending: isProductsPending,
    isSuccess: isProductsSuccess,
  } = useProducts(serverFilters);

  const categories = useMemo(() => {
    const map = new Map<string, Category>();
    rawCategories.forEach(cat => {
      if (cat.slug) {
        map.set(cat.slug, cat);
      }
    });
    return Array.from(map.values());
  }, [rawCategories]);

  const selectedCategory = useMemo(() => categories.find(c => c.slug === categorySlug), [categories, categorySlug]);

  const activeSubcategories = useMemo(() => selectedCategory?.subcategories ?? [], [selectedCategory]);

  // Client-side instant filtering for Algolia-style reactive responsiveness
  const { products, searchTimeMs } = useMemo(() => {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const query = searchQuery.trim().toLowerCase();
    const words = query.split(/\s+/).filter(Boolean);

    let result = rawProducts;

    if (words.length > 0) {
      result = result.filter(product => {
        const title = product.name.toLowerCase();
        const desc = (product.description ?? '').toLowerCase();
        const shortDesc = (product.shortDescription ?? '').toLowerCase();
        const catName = (product.category?.name ?? '').toLowerCase();
        const tags = (product.tags ?? []).join(' ').toLowerCase();

        return words.every(
          w =>
            title.includes(w) || desc.includes(w) || shortDesc.includes(w) || catName.includes(w) || tags.includes(w),
        );
      });
    }

    if (priceRange === 'under-50k') {
      result = result.filter(p => p.price < 50000);
    } else if (priceRange === '50k-200k') {
      result = result.filter(p => p.price >= 50000 && p.price <= 200000);
    } else if (priceRange === 'above-200k') {
      result = result.filter(p => p.price > 200000);
    }

    if (inStockOnly) {
      result = result.filter(p => p.inStock && p.stockQuantity > 0);
    }

    const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const elapsed = Math.max(2, Math.round(endTime - startTime));

    return { products: result, searchTimeMs: elapsed };
  }, [rawProducts, searchQuery, priceRange, inStockOnly]);

  const handleProductClick = useCallback(
    (product: Product) => {
      if (product.slug) {
        navigate(generateRoute.shopProduct(product.slug, i18n.language));
      }
    },
    [navigate, i18n.language],
  );

  const navigateToCategory = useCallback(
    (category: Category) => {
      navigate(generateRoute.shopCategory(category.slug, i18n.language));
    },
    [navigate, i18n.language],
  );

  const toggleSubcategory = useCallback((subSlug: string) => {
    setSelectedSubcategories(prev => {
      const isSelected = prev.includes(subSlug);
      if (isSelected) {
        return prev.filter(s => s !== subSlug);
      }
      return [...prev, subSlug];
    });
  }, []);

  const clearSubcategories = useCallback(() => {
    setSelectedSubcategories([]);
  }, []);

  const toggleInStockOnly = useCallback(() => {
    setInStockOnly(prev => !prev);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedSubcategories([]);
    setPriceRange('all');
    setInStockOnly(false);
  }, []);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedSubcategories.length > 0 || priceRange !== 'all' || inStockOnly,
  );

  return {
    productsRef,
    categorySlug,
    categories,
    selectedCategory,
    activeSubcategories,
    selectedSubcategories,
    products,
    allProducts: rawProducts,
    productCount: products.length,
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
  };
}
