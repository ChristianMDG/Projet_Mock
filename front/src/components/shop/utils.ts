import type { Product, SortOption } from '@/models/Shop';

export interface ShopFilters {
  categorySlugs: string[];
  subcategorySlugs: string[];
  priceMin: number;
  priceMax: number;
  types: string[];
  sizes: string[];
}

export const buildDefaultFilters = (maxPrice: number): ShopFilters => ({
  categorySlugs: [],
  subcategorySlugs: [],
  priceMin: 0,
  priceMax: maxPrice,
  types: [],
  sizes: [],
});

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-MG').format(price) + ' Ar';
};

export const sortProducts = (products: Product[], sortBy: SortOption): Product[] => {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case 'best-seller':
      return sorted.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'relevance':
    default:
      return sorted;
  }
};
