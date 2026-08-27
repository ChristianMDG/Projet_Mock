import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useImportProductsCsv } from '@/hooks/product.hook';
import type { ImportResult } from '@/api/product.api';
import Labels from '@/labelKeys.json';

interface ProductCsvImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ProductCsvImportDialog({ open, onClose }: ProductCsvImportDialogProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const importCsv = useImportProductsCsv();

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  const handleUpload = async () => {
    if (!file) return;
    const data = await importCsv.mutateAsync(file);
    setResult(data);
  };

  const hasErrors = Boolean(result && result.errorCount > 0);
  const hasSuccess = Boolean(result && result.successCount > 0);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t(Labels.shop_product_import_title)}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t(Labels.shop_product_import_hint)}
        </Typography>
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <CloudUpload sx={{ fontSize: 36, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2">{file ? file.name : t(Labels.shop_product_import_pick)}</Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </Box>
        {importCsv.isPending && <LinearProgress sx={{ mt: 2 }} />}
        {hasSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t(Labels.shop_product_import_success).replace('{count}', String(result?.successCount ?? 0))}
          </Alert>
        )}
        {hasErrors && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {t(Labels.shop_product_import_errors).replace('{count}', String(result?.errorCount ?? 0))}
            <List dense>
              {(result?.errors ?? []).map((err) => (
                <ListItem key={`${err.line}-${err.error ?? ''}`} disableGutters>
                  <ListItemText primary={`#${err.line}: ${err.error ?? ''}`} />
                </ListItem>
              ))}
            </List>
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>{t(Labels.shop_common_close)}</Button>
        <Button variant="contained" onClick={handleUpload} disabled={!file || importCsv.isPending}>
          {t(Labels.shop_product_import_start)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
