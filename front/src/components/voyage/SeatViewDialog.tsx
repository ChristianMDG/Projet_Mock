import React from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { KrafterViewer } from '@/components';
import { Voyage } from '@/models/Voyage';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export interface SeatViewDialogProps {
  open: boolean;
  onClose: () => void;
  voyage: Voyage | null;
  readonly?: boolean;
}

export const SeatViewDialog: React.FC<SeatViewDialogProps> = ({ open, onClose, voyage, readonly = true }) => {
  const { t } = useTranslation();

  if (!voyage) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{
        paper: {
          sx: { minHeight: '500px' },
        },
      }}
      sx={{
        maxWidth: 'md',
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'between',
          }}
        >
          <Box>
            <Typography variant="h6">
              {voyage.description ?? `${voyage.departureGare?.name} → ${voyage.arrivalGare?.name}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t(Labels.seat_selection)}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {!voyage.crafter ? (
          <Alert severity="warning">No vehicle assigned to this voyage. Cannot display seat layout.</Alert>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 2,
            }}
          >
            <KrafterViewer voyage={voyage} selectedSeats={[]} multiSelect={!readonly} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeatViewDialog;
