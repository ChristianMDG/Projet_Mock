import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  type DynamicPageListResponse,
  getDynamicPage,
  getDynamicPageBySlug,
  getDynamicPages,
  getSectionByComponent,
  type SingleDynamicPageResponse,
  type SectionResponse,
} from '@/api/dynamic-page.api';

export function useDynamicPages() {
  const { i18n } = useTranslation();
  return useQuery<DynamicPageListResponse, Error>({
    queryKey: ['cms', 'dynamic-pages', i18n.language],
    queryFn: () => getDynamicPages(i18n.language),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useDynamicPage(id: string) {
  const { i18n } = useTranslation();
  return useQuery<SingleDynamicPageResponse, Error>({
    queryKey: ['cms', 'dynamic-page', id, i18n.language],
    queryFn: () => getDynamicPage(id, i18n.language),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useDynamicPageBySlug(slug: string | undefined) {
  const { i18n } = useTranslation();
  return useQuery<SingleDynamicPageResponse, Error>({
    queryKey: ['cms', 'dynamic-page', slug, i18n.language],
    queryFn: () => getDynamicPageBySlug(slug ?? '', i18n.language),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}

export function useSectionByComponent(component: string, slug: string = 'page-template') {
  const { i18n } = useTranslation();
  return useQuery<SectionResponse, Error>({
    queryKey: ['cms', 'section', component, slug, i18n.language],
    queryFn: () => getSectionByComponent(component, i18n.language, slug),
    enabled: !!component,
    staleTime: 15 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
}
