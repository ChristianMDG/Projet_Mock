import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { CallToAction, PageHeader, Section } from '@/components/section';
import { PageNotFound } from '@/shared';
import DynamicPageSkeleton from '@/skeleton/DynamicPageSkeleton';
import { useDynamicPageBySlug } from '@/hooks/dynamic-page.hooks';
import { DynamicPageSection } from '@/api/dynamic-page.api';
import SEO from '@/components/shared/SEO';

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useDynamicPageBySlug(slug);

  if (isLoading) return <DynamicPageSkeleton />;
  if (error) return <PageNotFound error={error} />;

  return data?.data ? (
    <Container maxWidth="lg" sx={{ px: '0 !important' }}>
      <SEO
        title={data.data.pageHeader?.title ?? data.data.title ?? 'Page'}
        description={data.data.pageHeader?.description}
        image={data.data.featuredImage?.url}
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
