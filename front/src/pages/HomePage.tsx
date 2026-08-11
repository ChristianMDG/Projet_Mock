import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import HeroSearch from '@/components/HeroSearch';
import PaymentMethods from '@/components/payment/PaymentMethods';
import { Section, LiveRoutePricing } from '@/components/section';
import SEO from '@/components/shared/SEO';
import { HOME_PAGE_ESSENTIAL_SECTIONS } from '@/constants';

import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t(Labels.nav_home)} />
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

        <Box sx={{ mt: 4, mb: 4 }}>
          <PaymentMethods />
        </Box>
      </Container>
    </>
  );
}
