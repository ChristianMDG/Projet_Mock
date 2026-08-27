import { useEffect, useMemo, useRef } from 'react';
import { Container } from '@mui/material';
import SearchForm from '@/shared/SearchForm';
import VoyageWeeklySearch from '@/components/VoyageWeeklySearch';
import VoyageWeeklyBanner from '@/components/banner/VoyageWeeklyBanner';
import LiveRoutePricing from '@/components/section/LiveRoutePricing';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useVoyageSearchStore, VoyageSearchState } from '@/stores/voyage-search.store';
import SEO from '@/components/shared/SEO';
import { useSearchParams } from 'react-router-dom';
import { useVilles } from '@/hooks/ville.hooks';
import dayjs from '@/utils/dayjs';
import { useVoyageSearchUrl } from '@/hooks/useVoyageSearchUrl';
import { ROUTES } from '@/constants/routes';
import { trackEvent, useComponentView } from '@/hooks/google-analytics.hook';

export default function VoyageWeeklyPage() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const { data: villes = [] } = useVilles();

  const hasAppliedUrlParams = useRef(false);

  const { hasSearched, fromVille, toVille, setSearchParams } = useVoyageSearchStore();

  useComponentView('Page', 'Voyage Results');

  const queryString = useMemo(() => {
    const qs = searchParams.toString();
    return qs && `?${qs}`;
  }, [searchParams]);

  const seoTitle = useMemo(() => {
    if (fromVille?.name && toVille?.name) {
      return `${fromVille.name} → ${toVille.name}`;
    }
    return t(Labels.voyage_search_title);
  }, [fromVille?.name, toVille?.name, t]);

  const seoDescription = useMemo(() => {
    if (fromVille?.name && toVille?.name) {
      return t(Labels.seo_description_voyage_search_with_cities, { from: fromVille.name, to: toVille.name });
    }
    return t(Labels.seo_description_voyage_search);
  }, [fromVille?.name, toVille?.name, t]);

  const seoCanonicalQueryParams = useMemo(() => {
    return [
      t(Labels.url_param_from),
      t(Labels.url_param_to),
      t(Labels.url_param_date),
      t(Labels.url_param_pax),
      t(Labels.url_param_k),
    ];
  }, [t]);

  const breadcrumbs = useMemo(() => {
    const homePath = ROUTES.home[i18n.language];
    const searchPath = `${ROUTES.searchResults[i18n.language]}${queryString}`;

    const crumbs = [
      { name: t(Labels.nav_home), path: homePath },
      { name: t(Labels.voyage_search_title), path: ROUTES.searchResults[i18n.language] },
    ];

    if (fromVille && toVille) {
      crumbs.push({ name: `${fromVille.name} → ${toVille.name}`, path: searchPath });
    }

    return crumbs;
  }, [fromVille, toVille, i18n.language, queryString, t]);

  const alternates = useMemo(
    () => ({
      mg: `${ROUTES.searchResults.mg}${queryString}`,
      fr: `${ROUTES.searchResults.fr}${queryString}`,
      en: `${ROUTES.searchResults.en}${queryString}`,
    }),
    [queryString],
  );

  const extraKeywords = useMemo(() => {
    const extras: string[] = [];
    if (fromVille?.name) extras.push(fromVille.name);
    if (toVille?.name) extras.push(toVille.name);
    return extras;
  }, [fromVille?.name, toVille?.name]);

  const handleEditSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { parseUrlQuery } = useVoyageSearchUrl();

  useEffect(() => {
    const canApplyParams = !hasAppliedUrlParams.current && villes.length > 0;
    if (canApplyParams) {
      const parsed = parseUrlQuery(searchParams);
      const newParams: Partial<VoyageSearchState> = {};

      if (parsed.fromVilleName && parsed.toVilleName) {
        const foundFromVille = villes.find(v => v.name?.toLowerCase() === parsed.fromVilleName?.toLowerCase());
        const foundToVille = villes.find(v => v.name?.toLowerCase() === parsed.toVilleName?.toLowerCase());

        if (foundFromVille && foundToVille) {
          newParams.fromVille = foundFromVille;
          newParams.toVille = foundToVille;
          newParams.hasSearched = true;
        }
      }

      if (parsed.departureDate) newParams.departureDate = dayjs(parsed.departureDate);
      if (parsed.passengers) newParams.passengers = parsed.passengers;
      if (parsed.koperativeId) newParams.koperativeId = parsed.koperativeId;

      if (Object.keys(newParams).length > 0) {
        setSearchParams(newParams);
        hasAppliedUrlParams.current = true;
      }
    }
  }, [searchParams, villes, setSearchParams, parseUrlQuery]);

  useEffect(() => {
    if (hasSearched) {
      setTimeout(() => document.getElementById('weekly-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [hasSearched]);

  useEffect(() => {
    if (hasSearched && fromVille && toVille) {
      trackEvent('voyage_search', 'Booking', `${fromVille.name} → ${toVille.name}`);
    }
  }, [hasSearched, fromVille, toVille]);

  // Force document title update when fromVille or toVille changes
  useEffect(() => {
    if (fromVille?.name && toVille?.name) {
      const siteName = 'Taxibrousse - National';
      const pageTitle = `${fromVille.name} → ${toVille.name}`;
      document.title = `${pageTitle} | ${siteName}`;
    } else {
      const siteName = 'Taxibrousse - National';
      document.title = `${t(Labels.voyage_search_title)} | ${siteName}`;
    }
  }, [fromVille?.name, toVille?.name, t]);

  return (
    <>
      <SEO
        key={`${fromVille?.id}-${toVille?.id}`}
        title={seoTitle}
        description={seoDescription}
        canonicalQueryParams={seoCanonicalQueryParams}
        alternates={alternates}
        breadcrumbs={breadcrumbs}
        extraKeywords={extraKeywords}
        image="/weekly-voyage-banner.png"
      />
      <VoyageWeeklyBanner />
      <Container
        sx={{
          px: '0 !important',
          maxWidth: 'lg',
        }}
      >
        <SearchForm navigateOnSearch={false} />
        {fromVille && toVille ? (
          <VoyageWeeklySearch onEditSearch={handleEditSearch} />
        ) : (
          <LiveRoutePricing sx={{ my: 4 }} />
        )}
      </Container>
    </>
  );
}
