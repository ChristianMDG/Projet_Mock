import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import CallToAction from '@/components/section/CallToAction';
import PageHeader from '@/components/section/PageHeader';
import Section from '@/components/section/Section';
import { PageNotFound } from '@/shared';
import DynamicPageSkeleton from '@/skeleton/DynamicPageSkeleton';
import { useDynamicPageBySlug } from '@/hooks/dynamic-page.hooks';
import { DynamicPageSection } from '@/api/dynamic-page.api';
import SEO from '@/components/shared/SEO';
import { trackEvent } from '@/hooks/google-analytics.hook';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';
import Labels from '@/labelKeys.json';

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useDynamicPageBySlug(slug);
  const { t } = useTranslation();

  useEffect(() => {
    if (data?.data && slug) {
      const title = data.data.pageHeader?.title ?? data.data.title ?? slug;
      trackEvent('dynamic_page_view', 'Content', title);
    }
  }, [data, slug]);

  if (isLoading) return <DynamicPageSkeleton />;
  if (error) return <PageNotFound error={error} />;

  const pageTitle = data?.data?.pageHeader?.title ?? data?.data?.title ?? 'Page';
  const breadcrumbs = [{ name: t(Labels.nav_home), path: ROUTES.home.fr }, { name: pageTitle }];

  return data?.data ? (
    <Container maxWidth="lg" sx={{ px: '0 !important' }}>
      <SEO
        title={pageTitle}
        description={data.data.pageHeader?.description}
        image={data.data.featuredImage?.url}
        breadcrumbs={breadcrumbs}
      />
      <PageHeader header={data.data.pageHeader} />

      {data.data.sections?.map((section: DynamicPageSection) => (
        <Section key={`${section.__component}-section-${section.id}`} section={section} />
      ))}

      {data.data.callToAction && <CallToAction cta={data.data.callToAction} />}
    </Container>
  ) : (
    <PageNotFound />
  );
};

export default DynamicPage;
