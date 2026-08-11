import React from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import {
  Cancel as CancelIcon,
  FileDownload as ExportIcon,
  Pause as DeactivateIcon,
  PlayArrow as ActivateIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { VoyageStatusEnum } from '../../models/enums';

interface BulkActionsProps {
  selectedCount: number;
  onBulkCancel: () => void;
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkExport: () => void;
  onBulkStatusChange: (status: VoyageStatusEnum) => void;
  isLoading?: boolean;
}

interface BulkActionDialogProps {
  open: boolean;
  onClose: () => void;
  action: 'cancel' | 'activate' | 'deactivate' | 'export' | 'status' | null;
  selectedCount: number;
  onConfirm: () => void;
  onStatusChange?: (status: VoyageStatusEnum) => void;
  isLoading?: boolean;
}

const BulkActionDialog: React.FC<BulkActionDialogProps> = ({
  open,
  onClose,
  action,
  selectedCount,
  onConfirm,
  onStatusChange,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = React.useState<VoyageStatusEnum | ''>('');

  const statusOptions = [
    { value: VoyageStatusEnum.SCHEDULED, label: t(Labels.enum_voyage_status_scheduled) },
    { value: VoyageStatusEnum.ONGOING, label: t(Labels.enum_voyage_status_ongoing) },
    { value: VoyageStatusEnum.COMPLETED, label: t(Labels.enum_voyage_status_completed) },
    { value: VoyageStatusEnum.CANCELLED, label: t(Labels.enum_voyage_status_cancelled) },
    { value: VoyageStatusEnum.DELAYED, label: t(Labels.enum_voyage_status_delayed) },
  ];

  const getActionConfig = () => {
    switch (action) {
      case 'cancel':
        return {
          title: t(Labels.voyage_management_bulk_cancel),
          message: t(Labels.voyage_management_confirm_bulk_action),
          color: 'error' as const,
          icon: <CancelIcon />,
        };
      case 'activate':
        return {
          title: t(Labels.voyage_management_bulk_activate),
          message: t(Labels.voyage_management_confirm_bulk_action),
          color: 'success' as const,
          icon: <ActivateIcon />,
        };
      case 'deactivate':
        return {
          title: t(Labels.voyage_management_bulk_deactivate),
          message: t(Labels.voyage_management_confirm_bulk_action),
          color: 'warning' as const,
          icon: <DeactivateIcon />,
        };
      case 'export':
        return {
          title: t(Labels.voyage_management_bulk_export),
          message: t(Labels.voyage_management_confirm_bulk_action),
          color: 'primary' as const,
          icon: <ExportIcon />,
        };
      case 'status':
        return {
          title: t(Labels.voyage_management_filters_status),
          message: t(Labels.voyage_management_confirm_bulk_action),
          color: 'primary' as const,
          icon: null,
        };
      default:
        return null;
    }
  };

  const actionConfig = getActionConfig();

  const handleConfirm = () => {
    if (action === 'status' && selectedStatus && onStatusChange) {
      onStatusChange(selectedStatus as VoyageStatusEnum);
    } else {
      onConfirm();
    }
  };

  if (!actionConfig) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        maxWidth: 'sm',
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {actionConfig.icon}
          {actionConfig.title}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          {actionConfig.message.replace('{count}', selectedCount.toString())}
        </Typography>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          {t(Labels.voyage_management_items_selected).replace('{count}', selectedCount.toString())}
        </Typography>

        {action === 'status' && (
          <Box
            sx={{
              mt: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel>{t(Labels.voyage_management_filters_status)}</InputLabel>
              <Select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value as VoyageStatusEnum)}
                label={t(Labels.voyage_management_filters_status)}
              >
                {statusOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {action === 'cancel' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {t(Labels.voyage_delete_template_warning)}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {t(Labels.ui_cancel)}
        </Button>
        <Button
          onClick={handleConfirm}
          color={actionConfig.color}
          variant="contained"
          disabled={isLoading || (action === 'status' && !selectedStatus)}
        >
          {isLoading ? t(Labels.loading) : t(Labels.button_save)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const VoyageManagementBulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onBulkCancel,
  onBulkActivate,
  onBulkDeactivate,
  onBulkExport,
  onBulkStatusChange,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [dialogState, setDialogState] = React.useState<{
    open: boolean;
    action: 'cancel' | 'activate' | 'deactivate' | 'export' | 'status' | null;
  }>({
    open: false,
    action: null,
  });

  const handleOpenDialog = (action: 'cancel' | 'activate' | 'deactivate' | 'export' | 'status') => {
    setDialogState({ open: true, action });
  };

  const handleCloseDialog = () => {
    setDialogState({ open: false, action: null });
  };

  const handleConfirm = () => {
    switch (dialogState.action) {
      case 'cancel':
        onBulkCancel();
        break;
      case 'activate':
        onBulkActivate();
        break;
      case 'deactivate':
        onBulkDeactivate();
        break;
      case 'export':
        onBulkExport();
        break;
    }
    handleCloseDialog();
  };

  const handleStatusChange = (status: VoyageStatusEnum) => {
    onBulkStatusChange(status);
    handleCloseDialog();
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          bgcolor: 'primary.light',
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Typography variant="body2" color="primary.contrastText">
          {t(Labels.voyage_management_items_selected).replace('{count}', selectedCount.toString())}
        </Typography>

        <Divider orientation="vertical" flexItem sx={{ bgcolor: 'primary.contrastText' }} />

        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Button
            size="small"
            startIcon={<CancelIcon />}
            onClick={() => handleOpenDialog('cancel')}
            color="error"
            variant="outlined"
            disabled={isLoading}
          >
            {t(Labels.voyage_management_bulk_cancel)}
          </Button>

          <Button
            size="small"
            startIcon={<ActivateIcon />}
            onClick={() => handleOpenDialog('activate')}
            color="success"
            variant="outlined"
            disabled={isLoading}
          >
            {t(Labels.voyage_management_bulk_activate)}
          </Button>

          <Button
            size="small"
            startIcon={<DeactivateIcon />}
            onClick={() => handleOpenDialog('deactivate')}
            color="warning"
            variant="outlined"
            disabled={isLoading}
          >
            {t(Labels.voyage_management_bulk_deactivate)}
          </Button>

          <Button size="small" onClick={() => handleOpenDialog('status')} variant="outlined" disabled={isLoading}>
            {t(Labels.voyage_status)}
          </Button>

          <Button
            size="small"
            startIcon={<ExportIcon />}
            onClick={() => handleOpenDialog('export')}
            variant="outlined"
            disabled={isLoading}
          >
            {t(Labels.voyage_management_bulk_export)}
          </Button>
        </Box>
      </Box>
      <BulkActionDialog
        open={dialogState.open}
        onClose={handleCloseDialog}
        action={dialogState.action}
        selectedCount={selectedCount}
        onConfirm={handleConfirm}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
      />
    </>
  );
};

export default VoyageManagementBulkActions;
