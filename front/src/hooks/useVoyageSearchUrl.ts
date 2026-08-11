import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import {
  buildVoyageSearchQuery,
  parseVoyageSearchQuery,
  VoyageSearchUrlMapping,
  VoyageSearchUrlParams,
} from '@/utils/voyageSearchUrl';

export function useVoyageSearchUrl() {
  const { t } = useTranslation();

  const urlMapping: VoyageSearchUrlMapping = useMemo(
    () => ({
      from: t(Labels.url_param_from),
      to: t(Labels.url_param_to),
      date: t(Labels.url_param_date),
      pax: t(Labels.url_param_pax),
      k: t(Labels.url_param_k),
    }),
    [t],
  );

  const buildUrlQuery = useCallback(
    (params: VoyageSearchUrlParams) => {
      return buildVoyageSearchQuery(params, urlMapping);
    },
    [urlMapping],
  );

  const parseUrlQuery = useCallback(
    (searchParams: URLSearchParams) => {
      return parseVoyageSearchQuery(searchParams, urlMapping);
    },
    [urlMapping],
  );

  return {
    urlMapping,
    buildUrlQuery,
    parseUrlQuery,
  };
}
