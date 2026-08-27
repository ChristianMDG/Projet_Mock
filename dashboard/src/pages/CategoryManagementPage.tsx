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
  Stack,
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
import { Add, Category as CategoryIcon, Delete, Edit } from '@mui/icons-material';
import { SectionHeader, mrtTableProps } from '@/components/shared';
import CategoryFormDialog from '@/components/category/CategoryFormDialog';
import { useCategoryTree, useDeleteCategory } from '@/hooks/category.hook';
import type { Category } from '@/types/shop.types';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

interface CategoryActionsMeta {
  readonly onEdit: (cat: Category) => void;
  readonly onDelete: (cat: Category) => void;
}

function CategoryNameCell({ row }: Readonly<{ row: MRT_Row<Category> }>) {
  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {row.original.name}
      </Typography>
      {row.original.description ? (
        <Typography variant="caption" color="text.secondary">
          {row.original.description}
        </Typography>
      ) : null}
    </Box>
  );
}

function SubcategoriesCountCell({ cell }: Readonly<{ cell: MRT_Cell<Category> }>) {
  const value = cell.getValue<number>();
  return <Chip size="small" label={value} color={value > 0 ? 'primary' : 'default'} variant="outlined" />;
}

function CategoryStatusCell({ cell }: Readonly<{ cell: MRT_Cell<Category> }>) {
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

function CategoryActionsCell({
  row,
  column,
}: Readonly<{
  row: MRT_Row<Category>;
  column: MRT_Column<Category>;
}>) {
  const { t } = useTranslation();
  const meta = column.columnDef.meta as CategoryActionsMeta | undefined;
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

export default function CategoryManagementPage() {
  const { t } = useTranslation();
  const { data: categories = [], isLoading, isFetching } = useCategoryTree();
  const deleteCategory = useDeleteCategory();

  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await deleteCategory.mutateAsync(toDelete.id);
    setToDelete(null);
  };

  const columns = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      {
        header: t(Labels.shop_category_col_name),
        accessorKey: 'name',
        size: 280,
        Cell: CategoryNameCell,
      },
      { header: t(Labels.shop_category_col_slug), accessorKey: 'slug', size: 200 },
      {
        header: t(Labels.shop_category_col_subcategories_count),
        id: 'subcategoriesCount',
        size: 160,
        accessorFn: (row) => row.subcategories?.length ?? 0,
        Cell: SubcategoriesCountCell,
      },
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
        Cell: CategoryStatusCell,
      },
      {
        header: t(Labels.shop_common_actions),
        id: 'actions',
        size: 140,
        enableColumnFilter: false,
        enableSorting: false,
        meta: { onEdit: openEdit, onDelete: setToDelete } satisfies CategoryActionsMeta,
        Cell: CategoryActionsCell,
      },
    ],
    [t]
  );

  const showLoader = isLoading || isFetching;
  const hasCategories = categories.length > 0;

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
          icon={<CategoryIcon sx={{ color: paletteTokens.purple }} />}
          title={t(Labels.shop_category_title)}
          subtitle={`${categories.length} ${t(Labels.shop_category_count)}`}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            {t(Labels.shop_category_create)}
          </Button>
        </Stack>
      </Box>

      {showLoader ? <LinearProgress sx={{ mb: 1, borderRadius: 1 }} /> : null}

      {hasCategories ? (
        <Box sx={{ width: '100%' }}>
          <MaterialReactTable
            {...mrtTableProps}
            columns={columns}
            data={categories}
            state={{ isLoading: showLoader }}
            initialState={{ density: 'compact', pagination: { pageIndex: 0, pageSize: 25 } }}
          />
        </Box>
      ) : (
        !showLoader && <Alert severity="info">{t(Labels.shop_category_none)}</Alert>
      )}

      <CategoryFormDialog open={formOpen} onClose={() => setFormOpen(false)} category={editing} />

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t(Labels.shop_category_delete_title)}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t(Labels.shop_category_delete_message)}</Typography>
          {toDelete ? (
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              {toDelete.name}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToDelete(null)}>{t(Labels.shop_common_cancel)}</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleteCategory.isPending}>
            {t(Labels.shop_common_delete)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
