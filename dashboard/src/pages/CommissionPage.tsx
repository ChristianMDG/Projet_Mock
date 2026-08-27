import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Alert,
  Tooltip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Paper,
  Grid,
} from '@mui/material';
import { Percent, Add, Refresh } from '@mui/icons-material';
import { SectionHeader, StatCard } from '@/components/shared';
import { CommissionTable, CommissionFilters, CommissionFormDialog } from '@/components/commission';
import { useCommissions, useCreateCommission, useUpdateCommission, useDeleteCommission } from '@/hooks/commission.hook';
import { useKoperatives } from '@/hooks/koperative.hook';
import type { Commission } from '@/models';
import type { Koperative } from '@/types/koperative.types';
import { paletteTokens } from '@/themes/appTheme';
import { formatCurrency } from '@/utils/format';
import Labels from '@/labelKeys.json';

export default function CommissionPage() {
  const { t } = useTranslation();
  const [filterKoperativeId, setFilterKoperativeId] = useState<number | ''>('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });

  const koperativeIdParam = filterKoperativeId ? filterKoperativeId : undefined;

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filterKoperativeId]);

  const { data, isFetching, error, refetch } = useCommissions(
    koperativeIdParam,
    pagination.pageIndex,
    pagination.pageSize
  );
  const { data: koperatives = [], isLoading: isFetchingKoperatives } = useKoperatives();

  const selectedKoperative = useMemo(
    () => (filterKoperativeId ? (koperatives.find((k) => k.id === filterKoperativeId) ?? null) : null),
    [koperatives, filterKoperativeId]
  );

  const commissions = data?.content ?? [];
  const totalElements = data?.totalElements ?? data?.page?.totalElements ?? 0;

  const createCommission = useCreateCommission();
  const updateCommission = useUpdateCommission();
  const deleteCommission = useDeleteCommission();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Commission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Commission | null>(null);

  const koperativeMap = useMemo(() => {
    const map: Record<number, Koperative> = {};
    koperatives.forEach((k) => {
      map[k.id] = k;
    });
    return map;
  }, [koperatives]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (commission: Commission) => {
    setEditing(commission);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const handleFormSubmit = async (payload: Commission) => {
    if (editing?.id) {
      await updateCommission.mutateAsync({ id: editing.id, payload });
    } else {
      await createCommission.mutateAsync(payload);
    }
    closeDialog();
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget?.id) {
      await deleteCommission.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const isMutating = createCommission.isPending || updateCommission.isPending || deleteCommission.isPending;

  const stats = useMemo(() => {
    const total = totalElements;
    const hasData = commissions.length > 0;
    const sumFrais = hasData ? commissions.reduce((acc, c) => acc + (c.frais ?? 0), 0) : 0;
    const avgFrais = hasData ? Math.round(sumFrais / commissions.length) : 0;
    const maxFrais = hasData ? Math.max(...commissions.map((c) => c.frais ?? 0)) : 0;
    return { total, avgFrais, maxFrais };
  }, [commissions, totalElements]);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t(Labels.commission_error)}</Alert>
      </Box>
    );
  }

  const statItems = [
    {
      label: t(Labels.commission_stat_total),
      value: String(stats.total),
      color: paletteTokens.indigo,
    },
    {
      label: t(Labels.commission_stat_avg_frais),
      value: formatCurrency(stats.avgFrais),
      color: paletteTokens.teal,
    },
    {
      label: t(Labels.commission_stat_max_frais),
      value: formatCurrency(stats.maxFrais),
      color: paletteTokens.warning,
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <SectionHeader
          icon={<Percent />}
          title={t(Labels.commission_title)}
          subtitle={`${totalElements} ${
            totalElements !== 1 ? t(Labels.commission_count_plural) : t(Labels.commission_count)
          }`}
          size="small"
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={t(Labels.commission_refresh)}>
            <span>
              <IconButton onClick={() => refetch()} disabled={isFetching} size="small" color="primary">
                <Refresh />
              </IconButton>
            </span>
          </Tooltip>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={openCreate} disabled={isMutating}>
            {t(Labels.commission_new)}
          </Button>
        </Stack>
      </Box>

      {/* Filter Toolbar */}
      <CommissionFilters
        selectedKoperative={selectedKoperative}
        onKoperativeChange={(k) => setFilterKoperativeId(k ? k.id : '')}
        koperatives={koperatives}
        isLoading={isFetchingKoperatives}
      />

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statItems.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
            <StatCard
              icon={<Percent fontSize="small" />}
              label={item.label}
              value={item.value}
              color={item.color}
              loading={isFetching}
            />
          </Grid>
        ))}
      </Grid>

      {/* Commission Table Component */}
      <Paper sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
        <CommissionTable
          data={commissions}
          loading={isFetching}
          pagination={pagination}
          onPaginationChange={setPagination}
          rowCount={totalElements}
          koperativeMap={koperativeMap}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          isMutating={isMutating}
        />
      </Paper>

      {/* Create / Edit Form Dialog */}
      <CommissionFormDialog
        open={dialogOpen}
        editing={editing}
        onClose={closeDialog}
        onSubmit={handleFormSubmit}
        koperatives={koperatives}
        isMutating={isMutating}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t(Labels.commission_delete_title)}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t(Labels.commission_delete_message)}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteCommission.isPending}>
            {t(Labels.commission_cancel)}
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={deleteCommission.isPending}>
            {t(Labels.commission_action_delete)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
