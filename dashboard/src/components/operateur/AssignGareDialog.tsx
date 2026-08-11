import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Stack,
  Alert,
  TextField,
} from '@mui/material';
import { useAssignGareToOperator, useGuichetsByGare } from '@/hooks/operateur.hook';
import { useGares } from '@/hooks/gare.hook';
import type { UserOperator } from '@/api/operateur.api';
import Labels from '@/labelKeys.json';

interface AssignGareDialogProps {
  open: boolean;
  onClose: () => void;
  operator: UserOperator | null;
}

export function AssignGareDialog({ open, onClose, operator }: AssignGareDialogProps) {
  const { t } = useTranslation();
  const [gareId, setGareId] = useState<number | ''>('');
  const [koperativeId, setKoperativeId] = useState<number | ''>('');

  const { data: gares = [] } = useGares();
  const { data: guichets = [] } = useGuichetsByGare(gareId !== '' ? gareId : null);
  const { mutate, isPending, error } = useAssignGareToOperator();

  const koperativesForGare = guichets
    .map((g) => g.koperative)
    .filter((k): k is NonNullable<typeof k> => k != null)
    .filter((k, i, arr) => arr.findIndex((x) => x.id === k.id) === i);

  useEffect(() => {
    if (!open) return;
    setGareId(operator?.departureGare?.id ?? '');
    setKoperativeId(operator?.koperative?.id ?? '');
  }, [open, operator]);

  // Reset koperative when gare changes
  useEffect(() => {
    setKoperativeId('');
  }, [gareId]);

  const handleSubmit = () => {
    if (!gareId || !operator) return;
    mutate(
      {
        operatorId: operator.id,
        gareId: gareId as number,
        koperativeId: koperativeId !== '' ? (koperativeId as number) : undefined,
      },
      { onSuccess: onClose }
    );
  };

  const handleClose = () => {
    setGareId('');
    setKoperativeId('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t(Labels.operateur_assign_gare)}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{t(Labels.operateur_error)}</Alert>}
          <TextField
            select
            label={t(Labels.operateur_select_gare)}
            value={gareId}
            onChange={(e) => setGareId(Number(e.target.value))}
            size="small"
            fullWidth
          >
            {gares.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name} {g.ville ? `— ${g.ville.name}` : ''}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t(Labels.operateur_select_koperative)}
            value={koperativeId}
            onChange={(e) => setKoperativeId(Number(e.target.value))}
            size="small"
            fullWidth
            disabled={!gareId}
            helperText={!gareId ? t(Labels.operateur_select_gare_first) : undefined}
          >
            {koperativesForGare.map((k) => (
              <MenuItem key={k.id} value={k.id}>
                {k.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          {t(Labels.operateur_cancel)}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending || !gareId || !koperativeId}>
          {t(Labels.operateur_submit)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
