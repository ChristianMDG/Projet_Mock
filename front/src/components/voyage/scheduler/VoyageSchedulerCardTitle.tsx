import React from 'react';
import Labels from '@/labelKeys.json';
import { Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import RouteIcon from '@mui/icons-material/Route';
import { useTranslation } from 'react-i18next';
import { Ville } from '@/models/Ville';
import { StyledIcon } from '@/components/ui';

interface VoyageSchedulerCardTitleProps {
  isEditMode: boolean;
  departureVille?: Ville | null;
  arrivalVille?: Ville | null;
}

const VoyageSchedulerCardTitle: React.FC<VoyageSchedulerCardTitleProps> = ({ departureVille, arrivalVille }) => {
  const { t } = useTranslation();
  const hasRoute = Boolean(departureVille) || Boolean(arrivalVille);

  return hasRoute ? (
    <>
      <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <StyledIcon icon={RouteIcon} />
        {departureVille?.name}
        {departureVille && arrivalVille && <EastIcon />}
        {arrivalVille?.name}
      </Typography>
      <Typography variant="body2" component="span">
        {t(Labels.voyage_schedule_form_title)}
      </Typography>
    </>
  ) : (
    <Typography variant="h6">{t(Labels.voyage_schedule_form_title)}</Typography>
  );
};

export default VoyageSchedulerCardTitle;
