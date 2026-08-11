import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ButtonTx } from '@/components/ui';
import { Guichet } from '@/types';
import Labels from '@/labelKeys.json';

interface GuichetDeleteDialogProps {
  open: boolean;
  guichet: Guichet | null;
  isDeleting: boolean;
  t: (key: string) => string;
  onConfirm: () => void;
  onCancel: () => void;
}

const GuichetDeleteDialog: React.FC<GuichetDeleteDialogProps> = ({
  open,
  guichet,
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
        {t(Labels.delete_confirmation_message).replace('{name}', guichet?.name ?? '')}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <ButtonTx onClick={onCancel}>{t(Labels.button_cancel)}</ButtonTx>
      <ButtonTx onClick={onConfirm} color="error" variant="contained" disabled={isDeleting}>
        {isDeleting ? t(Labels.button_deleting) : t(Labels.button_delete)}
      </ButtonTx>
    </DialogActions>
  </Dialog>
);

export default GuichetDeleteDialog;
