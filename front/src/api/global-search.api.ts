import axios from '@/api/axios';
import { GlobalSearchTabEnum, type GlobalSearchTab, SearchTabEnum } from '@/models/enums';

export { GlobalSearchTabEnum, SearchTabEnum, type GlobalSearchTab };

export interface GlobalSearchHit {
  id: string;
  type: 'VOYAGE' | 'PRODUCT' | 'CATEGORY' | string;
  title: string;
  subtitle?: string;
  badge?: string;
  extraInfo?: string;
  imageUrl?: string;
  slug?: string;
  price?: number;
  availableSeats?: number;
  departureVilleName?: string;
  arrivalVilleName?: string;
  departureDate?: string;
}

export interface GlobalSearchResponse {
  voyages: GlobalSearchHit[];
  products: GlobalSearchHit[];
  categories: GlobalSearchHit[];
  totalVoyages?: number;
  totalProducts?: number;
  totalCategories?: number;
  totalMatches: number;
  tookMs: number;
}

export async function fetchGlobalSearch(query: string, limit = 8): Promise<GlobalSearchResponse> {
  const response = await axios.get<GlobalSearchResponse>('/search', {
    params: {
      query,
      limit,
    },
  });
  return response.data;
}
