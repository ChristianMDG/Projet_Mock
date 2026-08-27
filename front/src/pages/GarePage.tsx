import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { useGares } from '@/hooks/gare.hooks';
import { Gare } from '@/types';
import GareFormDrawer from './gareDetail/GareFormDrawer';
import KoperativeListSkeleton from '@/skeleton/KoperativeListSkeleton';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import useGarePageStore from '@/stores/gare.store';
import GareBanner from '@/components/banner/GareBanner';
import GareListCard from '@/components/gare/GareListCard';
import GareFilterBar from '@/components/gare/GareFilterBar';
import Section from '@/components/section/Section';
import { SECTION_TYPES } from '@/constants';
import SEO from '@/components/shared/SEO';
import { generateRoute } from '@/constants/routes';

const GarePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    drawerOpen,
    filterParams,
    gareForm,
    setDrawerOpen,
    setFilterParams,
    setGareForm,
    setSelectedId,
    resetFilter,
  } = useGarePageStore();

  const { data: gares, isLoading, error } = useGares(filterParams, false);

  const garesWithImages = useMemo(
    () =>
      (gares ?? []).map(currentGare => ({
        gare: currentGare,
        coverImage: currentGare.photo?.url,
      })),
    [gares],
  );

  const handleEditOpen = (g: Gare) => {
    setGareForm(g);
    setDrawerOpen(true);
  };

  const handleAddOpen = () => {
    setGareForm({});
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setGareForm({});
  };

  const handleSelectGare = (gare: Gare) => {
    if (gare.id) {
      setSelectedId(gare.id);
      navigate(generateRoute.gareDetail(gare.id, i18n.language));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <KoperativeListSkeleton count={4} />;
    }

    if (error) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {t(Labels.gare_page_error_loading)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error.message}
          </Typography>
        </Paper>
      );
    }

    if (garesWithImages.length === 0) {
      return (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t(Labels.gare_page_no_results)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(Labels.gare_page_empty_hint)}
          </Typography>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3}>
        {garesWithImages.map(({ gare, coverImage }) => (
          <Grid size={{ xs: 12, sm: 6 }} key={gare.id}>
            <GareListCard
              gare={gare}
              coverImage={coverImage}
              onEdit={handleEditOpen}
              onViewDetails={handleSelectGare}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <SEO title={t(Labels.menu_stations)} />
      <GareBanner />
      <Container maxWidth="lg" sx={{ py: 2, px: { xs: 0 } }}>
        <GareFilterBar
          filter={filterParams}
          onFilterChange={setFilterParams}
          onReset={resetFilter}
          onAdd={handleAddOpen}
          isLoading={isLoading}
        />

        <Box sx={{ mb: 3 }}>{renderContent()}</Box>

        <GareFormDrawer open={drawerOpen} onClose={handleDrawerClose} initialData={gareForm} />

        {/* About Us section for company information */}
        <Box sx={{ mt: 6 }}>
          <Section
            section={{
              id: 1,
              __component: 'page.section-reference',
              sectionTitle: '',
              sectionType: SECTION_TYPES.ABOUT_US_SECTION,
            }}
          />
        </Box>

        {/* Network section for station information */}
        <Box sx={{ mt: 4 }}>
          <Section
            section={{
              id: 2,
              __component: 'page.section-reference',
              sectionTitle: '',
              sectionType: SECTION_TYPES.NETWORK_SECTION,
            }}
          />
        </Box>
      </Container>
    </>
  );
};

export default GarePage;
