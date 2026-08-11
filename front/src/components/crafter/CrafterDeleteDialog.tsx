import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import { ButtonTx } from '@/components/ui';
import { Crafter } from '@/types';
import Labels from '@/labelKeys.json';

interface CrafterDeleteDialogProps {
  open: boolean;
  crafter: Crafter | null;
  isDeleting: boolean;
  t: (key: string) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CrafterDeleteDialog: React.FC<CrafterDeleteDialogProps> = ({
  open,
  crafter,
  isDeleting,
  t,
  onConfirm,
  onCancel,
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
    aria-labelledby="delete-dialog-title"
    aria-describedby="delete-dialog-description"
  >
    <DialogTitle id="delete-dialog-title">{t(Labels.delete_confirmation_title)}</DialogTitle>
    <DialogContent>
      <DialogContentText id="delete-dialog-description">
        {t(Labels.crafter_delete_confirm).replace('{registrationNumber}', crafter?.registrationNumber ?? '')}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <ButtonTx onClick={onCancel} variant="contained" size="large">
        {t(Labels.button_cancel)}
      </ButtonTx>
      <ButtonTx onClick={onConfirm} color="error" variant="contained" disabled={isDeleting} size="large">
        {isDeleting ? t(Labels.button_deleting) : t(Labels.button_delete)}
      </ButtonTx>
    </DialogActions>
  </Dialog>
);

export default CrafterDeleteDialog;
