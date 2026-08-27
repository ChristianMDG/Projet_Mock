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
