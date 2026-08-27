import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Alert,
  LinearProgress,
  Tooltip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Paper,
} from '@mui/material';
import { Category, Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { SectionHeader, StatCard, mrtTableProps } from '@/components/shared';
import { useClasses, useCreateClasse, useUpdateClasse, useDeleteClasse } from '@/hooks/classe.hook';
import { useKoperatives } from '@/hooks/koperative.hook';
import type { Classe } from '@/models';
import type { Koperative } from '@/types/koperative.types';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

interface ClasseFormState {
  name: string;
  description: string;
  koperativeId: number | '';
}

type ClasseFormErrors = Partial<Record<keyof ClasseFormState, string>>;

const emptyForm: ClasseFormState = { name: '', description: '', koperativeId: '' };

export default function ClassesPage() {
  const { t } = useTranslation();
  const { data: classes = [], isFetching, error, refetch } = useClasses();
  const { data: koperatives = [] } = useKoperatives();

  const createClasse = useCreateClasse();
  const updateClasse = useUpdateClasse();
  const deleteClasse = useDeleteClasse();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Classe | null>(null);
  const [form, setForm] = useState<ClasseFormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<ClasseFormErrors>({});

  const [deleteTarget, setDeleteTarget] = useState<Classe | null>(null);

  const koperativeMap = useMemo(() => {
    const map: Record<number, Koperative> = {};
    koperatives.forEach((k) => (map[k.id] = k));
    return map;
  }, [koperatives]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (classe: Classe) => {
    setEditing(classe);
    setForm({
      name: classe.name,
      description: classe.description ?? '',
      koperativeId: classe.koperativeId ?? '',
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
  };

  const validate = (): boolean => {
    const errors: ClasseFormErrors = {};
    if (form.name.trim() === '') errors.name = t(Labels.classe_name_required);
    if (form.koperativeId === '') errors.koperativeId = t(Labels.classe_koperative_required);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      if (form.koperativeId === '') return;
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        koperativeId: form.koperativeId,
      };
      if (editing?.id) {
        await updateClasse.mutateAsync({ id: editing.id, payload });
      } else {
        await createClasse.mutateAsync(payload);
      }
      closeDialog();
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget?.id) {
      await deleteClasse.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const isMutating = createClasse.isPending || updateClasse.isPending || deleteClasse.isPending;

  const columns = useMemo<MRT_ColumnDef<Classe>[]>(
    () => [
      {
        header: t(Labels.classe_col_id),
        accessorKey: 'id',
        size: 80,
        Cell: ({ cell }) => (
          <Box component="span" sx={{ fontFamily: 'monospace' }}>
            {cell.getValue<number>()}
          </Box>
        ),
        enableColumnFilter: false,
      },
      {
        header: t(Labels.classe_col_name),
        accessorKey: 'name',
        size: 220,
      },
      {
        header: t(Labels.classe_col_description),
        accessorKey: 'description',
        size: 340,
        Cell: ({ cell }) => cell.getValue<string>() ?? '—',
      },
      {
        header: t(Labels.classe_col_koperative),
        accessorFn: (row) => (row.koperativeId ? (koperativeMap[row.koperativeId]?.name ?? row.koperativeId) : '—'),
        id: 'koperative',
        size: 220,
      },
      {
        header: t(Labels.classe_col_actions),
        id: 'actions',
        size: 120,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={t(Labels.classe_action_edit)}>
              <IconButton size="small" onClick={() => openEdit(row.original)} disabled={isMutating}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t(Labels.classe_action_delete)}>
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleteTarget(row.original)}
                disabled={isMutating}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [t, koperativeMap, isMutating]
  );

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t(Labels.classe_error)}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <SectionHeader
          icon={<Category />}
          title={t(Labels.classe_title)}
          subtitle={`${classes.length} ${classes.length !== 1 ? t(Labels.classe_count_plural) : t(Labels.classe_count)}`}
          size="small"
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={t(Labels.classe_refresh)}>
            <span>
              <IconButton onClick={() => refetch()} disabled={isFetching} size="small" color="primary">
                <Refresh />
              </IconButton>
            </span>
          </Tooltip>
          <Button variant="contained" size="small" startIcon={<Add />} onClick={openCreate} disabled={isMutating}>
            {t(Labels.classe_new)}
          </Button>
        </Stack>
      </Box>

      {/* Stat cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 140 }}>
          <StatCard
            icon={<Category fontSize="small" />}
            label={t(Labels.classe_title)}
            value={String(classes.length)}
            color={paletteTokens.indigo}
            loading={isFetching}
          />
        </Box>
      </Box>

      {/* Table */}
      <Paper sx={{ borderRadius: 2.5, overflow: 'hidden', position: 'relative' }}>
        {isFetching && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }} />}
        <MaterialReactTable
          {...mrtTableProps}
          columns={columns}
          data={classes}
          state={{ isLoading: isFetching && classes.length === 0 }}
          initialState={{ density: 'compact', pagination: { pageIndex: 0, pageSize: 20 } }}
          renderEmptyRowsFallback={() => (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
              {t(Labels.classe_no_data)}
            </Box>
          )}
        />
      </Paper>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? t(Labels.classe_dialog_edit) : t(Labels.classe_dialog_create)}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t(Labels.classe_field_name)}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
              fullWidth
              size="small"
            />
            <TextField
              label={t(Labels.classe_field_description)}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              multiline
              minRows={2}
              fullWidth
              size="small"
            />
            <TextField
              select
              label={t(Labels.classe_field_koperative)}
              value={form.koperativeId}
              onChange={(e) => setForm((f) => ({ ...f, koperativeId: Number(e.target.value) }))}
              error={Boolean(formErrors.koperativeId)}
              helperText={formErrors.koperativeId}
              required
              fullWidth
              size="small"
            >
              <MenuItem value="">{t(Labels.classe_select_koperative)}</MenuItem>
              {koperatives.map((k) => (
                <MenuItem key={k.id} value={k.id}>
                  {k.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={createClasse.isPending || updateClasse.isPending}>
            {t(Labels.classe_cancel)}
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={createClasse.isPending || updateClasse.isPending}>
            {t(Labels.classe_save)}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t(Labels.classe_delete_title)}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t(Labels.classe_delete_message)}</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteClasse.isPending}>
            {t(Labels.classe_cancel)}
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm} disabled={deleteClasse.isPending}>
            {t(Labels.classe_action_delete)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
