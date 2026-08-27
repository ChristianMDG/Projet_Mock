import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Delete, Route as RouteIcon } from '@mui/icons-material';
import { useAllRoutes } from '@/hooks/route.hook';
import { useAddProductRoute, useProductRoutes, useRemoveProductRoute } from '@/hooks/productRoute.hook';
import type { Route } from '@/api/route.api';
import Labels from '@/labelKeys.json';

interface ProductRoutesPanelProps {
  readonly productId: number;
}

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    const message = response?.data?.message;
    if (message) return message;
  }
  return fallback;
};

export default function ProductRoutesPanel({ productId }: ProductRoutesPanelProps) {
  const { t } = useTranslation();
  const productRoutesQuery = useProductRoutes(productId);
  const allRoutesQuery = useAllRoutes();
  const addMutation = useAddProductRoute(productId);
  const removeMutation = useRemoveProductRoute(productId);

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [displayOrder, setDisplayOrder] = useState<string>('0');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  const productRoutes = productRoutesQuery.data ?? [];
  const allRoutes = allRoutesQuery.data ?? [];

  const isListLoading = productRoutesQuery.isLoading;
  const isListReady = !isListLoading && !productRoutesQuery.isError;
  const hasRoutes = productRoutes.length > 0;
  const showEmpty = isListReady && !hasRoutes;
  const showList = isListReady && hasRoutes;

  const canSubmit = Boolean(selectedRoute) && !addMutation.isPending;

  const resetForm = () => {
    setSelectedRoute(null);
    setDisplayOrder('0');
    setIsActive(true);
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!selectedRoute) return;
    setFormError(null);
    const parsedOrder = Number(displayOrder);
    const finalOrder = Number.isFinite(parsedOrder) ? parsedOrder : 0;
    try {
      await addMutation.mutateAsync({ routeId: selectedRoute.id, displayOrder: finalOrder, isActive });
      resetForm();
    } catch (err) {
      setFormError(extractErrorMessage(err, t(Labels.shop_product_routes_error_generic)));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {t(Labels.shop_product_routes_add)}
        </Typography>

        {formError && (
          <Alert severity="error" onClose={() => setFormError(null)}>
            {formError}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <Autocomplete
            sx={{ flex: 2, minWidth: 240 }}
            options={allRoutes}
            loading={allRoutesQuery.isLoading}
            value={selectedRoute}
            onChange={(_, v) => setSelectedRoute(v)}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t(Labels.shop_product_routes_select_route)}
                size="small"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {allRoutesQuery.isLoading && <CircularProgress size={16} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />

          <TextField
            sx={{ width: { xs: '100%', md: 160 } }}
            label={t(Labels.shop_product_routes_display_order)}
            size="small"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
          />

          <FormControlLabel
            control={<Switch checked={isActive} onChange={(_, v) => setIsActive(v)} />}
            label={t(Labels.shop_product_routes_active)}
          />

          <Button variant="contained" startIcon={<Add />} onClick={handleSubmit} disabled={!canSubmit}>
            {t(Labels.shop_product_routes_add)}
          </Button>
        </Stack>
      </Stack>

      {isListLoading && (
        <Stack spacing={1}>
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
        </Stack>
      )}

      {productRoutesQuery.isError && <Alert severity="error">{t(Labels.shop_product_routes_error_generic)}</Alert>}

      {showEmpty && (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
            borderStyle: 'dashed',
            borderRadius: 2,
            color: 'text.secondary',
          }}
        >
          <RouteIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
          <Typography variant="body2">{t(Labels.shop_product_routes_empty)}</Typography>
        </Box>
      )}

      {showList && (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t(Labels.shop_product_routes_route)}</TableCell>
              <TableCell align="right">{t(Labels.shop_product_routes_display_order)}</TableCell>
              <TableCell align="center">{t(Labels.shop_product_routes_active)}</TableCell>
              <TableCell align="right">{t(Labels.shop_product_routes_actions)}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productRoutes.map((pr) => (
              <TableRow key={pr.id} hover>
                <TableCell>{pr.route.name}</TableCell>
                <TableCell align="right">{pr.displayOrder}</TableCell>
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={t(Labels.shop_product_routes_active)}
                    color={pr.isActive ? 'success' : 'default'}
                    variant={pr.isActive ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={t(Labels.shop_product_routes_remove)}>
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={removeMutation.isPending}
                        onClick={() => removeMutation.mutate(pr.routeId)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
}
