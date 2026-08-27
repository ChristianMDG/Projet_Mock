import { useTranslation } from 'react-i18next';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { Commission } from '@/models';
import Labels from '@/labelKeys.json';

interface CommissionActionsProps {
  readonly commission: Commission;
  readonly onEdit: (commission: Commission) => void;
  readonly onDelete: (commission: Commission) => void;
  readonly isMutating?: boolean;
}

export default function CommissionActions({
  commission,
  onEdit,
  onDelete,
  isMutating = false,
}: Readonly<CommissionActionsProps>) {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title={t(Labels.commission_action_edit)}>
        <span>
          <IconButton size="small" color="primary" onClick={() => onEdit(commission)} disabled={isMutating}>
            <Edit fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={t(Labels.commission_action_delete)}>
        <span>
          <IconButton size="small" color="error" onClick={() => onDelete(commission)} disabled={isMutating}>
            <Delete fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
