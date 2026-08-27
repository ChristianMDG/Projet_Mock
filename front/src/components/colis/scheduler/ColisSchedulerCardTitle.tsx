import React from 'react';
import Labels from '@/labelKeys.json';
import { Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import RouteIcon from '@mui/icons-material/Route';
import { useTranslation } from 'react-i18next';
import { Ville } from '@/models/Ville';
import StyledIcon from '@/components/ui/StyledIcon';

interface ColisSchedulerCardTitleProps {
  isEditMode: boolean;
  departureVille?: Ville | null;
  arrivalVille?: Ville | null;
}

const ColisSchedulerCardTitle: React.FC<ColisSchedulerCardTitleProps> = ({
  isEditMode,
  departureVille,
  arrivalVille,
}) => {
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
        {isEditMode ? t(Labels.colis_form_edit_title) : t(Labels.colis_form_create_title)}
      </Typography>
    </>
  ) : (
    <Typography variant="h6">{t(Labels.colis_form_create_title)}</Typography>
  );
};

export default ColisSchedulerCardTitle;
