import React from 'react';
import { Box, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ButtonTx from '@/components/ui/ButtonTx';
import KoperativeAvatar from '@/components/ui/KoperativeAvatar';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';
import ProtectedTx from '@/components/ProtectedTx';
import { Koperative } from '@/types';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface KoperativeSelectionCardProps {
  koperative: Koperative | null;
  options: Koperative[];
  readOnly: boolean;
  disabled?: boolean;
  onKoperativeChange: (koperative: Koperative | Koperative[] | null) => void;
  onScheduleClick: () => void;
  onManageClick: () => void;
}

const KoperativeSelectionCard: React.FC<KoperativeSelectionCardProps> = ({
  koperative,
  options,
  readOnly,
  disabled = false,
  onKoperativeChange,
  onScheduleClick,
  onManageClick,
}) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ border: 1, borderColor: 'divider' }}>
      <CardHeader
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t(Labels.ui_koperative_name)}
          </Typography>
        }
      />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <KoperativeAvatar logoUrl={koperative?.logoUrl} name={koperative?.name} />
          <Box sx={{ flex: 1 }}>
            <KoperativeAutocomplete
              id="voyage-koperative-select"
              value={koperative}
              onChange={onKoperativeChange}
              options={options}
              readOnly={readOnly}
              disabled={disabled}
              label={t(Labels.ui_koperative_name)}
              required
            />
          </Box>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'flex-end',
          gap: 1,
          flexWrap: 'nowrap',
          paddingTop: 0,
        }}
      >
        <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE', 'GUICHET']}>
          <ButtonTx
            variant="outlined"
            size="small"
            startIcon={<CalendarMonthIcon />}
            onClick={onScheduleClick}
            disabled={!koperative?.id}
          >
            {t(Labels.button_voyage_calendar)}
          </ButtonTx>
          <ButtonTx
            variant="outlined"
            size="small"
            startIcon={<ConfirmationNumberIcon />}
            onClick={onManageClick}
            disabled={!koperative?.id}
          >
            {t(Labels.button_voyage_counters)}
          </ButtonTx>
        </ProtectedTx>
      </CardActions>
    </Card>
  );
};

export default KoperativeSelectionCard;
