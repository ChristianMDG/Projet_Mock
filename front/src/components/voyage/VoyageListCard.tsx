import React from 'react';
import { Alert, Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ButtonTx from '@/components/ui/ButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import TaxibrousseRedIcon from '@/components/ui/TaxibrousseRedIcon';
import ProtectedTx from '@/components/ProtectedTx';
import { VoyageList } from '@/components/voyage';
import { Ville, Voyage } from '@/types';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface VoyageListCardProps {
  currentVille: Ville | null;
  voyages: Voyage[];
  loading: boolean;
  error: unknown;
  selectedVoyage: Voyage | null;
  onSelectVoyage: (voyage: Voyage) => void;
  onScheduleVoyage: () => void;
}

const VoyageListCard: React.FC<VoyageListCardProps> = ({
  currentVille,
  voyages,
  loading,
  error,
  selectedVoyage,
  onSelectVoyage,
  onScheduleVoyage,
}) => {
  const { t } = useTranslation();

  if (!currentVille) {
    return null;
  }

  return (
    <Card sx={{ minHeight: 300, border: 1, borderColor: 'divider' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledIcon icon={CalendarMonthIcon} />
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }} variant="h6">
              {currentVille.name}
              <TaxibrousseRedIcon sx={{ fontSize: 'inherit' }} />
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <VoyageList
          voyages={voyages}
          loading={loading}
          error={error as Error | null}
          selectedVoyage={selectedVoyage}
          onSelectVoyage={onSelectVoyage}
        />
        <ProtectedTx allowedRoles={['ADMIN', 'KOPERATIVE']}>
          {!loading && voyages.length === 0 && (
            <Alert
              severity="info"
              sx={{ mt: 2 }}
              action={
                <ButtonTx
                  color="inherit"
                  size="small"
                  onClick={onScheduleVoyage}
                  startIcon={<AddIcon />}
                  hideTextOnMobile
                >
                  {t(Labels.button_schedule_voyage)}
                </ButtonTx>
              }
            >
              <Typography variant="body2">{t(Labels.voyage_no_schedule_available)}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t(Labels.voyage_schedule_suggestion)}
              </Typography>
            </Alert>
          )}
        </ProtectedTx>
      </CardContent>
    </Card>
  );
};

export default VoyageListCard;
