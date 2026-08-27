import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import KoperativeListSkeleton from '@/skeleton/KoperativeListSkeleton';
import KoperativeFilterForm from './koperative/KoperativeFilterForm';
import { useTopKoperatives, useKoperativesCount } from '@/hooks/koperative.hooks';
import { KoperativeFilter } from '@/types/type.util';
import { Koperative } from '@/types';
import useKoperativePageStore from '@/stores/koperative.store';
import KoperativeGrid from '@/components/koperative/KoperativeGrid';
import ViewToggle from '@/components/koperative/ViewToggle';
import KoperativeBanner from '@/components/banner/KoperativeBanner';
import Section from '@/components/section/Section';

import KoperativeFormDrawer from './koperativeDetail/KoperativeFormDrawer';
import KoperativeList from '@/components/koperative/KoperativeList';
import { SECTION_TYPES } from '@/constants';
import HydrationSafe from '@/components/shared/HydrationSafe';
import SEO from '@/components/shared/SEO';

import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { generateRoute } from '@/constants/routes';

const KoperativePage = () => {
  const { t, i18n } = useTranslation();
  // --- ZUSTAND STATE ---
  const {
    drawerOpen,
    filterParams,
    koperativeForm,
    selectedId,
    viewMode,
    setDrawerOpen,
    setFilterParams,
    setKoperativeForm,
    setSelectedId,
    setViewMode,
    resetFilter,
  } = useKoperativePageStore();

  // --- HOOKS ---
  const { data: koperatives, isLoading, error } = useTopKoperatives(filterParams);
  const { data: koperativesCount } = useKoperativesCount();
  const navigate = useNavigate();

  const handlers = {
    handleEditOpen: (k: Koperative) => {
      setKoperativeForm(k);
      setDrawerOpen(true);
    },
    handleAddOpen: () => {
      setKoperativeForm({});
      setDrawerOpen(true);
    },
    handleDrawerClose: () => {
      setDrawerOpen(false);
      setKoperativeForm({});
    },
    handleSelectKoperative: (k: Koperative) => {
      if (k.slug) {
        setSelectedId(k.id);
        navigate(generateRoute.koperativeDetail(k.slug, i18n.language));
      }
    },
    setKoperativeFilter: (filter: Partial<KoperativeFilter>) => {
      setFilterParams(filter);
    },
    resetKoperativeFilter: () => {
      resetFilter();
    },
    setKoperativeViewMode: (mode: 'grid' | 'list') => {
      setViewMode(mode);
    },
  };

  return (
    <>
      <SEO title={t(Labels.menu_koperatives)} />
      <KoperativeBanner />
      <Container maxWidth="lg" sx={{ p: 0, pt: 2 }}>
        <KoperativeFilterForm
          filter={filterParams}
          setKoperativeFilter={handlers.setKoperativeFilter}
          onReset={handlers.resetKoperativeFilter}
          onAdd={handlers.handleAddOpen}
          isLoading={isLoading}
        />

        {/* View Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <ViewToggle
            viewMode={viewMode}
            onViewModeChange={handlers.setKoperativeViewMode}
            count={koperativesCount ?? 0}
          />
        </Box>

        {/* Content Based on View Mode */}
        <HydrationSafe fallback={<KoperativeListSkeleton count={4} />}>
          {isLoading || error ? (
            <KoperativeListSkeleton count={4} />
          ) : (
            <>
              {viewMode === 'grid' ? (
                <KoperativeGrid
                  koperatives={koperatives ?? []}
                  onSelect={handlers.handleSelectKoperative}
                  onEdit={handlers.handleEditOpen}
                  isEmpty={!koperatives?.length}
                />
              ) : (
                <KoperativeList
                  koperatives={koperatives ?? []}
                  selectedId={selectedId?.toString()}
                  onSelect={handlers.handleSelectKoperative}
                  onEdit={handlers.handleEditOpen}
                  showEditButton={true}
                  isEmpty={!koperatives?.length}
                />
              )}
            </>
          )}
        </HydrationSafe>

        <KoperativeFormDrawer open={drawerOpen} onClose={handlers.handleDrawerClose} initialData={koperativeForm} />

        {/* Statistics section for trust indicators */}
        <Box sx={{ mt: 6 }}>
          <Section
            section={{
              id: 1,
              __component: 'page.section-reference',
              sectionTitle: '',
              sectionType: SECTION_TYPES.STATISTICS_SECTION,
            }}
          />
        </Box>

        {/* Network section for company information */}
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

export default KoperativePage;
