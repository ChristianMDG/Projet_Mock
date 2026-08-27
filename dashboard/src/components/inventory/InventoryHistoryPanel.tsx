import { useTranslation } from 'react-i18next';
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useInventoryHistory } from '@/hooks/inventory.hook';
import { formatDateTime } from '@/utils/format';
import Labels from '@/labelKeys.json';

export default function InventoryHistoryPanel({ inventoryId }: { inventoryId: number }) {
  const { t } = useTranslation();
  const { data: logs = [], isLoading } = useInventoryHistory(inventoryId);

  const hasLogs = logs.length > 0;

  if (isLoading) {
    return (
      <Box sx={{ py: 2, px: 3 }}>
        <Typography variant="caption" color="text.secondary">
          ...
        </Typography>
      </Box>
    );
  }

  if (!hasLogs) {
    return (
      <Box sx={{ py: 2, px: 3 }}>
        <Typography variant="caption" color="text.secondary">
          {t(Labels.shop_inventory_history_empty)}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1} sx={{ py: 2, px: 3 }}>
      <Typography variant="subtitle2">{t(Labels.shop_inventory_history)}</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t(Labels.shop_inventory_history_date)}</TableCell>
            <TableCell align="right">{t(Labels.shop_inventory_history_delta)}</TableCell>
            <TableCell align="right">{t(Labels.shop_inventory_history_after)}</TableCell>
            <TableCell>{t(Labels.shop_inventory_history_reason)}</TableCell>
            <TableCell>{t(Labels.shop_inventory_history_by)}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{formatDateTime(log.createdAt)}</TableCell>
              <TableCell align="right" sx={{ color: log.delta >= 0 ? 'success.main' : 'error.main' }}>
                {log.delta >= 0 ? `+${log.delta}` : log.delta}
              </TableCell>
              <TableCell align="right">{log.quantityAfter}</TableCell>
              <TableCell>{log.reason ?? '-'}</TableCell>
              <TableCell>{log.createdBy ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
}
