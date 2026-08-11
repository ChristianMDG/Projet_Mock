import React, { useCallback, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Fab,
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useVoyages } from '@/hooks/voyage.hooks';
import { useVoyageManagementStore } from '@/stores/voyage-management.store';
import { VoyageFormDrawer, VoyageListTable } from '@/components/voyage';
import ProtectedTx from '@/components/ProtectedTx';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/types';
import SEO from '@/components/shared/SEO';

// Import the components we'll create
const VoyageManagementFilters = React.lazy(() => import('../components/voyage/VoyageManagementFilters'));
const VoyageBulkActions = React.lazy(() => import('../components/voyage/VoyageManagementBulkActions'));
const VoyageCardView = React.lazy(() => import('../components/voyage/VoyageManagementCardView'));
const VoyageCalendarView = React.lazy(() => import('../components/voyage/VoyageManagementCalendarView'));

export const VoyageManagementPage: React.FC = () => {
  const { t } = useTranslation();

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingVoyage, setEditingVoyage] = useState<Voyage | null>(null);

  const {
    filters,
    selectedVoyageIds,
    isFilterDrawerOpen,
    currentPage,
    pageSize,
    viewMode,
    setFilterDrawerOpen,
    setBulkActionDialog,
    setViewMode,
    setFilters,
    toggleVoyageSelection,
    clearSelection,
    resetFilters,
  } = useVoyageManagementStore();

  // Query voyages with pagination and filters
  const { data: voyagesData, isLoading, isError, error, refetch } = useVoyages(currentPage, pageSize);

  const voyages = voyagesData?.content ?? [];
  const totalElements = voyagesData?.totalElements ?? 0;

  const handleViewVoyage = useCallback((_voyage: Voyage) => {
    // Navigate to voyage detail or open a modal
    // Implementation pending
  }, []);

  const handleEditVoyage = useCallback((voyage: Voyage) => {
    setEditingVoyage(voyage);
  }, []);

  const handleCreateVoyage = useCallback(() => {
    setIsCreateDrawerOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleExportVoyages = useCallback(() => {
    // TODO: Implement export functionality
    // Export voyages functionality pending
  }, []);

  const handleImportVoyages = useCallback(() => {
    // TODO: Implement import functionality
    // Import voyages functionality pending
  }, []);

  const activeFiltersCount = React.useMemo(() => {
    let count = 0;
    if (filters.koperativeIds.length > 0) count++;
    if (filters.gareIds.length > 0) count++;
    if (filters.statusFilter.length > 0) count++;
    if (filters.dateRange.startDate || filters.dateRange.endDate) count++;
    if (filters.searchQuery.trim()) count++;
    if (filters.routeFilter.trim()) count++;
    if (filters.showTemplatesOnly || filters.showInstancesOnly) count++;
    return count;
  }, [filters]);

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {t(Labels.error_loading_voyages)}: {(error as Error)?.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <SEO title={t(Labels.voyage_management_title)} />
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t(Labels.voyage_management_title)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t(Labels.voyage_management_description)}
        </Typography>
      </Box>
      {/* Action Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid
            container
            spacing={2}
            sx={{
              alignItems: 'center',
            }}
          >
            {/* Filter Toggle */}
            <Grid sx={{ xs: 'auto' }}>
              <Button
                variant={activeFiltersCount > 0 ? 'contained' : 'outlined'}
                startIcon={<FilterListIcon />}
                onClick={() => setFilterDrawerOpen(!isFilterDrawerOpen)}
                sx={{ position: 'relative' }}
              >
                {t(Labels.filters)}
                {activeFiltersCount > 0 && (
                  <Chip
                    size="small"
                    label={activeFiltersCount}
                    color="primary"
                    sx={{
                      ml: 1,
                      height: 16,
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </Button>
            </Grid>

            {/* View Mode Toggles */}
            <Grid sx={{ xs: 'auto' }}>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title={t(Labels.view_mode_table)}>
                  <IconButton color={viewMode === 'table' ? 'primary' : 'default'} onClick={() => setViewMode('table')}>
                    <ViewListIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t(Labels.view_mode_card)}>
                  <IconButton color={viewMode === 'card' ? 'primary' : 'default'} onClick={() => setViewMode('card')}>
                    <ViewModuleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t(Labels.view_mode_calendar)}>
                  <IconButton
                    color={viewMode === 'calendar' ? 'primary' : 'default'}
                    onClick={() => setViewMode('calendar')}
                  >
                    <CalendarIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            {/* Spacer */}
            <Grid sx={{ xs: 12 }} />

            {/* Action Buttons */}
            <Grid sx={{ xs: 'auto' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={t(Labels.refresh)}>
                  <IconButton onClick={handleRefresh} disabled={isLoading}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>

                <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE']}>
                  <Tooltip title={t(Labels.export_voyages)}>
                    <IconButton onClick={handleExportVoyages}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={t(Labels.import_voyages)}>
                    <IconButton onClick={handleImportVoyages}>
                      <UploadIcon />
                    </IconButton>
                  </Tooltip>
                </ProtectedTx>
              </Box>
            </Grid>
          </Grid>

          {/* Selection and Bulk Actions Bar */}
          {selectedVoyageIds.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'medium',
                  }}
                >
                  {selectedVoyageIds.length} {t(Labels.voyages_selected)}
                </Typography>

                <Button variant="outlined" size="small" onClick={() => setBulkActionDialog(true, 'status')}>
                  {t(Labels.bulk_change_status)}
                </Button>

                <ProtectedTx allowedRoles={['ADMIN']}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => setBulkActionDialog(true, 'delete')}
                  >
                    {t(Labels.bulk_delete)}
                  </Button>
                </ProtectedTx>

                <Button variant="outlined" size="small" onClick={() => setBulkActionDialog(true, 'export')}>
                  {t(Labels.bulk_export)}
                </Button>

                <Button variant="text" size="small" onClick={clearSelection}>
                  {t(Labels.clear_selection)}
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
      {/* Loading indicator */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Filters Panel */}
        {isFilterDrawerOpen && (
          <Grid sx={{ xs: 12, lg: 3 }}>
            <React.Suspense fallback={<div>Loading filters...</div>}>
              <VoyageManagementFilters
                filters={filters}
                onFiltersChange={newFilters => setFilters(newFilters)}
                onClearFilters={resetFilters}
              />
            </React.Suspense>
          </Grid>
        )}

        {/* Voyages Display */}
        <Grid sx={{ xs: 12, lg: isFilterDrawerOpen ? 9 : 12 }}>
          {viewMode === 'table' && (
            <VoyageListTable
              voyages={voyages}
              isLoading={isLoading}
              showActions={true}
              onEdit={handleEditVoyage}
              onView={handleViewVoyage}
              title={`${t(Labels.voyage_list_title)} (${totalElements})`}
            />
          )}

          {viewMode === 'card' && (
            <React.Suspense fallback={<div>Loading card view...</div>}>
              <VoyageCardView
                voyages={voyages}
                isLoading={isLoading}
                onVoyageEdit={handleEditVoyage}
                onVoyageView={handleViewVoyage}
                selectedVoyageIds={selectedVoyageIds}
                onVoyageSelect={toggleVoyageSelection}
                onVoyageDelete={handleViewVoyage} // TODO: Implement delete
              />
            </React.Suspense>
          )}

          {viewMode === 'calendar' && (
            <React.Suspense fallback={<div>Loading calendar...</div>}>
              <VoyageCalendarView
                voyages={voyages}
                isLoading={isLoading}
                onVoyageEdit={handleEditVoyage}
                onVoyageView={handleViewVoyage}
                onVoyageDelete={handleViewVoyage}
                selectedVoyageIds={selectedVoyageIds}
                onVoyageSelect={toggleVoyageSelection}
              />
            </React.Suspense>
          )}
        </Grid>
      </Grid>
      {/* Floating Action Button */}
      <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE', 'GUICHET']}>
        <Fab
          color="primary"
          aria-label={t(Labels.button_schedule_voyage)}
          onClick={handleCreateVoyage}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </ProtectedTx>
      {/* Create/Edit Voyage Drawer */}
      <VoyageFormDrawer
        open={isCreateDrawerOpen || !!editingVoyage}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          setEditingVoyage(null);
        }}
        voyage={editingVoyage}
        onSubmit={_voyage => {
          // Handle voyage creation/update
          // Save voyage functionality pending
          setIsCreateDrawerOpen(false);
          setEditingVoyage(null);
          refetch();
        }}
      />
      {/* Bulk Actions Dialog */}
      <React.Suspense fallback={null}>
        <VoyageBulkActions
          selectedCount={selectedVoyageIds.length}
          onBulkCancel={clearSelection}
          onBulkActivate={clearSelection}
          onBulkDeactivate={clearSelection}
          onBulkExport={() => {
            /* Export functionality pending */
          }}
          onBulkStatusChange={() => clearSelection()}
        />
      </React.Suspense>
    </Box>
  );
};

export default VoyageManagementPage;
