import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useKoperatives } from '@/hooks/koperative.hook';
import { useAssignKoperativesToOperator } from '@/hooks/operateur.hook';
import type { UserOperator } from '@/api/operateur.api';
import Labels from '@/labelKeys.json';

interface AssignKoperativesDialogProps {
  open: boolean;
  onClose: () => void;
  operator: UserOperator | null;
}

export function AssignKoperativesDialog({ open, onClose, operator }: AssignKoperativesDialogProps) {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const { data: koperatives = [], isLoading } = useKoperatives();
  const { mutate, isPending, error } = useAssignKoperativesToOperator();

  // Pre-select already assigned koperatives when dialog opens
  useEffect(() => {
    if (open && operator) {
      setSelectedIds((operator.assignedKoperatives ?? []).map((k) => k.id));
    }
  }, [open, operator]);

  const toggleKoperative = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleSubmit = () => {
    if (!operator) return;
    mutate({ operatorId: operator.id, koperativeIds: selectedIds }, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t(Labels.operateur_assign_koperatives)}</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{t(Labels.operateur_error)}</Alert>}
          {isLoading ? (
            <CircularProgress size={24} sx={{ alignSelf: 'center', my: 2 }} />
          ) : koperatives.length === 0 ? (
            <Typography color="text.secondary">{t(Labels.operateur_no_data)}</Typography>
          ) : (
            koperatives.map((k) => (
              <FormControlLabel
                key={k.id}
                control={
                  <Checkbox checked={selectedIds.includes(k.id)} onChange={() => toggleKoperative(k.id)} size="small" />
                }
                label={k.name}
              />
            ))
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          {t(Labels.operateur_cancel)}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending || isLoading}>
          {t(Labels.operateur_submit)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
