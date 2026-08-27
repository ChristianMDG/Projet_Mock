import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Avatar,
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
import { MaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import {
  Add,
  Category as CategoryIcon,
  CloudUpload,
  Delete,
  Edit,
  ImageNotSupported,
  Inventory,
  Tune,
} from '@mui/icons-material';
import { SectionHeader, mrtTableProps } from '@/components/shared';
import ProductFormDialog from '@/components/product/ProductFormDialog';
import ProductCsvImportDialog from '@/components/product/ProductCsvImportDialog';
import { useDeleteProduct, useProducts } from '@/hooks/product.hook';
import type { Product } from '@/types/shop.types';
import { formatCurrency } from '@/utils/format';
import { paletteTokens } from '@/themes/appTheme';
import Labels from '@/labelKeys.json';

export default function ProductManagement() {
  const { t } = useTranslation();
  const { data: products = [], isLoading, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [initialTab, setInitialTab] = useState(0);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  const openCreate = () => {
    setEditing(null);
    setInitialTab(0);
    setFormOpen(true);
  };

  const openEdit = (product: Product, tab = 0) => {
    setEditing(product);
    setInitialTab(tab);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    await deleteProduct.mutateAsync(toDelete.id);
    setToDelete(null);
  };

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        header: t(Labels.shop_product_col_image),
        id: 'image',
        size: 80,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => {
          const primary = row.original.images?.find((i) => i.primary) ?? row.original.images?.[0];
          const hasImage = Boolean(primary?.url);
          return hasImage ? (
            <Avatar src={primary?.url} variant="rounded" sx={{ width: 44, height: 44 }} />
          ) : (
            <Avatar variant="rounded" sx={{ width: 44, height: 44, bgcolor: 'action.hover' }}>
              <ImageNotSupported fontSize="small" color="disabled" />
            </Avatar>
          );
        },
      },
      {
        header: t(Labels.shop_product_col_name),
        accessorKey: 'name',
        size: 260,
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.original.name}
            </Typography>
            {row.original.sku ? (
              <Typography variant="caption" color="text.secondary">
                {row.original.sku}
              </Typography>
            ) : null}
          </Box>
        ),
      },
      {
        header: t(Labels.shop_product_col_category),
        accessorFn: (row) => row.categoryName ?? '-',
        id: 'categoryName',
        size: 160,
      },
      {
        header: t(Labels.shop_product_col_price),
        accessorKey: 'price',
        size: 120,
        Cell: ({ cell }) => formatCurrency(Number(cell.getValue<number>() ?? 0)),
      },
      {
        header: t(Labels.shop_product_col_stock),
        accessorKey: 'stock',
        size: 100,
        Cell: ({ cell }) => {
          const value = cell.getValue<number | undefined>();
          return value === undefined ? '-' : value;
        },
      },
      {
        header: t(Labels.shop_product_col_status),
        accessorKey: 'isActive',
        size: 120,
        Cell: ({ cell }) => {
          const isActive = Boolean(cell.getValue<boolean>());
          return (
            <Chip
              size="small"
              label={t(isActive ? Labels.shop_common_active : Labels.shop_common_inactive)}
              color={isActive ? 'success' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
            />
          );
        },
      },
      {
        header: t(Labels.shop_common_actions),
        id: 'actions',
        size: 180,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={t(Labels.shop_common_edit)}>
              <IconButton size="small" onClick={() => openEdit(row.original, 0)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t(Labels.shop_product_action_images)}>
              <IconButton size="small" onClick={() => openEdit(row.original, 1)}>
                <CloudUpload fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t(Labels.shop_product_action_variants)}>
              <IconButton size="small" onClick={() => openEdit(row.original, 2)}>
                <Tune fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={t(Labels.shop_common_delete)}>
              <IconButton size="small" color="error" onClick={() => setToDelete(row.original)}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [t]
  );

  const hasError = Boolean(error);
  if (hasError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t(Labels.shop_common_error)}</Alert>
      </Box>
    );
  }

  const productCount = products.length;

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
          icon={<Inventory sx={{ color: paletteTokens.indigo }} />}
          title={t(Labels.shop_product_title)}
          subtitle={`${productCount} ${t(Labels.shop_product_col_name).toLowerCase()}`}
        />
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<CategoryIcon />} onClick={() => setImportOpen(true)}>
            {t(Labels.shop_product_import_cta)}
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
            {t(Labels.shop_product_create_cta)}
          </Button>
        </Stack>
      </Box>

      {isLoading ? <LinearProgress sx={{ mb: 1, borderRadius: 1 }} /> : null}

      <Box sx={{ width: '100%' }}>
        <MaterialReactTable
          {...mrtTableProps}
          columns={columns}
          data={products}
          state={{ isLoading }}
          initialState={{ density: 'compact', pagination: { pageIndex: 0, pageSize: 20 } }}
          renderEmptyRowsFallback={() => (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
              {t(Labels.shop_product_none)}
            </Box>
          )}
        />
      </Box>

      <ProductFormDialog
        key={editing?.id ?? 'new'}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editing}
        initialTab={initialTab}
      />

      <ProductCsvImportDialog open={importOpen} onClose={() => setImportOpen(false)} />

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{t(Labels.shop_product_delete_title)}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t(Labels.shop_product_delete_message)}</Typography>
          {toDelete ? (
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              {toDelete.name}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToDelete(null)}>{t(Labels.shop_common_cancel)}</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleteProduct.isPending}>
            {t(Labels.shop_common_delete)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
