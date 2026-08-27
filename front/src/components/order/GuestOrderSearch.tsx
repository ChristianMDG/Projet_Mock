import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, InputAdornment, Paper, Stack, TextField } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useOrders } from '@/hooks/order.hooks';
import type { Order } from '@/types/order.types';
import OrderResultCard from './OrderResultCard';

const GuestOrderSearch: React.FC = () => {
  const { t } = useTranslation();
  const [orderNumber, setOrderNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading, isError } = useOrders(
    hasSearched && searchQuery ? { q: searchQuery, page: 0, size: 5 } : undefined,
  );

  const results: Order[] = data?.content ?? [];
  const hasResults = results.length > 0;
  const hasInput = Boolean(orderNumber.trim());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasInput) {
      setSearchQuery(orderNumber.trim());
      setHasSearched(true);
    }
  };

  const isReady = hasSearched && !isLoading;
  const showNotFound = isReady && !isError && !hasResults;
  const showResults = isReady && hasResults;

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: 'stretch' }}>
            <TextField
              id="guest-order-number"
              fullWidth
              label={t(Labels.order_search_by_number)}
              placeholder={t(Labels.order_search_number_placeholder)}
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              autoComplete="off"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <ReceiptLongIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              id="guest-order-search-btn"
              type="submit"
              variant="contained"
              size="large"
              disabled={!hasInput || isLoading}
              startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
              sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {t(Labels.order_search_submit)}
            </Button>
          </Stack>

          <Alert severity="info" icon={<Inventory2Icon fontSize="inherit" />}>
            {t(Labels.order_search_info)}
          </Alert>
        </Stack>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {t(Labels.shop_error)}
        </Alert>
      )}

      {showNotFound && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t(Labels.order_search_not_found)}
        </Alert>
      )}

      {hasSearched && isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {showResults && (
        <Stack spacing={2} sx={{ mt: 3 }}>
          {results.map(order => (
            <OrderResultCard key={order.id} order={order} />
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default GuestOrderSearch;
