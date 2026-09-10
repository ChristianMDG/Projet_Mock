import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  MaterialReactTable,
  type MRT_Cell,
  type MRT_Column,
  type MRT_ColumnDef,
  type MRT_Row,
} from 'material-react-table';
import { Add, AccountTree, Delete, Edit, Sort } from '@mui/icons-material';
import { SectionHeader, mrtTableProps } from '@/components/shared';
import SubcategoryFormDialog from '@/components/subcategory/SubcategoryFormDialog';
import ReorderSubcategoriesDialog from '@/components/subcategory/ReorderSubcategoriesDialog';
import { useDeleteProductCategory, useProductCategories } from '@/hooks/productCategory.hook';
import { useCategories } from '@/hooks/category.hook';
import type { ProductCategory } from '@/types/shop.types';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

interface SubcategoryActionsMeta {
  readonly onEdit: (cat: ProductCategory) => void;
  readonly onDelete: (cat: ProductCategory) => void;
}

function SubcategoryParentCell({ row }: Readonly<{ row: MRT_Row<ProductCategory> }>) {
  return <Chip size="small" label={row.original.category?.name ?? '-'} color="primary" variant="outlined" />;
}

function SubcategoryNameCell({ row }: Readonly<{ row: MRT_Row<ProductCategory> }>) {
  return (
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {row.original.name}
    </Typography>
  );
}

function SubcategoryStatusCell({ cell }: Readonly<{ cell: MRT_Cell<ProductCategory> }>) {
  const { t } = useTranslation();
  const isActive = Boolean(cell.getValue<boolean>());
  return (
    <Chip
      size="small"
      label={t(isActive ? Labels.shop_common_active : Labels.shop_common_inactive)}
      color={isActive ? 'success' : 'default'}
      variant={isActive ? 'filled' : 'outlined'}
    />
  );
}

function SubcategoryActionsCell({
  row,
  column,
}: Readonly<{
  row: MRT_Row<ProductCategory>;
  column: MRT_Column<ProductCategory>;
}>) {
  const { t } = useTranslation();
  const meta = column.columnDef.meta as SubcategoryActionsMeta | undefined;
  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title={t(Labels.shop_common_edit)}>
        <IconButton size="small" onClick={() => meta?.onEdit(row.original)}>
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t(Labels.shop_common_delete)}>
        <IconButton size="small" color="error" onClick={() => meta?.onDelete(row.original)}>
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default function SubcategoryManagementPage() {
  const { t } = useTranslation();
  const { data: subcategories = [], isLoading, isFetching } = useProductCategories();
  const { data: parents = [] } = useCategories();
  const deleteSubcategory = useDeleteProductCategory();

  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ProductCategory | null>(null);
  const [parentFilter, setParentFilter] = useState<number | 'all'>('all');

  const filtered = useMemo(() => {
    if (parentFilter === 'all') return subcategories;
    return subcategories.filter((s) => (s.parentId ?? s.category?.id) === parentFilter);
  }, [subcategories, parentFilter]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (cat: ProductCategory) => {
    setEditing(cat);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await deleteSubcategory.mutateAsync(toDelete.id);
    setToDelete(null);
  };

  const columns = useMemo<MRT_ColumnDef<ProductCategory>[]>(
    () => [
      {
        header: t(Labels.shop_subcategory_col_parent),
        id: 'parent',
        size: 200,
        accessorFn: (row) => row.category?.name ?? '-',
        Cell: SubcategoryParentCell,
      },
      {
        header: t(Labels.shop_category_col_name),
        accessorKey: 'name',
        size: 240,
        Cell: SubcategoryNameCell,
      },
      { header: t(Labels.shop_category_col_slug), accessorKey: 'slug', size: 200 },
      {
        header: t(Labels.shop_category_col_order),
        accessorFn: (row) => row.displayOrder ?? 0,
        id: 'displayOrder',
        size: 100,
      },
      {
        header: t(Labels.shop_category_col_status),
        id: 'isActive',
        size: 120,
        accessorFn: (row) => row.isActive ?? true,
        Cell: SubcategoryStatusCell,
      },
      {
        header: t(Labels.shop_common_actions),
        id: 'actions',
        size: 140,
        enableColumnFilter: false,
        enableSorting: false,
        meta: { onEdit: openEdit, onDelete: setToDelete } satisfies SubcategoryActionsMeta,
        Cell: SubcategoryActionsCell,
      },
    ],
    [t]
  );

  const showLoader = isLoading || isFetching;
  const hasItems = filtered.length > 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <SectionHeader
          icon={<AccountTree sx={{ color: paletteTokens.purple }} />}
          title={t(Labels.shop_subcategory_title)}
          subtitle={`${subcategories.length} ${t(Labels.shop_subcategory_count)}`}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<Sort />} onClick={() => setReorderOpen(true)}>
            {t(Labels.shop_category_reorder)}
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            {t(Labels.shop_subcategory_create)}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 2, maxWidth: 320 }}>
        <TextField
          select
          fullWidth
          size="small"
          label={t(Labels.shop_subcategory_filter_parent)}
          value={parentFilter === 'all' ? 'all' : String(parentFilter)}
          onChange={(e) => setParentFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
        >
          <MenuItem value="all">{t(Labels.shop_subcategory_filter_all)}</MenuItem>
          {parents.map((p) => (
            <MenuItem key={p.id} value={String(p.id)}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {showLoader ? <LinearProgress sx={{ mb: 1, borderRadius: 1 }} /> : null}

      {hasItems ? (
        <Box sx={{ width: 1 }}>
          <MaterialReactTable
            {...mrtTableProps}
            columns={columns}
            data={filtered}
            state={{ isLoading: showLoader }}
            initialState={{ density: 'compact', pagination: { pageIndex: 0, pageSize: 50 } }}
          />
        </Box>
      ) : (
        !showLoader && <Alert severity="info">{t(Labels.shop_subcategory_none)}</Alert>
      )}

      <SubcategoryFormDialog open={formOpen} onClose={() => setFormOpen(false)} subcategory={editing} />

      <ReorderSubcategoriesDialog
        open={reorderOpen}
        onClose={() => setReorderOpen(false)}
        subcategories={subcategories}
      />

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t(Labels.shop_subcategory_delete_title)}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t(Labels.shop_subcategory_delete_message)}</Typography>
          {toDelete ? (
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              {toDelete.name}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToDelete(null)}>{t(Labels.shop_common_cancel)}</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleteSubcategory.isPending}>
            {t(Labels.shop_common_delete)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
