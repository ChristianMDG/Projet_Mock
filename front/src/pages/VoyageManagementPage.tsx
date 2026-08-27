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
import AddIcon from '@mui/icons-material/Add';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadIcon from '@mui/icons-material/Upload';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useTranslation } from 'react-i18next';
import { useVoyages, useScheduleVoyage, useUpdateVoyage } from '@/hooks/voyage.hooks';
import { useVoyageManagementStore } from '@/stores/voyage-management.store';
import { useAuthStore } from '@/stores/auth.store';
import { VoyageFormDrawer, VoyageListTable } from '@/components/voyage';
import ProtectedTx from '@/components/ProtectedTx';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/types';
import { VoyageManager } from '@/models/Voyage';
import SEO from '@/components/shared/SEO';

import VoyageManagementFilters from '../components/voyage/VoyageManagementFilters';
import VoyageBulkActions from '../components/voyage/VoyageManagementBulkActions';
import VoyageCardView from '../components/voyage/VoyageManagementCardView';
import VoyageCalendarView from '../components/voyage/VoyageManagementCalendarView';

export const VoyageManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [editingVoyage, setEditingVoyage] = useState<Voyage | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const koperativeId = user?.koperative?.id;

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

  // Mutations for create and update
  const scheduleVoyageMutation = useScheduleVoyage();
  const updateVoyageMutation = useUpdateVoyage();

  const voyages = voyagesData?.content ?? [];
  const totalElements = voyagesData?.totalElements ?? 0;

  const handleViewVoyage = useCallback((_voyage: Voyage) => {
    // Navigate to voyage detail or open a modal
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

  const handleSaveVoyage = useCallback(
    async (voyage: Partial<Voyage>) => {
      try {
        setErrorMessage('');
        setSuccessMessage('');

        if (voyage.id) {
          await updateVoyageMutation.mutateAsync({
            id: voyage.id,
            voyage,
          });
          setSuccessMessage(t(Labels.voyage_update_success));
        } else {
          const weekdaysArr = voyage.weekdays ? JSON.parse(voyage.weekdays) : [];
          const monthlyDatesArr = voyage.monthlyDates ? JSON.parse(voyage.monthlyDates) : [];

          const scheduleData = VoyageManager.toScheduleFormat(voyage, {
            weekdays: weekdaysArr,
            monthlyDates: monthlyDatesArr,
            recurrenceStartDate: voyage.recurrenceStartDate,
            recurrenceEndDate: voyage.recurrenceEndDate,
          });

          await scheduleVoyageMutation.mutateAsync(scheduleData);
          setSuccessMessage(t(Labels.voyage_create_success));
        }
        setIsCreateDrawerOpen(false);
        setEditingVoyage(null);
        refetch();
      } catch {
        setErrorMessage(t(voyage.id ? Labels.voyage_update_error : Labels.voyage_create_error));
      }
    },
    [updateVoyageMutation, scheduleVoyageMutation, t, refetch],
  );

  const handleExportVoyages = useCallback(() => {
    // Export voyages functionality
  }, []);

  const handleImportVoyages = useCallback(() => {
    // Import voyages functionality
  }, []);

  const activeFiltersCount = [
    filters.koperativeIds.length > 0,
    filters.gareIds.length > 0,
    filters.statusFilter.length > 0,
    filters.dateRange.startDate ?? filters.dateRange.endDate,
    filters.searchQuery.trim(),
    filters.routeFilter.trim(),
    filters.showTemplatesOnly ?? filters.showInstancesOnly,
  ].filter(Boolean).length;

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

      {/* Success Message */}
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

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
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
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
            <VoyageManagementFilters
              filters={filters}
              onFiltersChange={newFilters => setFilters(newFilters)}
              onClearFilters={resetFilters}
            />
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
            <VoyageCardView
              voyages={voyages}
              isLoading={isLoading}
              onVoyageEdit={handleEditVoyage}
              onVoyageView={handleViewVoyage}
              selectedVoyageIds={selectedVoyageIds}
              onVoyageSelect={toggleVoyageSelection}
              onVoyageDelete={handleViewVoyage}
            />
          )}

          {viewMode === 'calendar' && (
            <VoyageCalendarView
              voyages={voyages}
              isLoading={isLoading}
              onVoyageEdit={handleEditVoyage}
              onVoyageView={handleViewVoyage}
              onVoyageDelete={handleViewVoyage}
              selectedVoyageIds={selectedVoyageIds}
              onVoyageSelect={toggleVoyageSelection}
            />
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
            right: 96,
            zIndex: 1000,
          }}
        >
          <AddIcon />
        </Fab>
      </ProtectedTx>
      {/* Create/Edit Voyage Drawer */}
      <VoyageFormDrawer
        open={isCreateDrawerOpen || Boolean(editingVoyage)}
        onClose={() => {
          setIsCreateDrawerOpen(false);
          setEditingVoyage(null);
        }}
        voyage={editingVoyage}
        onSubmit={handleSaveVoyage}
        isLoading={scheduleVoyageMutation.isPending || updateVoyageMutation.isPending}
        koperativeId={koperativeId}
      />
      {/* Bulk Actions Dialog */}
      <VoyageBulkActions
        selectedCount={selectedVoyageIds.length}
        onBulkCancel={clearSelection}
        onBulkActivate={clearSelection}
        onBulkDeactivate={clearSelection}
        onBulkExport={() => {}}
        onBulkStatusChange={() => clearSelection()}
      />
    </Box>
  );
};

export default VoyageManagementPage;
