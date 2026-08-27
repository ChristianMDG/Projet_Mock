import { useQuery, UseQueryResult, skipToken } from '@tanstack/react-query';
import {
  getFrequentlyBoughtTogether,
  getPersonalizedRecommendations,
  getRelatedProducts,
} from '@/api/recommendation.api';
import type { Product } from '@/models/Shop';

export function useRelatedProducts(productId?: number, limit = 8): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['recommendations', 'related', productId, limit],
    queryFn: productId === undefined ? skipToken : () => getRelatedProducts(productId, limit),
  });
}

export function useFrequentlyBoughtTogether(productId?: number, limit = 6): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['recommendations', 'fbt', productId, limit],
    queryFn: productId === undefined ? skipToken : () => getFrequentlyBoughtTogether(productId, limit),
  });
}

export function usePersonalizedRecommendations(limit = 12, enabled = true): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['recommendations', 'personalized', limit],
    queryFn: () => getPersonalizedRecommendations(limit),
    enabled,
  });
}
