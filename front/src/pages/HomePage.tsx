import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import Section from '@/components/section/Section';
import LiveRoutePricing from '@/components/section/LiveRoutePricing';
import SEO from '@/components/shared/SEO';
import { SECTION_TYPES, HOME_PAGE_ESSENTIAL_SECTIONS } from '@/constants';

import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import HeroSearch from '@/components/HeroSearch';
import { useComponentView } from '@/hooks/google-analytics.hook';
import { ROUTES } from '@/constants/routes';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  useComponentView('Page', 'Home Page');

  const siteSearchUrlTemplate = `${ROUTES.searchResults[i18n.language as keyof typeof ROUTES.searchResults] || ROUTES.searchResults.mg}?${t(Labels.url_param_from)}=ANTANANARIVO&${t(Labels.url_param_to)}={search_term_string}`;

  return (
    <>
      <SEO title={t(Labels.nav_home)} siteSearchUrlTemplate={siteSearchUrlTemplate} />
      <HeroSearch />
      <Container maxWidth="lg" sx={{ px: '0 !important' }}>
        <LiveRoutePricing sx={{ my: 4 }} />
        <Box sx={{ mt: 4 }}>
          {HOME_PAGE_ESSENTIAL_SECTIONS.map((sectionType, index) => (
            <Section
              key={sectionType}
              section={{
                id: index,
                __component: 'page.section-reference',
                sectionTitle: '',
                sectionType,
              }}
              sx={{ mb: 4 }}
            />
          ))}
        </Box>

        <Section
          section={{
            id: -2,
            __component: 'page.section-reference',
            sectionTitle: '',
            sectionType: SECTION_TYPES.PAYMENT_SECTION,
          }}
          sx={{ mt: 4, mb: 4 }}
        />
      </Container>
    </>
  );
}
