import React, { useState, useEffect, useMemo } from 'react';
import { Alert, Box, CircularProgress, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useOrders } from '@/hooks/order.hooks';
import type { Order } from '@/types/order.types';
import OrderCard from './OrderCard';

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

const OrderList: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQ = useDebouncedValue(searchQuery.trim(), 300);

  const params = useMemo(
    () => ({
      page: 0,
      size: 20,
      ...(debouncedQ ? { q: debouncedQ } : {}),
    }),
    [debouncedQ],
  );

  const { data, isLoading, isError } = useOrders(params);
  const [expandedId, setExpandedId] = useState<number | false>(false);

  const orders: Order[] = data?.content ?? [];
  const hasItems = orders.length > 0;

  const handleToggle = (id: number) => () => {
    setExpandedId(prev => (prev === id ? false : id));
  };

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder={t(Labels.order_search_placeholder)}
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          },
        }}
      />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {t(Labels.shop_error)}
        </Alert>
      )}

      {!isLoading && !isError && hasItems && (
        <Box>
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              expanded={expandedId === order.id}
              onToggle={handleToggle(order.id!)}
            />
          ))}
        </Box>
      )}

      {!isLoading && !isError && !hasItems && (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Inventory2Icon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {t(Labels.shop_empty)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default OrderList;
